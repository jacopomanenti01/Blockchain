// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts/contracts/access/AccessControl.sol";
import "./interfaces/INFTFactory.sol";
import "./NFT.sol";

contract NFTFactory is AccessControl, INFTFactory {

    mapping (address => bool) public isFactoryDeployed;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Deploy a new NFT contract for a record company.
     * @param _name Token name
     * @param _recordCompanyAdmin Initial record company admin address
     */
    function deployNFT(string memory _name, address _recordCompanyAdmin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        NFT nft = new NFT(_name, _recordCompanyAdmin);

        isFactoryDeployed[address(nft)] = true;
    }

}