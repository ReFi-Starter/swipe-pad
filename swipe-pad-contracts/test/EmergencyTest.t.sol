// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Pool} from "../src/Pool.sol";
import {MockERC20} from "../src/mock/MockERC20.sol";
import "../src/library/ConstantsLib.sol";
import {IERC20} from "../src/interface/IERC20.sol";

contract ParticipantTest is Test {
    Pool public pool;
    MockERC20 public token;
    MockERC20 public token2;
    address public host;
    address public alice;
    address public bob;
    uint256 public amountToDeposit;
    uint256 public amountToDeposit2;
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
        token2 = new MockERC20("Test Token 2", "TST2", 18);
        host = vm.addr(1);
        alice = vm.addr(2);
        bob = vm.addr(3);
        pool.grantRole(pool.WHITELISTED_HOST(), host);
    }

    function test_emergencyWithdraw() public {
        helper_createPool();
        helper_deposit();

        vm.startPrank(address(this)); // Start prank deployer
        uint256 startingBalance = token.balanceOf(address(this));
        pool.pause();
        pool.emergencyWithdraw(
            IERC20(address(token)),
            pool.getPoolBalance(poolId)
        );
        uint256 endingBalance = token.balanceOf(address(this));

        // Make sure balance change is correct
        assertEq(endingBalance - startingBalance, amountToDeposit);

        vm.stopPrank();
    }

    function test_emergencyWithdraw_poolStarted() public {
        helper_createPool();
        helper_deposit();

        vm.startPrank(host);
        pool.startPool(poolId);

        vm.startPrank(address(this)); // Start prank deployer
        uint256 startingBalance = token.balanceOf(address(this));
        pool.pause();
        pool.emergencyWithdraw(
            IERC20(address(token)),
            pool.getPoolBalance(poolId)
        );
        uint256 endingBalance = token.balanceOf(address(this));

        // Make sure balance change is correct
        assertEq(endingBalance - startingBalance, amountToDeposit);

        vm.stopPrank();
    }

    function test_emergencyWithdraw_poolEnded() public {
        helper_createPool();
        helper_deposit();

        vm.startPrank(host);
        pool.startPool(poolId);
        pool.endPool(poolId);

        vm.startPrank(address(this)); // Start prank deployer
        uint256 startingBalance = token.balanceOf(address(this));
        pool.pause();
        pool.emergencyWithdraw(
            IERC20(address(token)),
            pool.getPoolBalance(poolId)
        );
        uint256 endingBalance = token.balanceOf(address(this));

        // Make sure balance change is correct
        assertEq(endingBalance - startingBalance, amountToDeposit);

        vm.stopPrank();
    }

    function test_emergencyWithdraw_multiPool() public {
        helper_createPool();
        helper_deposit();
        helper_createSecondPool();
        helper_depositSecond();

        vm.startPrank(address(this)); // Start prank deployer
        uint256 startingBalance = token.balanceOf(address(this));
        pool.pause();
        uint256 toWithdraw = pool.getPoolBalance(poolId) +
            pool.getPoolBalance(poolId2);
        pool.emergencyWithdraw(IERC20(address(token)), toWithdraw);
        uint256 endingBalance = token.balanceOf(address(this));

        // Make sure balance change is correct
        assertEq(endingBalance - startingBalance, amountToDeposit * 2);

        vm.stopPrank();
    }

    function test_emergencyWithdraw_multiToken() public {
        helper_createPool();
        helper_deposit();
        helper_createPool2();
        helper_deposit2();

        vm.startPrank(address(this)); // Start prank deployer
        uint256 startingBalance = token.balanceOf(address(this));
        uint256 startingBalance2 = token2.balanceOf(address(this));
        pool.pause();
        pool.emergencyWithdraw(
            IERC20(address(token)),
            pool.getPoolBalance(poolId)
        );
        pool.emergencyWithdraw(
            IERC20(address(token2)),
            pool.getPoolBalance(poolId)
        );
        uint256 endingBalance = token.balanceOf(address(this));
        uint256 endingBalance2 = token2.balanceOf(address(this));

        // Make sure balance change is correct
        assertEq(endingBalance - startingBalance, amountToDeposit);
        assertEq(endingBalance2 - startingBalance2, amountToDeposit);

        vm.stopPrank();
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

    function helper_createPool2() private turnOffGasMetering {
        // Warp to random time
        vm.warp(1713935623);

        // Create a pool
        vm.startPrank(host);
        amountToDeposit2 = 123e18;
        uint16 feeRate = 0; // 30% fees
        poolId = pool.createPool(
            uint40(block.timestamp + 10 days),
            uint40(block.timestamp + 11 days),
            "Second Pool",
            amountToDeposit,
            feeRate,
            address(token2)
        );
        pool.enableDeposit(poolId);
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

    function helper_deposit2() private turnOffGasMetering {
        // Deposit to the pool
        token2.mint(alice, amountToDeposit);
        vm.startPrank(alice);
        token2.approve(address(pool), amountToDeposit);
        pool.deposit(poolId, amountToDeposit);
    }
}
