// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "forge-std/Script.sol";
import {NFTFactory} from "../src/NFTFactory.sol";
import {Marketplace} from "../src/Marketplace.sol";

contract DeployerScript is Script {
    NFTFactory public factory;
    Marketplace public marketplace;

    // TODO: Update with our wallet
    address public feesCollector = 0xa83114A443dA1CecEFC50368531cACE9F37fCCcb;

    uint public feesPercentage = 5000000; // 5%

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        factory = new NFTFactory();
        marketplace = new Marketplace(address(factory), feesCollector, feesPercentage);

        vm.stopBroadcast();
    }
}
