// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts/contracts/access/AccessControl.sol";
import "./interfaces/INFTFactory.sol";
import "./NFT.sol";

contract NFTFactory is AccessControl, INFTFactory {

    mapping (address => bool) public isFactoryDeployed;
    mapping (address => address) public associatedNFT;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Deploy a new NFT contract for a record company.
     * @param _name Token name
     * @param _recordCompanyAdmin Initial record company admin address
     * @param _treasury Record company treasury
     */
    function deployNFT(string memory _name, address _recordCompanyAdmin, address _treasury) external onlyRole(DEFAULT_ADMIN_ROLE) {
        NFT nft = new NFT(_name, _recordCompanyAdmin, _treasury);

        isFactoryDeployed[address(nft)] = true;
        associatedNFT[_recordCompanyAdmin] = address(nft);
    }

    /**
     * @notice Links an admin to a NFT
     * @param _admin Address of the admin
     * @param _nft Address of the NFT to link
     * @dev This function can only be called by a NFT deployed by the factory
     */
    function setAssociatedNFT(address _admin, address _nft) external {
        require(isFactoryDeployed[msg.sender], "NFT is not factory deployed");
        require(_nft == msg.sender || _nft == address(0), "Invalid NFT");
        
        if (_nft != address(0)) {
            require(associatedNFT[_admin] == address(0), "Admin already has associated NFT");
        }

        associatedNFT[_admin] = _nft;
    } 

}