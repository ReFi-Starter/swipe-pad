// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";
import {DonationPool} from "../src/DonationPool.sol";
import {MockERC20} from "../src/mock/MockERC20.sol";
import {IDonationPool} from "../src/interface/IDonationPool.sol";
import {DonationErrorsLib} from "../src/library/DonationErrorsLib.sol";

contract DonationPoolTest is Test {
    DonationPool public donationPool;
    MockERC20 public token;

    address public admin = address(1);
    address public creator = address(2);
    address public donor1 = address(3);
    address public donor2 = address(4);

    uint256 public constant INITIAL_BALANCE = 1000 * 10 ** 18;
    uint256 public constant FUNDING_GOAL = 100 * 10 ** 18;
    uint40 public startTime;
    uint40 public endTime;

    function setUp() public {
        vm.startPrank(admin);
        donationPool = new DonationPool();
        token = new MockERC20("Test Token", "TST", 18);
        vm.stopPrank();

        // Mint tokens to users
        token.mint(creator, INITIAL_BALANCE);
        token.mint(donor1, INITIAL_BALANCE);
        token.mint(donor2, INITIAL_BALANCE);

        // Approve tokens for donation pool
        vm.startPrank(creator);
        token.approve(address(donationPool), INITIAL_BALANCE);
        vm.stopPrank();

        vm.startPrank(donor1);
        token.approve(address(donationPool), INITIAL_BALANCE);
        vm.stopPrank();

        vm.startPrank(donor2);
        token.approve(address(donationPool), INITIAL_BALANCE);
        vm.stopPrank();

        startTime = uint40(block.timestamp + 1 days);
        endTime = uint40(block.timestamp + 31 days);
    }

    function testCreateCampaign() public {
        vm.startPrank(creator);
        vm.warp(startTime - 1 days);

        uint256 campaignId = donationPool.createCampaign(
            startTime,
            endTime,
            "Test Campaign",
            "Test Description",
            "https://example.com",
            "https://example.com/image.jpg",
            FUNDING_GOAL,
            IDonationPool.FUNDINGMODEL.ALL_OR_NOTHING,
            address(token)
        );

        vm.stopPrank();

        assertTrue(campaignId == 1, "Campaign ID should be 1");

        // Convert enum to uint for comparison
        uint256 statusActive = uint256(IDonationPool.POOLSTATUS.ACTIVE);
        assertTrue(
            uint256(donationPool.poolStatus(campaignId)) == statusActive,
            "Campaign should be active"
        );

        IDonationPool.PoolDetail memory details = donationPool
            .getCampaignDetails(campaignId);
        assertTrue(details.startTime == startTime, "Start time mismatch");
        assertTrue(details.endTime == endTime, "End time mismatch");
        assertTrue(
            keccak256(abi.encodePacked(details.campaignName)) ==
                keccak256(abi.encodePacked("Test Campaign")),
            "Campaign name mismatch"
        );
        assertTrue(
            details.fundingGoal == FUNDING_GOAL,
            "Funding goal mismatch"
        );
        assertTrue(
            uint256(details.fundingModel) ==
                uint256(IDonationPool.FUNDINGMODEL.ALL_OR_NOTHING),
            "Funding model mismatch"
        );
    }

    function testDonate() public {
        // Create a campaign
        vm.startPrank(creator);
        vm.warp(startTime - 1 days);

        uint256 campaignId = donationPool.createCampaign(
            startTime,
            endTime,
            "Test Campaign",
            "Test Description",
            "https://example.com",
            "https://example.com/image.jpg",
            FUNDING_GOAL,
            IDonationPool.FUNDINGMODEL.ALL_OR_NOTHING,
            address(token)
        );

        vm.stopPrank();

        // Fast-forward to campaign start time
        vm.warp(startTime + 1);

        // Make a donation
        uint256 donationAmount = 20 * 10 ** 18;
        vm.startPrank(donor1);
        bool success = donationPool.donate(campaignId, donationAmount);
        vm.stopPrank();

        assertTrue(success == true, "Donation should succeed");

        // Check donation was recorded
        IDonationPool.DonorDetail memory donorDetail = donationPool
            .getDonationDetails(campaignId, donor1);
        assertTrue(
            donorDetail.totalDonated == donationAmount,
            "Donation amount mismatch"
        );

        // Check progress
        uint256 progress = donationPool.getFundingProgress(campaignId);
        assertTrue(progress == 20, "Progress should be 20%");

        // Verify token transfer
        assertTrue(
            token.balanceOf(address(donationPool)) == donationAmount,
            "Token transfer failed"
        );
    }

    function testCampaignSuccess() public {
        // Create a campaign
        vm.startPrank(creator);
        vm.warp(startTime - 1 days);

        uint256 campaignId = donationPool.createCampaign(
            startTime,
            endTime,
            "Test Campaign",
            "Test Description",
            "https://example.com",
            "https://example.com/image.jpg",
            FUNDING_GOAL,
            IDonationPool.FUNDINGMODEL.ALL_OR_NOTHING,
            address(token)
        );

        vm.stopPrank();

        // Fast-forward to campaign start time
        vm.warp(startTime + 1);

        // Make donations to reach funding goal
        vm.startPrank(donor1);
        donationPool.donate(campaignId, 60 * 10 ** 18);
        vm.stopPrank();

        vm.startPrank(donor2);
        donationPool.donate(campaignId, 40 * 10 ** 18);
        vm.stopPrank();

        // Check campaign status
        uint256 statusSuccessful = uint256(IDonationPool.POOLSTATUS.SUCCESSFUL);
        assertTrue(
            uint256(donationPool.poolStatus(campaignId)) == statusSuccessful,
            "Campaign should be successful"
        );

        // Fast-forward to end time
        vm.warp(endTime + 1);

        // Creator withdraws funds
        uint256 creatorBalanceBefore = token.balanceOf(creator);
        vm.startPrank(creator);
        donationPool.withdrawFunds(campaignId);
        vm.stopPrank();

        // Calculate expected amount (minus platform fee)
        uint256 platformFee = (FUNDING_GOAL * 100) / 10000; // 1% default fee
        uint256 expectedAmount = FUNDING_GOAL - platformFee;

        // Check creator balance increased
        assertTrue(
            token.balanceOf(creator) - creatorBalanceBefore == expectedAmount,
            "Withdrawal amount mismatch"
        );
    }

    function testCampaignFailureAndRefund() public {
        // Create a campaign
        vm.startPrank(creator);
        vm.warp(startTime - 1 days);

        uint256 campaignId = donationPool.createCampaign(
            startTime,
            endTime,
            "Test Campaign",
            "Test Description",
            "https://example.com",
            "https://example.com/image.jpg",
            FUNDING_GOAL,
            IDonationPool.FUNDINGMODEL.ALL_OR_NOTHING,
            address(token)
        );

        vm.stopPrank();

        // Fast-forward to campaign start time
        vm.warp(startTime + 1);

        // Make a partial donation
        uint256 donationAmount = 20 * 10 ** 18;
        vm.startPrank(donor1);
        donationPool.donate(campaignId, donationAmount);
        vm.stopPrank();

        // Fast-forward past end time
        vm.warp(endTime + 1);

        // Get donor1 balance before refund
        uint256 donor1BalanceBefore = token.balanceOf(donor1);

        // Claim refund
        vm.startPrank(donor1);
        donationPool.claimRefund(campaignId);
        vm.stopPrank();

        // Calculate expected refund (minus platform fee)
        uint256 platformFee = (donationAmount * 100) / 10000; // 1% default fee
        uint256 expectedRefund = donationAmount - platformFee;

        // Check donor1 balance increased by expected refund
        assertTrue(
            token.balanceOf(donor1) - donor1BalanceBefore == expectedRefund,
            "Refund amount mismatch"
        );

        // Check campaign status
        uint256 statusFailed = uint256(IDonationPool.POOLSTATUS.FAILED);
        assertTrue(
            uint256(donationPool.poolStatus(campaignId)) == statusFailed,
            "Campaign should be marked as failed"
        );
    }

    function testKeepWhatYouRaise() public {
        // Create a campaign with KEEP_WHAT_YOU_RAISE model
        vm.startPrank(creator);
        vm.warp(startTime - 1 days);

        uint256 campaignId = donationPool.createCampaign(
            startTime,
            endTime,
            "Test Campaign",
            "Test Description",
            "https://example.com",
            "https://example.com/image.jpg",
            FUNDING_GOAL,
            IDonationPool.FUNDINGMODEL.KEEP_WHAT_YOU_RAISE,
            address(token)
        );

        vm.stopPrank();

        // Fast-forward to campaign start time
        vm.warp(startTime + 1);

        // Make a partial donation
        uint256 donationAmount = 20 * 10 ** 18;
        vm.startPrank(donor1);
        donationPool.donate(campaignId, donationAmount);
        vm.stopPrank();

        // Fast-forward past end time
        vm.warp(endTime + 1);

        // Creator should be able to withdraw funds even though goal wasn't met
        uint256 creatorBalanceBefore = token.balanceOf(creator);
        vm.startPrank(creator);
        donationPool.withdrawFunds(campaignId);
        vm.stopPrank();

        // Calculate expected amount (minus platform fee)
        uint256 platformFee = (donationAmount * 100) / 10000; // 1% default fee
        uint256 expectedAmount = donationAmount - platformFee;

        // Check creator balance increased
        assertTrue(
            token.balanceOf(creator) - creatorBalanceBefore == expectedAmount,
            "Withdrawal amount mismatch"
        );
    }

    function testAdminCanPauseContract() public {
        vm.startPrank(admin);
        donationPool.pause();
        vm.stopPrank();

        // Attempt to create a campaign while paused
        vm.startPrank(creator);
        vm.expectRevert(
            abi.encodeWithSelector(bytes4(keccak256("EnforcedPause()")))
        );
        donationPool.createCampaign(
            startTime,
            endTime,
            "Test Campaign",
            "Test Description",
            "https://example.com",
            "https://example.com/image.jpg",
            FUNDING_GOAL,
            IDonationPool.FUNDINGMODEL.ALL_OR_NOTHING,
            address(token)
        );
        vm.stopPrank();

        // Unpause
        vm.startPrank(admin);
        donationPool.unpause();
        vm.stopPrank();

        // Now it should work
        vm.startPrank(creator);
        uint256 campaignId = donationPool.createCampaign(
            startTime,
            endTime,
            "Test Campaign",
            "Test Description",
            "https://example.com",
            "https://example.com/image.jpg",
            FUNDING_GOAL,
            IDonationPool.FUNDINGMODEL.ALL_OR_NOTHING,
            address(token)
        );
        vm.stopPrank();

        assertTrue(campaignId == 1, "Campaign ID should be 1");
    }

    function testDisputeResolution() public {
        // Create a campaign
        vm.startPrank(creator);
        vm.warp(startTime - 1 days);

        uint256 campaignId = donationPool.createCampaign(
            startTime,
            endTime,
            "Test Campaign",
            "Test Description",
            "https://example.com",
            "https://example.com/image.jpg",
            FUNDING_GOAL,
            IDonationPool.FUNDINGMODEL.ALL_OR_NOTHING,
            address(token)
        );

        vm.stopPrank();

        // Fast-forward to campaign start time
        vm.warp(startTime + 1);

        // Make donations to reach funding goal
        vm.startPrank(donor1);
        donationPool.donate(campaignId, 100 * 10 ** 18);
        vm.stopPrank();

        // Admin flags campaign as disputed
        vm.startPrank(admin);
        donationPool.flagCampaignAsDisputed(campaignId);
        vm.stopPrank();

        // Creator shouldn't be able to withdraw while disputed
        vm.startPrank(creator);
        vm.expectRevert(
            abi.encodeWithSelector(
                DonationErrorsLib.CampaignDisputed.selector,
                campaignId
            )
        );
        donationPool.withdrawFunds(campaignId);
        vm.stopPrank();

        // Admin resolves dispute in favor of refunds
        vm.startPrank(admin);
        donationPool.resolveDispute(campaignId, false);
        vm.stopPrank();

        // Check that campaign is now marked as failed
        uint256 statusFailed = uint256(IDonationPool.POOLSTATUS.FAILED);
        assertTrue(
            uint256(donationPool.poolStatus(campaignId)) == statusFailed,
            "Campaign should be marked as failed"
        );

        // Donor should be able to claim refund
        uint256 donor1BalanceBefore = token.balanceOf(donor1);
        vm.startPrank(donor1);
        donationPool.claimRefund(campaignId);
        vm.stopPrank();

        // Calculate expected refund (minus platform fee)
        uint256 platformFee = (100 * 10 ** 18 * 100) / 10000; // 1% default fee
        uint256 expectedRefund = 100 * 10 ** 18 - platformFee;

        // Check donor1 balance increased by expected refund
        assertTrue(
            token.balanceOf(donor1) - donor1BalanceBefore == expectedRefund,
            "Refund amount mismatch"
        );
    }
}
