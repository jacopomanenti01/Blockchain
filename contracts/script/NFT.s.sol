// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "forge-std/Script.sol";
import {NFT} from "../src/NFT.sol";

contract NFTScript is Script {
    NFT public nft;

    // TODO: Update with our wallet
    string public name = "prova";

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        nft = new NFT(name);

        vm.stopBroadcast();
    }
}
