// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Pool} from "../src/Pool.sol";
import {MockERC20} from "../src/mock/MockERC20.sol";
import "../src/library/ConstantsLib.sol";

contract CoreTest is Test {
    Pool public pool;
    MockERC20 public token;
    address public host;
    address public alice;
    address public bob;
    uint256 public amountToDeposit;
    uint256 public poolId;
    uint256 public poolId2;

    modifier turnOffGasMetering() {
        vm.pauseGasMetering();
        _;
        vm.resumeGasMetering();
    }

    function setUp() public {
        pool = new Pool();
        token = new MockERC20("Test Token", "TST", 18);
        host = vm.addr(1);
        alice = vm.addr(2);
        bob = vm.addr(3);
        pool.grantRole(pool.WHITELISTED_HOST(), host);
    }

    function test_createPool() public {
        vm.startPrank(host);
        uint16 feeRate = 3000; // 30% fees

        poolId = pool.createPool(
            uint40(block.timestamp + 10 days),
            uint40(block.timestamp + 11 days),
            "PoolParty",
            100e18,
            feeRate,
            address(token)
        );
        address res = pool.getHost(poolId);

        assertEq(res, host);
        vm.stopPrank();
    }

    function test_createPool_withInvalidFeeRate() external {
        vm.startPrank(host);
        uint16 feeRate = 10001; // 100.01% fees

        // Should fail
        vm.expectRevert();
        pool.createPool(
            uint40(block.timestamp + 10 days),
            uint40(block.timestamp + 11 days),
            "PoolParty",
            100e18,
            feeRate,
            address(token)
        );
        vm.stopPrank();
    }

    function test_deposit() public {
        helper_createPool();

        token.mint(alice, amountToDeposit);
        vm.startPrank(alice);
        token.approve(address(pool), amountToDeposit);
        pool.deposit(poolId, amountToDeposit);
        uint256 res = pool.getParticipantDeposit(alice, poolId);

        assertEq(res, amountToDeposit);
        vm.stopPrank();
    }

    function test_deposit_withoutEnablingDeposit() external {
        helper_createPool();

        // Reset enableDeposit to false
        vm.store(
            address(pool),
            0x3e5fec24aa4dc4e5aee2e025e51e1392c72a2500577559fae9665c6d52bd6a31,
            0
        );

        // Try reset success
        token.mint(alice, amountToDeposit);
        vm.startPrank(alice);
        token.approve(address(pool), amountToDeposit);
        try pool.deposit(poolId, amountToDeposit) {
            // Should not reach here
            console.log("Should not reach here");
        } catch Error(string memory reason) {
            console.log(reason);
            console.log("Reset successfully");
        }

        // Real test
        vm.expectRevert();
        pool.deposit(poolId, amountToDeposit);
        vm.stopPrank();
    }

    function test_selfRefund() external {
        helper_createPool();
        helper_deposit();

        uint256 amountDeposited = 100e18;

        vm.startPrank(alice);
        pool.selfRefund(poolId);
        uint256 res = token.balanceOf(alice);

        assertEq(res, amountDeposited);
        vm.stopPrank();
    }

    function test_selfRefund_withFeesSetByHostDeducted() public {
        helper_createPool();
        helper_deposit();

        uint256 amountDeposited = 100e18;

        vm.startPrank(alice);
        vm.warp(block.timestamp + 9 days); // 24 hours Before pool start time
        pool.selfRefund(poolId);
        uint256 res = token.balanceOf(alice);

        uint256 expected = amountDeposited -
            (amountDeposited * pool.getPoolFeeRate(poolId)) /
            FEES_PRECISION;
        assertEq(res, expected);
        vm.stopPrank();
    }

    function test_selfRefund_afterEventStartTime() external {
        helper_createPool();
        helper_deposit();

        vm.startPrank(alice);
        vm.warp(block.timestamp + 10 days + 1); // After pool start time
        vm.expectRevert();
        pool.selfRefund(poolId);
    }

    function test_deposit_afterStartPool() external {
        helper_createPool();

        token.mint(alice, amountToDeposit);

        // Start pool
        vm.startPrank(host);
        pool.startPool(poolId);

        // Should fail
        vm.startPrank(alice);
        token.approve(address(pool), amountToDeposit);
        vm.expectRevert();
        pool.deposit(poolId, amountToDeposit);
        vm.stopPrank();
    }

    function test_deposit_lesserAmount() external {
        helper_createPool();

        uint256 lesserAmount = amountToDeposit - 1;
        token.mint(alice, lesserAmount);

        // Should fail
        vm.startPrank(alice);
        token.approve(address(pool), lesserAmount);
        vm.expectRevert();
        pool.deposit(poolId, lesserAmount);
        vm.stopPrank();
    }

    function test_deposit_greaterAmount() external {
        helper_createPool();

        uint256 greaterAmount = amountToDeposit + 10000e18;
        token.mint(alice, greaterAmount);

        vm.startPrank(alice);
        token.approve(address(pool), greaterAmount);
        pool.deposit(poolId, greaterAmount);
        uint256 extra = pool.getSponsorshipAmount(poolId);
        // Extra balance should be 10000e18
        assertEq(extra, 10000e18);
        vm.stopPrank();
    }

    function test_setWinner() external {
        helper_createPool();
        helper_deposit();

        uint256 winnings = 23e18;

        vm.startPrank(host);
        pool.startPool(poolId);
        pool.endPool(poolId);
        pool.setWinner(poolId, alice, winnings);
        uint256 res = pool.getWinningAmount(poolId, alice);

        assertEq(res, winnings);
        vm.stopPrank();
    }

    function test_setWinner_exceedPoolBalance() external {
        helper_createPool();
        helper_deposit();

        uint256 winnings = 1000e18;

        vm.startPrank(host);
        pool.startPool(poolId);
        pool.endPool(poolId);

        // Expect revert because winnings exceed pool balance
        vm.expectRevert();
        pool.setWinner(poolId, alice, winnings);

        vm.stopPrank();
    }

    function test_setWinner_sameWinnerMultipleTimes() external {
        helper_createPool();
        helper_deposit();

        uint256 winnings = 23e18;

        vm.startPrank(host);
        pool.startPool(poolId);
        pool.endPool(poolId);
        pool.setWinner(poolId, alice, winnings);
        pool.setWinner(poolId, alice, winnings);
        uint256 res = pool.getWinningAmount(poolId, alice);

        assertEq(res, winnings * 2);
        vm.stopPrank();
    }

    function test_setWinnersMultiple_poolRemainingBalanceZero() external {
        helper_createPool();
        helper_deposit();

        // Setup
        uint256 winning = 125e18; // 5 deposits divided by 4 winners
        uint256[] memory winnings = new uint256[](4);
        address[] memory winners = new address[](4);
        for (uint256 i = 0; i < 4; i++) {
            winners[i] = vm.addr(i + 4);
            winnings[i] = winning;
            token.mint(winners[i], amountToDeposit);
            vm.startPrank(winners[i]);
            token.approve(address(pool), amountToDeposit);
            pool.deposit(poolId, amountToDeposit);
        }
        vm.startPrank(host);
        pool.startPool(poolId);
        pool.endPool(poolId);
        pool.setWinners(poolId, winners, winnings);
        uint256 res = pool.getPoolBalance(poolId);

        // Remaining balance should be 0
        assertEq(res, 0);
        vm.stopPrank();
    }

    function test_setWinner_participantNotDeposited() external {
        helper_createPool();
        helper_deposit();

        uint256 winning = amountToDeposit;
        vm.startPrank(host);
        pool.startPool(poolId);
        pool.endPool(poolId);

        // Should fail because participant has not deposited
        vm.expectRevert();
        pool.setWinner(poolId, vm.addr(0xBEEF), winning);
        vm.stopPrank();
    }

    function test_setWinner_beforeStartPool() external {
        helper_createPool();
        helper_deposit();

        uint256 winning = amountToDeposit;

        // Should fail because pool is not started
        vm.expectRevert();
        pool.setWinner(poolId, alice, winning);
    }

    function test_claimWinnings() external {
        helper_createPool();
        helper_deposit();

        uint256 winnings = 23e18;

        vm.startPrank(host);
        pool.startPool(poolId);
        pool.endPool(poolId);
        pool.setWinner(poolId, alice, winnings);

        vm.startPrank(alice);
        pool.claimWinning(poolId, alice);
        uint256 res = token.balanceOf(alice);

        assertEq(res, winnings);
        vm.stopPrank();
    }

    function test_collectFees() external {
        vm.pauseGasMetering();
        test_selfRefund_withFeesSetByHostDeducted();
        vm.resumeGasMetering();

        // Get fees accumulated
        uint256 fees = pool.getFeesAccumulated(poolId);
        uint256 balanceBefore = token.balanceOf(host);

        // Check fees collected before calling collectFees
        assertEq(pool.getFeesCollected(poolId), 0);
        pool.collectFees(poolId);
        uint256 balanceAfter = token.balanceOf(host);

        assertEq(balanceAfter - balanceBefore, fees);
        assertEq(
            pool.getFeesAccumulated(poolId) - pool.getFeesCollected(poolId),
            0
        );
    }

    function test_collectRemainingBalance() external {
        helper_createPool();
        helper_deposit();

        vm.startPrank(host);
        pool.startPool(poolId);
        pool.endPool(poolId);

        uint256 remainingBalance = pool.getPoolBalance(poolId);
        uint256 balanceBefore = token.balanceOf(host);
        pool.collectRemainingBalance(poolId);
        uint256 balanceAfter = token.balanceOf(host);

        assertEq(balanceAfter - balanceBefore, remainingBalance);
        assertEq(pool.getPoolBalance(poolId), 0);
        vm.stopPrank();
    }

    function test_collectRemainingBalance_tryExploitOtherPoolByHost() external {
        helper_createPool();
        helper_deposit();
        vm.pauseGasMetering();
        helper_createSecondPool();
        helper_depositSecond();

        // Do self refund in first pool to accumulate fees
        vm.startPrank(alice);
        vm.warp(block.timestamp + 9 days); // 24 hours Before pool start time
        pool.selfRefund(poolId);

        vm.resumeGasMetering();

        vm.startPrank(host);
        pool.startPool(poolId);
        pool.endPool(poolId);

        // PoolId balance should be 0 after alice selfRefund
        assertEq(pool.getPoolBalance(poolId), 0);
        // Try collectFees after 0 balance since there's fees accumulated
        uint256 fees = pool.getFeesAccumulated(poolId) -
            pool.getFeesCollected(poolId);
        assert(fees > 0);
        pool.collectFees(poolId);

        // Try exploit other pool by collecting remaining balance, pool 1 should already be 0
        vm.expectRevert();
        pool.collectFees(poolId);
        vm.stopPrank();

        // Overall pool balance should remains 100e18 for pool 2
        assertEq(token.balanceOf(address(pool)), amountToDeposit);
    }

    function test_getAllPoolInfo() external {
        helper_createPool();
        helper_deposit();

        // Use -vvvv to check returns
        pool.getAllPoolInfo(poolId);
    }

    function test_refundParticipant() external {
        helper_createPool();
        helper_deposit();

        vm.startPrank(host);
        pool.startPool(poolId);

        uint256 amountRefund = 25e18;
        uint256 balanceBefore = token.balanceOf(alice);
        pool.refundParticipant(poolId, alice, amountRefund);
        uint256 balanceAfter = token.balanceOf(alice);

        assertEq(balanceAfter - balanceBefore, amountRefund);
    }

    function test_refundParticipant_PoolEnded() external {
        helper_createPool();
        helper_deposit();

        vm.startPrank(host);
        pool.startPool(poolId);
        pool.endPool(poolId);

        uint256 amountRefund = 25e18;
        vm.expectRevert();
        pool.refundParticipant(poolId, alice, amountRefund);
    }

    function test_forfeitWinnings() external {
        helper_createPool();
        helper_deposit();

        uint256 winnings = 23e18;

        vm.startPrank(host);
        pool.startPool(poolId);
        pool.endPool(poolId);
        vm.warp(block.timestamp + 1 days);
        pool.setWinner(poolId, alice, winnings);
        vm.warp(block.timestamp + 3 days + 23 hours + 60 minutes + 1 seconds);

        pool.forfeitWinnings(poolId, alice);
        uint256 res = token.balanceOf(alice);

        assertEq(res, 0);
        assert(pool.getWinningAmount(poolId, alice) == 0);
    }

    function test_forfeitWinnings_shouldFailInTimelock() external {
        helper_createPool();
        helper_deposit();

        uint256 winnings = 23e18;

        vm.startPrank(host);
        pool.startPool(poolId);
        pool.endPool(poolId);
        vm.warp(block.timestamp + 1 days);
        pool.setWinner(poolId, alice, winnings);

        vm.expectRevert("Still in timelock");
        pool.forfeitWinnings(poolId, alice);
    }

    function test_getClaimablePools() external {
        helper_createPool();
        helper_deposit();

        uint256 winnings = 23e18;

        vm.startPrank(host);
        pool.startPool(poolId);
        pool.endPool(poolId);
        vm.warp(block.timestamp + 1 days);
        pool.setWinner(poolId, alice, winnings);

        (uint256[] memory claimablePools, bool[] memory isClaimed) = pool
            .getClaimablePools(alice);

        assertEq(claimablePools[0], pool.latestPoolId());
        assertEq(isClaimed[0], false);
    }

    function test_getWinnersDetails() external {
        helper_createPool();
        helper_deposit();

        uint256 winnings = 23e18;

        vm.startPrank(host);
        pool.startPool(poolId);
        pool.endPool(poolId);
        vm.warp(block.timestamp + 1 days);
        pool.setWinner(poolId, alice, winnings);

        (address[] memory winner, ) = pool.getWinnersDetails(1);
        assertEq(winner[0], alice);
    }

    function test_changePoolName() external {
        helper_createPool();

        vm.startPrank(host);
        pool.changePoolName(poolId, "NewName");
        string memory res = pool.getPoolDetail(poolId).poolName;

        assertEq(res, "NewName");
    }

    function test_sponsor() external {
        helper_createPool();

        uint256 amount = 23e18;

        vm.startPrank(address(this));
        pool.grantRole(pool.WHITELISTED_SPONSOR(), alice);
        vm.startPrank(alice);
        token.mint(alice, amount);
        token.approve(address(pool), amount);
        pool.sponsor("projectA", poolId, amount);
        uint256 res = pool.getSponsorshipAmount(poolId);

        assertEq(res, amount);
    }

    function test_sponsor_withoutRole() external {
        helper_createPool();

        uint256 amount = 23e18;

        vm.startPrank(alice);
        token.mint(alice, amount);
        token.approve(address(pool), amount);

        vm.expectRevert();
        pool.sponsor("projectA", poolId, amount);
    }

    function test_sponsor_withoutCreatingPool() external {
        poolId = 1;
        uint256 amount = 23e18;

        vm.startPrank(address(this));
        pool.grantRole(pool.WHITELISTED_SPONSOR(), alice);
        vm.startPrank(alice);
        token.mint(alice, amount);
        token.approve(address(pool), amount);

        vm.expectRevert();
        pool.sponsor("projectA", poolId, amount);
    }

    // ----------------------------------------------------------------------------
    // Helper Functions
    // ----------------------------------------------------------------------------

    function helper_createPool() private turnOffGasMetering {
        // Warp to random time
        vm.warp(1713935623);

        // Create a pool
        vm.startPrank(host);
        amountToDeposit = 100e18;
        uint16 feeRate = 3000; // 30% fees
        poolId = pool.createPool(
            uint40(block.timestamp + 10 days),
            uint40(block.timestamp + 11 days),
            "PoolParty",
            amountToDeposit,
            feeRate,
            address(token)
        );
        pool.enableDeposit(poolId);
    }

    function helper_createSecondPool() private turnOffGasMetering {
        // Create a second pool
        // Grant role for alice to create pool
        vm.startPrank(address(this));
        pool.grantRole(pool.WHITELISTED_HOST(), alice);

        // Alice create pool
        vm.startPrank(alice);
        poolId2 = pool.createPool(
            uint40(block.timestamp),
            uint40(block.timestamp + 10 days),
            "New",
            amountToDeposit,
            0,
            address(token)
        );
        pool.enableDeposit(poolId2);
    }

    function helper_deposit() private turnOffGasMetering {
        // Deposit to the pool
        token.mint(alice, amountToDeposit);
        vm.startPrank(alice);
        token.approve(address(pool), amountToDeposit);
        pool.deposit(poolId, amountToDeposit);
    }

    function helper_depositSecond() private turnOffGasMetering {
        // Deposit to the pool
        token.mint(bob, amountToDeposit);
        vm.startPrank(bob);
        token.approve(address(pool), amountToDeposit);
        pool.deposit(poolId2, amountToDeposit);
    }
}
