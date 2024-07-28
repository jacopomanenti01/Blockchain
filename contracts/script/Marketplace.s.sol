// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "forge-std/Script.sol";
import {Marketplace} from "../src/Marketplace.sol";

contract MarketplaceScript is Script {
    Marketplace public marketplace;

    address public feesCollector = 0xa83114A443dA1CecEFC50368531cACE9F37fCCcb;
    uint public feesPercentage = 5000000; // 5%

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        marketplace = new Marketplace(feesCollector, feesPercentage);
        console.log("Deployed Marketplace at:", address(marketplace));

        vm.stopBroadcast();
    }
}

