// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "forge-std/Script.sol";
import {NFTFactory} from "../src/NFTFactory.sol";
import {Marketplace} from "../src/Marketplace.sol";

contract DeployerOnlyMarketplaceScript is Script {
    Marketplace public marketplace;

    function setUp() public {}

    function run() public {
        uint deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address feesCollector = vm.envAddress("FEE_COLLECTOR_ADDRESS");
        address factoryAddress = 0x422761B0B1915c04FFC90511a250627bE1Ec2927;
        uint feesPercentage = 50000; // 5%

        address adminToAdd1 = 0xb7f8e58E3a892687700a37248c2482Ff846e16d8;
        address adminToAdd2 = 0x56C3E59117f37cf7203a0c6313c46003500b9317;

        vm.startBroadcast(deployerPrivateKey);

        marketplace = new Marketplace(factoryAddress, feesCollector, feesPercentage);

        marketplace.grantRole(marketplace.DEFAULT_ADMIN_ROLE(), adminToAdd1);
        marketplace.grantRole(marketplace.DEFAULT_ADMIN_ROLE(), adminToAdd2);

        vm.stopBroadcast();
    }
}
