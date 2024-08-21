# INFTFactory
[Git Source](https://github.com/jacopomanenti01/Blockchain/blob/ad0849695bddd3f5368d81383deb2c64cd2e9966/src/interfaces/INFTFactory.sol)


## Functions
### isFactoryDeployed


```solidity
function isFactoryDeployed(address) external returns (bool);
```

### setAssociatedNFT


```solidity
function setAssociatedNFT(address _admin, address _nft) external;
```

## Events
### NewNFT

```solidity
event NewNFT(address indexed _nft, address indexed _initialAdmin);
```

