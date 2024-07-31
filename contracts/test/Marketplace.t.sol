// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test, console} from "forge-std/Test.sol";
import {Marketplace} from "../src/Marketplace.sol";
import {NFTFactory} from "../src/NFTFactory.sol";

contract MarketplaceTest is Test {
    Marketplace public marketplace;
    NFTFactory public factory;

    address public feesCollector = 0xa83114A443dA1CecEFC50368531cACE9F37fCCcb; // Sample wallet
    uint public feesPercentage = 5000000; // 5%

    function setUp() public {
        factory = new NFTFactory();
        marketplace = new Marketplace(address(factory), feesCollector, feesPercentage);
    }

    function test_Deployment() public view {
        assertEq(feesCollector, marketplace.mpFeesCollector(), "Wrong fees collector address");
        assertEq(feesPercentage, marketplace.mpFeesPercentage(), "Wrong fees percentage");
    }

}
