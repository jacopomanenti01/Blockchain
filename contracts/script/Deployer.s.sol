// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "forge-std/Script.sol";
import {NFTFactory} from "../src/NFTFactory.sol";
import {Marketplace} from "../src/Marketplace.sol";

contract DeployerScript is Script {
    NFTFactory public factory;
    Marketplace public marketplace;

    function setUp() public {}

    function run() public {
        uint deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address feesCollector = vm.envAddress("FEE_COLLECTOR_ADDRESS");
        uint feesPercentage = 5000000; // 5%

        vm.startBroadcast(deployerPrivateKey);

        factory = new NFTFactory();
        marketplace = new Marketplace(address(factory), feesCollector, feesPercentage);

        vm.stopBroadcast();
    }
}
