// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol";
import "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import "openzeppelin-contracts/contracts/access/AccessControl.sol";
import "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import "openzeppelin-contracts/contracts/utils/Strings.sol";

import "./interfaces/IMarketplace.sol";
import "./interfaces/INFTFactory.sol";
import "./interfaces/INFT.sol";

contract Marketplace is AccessControl, ReentrancyGuard, IMarketplace {
    using SafeERC20 for IERC20;

    uint public constant PERCENT_DIVIDER = 1000000;  // percentage divider, 6 decimals

    struct Order { // single order listed on the marketplace
        uint orderId;     // order ID, starting from 1
        address paymentToken; // if token is address(0), it means native coin
        uint price; // sell price for single token
        uint amount; // 1 or more for ERC1155
        uint tokenId;
        address owner; // address that creates the listing
        address collection;  // NFT address
    }

    struct Auction { // auction details for a single order
        uint auctionId;     // auction ID, starting from 1
        address paymentToken; // if token is address(0), it means native coin
        uint basePrice;
        uint minIncrement;
        uint deadline;
        uint highestBid;
        address owner; // address that creates the listing
        address collection;  // NFT address
        address highestBidder;
    }

    // Marketplace variables
    address public mpFeesCollector;
    // MarketPlace Fee 
    uint public mpFeesPercentage;

    uint private orderCounter;
    uint private auctionCounter;

    INFTFactory public nftFactory;

    mapping(uint => Order) public orders;
    mapping(uint => Auction) public auctions;
    mapping(uint => bool) public usedOrderIds;
    mapping(uint => bool) public isAuction;


    /**
     * @notice Initializer
     * @param _nftFactory address of the NFT factory
     * @param _mpFeesCollector address that collects marketplace fees
     * @param _mpFeesPercentage marketplace fees percentage (scaled by 10^6)
     */
    constructor(address _nftFactory, address _mpFeesCollector, uint _mpFeesPercentage) {
        nftFactory = INFTFactory(_nftFactory);

        mpFeesCollector = _mpFeesCollector;
        mpFeesPercentage = _mpFeesPercentage;

        // add deployer as admin
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    /**
     * @notice update the address of the nft factory
     * @param _newFactory address of the new factory
     */
    function setNFTFactory(address _newFactory) external onlyRole(DEFAULT_ADMIN_ROLE) {
        nftFactory = INFTFactory(_newFactory);
    }

    /**
     * @notice set a new address to collect marketplace fees (DEFAULT_ADMIN_ROLE)
     * @param _newMPFeesCollector new treasury address
     */
    function setNewTreasury(address _newMPFeesCollector) external onlyRole(DEFAULT_ADMIN_ROLE) {
        mpFeesCollector = _newMPFeesCollector;
    }

    /**
     * @notice set a new marketplace fees (scaled by 1000000) (DEFAULT_ADMIN_ROLE)
     * @param _newMPFeesPercentage new marketplace fees percentage (scaled by 10^6)
     */
    function setMarketPlaceFee(uint _newMPFeesPercentage) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_newMPFeesPercentage <= PERCENT_DIVIDER, "Fee over 100%");

        mpFeesPercentage = _newMPFeesPercentage;
        emit NewMPFees(mpFeesPercentage);
    }

    function createOrder(
        address _collection,
        uint _tokenId,
        uint _amount,
        uint _price,
        address _paymentToken
    ) external {
        require(_amount > 0, "Amount must be greater than 0");
        require(nftFactory.isFactoryDeployed(_collection), "Invalid collection");

        IERC1155(_collection).safeTransferFrom(msg.sender, address(this), _tokenId, _amount, "");

        orderCounter++;
        orders[orderCounter] = Order(orderCounter, _paymentToken, _price, _amount, _tokenId, msg.sender, _collection);

        emit NewOrder(orderCounter, _collection, _tokenId, _amount, _price, msg.sender);
    }

    function createAuction(
        address _collection,
        uint _tokenId,
        uint _amount,
        uint _basePrice,
        uint _minIncrement,
        uint _deadline, // deadline as Unix timestamp
        address _paymentToken
    ) external {
        require(_amount > 0, "Amount must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(nftFactory.isFactoryDeployed(_collection), "Invalid collection");

        IERC1155(_collection).safeTransferFrom(msg.sender, address(this), _tokenId, _amount, "");

        auctionCounter++;
        auctions[auctionCounter] = Auction(auctionCounter, _paymentToken, _basePrice, _minIncrement, _deadline, 0, msg.sender, _collection, address(0));
        isAuction[auctionCounter] = true;

        emit NewAuction(auctionCounter, _basePrice, _minIncrement, _deadline);
    }

    function bid(uint _auctionId, uint _amount) external payable nonReentrant {
        require(isAuction[_auctionId], "Order is not an auction");

        Auction storage auction = auctions[_auctionId];
        require(block.timestamp < auction.deadline, "Auction has ended");

        if (auction.paymentToken == address(0)) {
            _amount = msg.value;
        }

        require(_amount >= auction.basePrice, "Bid must be at least base price");
        require(_amount >= auction.highestBid + auction.minIncrement, "Bid increment is too low");

        // Refund previous bidder
        if (auction.highestBidder != address(0)) {
            if (auction.paymentToken == address(0)) {
                payable(auction.highestBidder).transfer(auction.highestBid);
            } else {
                IERC20(auction.paymentToken).safeTransfer(auction.highestBidder, auction.highestBid);
            }
        }

        // Process payment
        if (auction.paymentToken != address(0)) {
            IERC20(auction.paymentToken).safeTransferFrom(msg.sender, address(this), _amount);
        }

        auction.highestBid = _amount;
        auction.highestBidder = msg.sender;

        emit NewBid(_auctionId, msg.sender, _amount);
    }

    function endAuction(uint _auctionId) external nonReentrant {
        require(isAuction[_auctionId], "Order is not an auction");
        Auction storage auction = auctions[_auctionId];
        require(block.timestamp >= auction.deadline, "Auction is still ongoing");

        INFT nft = INFT(auction.collection);
        uint platformFee = (auction.highestBid * mpFeesPercentage) / PERCENT_DIVIDER;
        uint recordCompanyFee = (auction.highestBid * nft.recordCompanyFee()) / PERCENT_DIVIDER;
        uint sellerAmount = auction.highestBid - platformFee - recordCompanyFee;

        if (auction.paymentToken == address(0)) {
            payable(mpFeesCollector).transfer(platformFee);
            payable(nft.treasury()).transfer(recordCompanyFee);
            payable(auction.owner).transfer(sellerAmount);
        } else {
            IERC20(auction.paymentToken).safeTransfer(mpFeesCollector, platformFee);
            IERC20(auction.paymentToken).safeTransfer(nft.treasury(), recordCompanyFee);
            IERC20(auction.paymentToken).safeTransfer(auction.owner, sellerAmount);
        }

        IERC1155(auction.collection).safeTransferFrom(address(this), auction.highestBidder, auction.auctionId, 1, "");
        
        delete auctions[_auctionId];
        delete isAuction[_auctionId];

        emit AuctionEnded(_auctionId, auction.highestBidder, auction.highestBid);
    }


    function buy(uint _orderId, uint _buyAmount) external payable nonReentrant {
        Order storage order = orders[_orderId];
        require(order.orderId != 0, "Order does not exist");
        require(!usedOrderIds[_orderId], "Order ID already completely filled");
        require(_buyAmount <= order.amount, "Not enough tokens to buy");

        INFT nft = INFT(order.collection);
        uint totalPrice = order.price * _buyAmount;
        uint platformFee = (totalPrice * mpFeesPercentage) / PERCENT_DIVIDER;
        uint recordCompanyFee = (totalPrice * nft.recordCompanyFee()) / PERCENT_DIVIDER;
        uint sellerAmount = totalPrice - platformFee - recordCompanyFee;

        if (order.paymentToken == address(0)) {
            require(msg.value >= totalPrice, "Insufficient funds");
            payable(mpFeesCollector).transfer(platformFee);
            payable(nft.treasury()).transfer(recordCompanyFee);
            payable(order.owner).transfer(sellerAmount);
        } else {
            IERC20(order.paymentToken).safeTransfer(mpFeesCollector, platformFee);
            IERC20(order.paymentToken).safeTransfer(nft.treasury(), recordCompanyFee);
            IERC20(order.paymentToken).safeTransfer(order.owner, sellerAmount);
        }

        IERC1155(order.collection).safeTransferFrom(address(this), msg.sender, order.tokenId, _buyAmount, "");
        order.amount -= _buyAmount;
        if (order.amount == 0) {
            delete orders[_orderId];
        }

        emit OrderFilled(_orderId, msg.sender, _buyAmount);
    }

    /**
     * @dev cancel an order by returning the tokens to the seller.
     * @param _id id of the order to cancel.
     */
    function cancel(uint _id) external {
        require(_id < orderCounter, "Invalid order id");

        Order memory order = orders[_id];
        require(order.owner == msg.sender, "Not token owner");

        IERC1155(order.collection).safeTransferFrom(address(this), msg.sender, order.tokenId, order.amount, "");

        delete orders[_id];

        emit OrderCancelled(_id);
    }

    // /**
    //  * @dev builds a prefixed hash to mimic the behavior of eth_sign.
    //  * @param _string hashed message
    //  * @return hash prefixed hashed message
    //  */
    // function msgHash(string memory _string) public pure returns (bytes32) {
    //     return keccak256(abi.encodePacked(_string));
    // }

    // /**
    //  * @dev builds a prefixed hash to mimic the behavior of eth_sign.
    //  * @param _hash hashed message
    //  * @return hash prefixed hashed message
    //  */
    // function ethMsgHash(bytes32 _hash) public pure returns (bytes32) {
    //     return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _hash));
    // }

    // /**
    //  * @dev recover the original address that signed a prefixed message
    //  * @param _ethHash prefixed hashed message
    //  * @param _sig message signature
    //  * @return address signature signed address
    //  */
    // function recover(bytes32 _ethHash, bytes calldata _sig) public pure returns (address) {
    //     (bytes32 r, bytes32 s, uint8 v) = splitSig(_sig);
    //     return ecrecover(_ethHash, v, r, s);
    // }

    // /**
    //  * @dev split a signature in r, s, and v components
    //  * @param _sig message signature
    //  * @return r signature component
    //  * @return s signature component
    //  * @return v signature component
    //  */
    // function splitSig(bytes memory _sig) internal pure returns(bytes32 r, bytes32 s, uint8 v) {
    //     require(_sig.length == 65, "Invalid sig length");
    //     assembly {
    //         r := mload(add(_sig, 0x20))
    //         s := mload(add(_sig, 0x40))
    //         v := byte(0, mload(add(_sig, 0x60)))
    //     }
    //     // return (r,s,v);
    // }

    // /**
    //  * @dev convert an address to string
    //  * @param account account to be converted in string
    //  * @return account account converted in lowercase string
    //  */
    // function address2String(address account) public pure returns(string memory) {
    //     return Strings.toHexString(account);
    // }

    // /**
    //  * @dev convert an uint to string
    //  * @param value value to be converted in string
    //  * @return value value converted in lowercase string
    //  */
    // function value2String(uint value) public pure returns(string memory) {
    //     return Strings.toString(value);
    // }

    // /**
    //  * @dev convert an order structure to string
    //  * @param _order order struct to be converted in string
    //  * @return originalMsg order converted in lowercase string
    //  */
    // function restoreMsg(Order calldata _order) public pure returns (string memory) {
    //     string memory originalMsg = string.concat(value2String(_order.orderId), address2String(_order.paymentToken), value2String(_order.price), value2String(_order.amount),
    //             value2String(_order.tokenId), address2String(_order.owner), address2String(_order.collection));
    //     return originalMsg;
    // }

    
    // INTERNAL METHODS
    /**
     * @notice process native token payment
     * @param _price price to be paid
     * @param _seller seller address
     */

    /**
     * @notice process other tokens payment
     * @param _token payment token address
     * @param _price price to be paid
     * @param _seller seller address
     */
    // function processPayment(address _token, uint _price, address _seller) internal {
    //     IERC20(_token).safeTransferFrom(_msgSender(), address(this), _price);

    //     // Fees
    //     uint platformFee;
    //     if (mpFeesPercentage > 0) {
    //         platformFee = _price * mpFeesPercentage / PERCENT_DIVIDER;
    //         // process fee payment
    //         IERC20(_token).safeTransfer(mpFeesCollector, platformFee);
    //     }

    //     // transfer payment
    //     uint sellerAmount = _price - platformFee;
    //     IERC20(_token).safeTransfer(_seller, sellerAmount);
    // }
}
