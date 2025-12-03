// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Pool} from "../src/Pool.sol";
import {MockERC20} from "../src/mock/MockERC20.sol";

contract PoolScript is Script {
    Pool public pool;
    MockERC20 public token;

    function setUp() public {}

    function run() public {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        pool = new Pool();
        vm.stopBroadcast();
    }

    function run_withMock() public {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        pool = new Pool();
        token = new MockERC20("Test Token", "TST", 18);
        vm.stopBroadcast();
    }

    function run_withSetup() public {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        address signer = vm.addr(vm.envUint("PRIVATE_KEY"));
        pool = new Pool();
        token = MockERC20(0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b);

        uint256 amount = 20e18;
        if (token.balanceOf(signer) == 0) {
            token.mint(signer, 1000e18);
        }
        pool.grantRole(pool.WHITELISTED_HOST(), signer);
        uint256 poolId = pool.createPool(
            uint40(block.timestamp + 2 days),
            uint40(block.timestamp + 2 days + 6 hours),
            "Test pool",
            amount,
            3000,
            address(0xfD2Ec58cE4c87b253567Ff98ce2778de6AF0101b)
        );
        pool.enableDeposit(poolId);
        token.approve(address(pool), amount);
        pool.deposit(poolId, amount);
        vm.stopBroadcast();
    }
}
