// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "forge-std/Script.sol";
import {NFTFactory} from "../src/NFTFactory.sol";
import {Marketplace} from "../src/Marketplace.sol";
import {NFT} from "../src/NFT.sol";

contract DeployerAndTestScript is Script {
    NFTFactory public factory;
    Marketplace public marketplace;
    NFT public nft;

    function setUp() public {}

    function run() public {
        uint deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        uint buyerPrivateKey = vm.envUint("BUYER_PRIVATE_KEY");
        address feesCollector = vm.envAddress("FEE_COLLECTOR_ADDRESS");
        uint feesPercentage = 50000; // 5%

        address deployer = 0x756bFB8A31b2a21823152D96c88C6B8ae4aB1E99;

        address adminToAdd1 = 0xb7f8e58E3a892687700a37248c2482Ff846e16d8;
        address adminToAdd2 = 0x56C3E59117f37cf7203a0c6313c46003500b9317;

        vm.startBroadcast(deployerPrivateKey);

        factory = new NFTFactory();
        marketplace = new Marketplace(address(factory), feesCollector, feesPercentage);

        factory.grantRole(factory.DEFAULT_ADMIN_ROLE(), adminToAdd1);
        factory.grantRole(factory.DEFAULT_ADMIN_ROLE(), adminToAdd2);

        marketplace.grantRole(factory.DEFAULT_ADMIN_ROLE(), adminToAdd1);
        marketplace.grantRole(factory.DEFAULT_ADMIN_ROLE(), adminToAdd2);


        factory.deployNFT("Test", deployer, feesCollector, feesPercentage);
        nft = NFT(factory.associatedNFT(deployer));
        nft.createSinger("Artist", "Description", "Pop", "https://...");
        nft.createAlbum(100, 0, "https://...");

        nft.setApprovalForAll(address(marketplace), true);
        marketplace.createOrder(address(nft), 0, 50, 0.0001 * 1e18, address(0));

        vm.stopBroadcast();

        vm.startBroadcast(buyerPrivateKey);
        marketplace.buy{value: 0.0005 * 1e18}(0, 5);
        vm.stopBroadcast();
    }
}
