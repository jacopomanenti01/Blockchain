// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts/contracts/access/AccessControl.sol";
import "./interfaces/INFTFactory.sol";
import "./interfaces/INFT.sol";
import "./NFT.sol";

contract NFTFactory is AccessControl, INFTFactory {

    mapping (address => bool) public isFactoryDeployed;
    mapping (address => address) public associatedNFT;
    mapping (uint => address) public deployedNFTs;

    uint public nextNFTId;

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
        require(associatedNFT[_recordCompanyAdmin] == address(0), "Admin already has associated NFT");
        
        NFT nft = new NFT(_name, _recordCompanyAdmin, _treasury, _initialFee);

        isFactoryDeployed[address(nft)] = true;
        associatedNFT[_recordCompanyAdmin] = address(nft);

        deployedNFTs[nextNFTId] = address(nft);
        nextNFTId++;

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

    /**
     * @notice return all NFTs owned by the specified wallet
     * @param _owner owner of the NFTs
     * @param _start starting NFT index (inclusive)
     * @param _end ending NFT index (exclusive)
     * @param _limit max amount of items to collect
     * @dev return four arrays (containgin respectively: nft address, token id, amount owned, relative uri and relative balance) and the effective number of NFTs
     */
    function batchGetNFTs(address _owner, uint _start, uint _end, uint _limit) external view returns (address[] memory, uint[] memory, uint[] memory, string[] memory, uint[] memory, uint) {
        address[] memory nfts = new address[](_limit);
        uint[] memory tokenIds = new uint[](_limit);
        uint[] memory amounts = new uint[](_limit);
        string[] memory uris = new string[](_limit);
        uint[] memory balances = new uint[](_limit);

        uint globalId = 0;
        for (uint i = _start; i < _end && globalId < _limit; i++) {
            NFT nft = NFT(deployedNFTs[i]);

            for (uint j = 0; j < nft.albumIdCounter() && globalId < _limit; j++) {
                uint balance = nft.balanceOf(_owner, j);
                if (balance != 0) {
                    nfts[globalId] = deployedNFTs[i];
                    tokenIds[globalId] = j;
                    amounts[globalId] = balance;
                    uris[globalId] = nft.uri(j);
                    balances[globalId] = balance;

                    globalId++;
                }
            }
        }

        return (nfts, tokenIds, amounts, uris, balances, globalId);
    }

}