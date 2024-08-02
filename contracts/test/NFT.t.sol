// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test, console} from "forge-std/Test.sol";
import {NFT} from "../src/NFT.sol";
import {NFTFactory} from "../src/NFTFactory.sol";

contract NFTTest is Test {
    NFTFactory public factory;
    NFT public nft;

    address public recordCompanyAdmin = address(0x1);
    address public treasury = address(0x2);

    function setUp() public {
        factory = new NFTFactory();
        factory.deployNFT(recordCompanyAdmin, treasury);

        nft = NFT(factory.associatedNFT(recordCompanyAdmin));
    }

    function test_SingerCreationAccess() public {
        // TODO: Use custom errors
        vm.expectRevert();

        nft.createSinger("Stage", "Desc", "Genre", "https://...");
    }

    function test_SingerCreation() public {
        vm.startPrank(recordCompanyAdmin);

        nft.createSinger("Name", "Desc", "Genre", "https://...");

        (string memory stage, string memory desc, string memory genre, string memory url, ) = nft.singers(0);

        assertEq(nft.singerIdCounter(), 1);
        assertEq(stage, "Name");
        assertEq(desc, "Desc");
        assertEq(genre, "Genre");
        assertEq(url, "https://...");

        vm.stopPrank();
    }

    function test_AlbumCreationAccess() public {
        vm.expectRevert();

        nft.createAlbum(100 * 1e18, 0, "https://...");
    }

    function test_AlbumCreationWitInvalidSinger() public {
        vm.expectRevert();

        vm.startPrank(recordCompanyAdmin);
        nft.createAlbum(100, 1, "https://...");
        vm.stopPrank();
    }

    function test_AlbumCreation() public {
        vm.startPrank(recordCompanyAdmin);

        uint sharesCount = 100;
        nft.createSinger("Name", "Desc", "Genre", "https://...");
        nft.createAlbum(sharesCount, 0, "https://...");

        // Album stored correctly
        (uint shares, uint singerId, string memory url) = nft.albums(0);
        assertEq(nft.albumIdCounter(), 1);
        assertEq(shares, sharesCount);
        assertEq(singerId, 0);
        assertEq(url, "https://...");

        // Shares minted
        uint balance = nft.balanceOf(recordCompanyAdmin, 0);
        assertEq(balance, sharesCount);

        vm.stopPrank();
    }


}
