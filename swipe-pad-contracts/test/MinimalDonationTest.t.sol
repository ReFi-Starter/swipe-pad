// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test} from "forge-std/Test.sol";
import {DonationPool} from "../src/DonationPool.sol";
import {MockERC20} from "../src/mock/MockERC20.sol";
import {IDonationPool} from "../src/interface/IDonationPool.sol";

contract MinimalDonationTest is Test {
    DonationPool public donationPool;
    MockERC20 public token;

    address public admin = address(1);
    address public creator = address(2);
    address public donor = address(3);

    function setUp() public {
        vm.startPrank(admin);
        donationPool = new DonationPool();
        token = new MockERC20("Test Token", "TST", 18);
        vm.stopPrank();

        // Mint tokens to creator and donor
        token.mint(creator, 1000 ether);
        token.mint(donor, 1000 ether);

        // Approve tokens for donation pool
        vm.startPrank(creator);
        token.approve(address(donationPool), 1000 ether);
        vm.stopPrank();

        vm.startPrank(donor);
        token.approve(address(donationPool), 1000 ether);
        vm.stopPrank();
    }

    function testCreateCampaign() public {
        vm.startPrank(creator);
        uint256 campaignId = donationPool.createCampaign(
            uint40(block.timestamp + 1 days),
            uint40(block.timestamp + 30 days),
            "Test Campaign",
            "Test Description",
            "https://example.com",
            "https://example.com/image.jpg",
            100 ether,
            IDonationPool.FUNDINGMODEL.ALL_OR_NOTHING,
            address(token)
        );
        vm.stopPrank();

        assertTrue(campaignId == 1, "Campaign ID should be 1");
        assertEq(
            uint256(donationPool.poolStatus(campaignId)),
            uint256(IDonationPool.POOLSTATUS.ACTIVE),
            "Campaign should be active"
        );
    }
}
