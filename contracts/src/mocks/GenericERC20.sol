// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract GenericERC20 is ERC20 {
    /**
     * @notice Constructor
     * @param _name token name
     * @param _sym token symbol
     * @param _initialSupply token initial supply
	 * @dev This is contract used only in the tests. Do NOT deploy this on mainnet.
     */
    constructor(string memory _name, string memory _sym, uint256 _initialSupply) ERC20(_name, _sym) {
    	_mint(msg.sender, _initialSupply * 1e18);
    }

}