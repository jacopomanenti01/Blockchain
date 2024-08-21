# GenericERC20
[Git Source](https://github.com/jacopomanenti01/Blockchain/blob/ad0849695bddd3f5368d81383deb2c64cd2e9966/src/mocks/GenericERC20.sol)

**Inherits:**
ERC20


## Functions
### constructor

Constructor

*This is contract used only in the tests. Do NOT deploy this on mainnet.*


```solidity
constructor(string memory _name, string memory _sym, uint256 _initialSupply) ERC20(_name, _sym);
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`_name`|`string`|token name|
|`_sym`|`string`|token symbol|
|`_initialSupply`|`uint256`|token initial supply|


