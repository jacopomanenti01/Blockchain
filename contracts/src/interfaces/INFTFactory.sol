// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface INFTFactory {
    function isFactoryDeployed(address) external returns (bool);
    function setAssociatedNFT(address _admin, address _nft) external;

    event NewNFT(address indexed _nft, address indexed _initialAdmin);
}