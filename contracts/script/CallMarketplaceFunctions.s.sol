// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {Marketplace} from "../src/Marketplace.sol";
import {console} from "forge-std/console.sol";

contract CallMarketplaceFunctions is Script {
    function setUp() public {}

    function run() public {
        address marketplaceAddress = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
        Marketplace marketplace = Marketplace(marketplaceAddress);

        vm.startBroadcast();

        uint tokenId = 1; // Example token ID
        uint amount = 10; // Amount of tokens
        uint price = 1 ether; // Price per token
        address paymentToken = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE; // Native coin, change if using a different token

        try marketplace.createOrder(address(this), tokenId, amount, price, paymentToken) {
            console.log("Order created successfully");
        } catch {
            console.log("Failed to create order");
        }

        vm.stopBroadcast();
    }
}
