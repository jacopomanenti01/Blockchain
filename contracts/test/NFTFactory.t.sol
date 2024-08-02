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
    address public treasury = address(0x2);

    function setUp() public {
        factory = new NFTFactory();
    }

    function test_Deployment() public {
        // Deploy new contract
        factory.deployNFT(recordCompanyAdmin, treasury);

        // Save nft object for later tests
        nft = NFT(factory.associatedNFT(recordCompanyAdmin));

        assertNotEq(address(nft), address(0), "Contract not deployed");
        assertEq(nft.hasRole(nft.RECORD_COMPANY_ROLE(), recordCompanyAdmin), true, "Record company admin misses role");
        assertEq(nft.hasRole(nft.DEFAULT_ADMIN_ROLE(), msg.sender), true, "Owner admin misses role");
    }

}
