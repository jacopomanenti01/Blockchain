// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test, console} from "forge-std/Test.sol";
import {NFT} from "../src/NFT.sol";
import {NFTFactory} from "../src/NFTFactory.sol";

contract NFTFactoryTest is Test {
    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);
    event NewNFT(address indexed _nft, address indexed _initialAdmin);
    
    NFTFactory public factory;
    NFT public nft;

    address public recordCompanyAdmin = address(0x1);
    address public recordCompanyAdmin2 = address(0x3);
    address public recordCompanyAdmin3 = address(0x4);
    address public treasury = address(0x2);

    uint public fee = 50000; // 5%

    function setUp() public {
        factory = new NFTFactory();
    }

    function test_Deployment() public {
        // Deploy new contract
        factory.deployNFT("Name", recordCompanyAdmin, treasury, fee);

        // Save nft object for later tests
        nft = NFT(factory.associatedNFT(recordCompanyAdmin));

        assertNotEq(address(nft), address(0), "Contract not deployed");
        assertEq(nft.name(), "Name", "Incorrect name");
        assertEq(nft.hasRole(nft.RECORD_COMPANY_ROLE(), recordCompanyAdmin), true, "Record company admin misses role");
        assertEq(nft.hasRole(nft.DEFAULT_ADMIN_ROLE(), msg.sender), true, "Owner admin misses role");
        assertEq(nft.recordCompanyFee(), fee, "Incorrect record company fee");
        assertEq(factory.nextNFTId(), 1, "Incorrect next NFT id");
        assertEq(factory.deployedNFTs(0), address(nft), "Incorrect NFT address in NFT by id map");
    }

    function test_NFTGetter() public {
        uint amount1 = 100;
        uint amount2 = 12;
        uint amount3 = 999999;
        address newOwner = address(10);

        // Deploy 3 NFTs
        factory.deployNFT("Name1", recordCompanyAdmin, treasury, fee);
        factory.deployNFT("Name1", recordCompanyAdmin2, treasury, fee);
        factory.deployNFT("Name1", recordCompanyAdmin3, treasury, fee);

        // Mint 3 Name1 NFTs and trasfer to another account
        vm.startPrank(recordCompanyAdmin);
        nft = NFT(factory.associatedNFT(recordCompanyAdmin));
        nft.createSinger("Singer", "desc", "pop", "https://...");
        nft.createAlbum(amount1, 0, "https://.../a");
        nft.createAlbum(amount2, 0, "https://.../b");
        nft.createAlbum(amount3, 0, "https://.../c");
        nft.safeTransferFrom(recordCompanyAdmin, newOwner, 0, amount1, "");
        nft.safeTransferFrom(recordCompanyAdmin, newOwner, 1, amount2, "");
        nft.safeTransferFrom(recordCompanyAdmin, newOwner, 2, amount3, "");
        vm.stopPrank();

        // Mint 1 Name2 NFTs and trasfer to another account
        vm.startPrank(recordCompanyAdmin2);
        nft = NFT(factory.associatedNFT(recordCompanyAdmin2));
        nft.createSinger("Singer", "desc", "pop", "https://...");
        nft.createAlbum(amount1, 0, "https://.../d");
        nft.safeTransferFrom(recordCompanyAdmin2, newOwner, 0, amount1, "");
        vm.stopPrank();

        // Mint 2 Name3 NFTs and trasfer to another account
        vm.startPrank(recordCompanyAdmin3);
        nft = NFT(factory.associatedNFT(recordCompanyAdmin3));
        nft.createSinger("Singer", "desc", "pop", "https://...");
        nft.createAlbum(amount1, 0, "https://.../e");
        nft.createAlbum(amount2, 0, "https://.../f");
        nft.safeTransferFrom(recordCompanyAdmin3, newOwner, 0, amount1, "");
        nft.safeTransferFrom(recordCompanyAdmin3, newOwner, 1, amount2, "");
        vm.stopPrank();

        // Get all owner NFTs
        (address[] memory nfts, uint[] memory ids, uint[] memory amounts, string[] memory uris, uint[] memory balances, uint effSize) = factory.batchGetNFTs(newOwner, 0, factory.nextNFTId(), 20);

        // Checks
        assertEq(nfts.length, ids.length, "Incorrect length between nfts and ids");
        assertEq(ids.length, amounts.length, "Incorrect length between ids and amounts");
        assertEq(amounts.length, uris.length, "Incorrect length between amounts and uris");
        assertEq(uris.length, balances.length, "Incorrect length between uris and balances");
        assertEq(balances.length, 20, "Incorrect arrays length");
        assertEq(effSize, 6, "Incorrect effective size");

        // Individual checks - NFT addresses
        assertEq(nfts[0], factory.associatedNFT(recordCompanyAdmin), "Incorrect NFT address at id 0");
        assertEq(nfts[1], factory.associatedNFT(recordCompanyAdmin), "Incorrect NFT address at id 1");
        assertEq(nfts[2], factory.associatedNFT(recordCompanyAdmin), "Incorrect NFT address at id 2");
        assertEq(nfts[3], factory.associatedNFT(recordCompanyAdmin2), "Incorrect NFT address at id 3");
        assertEq(nfts[4], factory.associatedNFT(recordCompanyAdmin3), "Incorrect NFT address at id 4");
        assertEq(nfts[5], factory.associatedNFT(recordCompanyAdmin3), "Incorrect NFT address at id 5");

        // Individual checks - ids
        assertEq(ids[0], 0, "Incorrect token id at id 0");
        assertEq(ids[1], 1, "Incorrect token id at id 1");
        assertEq(ids[2], 2, "Incorrect token id at id 2");
        assertEq(ids[3], 0, "Incorrect token id at id 3");
        assertEq(ids[4], 0, "Incorrect token id at id 4");
        assertEq(ids[5], 1, "Incorrect token id at id 5");

        // Individual checks - ids
        assertEq(amounts[0], amount1, "Incorrect amount at id 0");
        assertEq(amounts[1], amount2, "Incorrect amount at id 1");
        assertEq(amounts[2], amount3, "Incorrect amount at id 2");
        assertEq(amounts[3], amount1, "Incorrect amount at id 3");
        assertEq(amounts[4], amount1, "Incorrect amount at id 4");
        assertEq(amounts[5], amount2, "Incorrect amount at id 5");

        // Individual checks - uris
        assertEq(uris[0], "https://.../a", "Incorrect uri at id 0");
        assertEq(uris[1], "https://.../b", "Incorrect uri at id 1");
        assertEq(uris[2], "https://.../c", "Incorrect uri at id 2");
        assertEq(uris[3], "https://.../d", "Incorrect uri at id 3");
        assertEq(uris[4], "https://.../e", "Incorrect uri at id 4");
        assertEq(uris[5], "https://.../f", "Incorrect uri at id 5");

        // Individual checks - balances
        assertEq(balances[0], amount1, "Incorrect balance at id 0");
        assertEq(balances[1], amount2, "Incorrect balance at id 1");
        assertEq(balances[2], amount3, "Incorrect balance at id 2");
        assertEq(balances[3], amount1, "Incorrect balance at id 3");
        assertEq(balances[4], amount1, "Incorrect balance at id 4");
        assertEq(balances[5], amount2, "Incorrect balance at id 5");

    }

}
