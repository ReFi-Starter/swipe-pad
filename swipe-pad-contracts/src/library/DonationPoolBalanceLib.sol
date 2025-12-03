// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {IDonationPool} from "../interface/IDonationPool.sol";

library DonationPoolBalanceLib {
    function getTotalDonations(
        IDonationPool.PoolBalance storage balance
    ) internal view returns (uint256) {
        return balance.totalDonations;
    }

    function getBalance(
        IDonationPool.PoolBalance storage balance
    ) internal view returns (uint256) {
        return balance.balance;
    }

    function getFeesAccumulated(
        IDonationPool.PoolBalance storage balance
    ) internal view returns (uint256) {
        return balance.feesAccumulated;
    }

    function getFeesCollected(
        IDonationPool.PoolBalance storage balance
    ) internal view returns (uint256) {
        return balance.feesCollected;
    }

    function getFeesToCollect(
        IDonationPool.PoolBalance storage balance
    ) internal view returns (uint256) {
        return balance.feesAccumulated - balance.feesCollected;
    }

    function addDonation(
        IDonationPool.PoolBalance storage balance,
        uint256 amount,
        uint256 feeAmount
    ) internal {
        balance.totalDonations += amount;
        balance.balance += (amount - feeAmount);
        balance.feesAccumulated += feeAmount;
    }

    function deductFromBalance(
        IDonationPool.PoolBalance storage balance,
        uint256 amount
    ) internal {
        balance.balance -= amount;
    }

    function collectFees(
        IDonationPool.PoolBalance storage balance,
        uint256 amount
    ) internal {
        balance.feesCollected += amount;
    }
}
