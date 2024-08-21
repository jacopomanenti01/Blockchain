# NFT
[Git Source](https://github.com/jacopomanenti01/Blockchain/blob/ad0849695bddd3f5368d81383deb2c64cd2e9966/src/NFT.sol)

**Inherits:**
ERC1155Supply, AccessControl, [INFT](/src/interfaces/INFT.sol/interface.INFT.md)


## State Variables
### PERCENT_DIVIDER

```solidity
uint256 public constant PERCENT_DIVIDER = 1000000;
```


### RECORD_COMPANY_ROLE

```solidity
bytes32 public constant RECORD_COMPANY_ROLE = keccak256("RECORD_COMPANY_ROLE");
```


### singers

```solidity
mapping(uint256 => Singer) public singers;
```


### albums

```solidity
mapping(uint256 => Album) public albums;
```


### singerExists

```solidity
mapping(string => bool) private singerExists;
```


### singerIdCounter

```solidity
uint256 public singerIdCounter;
```


### albumIdCounter

```solidity
uint256 public albumIdCounter;
```


### recordCompanyFee

```solidity
uint256 public recordCompanyFee;
```


### name

```solidity
string public name;
```


### treasury

```solidity
address public treasury;
```


### factory

```solidity
INFTFactory public factory;
```


## Functions
### constructor


```solidity
constructor(string memory _name, address _recordCompanyAdmin, address _treasury, uint256 _initialFee)
    ERC1155("")
    ERC1155Supply();
```

### createSinger

create a new singer


```solidity
function createSinger(
    string memory _stageName,
    string memory _description,
    string memory _genre,
    string memory _imageUrl
) external onlyRole(RECORD_COMPANY_ROLE);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_stageName`|`string`|stage name of the singer|
|`_description`|`string`|description of the singer|
|`_genre`|`string`|main genre of the singer|
|`_imageUrl`|`string`|url of the cover image of the singer|


### createAlbum

create a new album (represented by a NFT)


```solidity
function createAlbum(uint256 _shareCount, uint256 _singerId, string memory _metadataUrl)
    external
    onlyRole(RECORD_COMPANY_ROLE);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_shareCount`|`uint256`|number of shares|
|`_singerId`|`uint256`|id of the singer|
|`_metadataUrl`|`string`|url of the metadata of the NFT|


### getSingers

return an array with the singers in the specified range


```solidity
function getSingers(uint256 _start, uint256 _end) public view returns (Singer[] memory);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_start`|`uint256`|starting index (inclusive)|
|`_end`|`uint256`|ending index (exclusive)|


### updateRecordCompanyFee

update the record company fee


```solidity
function updateRecordCompanyFee(uint256 _newFee) external onlyRole(DEFAULT_ADMIN_ROLE);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_newFee`|`uint256`|new fee|


### updateRecordTreasury

update the record company treasury address


```solidity
function updateRecordTreasury(address _treasury) external onlyRole(RECORD_COMPANY_ROLE);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_treasury`|`address`|new treasury address|


### uri

return the uri of the specified token


```solidity
function uri(uint256 _id) public view override returns (string memory);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_id`|`uint256`|id of the token|


### grantRole

assign role _role to _account. If _role is the record company role, than it also associates _account to this NFT


```solidity
function grantRole(bytes32 _role, address _account) public override onlyRole(getRoleAdmin(_role));
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|role to add|
|`_account`|`address`|account that receives the role|


### revokeRole

revoke role _role from _account. If _role is the record company role, than it also
removes the association of _account from this NFT


```solidity
function revokeRole(bytes32 _role, address _account) public override onlyRole(getRoleAdmin(_role));
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_role`|`bytes32`|role to remove|
|`_account`|`address`|account that looses the role|


### supportsInterface


```solidity
function supportsInterface(bytes4 _interfaceId) public view virtual override(AccessControl, ERC1155) returns (bool);
```

## Structs
### Singer

```solidity
struct Singer {
    string stageName;
    string description;
    string genre;
    string imageUrl;
    bool exists;
}
```

### Album

```solidity
struct Album {
    uint256 shareCount;
    uint256 singerId;
    string metadataUrl;
}
```

