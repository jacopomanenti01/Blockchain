# IMarketplace
[Git Source](https://github.com/jacopomanenti01/Blockchain/blob/ad0849695bddd3f5368d81383deb2c64cd2e9966/src/interfaces/IMarketplace.sol)


## Events
### NewMPFees

```solidity
event NewMPFees(uint256 indexed _newMPFees);
```

### PaymentTokenAdded

```solidity
event PaymentTokenAdded(address indexed token);
```

### PaymentTokenRemoved

```solidity
event PaymentTokenRemoved(address indexed token);
```

### NewOrder

```solidity
event NewOrder(
    uint256 indexed orderId,
    address indexed collection,
    uint256 indexed tokenId,
    uint256 amount,
    uint256 price,
    address owner
);
```

### OrderCancelled

```solidity
event OrderCancelled(uint256 indexed orderId);
```

### OrderFilled

```solidity
event OrderFilled(uint256 indexed orderId, address indexed buyer, uint256 amount);
```

### NewAuction

```solidity
event NewAuction(uint256 indexed auctionId, uint256 basePrice, uint256 minIncrement, uint256 deadline);
```

### NewBid

```solidity
event NewBid(uint256 indexed auctionId, address indexed bidder, uint256 bidAmount);
```

### AuctionEnded

```solidity
event AuctionEnded(uint256 indexed auctionId, address indexed winner, uint256 winningBid);
```

