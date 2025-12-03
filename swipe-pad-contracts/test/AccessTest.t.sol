// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Pool} from "../src/Pool.sol";
import {MockERC20} from "../src/mock/MockERC20.sol";
import "../src/library/ConstantsLib.sol";

contract AccessTest is Test {
    Pool public pool;
    MockERC20 public token;
    address public host;
    address public alice;

    function setUp() public {
        pool = new Pool();
        token = new MockERC20("Test Token", "TST", 18);
        host = vm.addr(1);
        alice = vm.addr(2);
        pool.grantRole(pool.WHITELISTED_HOST(), host);
        vm.warp(1713935623);

        // Create a pool
        vm.startPrank(host);
        uint16 feeRate = 3000; // 30% fees
        pool.createPool(
            uint40(block.timestamp + 10 days),
            uint40(block.timestamp + 11 days),
            "PoolParty",
            100e18,
            feeRate,
            address(token)
        );
        pool.enableDeposit(1);

        // Deposit to the pool
        uint256 amount = 100e18;
        token.mint(alice, amount);
        vm.startPrank(alice);
        token.approve(address(pool), amount);
        pool.deposit(1, amount);
    }

    function test_pause() external {
        vm.startPrank(address(this));
        pool.pause();
        bool paused = pool.paused();
        assertEq(paused, true);
        vm.stopPrank();
    }

    function test_pause_tryCreatePool() external {
        vm.startPrank(address(this));
        pool.pause();
        pool.grantRole(pool.WHITELISTED_HOST(), address(this));

        vm.expectRevert();
        pool.createPool(
            uint40(block.timestamp + 10 days),
            uint40(block.timestamp + 11 days),
            "PoolParty",
            100e18,
            3000,
            address(token)
        );
        vm.stopPrank();
    }

    function test_pause_tryDeposit() external {
        vm.startPrank(address(this));
        pool.pause();
        pool.grantRole(pool.WHITELISTED_HOST(), address(this));

        uint256 amount = 100e18;
        address bob = vm.addr(0xB0B);
        token.mint(bob, amount);
        vm.startPrank(bob);
        token.approve(address(pool), amount);

        vm.expectRevert();
        pool.deposit(1, amount);
        vm.stopPrank();
    }

    function test_pause_nonAdmin() external {
        vm.startPrank(host);
        vm.expectRevert();
        pool.pause();
        vm.stopPrank();
    }

    function test_unpause() external {
        // Setup
        vm.startPrank(address(this));
        pool.pause();

        // Unpause contract
        pool.unpause();
        bool paused = pool.paused();
        assertEq(paused, false);
        vm.stopPrank();
    }

    function test_unpause_nonAdmin() external {
        // Setup
        vm.startPrank(address(this));
        pool.pause();

        // Should fail
        vm.startPrank(host);
        vm.expectRevert();
        pool.unpause();
        vm.stopPrank();
    }
}
