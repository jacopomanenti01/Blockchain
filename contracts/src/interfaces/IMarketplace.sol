// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IMarketplace {
    event NewMPFees(uint indexed _newMPFees);

    event PaymentTokenAdded(address indexed token);
    event PaymentTokenRemoved(address indexed token);

    event NewOrder(uint indexed orderId, address indexed collection, uint indexed tokenId, uint amount, uint price, address owner);
    event OrderCancelled(uint indexed orderId);

    event OrderFilled(uint indexed orderId, address indexed buyer, uint amount);
}