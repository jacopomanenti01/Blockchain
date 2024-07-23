// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IMarketplace {
    event NewMPFees(uint256 indexed _newMPFees);

    event PaymentTokenAdded(address indexed token);
    event PaymentTokenRemoved(address indexed token);

    event NewNFTBuyOrder(address indexed collection, uint256 indexed id, address buyer);

    event NewOrder(uint256 indexed orderId, address indexed collection, uint256 indexed tokenId, uint256 amount, uint256 price, address owner);
    event OrderFilled(uint256 indexed orderId, address indexed buyer, uint256 amount);
}