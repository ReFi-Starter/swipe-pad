// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IPool} from "../interface/IPool.sol";

library EventsLib {
    event PoolCreated(
        uint256 poolId,
        address indexed host,
        string poolName,
        uint256 depositAmountPerPerson,
        uint256 penaltyFeeRate,
        address indexed token
    );
    event PoolBalanceUpdated(uint256 poolId, uint256 balanceBefore, uint256 balanceAfter);
    event PoolStatusChanged(uint256 poolId, IPool.POOLSTATUS status);
    event Refund(uint256 poolId, address indexed participant, uint256 amount);
    event Deposit(uint256 poolId, address indexed participant, uint256 amount);
    event ExtraDeposit(uint256 poolId, address indexed participant, uint256 amount);
    event FeesCollected(uint256 poolId, address indexed host, uint256 fees);
    event FeesCharged(uint256 poolId, address indexed participant, uint256 fees);
    event ParticipantRemoved(uint256 poolId, address indexed participant);
    event JoinedPoolsRemoved(uint256 poolId, address indexed participant);
    event WinnerSet(uint256 poolId, address indexed winner, uint256 amount);
    event WinningsClaimed(uint256 poolId, address indexed winner, uint256 amount);
    event RemainingBalanceCollected(uint256 poolId, address indexed host, uint256 amount);
    event PoolStartTimeChanged(uint256 poolId, uint256 startTime);
    event PoolEndTimeChanged(uint256 poolId, uint256 endTime);
    event WinningForfeited(uint256 poolId, address indexed winner, uint256 amount);
    event PoolNameChanged(uint256 poolId, string poolName);
    event ParticipantRejoined(uint256 poolId, address indexed participant);
    event SponsorshipAdded(uint256 poolId, address indexed sponsor, uint256 amount);
}
