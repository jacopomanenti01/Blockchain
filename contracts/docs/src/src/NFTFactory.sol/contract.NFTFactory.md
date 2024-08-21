# NFTFactory
[Git Source](https://github.com/jacopomanenti01/Blockchain/blob/ad0849695bddd3f5368d81383deb2c64cd2e9966/src/NFTFactory.sol)

**Inherits:**
AccessControl, [INFTFactory](/src/interfaces/INFTFactory.sol/interface.INFTFactory.md)


## State Variables
### isFactoryDeployed

```solidity
mapping(address => bool) public isFactoryDeployed;
```


### associatedNFT

```solidity
mapping(address => address) public associatedNFT;
```


### deployedNFTs

```solidity
mapping(uint256 => address) public deployedNFTs;
```


### nextNFTId

```solidity
uint256 public nextNFTId;
```


## Functions
### constructor


```solidity
constructor();
```

### deployNFT

*deploy a new NFT contract for a record company.*


```solidity
function deployNFT(string memory _name, address _recordCompanyAdmin, address _treasury, uint256 _initialFee)
    external
    onlyRole(DEFAULT_ADMIN_ROLE);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_name`|`string`|name of the token|
|`_recordCompanyAdmin`|`address`|initial record company admin address|
|`_treasury`|`address`|record company treasury|
|`_initialFee`|`uint256`|initial fee for the record company|


### setAssociatedNFT

link an admin to a NFT

*this function can only be called by a NFT deployed by the factory*


```solidity
function setAssociatedNFT(address _admin, address _nft) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_admin`|`address`|address of the admin|
|`_nft`|`address`|address of the NFT to link|


### batchGetNFTs

return all NFTs owned by the specified wallet

*return four arrays (containgin respectively: nft address, token id, amount owned, relative uri and relative balance) and the effective number of NFTs*


```solidity
function batchGetNFTs(address _owner, uint256 _start, uint256 _end, uint256 _limit)
    external
    view
    returns (address[] memory, uint256[] memory, uint256[] memory, string[] memory, uint256[] memory, uint256);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_owner`|`address`|owner of the NFTs|
|`_start`|`uint256`|starting NFT index (inclusive)|
|`_end`|`uint256`|ending NFT index (exclusive)|
|`_limit`|`uint256`|max amount of items to collect|


