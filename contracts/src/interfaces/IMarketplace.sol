// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IMarketplace {
    event NewMPFees(uint256 indexed _newMPFees);

    event PaymentTokenAdded(address indexed token);
    event PaymentTokenRemoved(address indexed token);

    event NewNFTBuyOrder(address indexed collection, uint256 indexed id, address buyer);
}