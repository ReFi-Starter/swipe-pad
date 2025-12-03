// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IPool} from "../interface/IPool.sol";

library PoolAdminLib {
    function setPenaltyFeeRate(IPool.PoolAdmin storage self, uint16 penaltyFeeRate) internal {
        self.penaltyFeeRate = penaltyFeeRate;
    }

    function getPenaltyFeeRate(IPool.PoolAdmin storage self) internal view returns (uint16) {
        return self.penaltyFeeRate;
    }

    function setHost(IPool.PoolAdmin storage self, address host) internal {
        self.host = host;
    }

    function getHost(IPool.PoolAdmin storage self) internal view returns (address) {
        return self.host;
    }
}
