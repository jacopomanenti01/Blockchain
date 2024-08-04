// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test, console} from "forge-std/Test.sol";
import {Marketplace} from "../src/Marketplace.sol";
import {NFTFactory} from "../src/NFTFactory.sol";
import {NFT} from "../src/NFT.sol";
import {GenericERC20} from "../src/mocks/GenericERC20.sol";

contract MarketplaceTest is Test {
    Marketplace public marketplace;
    NFTFactory public factory;
    NFT public nft;
    GenericERC20 public paymentToken;
    address public owner;

    address public feeCollector = address(1);
    address public recordCompany = address(2);
    address public treasury = address(3);
    address public buyer = address (4);
    address public seller = address (5);
    address public bidder1 = address (6);
    address public bidder2 = address (7);
    
    uint public feePercentage = 55000; // 5.5%

    function setUp() public {
        owner = msg.sender;

        // Deploy a payment token and distribute it
        paymentToken = new GenericERC20("Payment Token", "PayT", 1000000);

        factory = new NFTFactory();
        factory.deployNFT("Token1", recordCompany, treasury);
        nft = NFT(factory.associatedNFT(recordCompany));

        marketplace = new Marketplace(address(factory), feeCollector, feePercentage);
    }

    function test_Deployment() public view {
        assertEq(feeCollector, marketplace.mpFeesCollector(), "Wrong fees collector address");
        assertEq(feePercentage, marketplace.mpFeesPercentage(), "Wrong fees percentage");
    }

    function testFuzz_TreasuryUpdateAccess(address _attacker) public {
        vm.assume(! marketplace.hasRole(marketplace.DEFAULT_ADMIN_ROLE(), _attacker));

        vm.startPrank(_attacker);
        vm.expectRevert();
        marketplace.setNewTreasury(_attacker);
        vm.stopPrank();
    }

    function testFuzz_TreasuryUpdate(address _newTreasury) public {
        marketplace.setNewTreasury(_newTreasury);
        assertEq(marketplace.mpFeesCollector(), _newTreasury, "Incorrect treasury");

        // Restore treasury
        marketplace.setNewTreasury(feeCollector);
    }

    function testFuzz_FeeUpdateAccess(address _attacker) public {
        vm.assume(! marketplace.hasRole(marketplace.DEFAULT_ADMIN_ROLE(), _attacker));

        vm.startPrank(_attacker);
        vm.expectRevert();
        marketplace.setMarketPlaceFee(1);
        vm.stopPrank();
    }

    function testFuzz_FeeUpdateOverLimit(uint _fee) public {
        vm.assume(_fee > marketplace.PERCENT_DIVIDER());

        vm.expectRevert();
        marketplace.setMarketPlaceFee(_fee);
    }

    function testFuzz_FeeUpdate(uint _fee) public {
        vm.assume(_fee <= marketplace.PERCENT_DIVIDER());

        marketplace.setMarketPlaceFee(_fee);
        assertEq(marketplace.mpFeesPercentage(), _fee, "Incorrect fee percentage");

        // Restore treasury
        marketplace.setMarketPlaceFee(feePercentage);
    }

    function testFuzz_FactoryUpdateAccess(address _attacker) public {
        vm.assume(! marketplace.hasRole(marketplace.DEFAULT_ADMIN_ROLE(), _attacker));

        vm.startPrank(_attacker);
        vm.expectRevert();
        marketplace.setNFTFactory(address(0));
        vm.stopPrank();
    }

    function test_FactoryUpdate() public {
        NFTFactory factory2 = new NFTFactory();

        marketplace.setNFTFactory(address(factory2));
        assertEq(address(marketplace.nftFactory()), address(factory2), "Incorrect new factory");

        // Restore factory
        marketplace.setNFTFactory(address(factory));
    }

}
