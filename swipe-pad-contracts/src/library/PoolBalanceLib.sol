// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IPool} from "../interface/IPool.sol";

library PoolBalanceLib {
    function getDepositAmount(IPool.PoolBalance storage self) internal view returns (uint256) {
        return self.totalDeposits;
    }

    function getBalance(IPool.PoolBalance storage self) internal view returns (uint256) {
        return self.balance;
    }

    function getFeesAccumulated(IPool.PoolBalance storage self) internal view returns (uint256) {
        return self.feesAccumulated;
    }

    function getFeesCollected(IPool.PoolBalance storage self) internal view returns (uint256) {
        return self.feesCollected;
    }

    function getSponsorshipAmount(IPool.PoolBalance storage self) internal view returns (uint256) {
        return self.sponsored;
    }
}
