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
    
    uint public rcFeePercentage = 55000; // 5.5%
    uint public marketplaceFeePercentage = 25000; // 2.5%
    uint public shares0Amount = 1000;

    function setUp() public {
        owner = msg.sender;

        vm.startPrank(owner);
        // Deploy a payment token and distribute it
        paymentToken = new GenericERC20("Payment Token", "PayT", 1000000);
        paymentToken.transfer(buyer, 100000 * 1e18);
        paymentToken.transfer(bidder1, 100000 * 1e18);
        paymentToken.transfer(bidder2, 100000 * 1e18);

        vm.deal(buyer, 1000 * 1e18);
        vm.deal(bidder1, 1000 * 1e18);
        vm.deal(bidder2, 1000 * 1e18);

        factory = new NFTFactory();
        factory.deployNFT("Token1", recordCompany, treasury, rcFeePercentage);
        nft = NFT(factory.associatedNFT(recordCompany));

        marketplace = new Marketplace(address(factory), feeCollector, marketplaceFeePercentage);
        vm.stopPrank();

        vm.startPrank(recordCompany);
        nft.createSinger("Name", "Desc", "Pop", "https://.../artist/sid");
        nft.createAlbum(shares0Amount, 0, "https://.../artist/sid/albums/aid");
        nft.safeTransferFrom(recordCompany, seller, 0, shares0Amount, "");
        vm.stopPrank();
    }

    function test_Deployment() public view {
        assertEq(feeCollector, marketplace.mpFeesCollector(), "Wrong fees collector address");
        assertEq(marketplaceFeePercentage, marketplace.mpFeesPercentage(), "Wrong fees percentage");

        assertEq(marketplace.hasRole(marketplace.DEFAULT_ADMIN_ROLE(), owner), true, "Deployer is not admin");
    }

    function testFuzz_TreasuryUpdateAccess(address _attacker) public {
        vm.assume(! marketplace.hasRole(marketplace.DEFAULT_ADMIN_ROLE(), _attacker));

        vm.startPrank(_attacker);
        vm.expectRevert();
        marketplace.setNewTreasury(_attacker);
        vm.stopPrank();
    }

    function testFuzz_TreasuryUpdate(address _newTreasury) public {
        vm.startPrank(owner);

        marketplace.setNewTreasury(_newTreasury);
        assertEq(marketplace.mpFeesCollector(), _newTreasury, "Incorrect treasury");

        // Restore treasury
        marketplace.setNewTreasury(feeCollector);

        vm.stopPrank();
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

        vm.startPrank(owner);
        vm.expectRevert();
        marketplace.setMarketPlaceFee(_fee);
        vm.stopPrank();
    }

    function testFuzz_FeeUpdate(uint _fee) public {
        vm.assume(_fee <= marketplace.PERCENT_DIVIDER());
        
        vm.startPrank(owner);
        marketplace.setMarketPlaceFee(_fee);
        assertEq(marketplace.mpFeesPercentage(), _fee, "Incorrect fee percentage");

        // Restore treasury
        marketplace.setMarketPlaceFee(rcFeePercentage);

        vm.stopPrank();
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

        vm.startPrank(owner);
        marketplace.setNFTFactory(address(factory2));
        assertEq(address(marketplace.nftFactory()), address(factory2), "Incorrect new factory");

        // Restore factory
        marketplace.setNFTFactory(address(factory));
        vm.stopPrank();
    }

    function test_CancelBuyOrder() public {
        uint sellAmount = 500;
        uint sellPrice = 0.5 * 1e18;
        uint totalSellPrice = sellPrice * sellAmount;

        uint sellerBalanceNFTBefore = nft.balanceOf(seller, 0);
        uint marketplaceBalanceNFTBefore = nft.balanceOf(address(marketplace), 0);

        // Sell then cancel
        vm.startPrank(seller);
        nft.setApprovalForAll(address(marketplace), true); 
        marketplace.createOrder(address(nft), 0, sellAmount, sellPrice, address(paymentToken));
        marketplace.cancel(0);
        vm.stopPrank();
        
        uint sellerBalanceNFTAfter = nft.balanceOf(seller, 0);
        uint marketplaceBalanceNFTAfter = nft.balanceOf(address(marketplace), 0);
        assertEq(sellerBalanceNFTAfter, sellerBalanceNFTBefore, "Incorrect seller amount");

        assertEq(marketplaceBalanceNFTAfter, marketplaceBalanceNFTBefore, "Incorrect marketplace amount");

        // Cannot buy a cancelled order
        vm.prank(buyer);
        paymentToken.approve(address(marketplace), totalSellPrice);
        vm.expectRevert();
        marketplace.buy(0, sellAmount);
        vm.stopPrank();
    }

    function test_SuccessfulBuyOrderWithPaymentToken() public {
        uint sellAmount = 500;
        uint sellPrice = 0.5 * 1e18;
        uint totalSellPrice = sellPrice * sellAmount;

        // Sell
        vm.startPrank(seller);
        uint sellerBalanceBefore = nft.balanceOf(seller, 0);
        nft.setApprovalForAll(address(marketplace), true); 
        marketplace.createOrder(address(nft), 0, sellAmount, sellPrice, address(paymentToken));
        uint sellerBalanceAfter = nft.balanceOf(seller, 0);
        uint marketplaceBalanceAfterCreateOrder = nft.balanceOf(address(marketplace), 0);
        vm.stopPrank();

        // Checks
        assertEq(sellerBalanceBefore - sellerBalanceAfter, sellAmount, "Incorrect balances for seller");
        assertEq(marketplaceBalanceAfterCreateOrder, sellAmount, "Incorrect balances for marketplace after create order");
        
        (address payT, uint price, uint amount, uint left, uint tokenId, address effSeller, address collection) = marketplace.orders(0);
        assertEq(payT, address(paymentToken), "Incorrect payment token");
        assertEq(price, sellPrice, "Incorrect sell price");
        assertEq(amount, sellAmount, "Incorrect sell amount");
        assertEq(left, sellAmount, "Incorrect left tokens amount");
        assertEq(tokenId, 0, "Incorrect token id");
        assertEq(effSeller, seller, "Incorrect order owner");
        assertEq(collection, address(nft), "Incorrect nft address");
        assertEq(marketplace.orderCounter(), 1, "Incorrect order counter");

        // Buy
        vm.startPrank(buyer);
        uint sellerPaymentBalanceBefore = paymentToken.balanceOf(seller);
        uint buyerPaymentBalanceBefore = paymentToken.balanceOf(buyer);
        uint treasuryPaymentBalanceBefore = paymentToken.balanceOf(treasury);
        uint feeCollectorPaymentBalanceBefore = paymentToken.balanceOf(feeCollector);
        uint buyerNFTBalanceBefore = nft.balanceOf(buyer, 0);

        paymentToken.approve(address(marketplace), totalSellPrice);
        marketplace.buy(0, sellAmount);

        uint sellerPaymentBalanceAfter = paymentToken.balanceOf(seller);
        uint buyerPaymentBalanceAfter = paymentToken.balanceOf(buyer);
        uint treasuryPaymentBalanceAfter = paymentToken.balanceOf(treasury);
        uint feeCollectorPaymentBalanceAfter = paymentToken.balanceOf(feeCollector);
        uint buyerNFTBalanceAfter = nft.balanceOf(buyer, 0);
        uint marketplaceNFTBalanceAfterBuy = nft.balanceOf(address(marketplace), 0);
        vm.stopPrank();

        // Checks
        uint expectedTreasuryAmount = totalSellPrice * rcFeePercentage / marketplace.PERCENT_DIVIDER();
        uint expectedFeeCollectorAmount = totalSellPrice * marketplaceFeePercentage / marketplace.PERCENT_DIVIDER();

        assertEq(buyerPaymentBalanceBefore - buyerPaymentBalanceAfter, totalSellPrice, "Incorrect amount deducted from buyer");
        assertEq(treasuryPaymentBalanceAfter - treasuryPaymentBalanceBefore, expectedTreasuryAmount, "Incorrect record company fees deducted");
        assertEq(feeCollectorPaymentBalanceAfter - feeCollectorPaymentBalanceBefore, expectedFeeCollectorAmount, "Incorrect marketplace fees deducted");
        assertEq(sellerPaymentBalanceAfter - sellerPaymentBalanceBefore, totalSellPrice - expectedFeeCollectorAmount - expectedTreasuryAmount, "Incorrect payment to seller");
    
        assertEq(marketplaceBalanceAfterCreateOrder - marketplaceNFTBalanceAfterBuy, sellAmount, "Incorrect NFT balance in marketplace");
        assertEq(buyerNFTBalanceAfter - buyerNFTBalanceBefore, sellAmount, "Incorrect NFT balance in buyer");

        // Check order status
        (, , amount, left, , ,) = marketplace.orders(0);
        assertEq(amount, sellAmount, "Incorrect amount in order after buy");
        assertEq(left, 0, "Incorrect left amount in order after buy");
    }

    function test_SuccessfulBuyOrderWithNativeCoin() public {
        uint sellAmount = 500;
        uint sellPrice = 0.5 * 1e18;
        uint totalSellPrice = sellPrice * sellAmount;

        // Sell
        vm.startPrank(seller);
        uint sellerBalanceBefore = nft.balanceOf(seller, 0);
        nft.setApprovalForAll(address(marketplace), true); 
        marketplace.createOrder(address(nft), 0, sellAmount, sellPrice, address(0));
        uint sellerBalanceAfter = nft.balanceOf(seller, 0);
        uint marketplaceBalanceAfterCreateOrder = nft.balanceOf(address(marketplace), 0);
        vm.stopPrank();

        // Checks
        assertEq(sellerBalanceBefore - sellerBalanceAfter, sellAmount, "Incorrect balances for seller");
        assertEq(marketplaceBalanceAfterCreateOrder, sellAmount, "Incorrect balances for marketplace after create order");
        
        (address payT, uint price, uint amount, uint left, uint tokenId, address effSeller, address collection) = marketplace.orders(0);
        assertEq(payT, address(0), "Incorrect payment token");
        assertEq(price, sellPrice, "Incorrect sell price");
        assertEq(amount, sellAmount, "Incorrect sell amount");
        assertEq(left, sellAmount, "Incorrect left tokens amount");
        assertEq(tokenId, 0, "Incorrect token id");
        assertEq(effSeller, seller, "Incorrect order owner");
        assertEq(collection, address(nft), "Incorrect nft address");
        assertEq(marketplace.orderCounter(), 1, "Incorrect order counter");

        // Buy
        vm.startPrank(buyer);
        uint sellerPaymentBalanceBefore = seller.balance;
        uint buyerPaymentBalanceBefore = buyer.balance;
        uint treasuryPaymentBalanceBefore = treasury.balance;
        uint feeCollectorPaymentBalanceBefore = feeCollector.balance;
        uint buyerNFTBalanceBefore = nft.balanceOf(buyer, 0);

        marketplace.buy{value: totalSellPrice}(0, sellAmount);

        uint sellerPaymentBalanceAfter = seller.balance;
        uint buyerPaymentBalanceAfter = buyer.balance;
        uint treasuryPaymentBalanceAfter = treasury.balance;
        uint feeCollectorPaymentBalanceAfter = feeCollector.balance;
        uint buyerNFTBalanceAfter = nft.balanceOf(buyer, 0);
        uint marketplaceNFTBalanceAfterBuy = nft.balanceOf(address(marketplace), 0);
        vm.stopPrank();

        // Checks
        uint expectedTreasuryAmount = totalSellPrice * rcFeePercentage / marketplace.PERCENT_DIVIDER();
        uint expectedFeeCollectorAmount = totalSellPrice * marketplaceFeePercentage / marketplace.PERCENT_DIVIDER();

        assertEq(buyerPaymentBalanceBefore - buyerPaymentBalanceAfter, totalSellPrice, "Incorrect amount deducted from buyer");
        assertEq(treasuryPaymentBalanceAfter - treasuryPaymentBalanceBefore, expectedTreasuryAmount, "Incorrect record company fees deducted");
        assertEq(feeCollectorPaymentBalanceAfter - feeCollectorPaymentBalanceBefore, expectedFeeCollectorAmount, "Incorrect marketplace fees deducted");
        assertEq(sellerPaymentBalanceAfter - sellerPaymentBalanceBefore, totalSellPrice - expectedFeeCollectorAmount - expectedTreasuryAmount, "Incorrect payment to seller");
    
        assertEq(marketplaceBalanceAfterCreateOrder - marketplaceNFTBalanceAfterBuy, sellAmount, "Incorrect NFT balance in marketplace");
        assertEq(buyerNFTBalanceAfter - buyerNFTBalanceBefore, sellAmount, "Incorrect NFT balance in buyer");

        // Check order status
        (, , amount, left, , ,) = marketplace.orders(0);
        assertEq(amount, sellAmount, "Incorrect amount in order after buy");
        assertEq(left, 0, "Incorrect left amount in order after buy");
    }

        function test_SuccessfulAuctionPaymentToken() public {
        uint sellAmount = 100;
        uint basePrice = 1e18;
        uint minIncrement = 0.1 * 1e18;
        uint bidAmount1 = basePrice;
        uint bidAmount2 = basePrice + minIncrement;

        // Sell
        vm.startPrank(seller);
        uint sellerBalanceBefore = nft.balanceOf(seller, 0);
        nft.setApprovalForAll(address(marketplace), true); 
        marketplace.createAuction(address(nft), 0, sellAmount, basePrice, minIncrement, block.timestamp + 3600, address(paymentToken));
        uint sellerBalanceAfter = nft.balanceOf(seller, 0);
        uint marketplaceBalanceAfterCreateOrder = nft.balanceOf(address(marketplace), 0);
        vm.stopPrank();

        // Checks
        assertEq(sellerBalanceBefore - sellerBalanceAfter, sellAmount, "Incorrect balances for seller");
        assertEq(marketplaceBalanceAfterCreateOrder, sellAmount, "Incorrect balances for marketplace after create order");
        
        (uint auctionId, address payT, uint effBasePrice, uint effMinIncrement, uint deadline, 
            uint highestBid, uint amount, address effSeller, address collection, address highestBidder) = marketplace.auctions(0);
        
        assertEq(auctionId, 0, "Incorrect auction id");
        assertEq(payT, address(paymentToken), "Incorrect payment token");
        assertEq(effBasePrice, basePrice, "Incorrect base price");
        assertEq(effMinIncrement, minIncrement, "Incorrect minimum increment");
        assertEq(deadline, block.timestamp + 3600, "Incorrect deadline");
        assertEq(highestBid, 0, "Incorrect highest bid");
        assertEq(amount, sellAmount, "Incorrect sell amount");
        assertEq(effSeller, seller, "Incorrect seller");
        assertEq(collection, address(nft), "Incorrect collection");
        assertEq(highestBidder, address(0), "Incorrect highest bidder");
        assertEq(marketplace.auctionCounter(), 1, "Incorrect auction counter");

        // Failing bid due to base price
        vm.startPrank(bidder1);
        vm.expectRevert();
        marketplace.bid(0, basePrice - 1);
        vm.stopPrank();

        // First bid
        vm.startPrank(bidder1);
        uint bidder1BalanceBefore = paymentToken.balanceOf(bidder1);
        uint marketplaceBalanceBefore = paymentToken.balanceOf(address(marketplace));
        paymentToken.approve(address(marketplace), bidAmount1);
        marketplace.bid(0, bidAmount1);
        uint bidder1BalanceAfter = paymentToken.balanceOf(bidder1);
        uint marketplaceBalanceAfter = paymentToken.balanceOf(address(marketplace));
        vm.stopPrank();

        assertEq(bidder1BalanceBefore - bidder1BalanceAfter, bidAmount1, "Incorrect amount subtracted from bidder1");
        assertEq(marketplaceBalanceAfter - marketplaceBalanceBefore, bidAmount1, "Incorrect amount transferred to marketplace");

        // Failing bid due to insufficient increment
        vm.startPrank(bidder2);
        vm.expectRevert();
        marketplace.bid(0, basePrice + 1);
        vm.stopPrank();

        // Second bid
        vm.startPrank(bidder2);
        bidder1BalanceBefore = paymentToken.balanceOf(bidder1);
        uint bidder2BalanceBefore = paymentToken.balanceOf(bidder2);
        paymentToken.approve(address(marketplace), bidAmount2);
        marketplace.bid(0, bidAmount2);
        bidder1BalanceAfter = paymentToken.balanceOf(bidder1);
        uint bidder2BalanceAfter = paymentToken.balanceOf(bidder2);
        marketplaceBalanceAfter = paymentToken.balanceOf(address(marketplace));
        vm.stopPrank();

        assertEq(bidder1BalanceAfter - bidder1BalanceBefore, bidAmount1, "Incorrect amount sent to previous bidder");
        assertEq(bidder2BalanceBefore - bidder2BalanceAfter, bidAmount2, "Incorrect amount subtracted from bidder2");
        assertEq(marketplaceBalanceAfter, bidAmount2, "Incorrect amount in marketplace");

        (, , , , , highestBid, , , , highestBidder) = marketplace.auctions(0);
        assertEq(highestBid, bidAmount2, "Incorrect highest bid after second bid");
        assertEq(highestBidder, bidder2, "Incorrect highest bidder after second bid");

        // Try to end auction before deadline
        vm.expectRevert();
        marketplace.endAuction(0);

        vm.warp(deadline); // update timestamp according to deadline

        // Complete auction
        sellerBalanceBefore = paymentToken.balanceOf(seller);
        uint treasuryBalanceBefore = paymentToken.balanceOf(treasury);
        uint feeCollectorBefore = paymentToken.balanceOf(feeCollector);
        marketplaceBalanceBefore = paymentToken.balanceOf(address(marketplace));
        marketplace.endAuction(0);
        sellerBalanceAfter = paymentToken.balanceOf(seller);
        uint treasuryBalanceAfter = paymentToken.balanceOf(treasury);
        uint feeCollectorAfter = paymentToken.balanceOf(feeCollector);
        marketplaceBalanceAfter = paymentToken.balanceOf(address(marketplace));

        uint expectedTreasuryAmount = bidAmount2 * rcFeePercentage / marketplace.PERCENT_DIVIDER();
        uint expectedFeeCollectorAmount = bidAmount2 * marketplaceFeePercentage / marketplace.PERCENT_DIVIDER();

        assertEq(treasuryBalanceAfter - treasuryBalanceBefore, expectedTreasuryAmount, "Incorrect amount in treasury");
        assertEq(feeCollectorAfter - feeCollectorBefore, expectedFeeCollectorAmount, "Incorrect amount in fee collector");
        assertEq(marketplaceBalanceAfter, 0, "Incorrect amount in marketplace");
    }

    function test_SuccessfulAuctionNativeCoin() public {
        uint sellAmount = 100;
        uint basePrice = 1e18;
        uint minIncrement = 0.1 * 1e18;
        uint bidAmount1 = basePrice;
        uint bidAmount2 = basePrice + minIncrement;

        // Sell
        vm.startPrank(seller);
        uint sellerBalanceBefore = nft.balanceOf(seller, 0);
        nft.setApprovalForAll(address(marketplace), true); 
        marketplace.createAuction(address(nft), 0, sellAmount, basePrice, minIncrement, block.timestamp + 3600, address(0));
        uint sellerBalanceAfter = nft.balanceOf(seller, 0);
        uint marketplaceBalanceAfterCreateOrder = nft.balanceOf(address(marketplace), 0);
        vm.stopPrank();

        // Checks
        assertEq(sellerBalanceBefore - sellerBalanceAfter, sellAmount, "Incorrect balances for seller");
        assertEq(marketplaceBalanceAfterCreateOrder, sellAmount, "Incorrect balances for marketplace after create order");
        
        (uint auctionId, address payT, uint effBasePrice, uint effMinIncrement, uint deadline, 
            uint highestBid, uint amount, address effSeller, address collection, address highestBidder) = marketplace.auctions(0);
        
        assertEq(auctionId, 0, "Incorrect auction id");
        assertEq(payT, address(0), "Incorrect payment token");
        assertEq(effBasePrice, basePrice, "Incorrect base price");
        assertEq(effMinIncrement, minIncrement, "Incorrect minimum increment");
        assertEq(deadline, block.timestamp + 3600, "Incorrect deadline");
        assertEq(highestBid, 0, "Incorrect highest bid");
        assertEq(amount, sellAmount, "Incorrect sell amount");
        assertEq(effSeller, seller, "Incorrect seller");
        assertEq(collection, address(nft), "Incorrect collection");
        assertEq(highestBidder, address(0), "Incorrect highest bidder");
        assertEq(marketplace.auctionCounter(), 1, "Incorrect auction counter");

        // Failing bid due to base price
        vm.startPrank(bidder1);
        vm.expectRevert();
        marketplace.bid(0, basePrice - 1);
        vm.stopPrank();

        // First bid
        vm.startPrank(bidder1);
        uint bidder1BalanceBefore = bidder1.balance;
        uint marketplaceBalanceBefore = address(marketplace).balance;
        marketplace.bid{value: bidAmount1}(0, 0);
        uint bidder1BalanceAfter = bidder1.balance;
        uint marketplaceBalanceAfter = address(marketplace).balance;
        vm.stopPrank();

        assertEq(bidder1BalanceBefore - bidder1BalanceAfter, bidAmount1, "Incorrect amount subtracted from bidder1");
        assertEq(marketplaceBalanceAfter - marketplaceBalanceBefore, bidAmount1, "Incorrect amount transferred to marketplace");

        // Failing bid due to insufficient increment
        vm.startPrank(bidder2);
        vm.expectRevert();
        marketplace.bid{value: basePrice + 1}(0, 0);
        vm.stopPrank();

        // Second bid
        vm.startPrank(bidder2);
        bidder1BalanceBefore = bidder1.balance;
        uint bidder2BalanceBefore = bidder2.balance;
        marketplace.bid{value: bidAmount2}(0, 0);
        bidder1BalanceAfter = bidder1.balance;
        uint bidder2BalanceAfter = bidder2.balance;
        marketplaceBalanceAfter = address(marketplace).balance;
        vm.stopPrank();

        assertEq(bidder1BalanceAfter - bidder1BalanceBefore, bidAmount1, "Incorrect amount sent to previous bidder");
        assertEq(bidder2BalanceBefore - bidder2BalanceAfter, bidAmount2, "Incorrect amount subtracted from bidder2");
        assertEq(marketplaceBalanceAfter, bidAmount2, "Incorrect amount in marketplace");

        (, , , , , highestBid, , , , highestBidder) = marketplace.auctions(0);
        assertEq(highestBid, bidAmount2, "Incorrect highest bid after second bid");
        assertEq(highestBidder, bidder2, "Incorrect highest bidder after second bid");

        // Try to end auction before deadline
        vm.expectRevert();
        marketplace.endAuction(0);

        vm.warp(deadline); // update timestamp according to deadline

        // Complete auction
        sellerBalanceBefore = seller.balance;
        uint treasuryBalanceBefore = treasury.balance;
        uint feeCollectorBefore = feeCollector.balance;
        marketplaceBalanceBefore = address(marketplace).balance;
        marketplace.endAuction(0);
        sellerBalanceAfter = seller.balance;
        uint treasuryBalanceAfter = treasury.balance;
        uint feeCollectorAfter = feeCollector.balance;
        marketplaceBalanceAfter = address(marketplace).balance;

        uint expectedTreasuryAmount = bidAmount2 * rcFeePercentage / marketplace.PERCENT_DIVIDER();
        uint expectedFeeCollectorAmount = bidAmount2 * marketplaceFeePercentage / marketplace.PERCENT_DIVIDER();

        assertEq(treasuryBalanceAfter - treasuryBalanceBefore, expectedTreasuryAmount, "Incorrect amount in treasury");
        assertEq(feeCollectorAfter - feeCollectorBefore, expectedFeeCollectorAmount, "Incorrect amount in fee collector");
        assertEq(marketplaceBalanceAfter, 0, "Incorrect amount in marketplace");
    }
}