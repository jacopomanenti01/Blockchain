# Marketplace
[Git Source](https://github.com/jacopomanenti01/Blockchain/blob/ad0849695bddd3f5368d81383deb2c64cd2e9966/src/Marketplace.sol)

**Inherits:**
AccessControl, ReentrancyGuard, [IMarketplace](/src/interfaces/IMarketplace.sol/interface.IMarketplace.md)


## State Variables
### PERCENT_DIVIDER

```solidity
uint256 public constant PERCENT_DIVIDER = 1000000;
```


### mpFeesCollector

```solidity
address public mpFeesCollector;
```


### mpFeesPercentage

```solidity
uint256 public mpFeesPercentage;
```


### orderCounter

```solidity
uint256 public orderCounter;
```


### auctionCounter

```solidity
uint256 public auctionCounter;
```


### nftFactory

```solidity
INFTFactory public nftFactory;
```


### orders

```solidity
mapping(uint256 => Order) public orders;
```


### auctions

```solidity
mapping(uint256 => Auction) public auctions;
```


### isAuction

```solidity
mapping(uint256 => bool) public isAuction;
```


## Functions
### constructor

Initializer


```solidity
constructor(address _nftFactory, address _mpFeesCollector, uint256 _mpFeesPercentage);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_nftFactory`|`address`|address of the NFT factory|
|`_mpFeesCollector`|`address`|address that collects marketplace fees|
|`_mpFeesPercentage`|`uint256`|marketplace fees percentage (scaled by 10^6)|


### setNFTFactory

update the address of the nft factory


```solidity
function setNFTFactory(address _newFactory) external onlyRole(DEFAULT_ADMIN_ROLE);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_newFactory`|`address`|address of the new factory|


### setNewTreasury

set a new address to collect marketplace fees


```solidity
function setNewTreasury(address _newMPFeesCollector) external onlyRole(DEFAULT_ADMIN_ROLE);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_newMPFeesCollector`|`address`|new treasury address|


### setMarketPlaceFee

set a new marketplace fees (scaled by 1000000)


```solidity
function setMarketPlaceFee(uint256 _newMPFeesPercentage) external onlyRole(DEFAULT_ADMIN_ROLE);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_newMPFeesPercentage`|`uint256`|new marketplace fees percentage (scaled by 10^6)|


### createOrder

create a sell order

*before calling this function, the seller must call the nft.setApprovalForAll function by allowing
the marketplace to operate*


```solidity
function createOrder(address _collection, uint256 _tokenId, uint256 _amount, uint256 _price, address _paymentToken)
    external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_collection`|`address`|address of the NFT smart contract. It must be deployed be the factory|
|`_tokenId`|`uint256`|id of the NFT to sell|
|`_amount`|`uint256`|amount of copies to sell|
|`_price`|`uint256`|total price for the order|
|`_paymentToken`|`address`|address of the payment token you want to receive. Use address(0) for the native coin|


### createAuction

create a new auction


```solidity
function createAuction(
    address _collection,
    uint256 _tokenId,
    uint256 _amount,
    uint256 _basePrice,
    uint256 _minIncrement,
    uint256 _deadline,
    address _paymentToken
) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_collection`|`address`|address of the NFT collection. It must be deployed by the NFT factory|
|`_tokenId`|`uint256`|id of the token in the collection|
|`_amount`|`uint256`|amount of tokens to sell|
|`_basePrice`|`uint256`|base price of the auction|
|`_minIncrement`|`uint256`|minimum increment for each bid|
|`_deadline`|`uint256`|termination timestamp of the auction|
|`_paymentToken`|`address`|address of the ERC20 token that the seller wants to receive. If address(0), the native coin is used instead|


### bid

create a bid for an auction


```solidity
function bid(uint256 _auctionId, uint256 _amount) external payable nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_auctionId`|`uint256`|id of the auction to bid|
|`_amount`|`uint256`|if the auction uses an ERC20 token for payments, this is the amount of the bid in that token. If the auction uses the native coin, this parameter is not used.|


### endAuction

end an auction. If it is successful, it processes the payments and transfers the NFT to the highest bidder.
If it is unsuccessful, it returns the token to seller.


```solidity
function endAuction(uint256 _auctionId) external nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_auctionId`|`uint256`|id of the auction|


### buy

buy (fully or partially) tokens from an order


```solidity
function buy(uint256 _orderId, uint256 _buyAmount) external payable nonReentrant;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_orderId`|`uint256`|id of the order|
|`_buyAmount`|`uint256`|number of tokens to buy|


### cancel

cancel an order by returning the tokens to the seller.


```solidity
function cancel(uint256 _id) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_id`|`uint256`|id of the order to cancel.|


### getOrders

return the orders based on the provided indices


```solidity
function getOrders(uint256 _start, uint256 _end, address _owner)
    external
    view
    returns (Order[] memory, string[] memory, uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_start`|`uint256`|starting index (inclusive)|
|`_end`|`uint256`|ending index (exclusive)|
|`_owner`|`address`|eventual filter of the orders. If it is equal to address(0), returns all orders|


### getAuctions

return the auctions based on the provided indices


```solidity
function getAuctions(uint256 _start, uint256 _end, address _owner, address _bidder)
    external
    view
    returns (Auction[] memory, string[] memory, uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_start`|`uint256`|starting index (inclusive)|
|`_end`|`uint256`|ending index (exclusive)|
|`_owner`|`address`|eventual filter of the auction. If it is equal to address(0), ignores the owner|
|`_bidder`|`address`|eventual filter of the auction. If it is equal to address(0), ignores the highestBidder|


### processPaymentETH


```solidity
function processPaymentETH(address _to, uint256 _amount, string memory _error) internal;
```

### onERC1155Received


```solidity
function onERC1155Received(address, address, uint256, uint256, bytes calldata) external pure returns (bytes4);
```

## Structs
### Order

```solidity
struct Order {
    address paymentToken;
    uint256 price;
    uint256 amount;
    uint256 left;
    uint256 tokenId;
    address owner;
    address collection;
    uint256 id;
}
```

### Auction

```solidity
struct Auction {
    uint256 tokenId;
    address paymentToken;
    uint256 basePrice;
    uint256 minIncrement;
    uint256 deadline;
    uint256 highestBid;
    uint256 amount;
    address owner;
    address collection;
    address highestBidder;
    bool claimed;
    uint256 id;
}
```

