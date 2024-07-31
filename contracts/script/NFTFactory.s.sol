// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "forge-std/Script.sol";
import {NFTFactory} from "../src/NFTFactory.sol";

contract NFTScript is Script {
    NFTFactory public factory;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        factory = new NFTFactory();

        vm.stopBroadcast();
    }
}
