// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test, console} from "forge-std/Test.sol";
import {NFT} from "../src/NFT.sol";
import {NFTFactory} from "../src/NFTFactory.sol";

contract NFTFactoryTest is Test {
    NFTFactory public factory;
    NFT public nft;

    address public recordCompanyAdmin = address(0x1);
    address public treasury = address(0x2);

    string public baseUri = "https://.../";

    function setUp() public {
        factory = new NFTFactory();
        factory.deployNFT(baseUri, recordCompanyAdmin, treasury);

        nft = NFT(factory.associatedNFT(recordCompanyAdmin));
    }

    function test_Deployment() public view {
        assertEq(nft.hasRole(nft.RECORD_COMPANY_ROLE(), recordCompanyAdmin), true, "Record company admin misses role");
        assertEq(nft.hasRole(nft.DEFAULT_ADMIN_ROLE(), msg.sender), true, "Owner admin misses role");
    }

}
