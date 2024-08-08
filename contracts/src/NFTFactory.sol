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
     * @dev deploy a new NFT contract for a record company.
     * @param _name name of the token
     * @param _recordCompanyAdmin initial record company admin address
     * @param _treasury record company treasury
     * @param _initialFee initial fee for the record company
     */
    function deployNFT(string memory _name, address _recordCompanyAdmin, address _treasury, uint _initialFee) external onlyRole(DEFAULT_ADMIN_ROLE) {
        NFT nft = new NFT(_name, _recordCompanyAdmin, _treasury, _initialFee);

        isFactoryDeployed[address(nft)] = true;
        associatedNFT[_recordCompanyAdmin] = address(nft);

        emit NewNFT(address(nft), _recordCompanyAdmin);
    }

    /**
     * @notice link an admin to a NFT
     * @param _admin address of the admin
     * @param _nft address of the NFT to link
     * @dev this function can only be called by a NFT deployed by the factory
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