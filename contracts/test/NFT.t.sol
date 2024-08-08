// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test, console} from "forge-std/Test.sol";
import {NFT} from "../src/NFT.sol";
import {NFTFactory} from "../src/NFTFactory.sol";
import "openzeppelin-contracts/contracts/utils/Strings.sol";

contract NFTTest is Test {
    NFTFactory public factory;
    NFT public nft;

    address public recordCompanyAdmin = address(0x1);
    address public treasury = address(0x2);
    uint public fee = 50000; // 5%
    address public owner;

    function setUp() public {
        owner = msg.sender;

        factory = new NFTFactory();
        factory.deployNFT("Test", recordCompanyAdmin, treasury, fee);

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

    function test_SingerCreationWithSameName() public {
        vm.startPrank(recordCompanyAdmin);

        nft.createSinger("Name", "Desc", "Genre", "https://...");
        vm.expectRevert();
        nft.createSinger("Name", "Desc2", "Genre2", "https://...");

        vm.stopPrank();
    }

    function test_SingerGetter() public {
        vm.startPrank(recordCompanyAdmin);

        for (uint i = 0; i < 10; i++) { 
            nft.createSinger(string.concat("Name_", Strings.toString(i)), "Desc", "Genre", "https://...");
        }

        vm.stopPrank();
        
        NFT.Singer[] memory singers = nft.getSingers(0, nft.singerIdCounter());

        assertEq(singers.length, 10, "Incorrect array length");
        for (uint i = 0; i < 10; i++) { 
            assertEq(singers[i].stageName, string.concat("Name_", Strings.toString(i)), "Incorrect name");
            assertEq(singers[i].description, "Desc", "Incorrect description");
            assertEq(singers[i].genre, "Genre", "Incorrect genre");
            assertEq(singers[i].imageUrl, "https://...", "Incorrect image url");
            assertEq(singers[i].exists, true, "Singer does not exist");
        }

        vm.expectRevert("Invalid parameters");
        singers = nft.getSingers(1, 0);
    }

    function test_SingerGetterAccess() public {
        vm.expectRevert();
        nft.getSingers(0, 100);
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

    function testFuzz_TreasuryUpdateAccess(address _attacker) public {
        vm.assume(! nft.hasRole(nft.RECORD_COMPANY_ROLE(), _attacker));
        
        vm.expectRevert();

        // caller is the deployer
        vm.startPrank(_attacker);
        nft.updateRecordTreasury(address(5));
        vm.stopPrank();
    }

    function test_TreasuryUpdate() public {
        vm.startPrank(recordCompanyAdmin);

        // caller is the deployer
        nft.updateRecordTreasury(address(5));

        assertEq(nft.treasury(), address(5), "Incorrect treasury");

        vm.stopPrank();
    }

    function testFuzz_RecordCompanyFeeUpdateAccess(address _attacker) public {
        vm.assume(! nft.hasRole(nft.DEFAULT_ADMIN_ROLE(), _attacker));

        vm.expectRevert();
        vm.startPrank(_attacker);

        nft.updateRecordCompanyFee(1000);

        vm.stopPrank();
    }

    function test_RecordCompanyFeeUpdate() public {
        vm.startPrank(owner);

        // caller is the deployer
        nft.updateRecordCompanyFee(1000);

        assertEq(nft.recordCompanyFee(), 1000);

        vm.stopPrank();
    }

    function testFuzz_CustomGrantRoleAccess(address _attacker) public {
        vm.assume(_attacker != recordCompanyAdmin);
        vm.assume(_attacker != owner);

        vm.startPrank(_attacker);

        bytes32 role = nft.RECORD_COMPANY_ROLE();
        vm.expectRevert();
        nft.grantRole(role, _attacker);

        role = nft.DEFAULT_ADMIN_ROLE();
        vm.expectRevert();
        nft.grantRole(role, _attacker);

        vm.stopPrank();
    }

    function testFuzz_CustomGrantRoleRecordCompany(address _newAdmin) public {
        vm.assume(factory.associatedNFT(_newAdmin) == address(0));
        
        vm.startPrank(recordCompanyAdmin);

        nft.grantRole(nft.RECORD_COMPANY_ROLE(), _newAdmin);
        assertEq(factory.associatedNFT(_newAdmin), address(nft), "Broken nft association to new admin");

        // Cleanup
        nft.revokeRole(nft.RECORD_COMPANY_ROLE(), _newAdmin);

        vm.stopPrank();
    }

    function testFuzz_CustomGrantRoleRDefaultAdmin(address _newAdmin) public {
        vm.assume(factory.associatedNFT(_newAdmin) == address(0));

        vm.startPrank(owner);
        nft.grantRole(nft.DEFAULT_ADMIN_ROLE(), _newAdmin);

        assertEq(factory.associatedNFT(_newAdmin), address(0), "Creates NFT association but it is not needed");

        // Cleanup
        nft.revokeRole(nft.DEFAULT_ADMIN_ROLE(), _newAdmin);

        vm.stopPrank();
    }

    function testFuzz_CustomRevokeRoleAccess(address _attacker) public {
        vm.assume(_attacker != recordCompanyAdmin);
        vm.assume(_attacker != owner);

        vm.startPrank(_attacker);

        bytes32 role = nft.RECORD_COMPANY_ROLE();
        vm.expectRevert();
        nft.revokeRole(role, _attacker);

        role = nft.DEFAULT_ADMIN_ROLE();
        vm.expectRevert();
        nft.revokeRole(role, _attacker);

        vm.stopPrank();
    }

    function testFuzz_CustomRevokeRoleRecordCompany(address _newAdmin) public {
        vm.assume(factory.associatedNFT(_newAdmin) == address(0));

        vm.startPrank(recordCompanyAdmin);
        
        nft.grantRole(nft.RECORD_COMPANY_ROLE(), _newAdmin);
        nft.revokeRole(nft.RECORD_COMPANY_ROLE(), _newAdmin);

        assertEq(factory.associatedNFT(_newAdmin), address(0), "Broken nft association to new admin");

        vm.stopPrank();
    }

    function testFuzz_CustomRevokeRoleRDefaultAdmin(address _newAdmin) public {
        vm.assume(factory.associatedNFT(_newAdmin) == address(0));

        vm.startPrank(owner);

        nft.grantRole(nft.DEFAULT_ADMIN_ROLE(), _newAdmin);
        nft.revokeRole(nft.DEFAULT_ADMIN_ROLE(), _newAdmin);

        assertEq(factory.associatedNFT(_newAdmin), address(0), "Creates NFT association but it is not needed");

        vm.stopPrank();
    }

}
