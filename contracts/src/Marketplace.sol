// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";
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
        uint id;
    }

    struct Auction { // auction details for a single order
        uint tokenId;
        address paymentToken; // if token is address(0), it means native coin
        uint basePrice;
        uint minIncrement;
        uint deadline;
        uint highestBid;
        uint amount;
        address owner; // address that creates the listing
        address collection;  // NFT address
        address highestBidder;
        bool claimed;
        uint id;
    }

    address public mpFeesCollector;
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
     * @notice set a new address to collect marketplace fees
     * @param _newMPFeesCollector new treasury address
     */
    function setNewTreasury(address _newMPFeesCollector) external onlyRole(DEFAULT_ADMIN_ROLE) {
        mpFeesCollector = _newMPFeesCollector;
    }

    /**
     * @notice set a new marketplace fees (scaled by 1000000)
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

        IERC1155MetadataURI(_collection).safeTransferFrom(msg.sender, address(this), _tokenId, _amount, "");

        Order storage  order = orders[orderCounter];
        order.paymentToken = _paymentToken;
        order.price = _price;
        order.amount = _amount;
        order.tokenId = _tokenId;
        order.owner = msg.sender;
        order.collection = _collection;
        order.left = _amount;
        order.id = orderCounter;

        emit NewOrder(orderCounter, _collection, _tokenId, _amount, _price, msg.sender);

        orderCounter++;
    }

    /**
     * @notice create a new auction
     * @param _collection address of the NFT collection. It must be deployed by the NFT factory
     * @param _tokenId id of the token in the collection
     * @param _amount amount of tokens to sell
     * @param _basePrice base price of the auction
     * @param _minIncrement minimum increment for each bid
     * @param _deadline termination timestamp of the auction
     * @param _paymentToken address of the ERC20 token that the seller wants to receive. 
                                If address(0), the native coin is used instead
     */
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

        IERC1155MetadataURI(_collection).safeTransferFrom(msg.sender, address(this), _tokenId, _amount, "");

        Auction storage auction = auctions[auctionCounter];
        auction.paymentToken = _paymentToken;
        auction.basePrice = _basePrice;
        auction.minIncrement = _minIncrement;
        auction.deadline = _deadline;
        auction.highestBid = 0;
        auction.amount = _amount;
        auction.owner = msg.sender;
        auction.collection = _collection;
        auction.highestBidder = address(0);
        auction.tokenId = _tokenId;
        auction.claimed = false;
        auction.id = auctionCounter;

        isAuction[auctionCounter] = true;
    
        emit NewAuction(auctionCounter, _basePrice, _minIncrement, _deadline);

        auctionCounter++;
    }

    /**
     * @notice create a bid for an auction
     * @param _auctionId id of the auction to bid
     * @param _amount if the auction uses an ERC20 token for payments, this is the amount of the bid in that token.
                        If the auction uses the native coin, this parameter is not used.
     */
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

    /**
     * @notice end an auction. If it is successful, it processes the payments and transfers the NFT to the highest bidder.
                If it is unsuccessful, it returns the token to seller.
     * @param _auctionId id of the auction
     */
    function endAuction(uint _auctionId) external nonReentrant {
        require(isAuction[_auctionId], "Order is not an auction");
        Auction storage auction = auctions[_auctionId];
        require(block.timestamp >= auction.deadline, "Auction is still ongoing");
        require(!auction.claimed, "Auction already claimed");

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

            IERC1155MetadataURI(auction.collection).safeTransferFrom(address(this), auction.highestBidder, auction.tokenId, auction.amount, "");
        } else {
            // Auction failed case -> return tokens to the owner
            IERC1155MetadataURI(auction.collection).safeTransferFrom(address(this), auction.owner, auction.tokenId, auction.amount, "");
        }

        auction.claimed = true;
        
        emit AuctionEnded(_auctionId, auction.highestBidder, auction.highestBid);
    }

    /**
     * @notice buy (fully or partially) tokens from an order
     * @param _orderId id of the order
     * @param _buyAmount number of tokens to buy
     */
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

        IERC1155MetadataURI(order.collection).safeTransferFrom(address(this), msg.sender, order.tokenId, _buyAmount, "");
        order.left -= _buyAmount;

        emit OrderFilled(_orderId, msg.sender, _buyAmount);
    }

    /**
     * @notice cancel an order by returning the tokens to the seller.
     * @param _id id of the order to cancel.
     */
    function cancel(uint _id) external {
        require(_id < orderCounter, "Invalid order id");

        Order storage order = orders[_id];
        require(order.owner == msg.sender, "Not token owner");

        IERC1155MetadataURI(order.collection).safeTransferFrom(address(this), msg.sender, order.tokenId, order.amount, "");

        order.left = 0;

        emit OrderCancelled(_id);
    }

    /**
     * @notice return the orders based on the provided indices 
     * @param _start starting index (inclusive)
     * @param _end ending index (exclusive)
     * @param _owner eventual filter of the orders. If it is equal to address(0), returns all orders
     */
    function getOrders(uint _start, uint _end, address _owner) external view returns (Order[] memory, string[] memory, uint) {
        require(_end <= orderCounter, "Invalid end");
        require (_start < _end, "Start must be smaller than end");

        uint effIdx = 0;
        Order[] memory array = new Order[](_end - _start);
        string[] memory uris = new string[](_end - _start);
        
        for (uint i = _start; i < _end; i++) {
            Order memory order = orders[i];
            if ((order.left > 0) && (_owner == address(0) || order.owner == _owner)) {
                array[effIdx] = order;
                uris[effIdx] = IERC1155MetadataURI(order.collection).uri(order.tokenId);
                effIdx++;
            }
        }

        return (array, uris, effIdx);
    }

    /**
     * @notice return the auctions based on the provided indices 
     * @param _start starting index (inclusive)
     * @param _end ending index (exclusive)
     * @param _owner eventual filter of the auction. If it is equal to address(0), ignores the owner
     * @param _bidder eventual filter of the auction. If it is equal to address(0), ignores the highestBidder
     */
    function getAuctions(uint _start, uint _end, address _owner, address _bidder) external view returns (Auction[] memory, string[] memory, uint) {
        require(_end <= auctionCounter, "Invalid end");
        require (_start < _end, "Start must be smaller than end");

        uint effIdx = 0;
        Auction[] memory array = new Auction[](_end - _start);
        string[] memory uris = new string[](_end - _start);
        
        for (uint i = _start; i < _end; i++) {
            Auction memory auction = auctions[i];
            if ((_owner == address(0) || auction.owner == _owner) && (_bidder == address(0) || _bidder == auction.highestBidder)) {
                array[effIdx] = auction;
                uris[effIdx] = IERC1155MetadataURI(auction.collection).uri(auction.tokenId);
                effIdx++;
            }
        }

        return (array, uris, effIdx);
    }

    // Internal function to process ETH payments
    function processPaymentETH(address _to, uint _amount, string memory _error) internal {
        (bool success, ) = address(_to).call{value: _amount}("");
        require(success, _error);
    }

    // Enables this smart contract to receive ERC1155 tokens
    function onERC1155Received(address, address, uint, uint, bytes calldata) external pure returns (bytes4) {
        return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
    }
}
