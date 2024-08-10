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

        address adminToAdd1 = 0xb7f8e58E3a892687700a37248c2482Ff846e16d8;
        address adminToAdd2 = 0x56C3E59117f37cf7203a0c6313c46003500b9317;


        vm.startBroadcast(deployerPrivateKey);

        factory = new NFTFactory();
        marketplace = new Marketplace(address(factory), feesCollector, feesPercentage);

        factory.grantRole(factory.DEFAULT_ADMIN_ROLE(), adminToAdd1);
        factory.grantRole(factory.DEFAULT_ADMIN_ROLE(), adminToAdd2);

        marketplace.grantRole(factory.DEFAULT_ADMIN_ROLE(), adminToAdd1);
        marketplace.grantRole(factory.DEFAULT_ADMIN_ROLE(), adminToAdd2);

        vm.stopBroadcast();
    }
}
