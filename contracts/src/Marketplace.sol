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
        address paymentToken; // if token is address(0), it means native coin
        uint price; // sell price for single token
        uint amount;
        uint left; // amount of NFTs in the order not yet sold
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
        uint amount;
        address owner; // address that creates the listing
        address collection;  // NFT address
        address highestBidder;
    }

    // Marketplace variables
    address public mpFeesCollector;
    // MarketPlace Fee 
    uint public mpFeesPercentage;

    uint public orderCounter;
    uint public auctionCounter;

    INFTFactory public nftFactory;

    mapping(uint => Order) public orders;
    mapping(uint => Auction) public auctions;
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

    /**
     * @notice create a sell order
     * @param _collection address of the NFT smart contract. It must be deployed be the factory
     * @param _tokenId id of the NFT to sell
     * @param _amount amount of copies to sell
     * @param _price total price for the order
     * @param _paymentToken address of the payment token you want to receive. Use address(0) for the native coin
     * @dev before calling this function, the seller must call the nft.setApprovalForAll function by allowing
            the marketplace to operate
     */
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

        Order storage  order = orders[orderCounter];
        order.paymentToken = _paymentToken;
        order.price = _price;
        order.amount = _amount;
        order.tokenId = _tokenId;
        order.owner = msg.sender;
        order.collection = _collection;
        order.left = _amount;

        emit NewOrder(orderCounter, _collection, _tokenId, _amount, _price, msg.sender);

        orderCounter++;
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

        Auction storage auction = auctions[auctionCounter];
        auction.auctionId = auctionCounter;
        auction.paymentToken = _paymentToken;
        auction.basePrice = _basePrice;
        auction.minIncrement = _minIncrement;
        auction.deadline = _deadline;
        auction.highestBid = 0;
        auction.amount = _amount;
        auction.owner = msg.sender;
        auction.collection = _collection;
        auction.highestBidder = address(0);

        isAuction[auctionCounter] = true;
    
        emit NewAuction(auctionCounter, _basePrice, _minIncrement, _deadline);

        auctionCounter++;
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
                processPaymentETH(auction.highestBidder, auction.highestBid, "Unable to repay previous bidder");
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

        // Auction successful case
        if (auction.highestBid >= auction.basePrice) {
            INFT nft = INFT(auction.collection);
            uint platformFee = (auction.highestBid * mpFeesPercentage) / PERCENT_DIVIDER;
            uint recordCompanyFee = (auction.highestBid * nft.recordCompanyFee()) / PERCENT_DIVIDER;
            uint sellerAmount = auction.highestBid - platformFee - recordCompanyFee;

            if (auction.paymentToken == address(0)) {
                processPaymentETH(mpFeesCollector, platformFee, "Unable to pay fees collector");
                processPaymentETH(nft.treasury(), recordCompanyFee, "Unable to pay record company fees");
                processPaymentETH(auction.owner, sellerAmount, "Unable to pay seller");
            } else {
                IERC20(auction.paymentToken).safeTransfer(mpFeesCollector, platformFee);
                IERC20(auction.paymentToken).safeTransfer(nft.treasury(), recordCompanyFee);
                IERC20(auction.paymentToken).safeTransfer(auction.owner, sellerAmount);
            }

            IERC1155(auction.collection).safeTransferFrom(address(this), auction.highestBidder, auction.auctionId, auction.amount, "");
        } else {
            // Auction failed case -> return tokens to the owner
            IERC1155(auction.collection).safeTransferFrom(address(this), auction.owner, auction.auctionId, auction.amount, "");
        }
        
        emit AuctionEnded(_auctionId, auction.highestBidder, auction.highestBid);
    }


    function buy(uint _orderId, uint _buyAmount) external payable nonReentrant {
        Order storage order = orders[_orderId];
        require(_buyAmount > 0, "Invali amount");
        require(_buyAmount <= order.left, "Not enough tokens to buy");

        INFT nft = INFT(order.collection);
        uint totalPrice = order.price * _buyAmount;
        uint platformFee = (totalPrice * mpFeesPercentage) / PERCENT_DIVIDER;
        uint recordCompanyFee = (totalPrice * nft.recordCompanyFee()) / PERCENT_DIVIDER;
        uint sellerAmount = totalPrice - platformFee - recordCompanyFee;

        if (order.paymentToken == address(0)) {
            require(msg.value >= totalPrice, "Insufficient funds");

            processPaymentETH(mpFeesCollector, platformFee, "Unable to pay fees collector");
            processPaymentETH(nft.treasury(), recordCompanyFee, "Unable to pay record company fees");
            processPaymentETH(order.owner, sellerAmount, "Unable to pay seller");
        } else {
            IERC20(order.paymentToken).safeTransferFrom(msg.sender, address(this), totalPrice);

            IERC20(order.paymentToken).safeTransfer(mpFeesCollector, platformFee);
            IERC20(order.paymentToken).safeTransfer(nft.treasury(), recordCompanyFee);
            IERC20(order.paymentToken).safeTransfer(order.owner, sellerAmount);
        }

        IERC1155(order.collection).safeTransferFrom(address(this), msg.sender, order.tokenId, _buyAmount, "");
        order.left -= _buyAmount;

        emit OrderFilled(_orderId, msg.sender, _buyAmount);
    }

    /**
     * @dev cancel an order by returning the tokens to the seller.
     * @param _id id of the order to cancel.
     */
    function cancel(uint _id) external {
        require(_id < orderCounter, "Invalid order id");

        Order storage order = orders[_id];
        require(order.owner == msg.sender, "Not token owner");

        IERC1155(order.collection).safeTransferFrom(address(this), msg.sender, order.tokenId, order.amount, "");

        order.left = 0;

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
    // /**
    //  * @notice process native token payment
    //  * @param _price price to be paid
    //  * @param _seller seller address
    //  */

    // /**
    //  * @notice process other tokens payment
    //  * @param _token payment token address
    //  * @param _price price to be paid
    //  * @param _seller seller address
    //  */
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

    function onERC1155Received(address, address, uint, uint, bytes calldata) external pure returns (bytes4) {
        return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
    }

    // Internal function to process ETH payments
    function processPaymentETH(address _to, uint _amount, string memory _error) internal {
        (bool success, ) = address(_to).call{value: _amount}("");
        require(success, _error);
    }
}
