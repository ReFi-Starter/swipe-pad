// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IPool} from "../interface/IPool.sol";

library PoolDetailLib {
    function setTimeStart(IPool.PoolDetail storage self, uint40 _timeStart) internal {
        self.timeStart = _timeStart;
    }

    function getTimeStart(IPool.PoolDetail storage self) internal view returns (uint40) {
        return self.timeStart;
    }

    function setTimeEnd(IPool.PoolDetail storage self, uint40 _timeEnd) internal {
        self.timeEnd = _timeEnd;
    }

    function getTimeEnd(IPool.PoolDetail storage self) internal view returns (uint40) {
        return self.timeEnd;
    }

    function setPoolName(IPool.PoolDetail storage self, string memory _poolName) internal {
        self.poolName = _poolName;
    }

    function getPoolName(IPool.PoolDetail storage self) internal view returns (string memory) {
        return self.poolName;
    }

    function setDepositAmountPerPerson(IPool.PoolDetail storage self, uint256 _depositAmountPerPerson) internal {
        self.depositAmountPerPerson = _depositAmountPerPerson;
    }

    function getDepositAmountPerPerson(IPool.PoolDetail storage self) internal view returns (uint256) {
        return self.depositAmountPerPerson;
    }
}
