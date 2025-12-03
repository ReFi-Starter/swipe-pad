// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {IDonationPool} from "../interface/IDonationPool.sol";

library DonationPoolAdminLib {
    function getCreator(
        IDonationPool.PoolAdmin storage admin
    ) internal view returns (address) {
        return admin.creator;
    }

    function getPlatformFeeRate(
        IDonationPool.PoolAdmin storage admin
    ) internal view returns (uint16) {
        return admin.platformFeeRate;
    }

    function isDisputed(
        IDonationPool.PoolAdmin storage admin
    ) internal view returns (bool) {
        return admin.disputed;
    }

    function setCreator(
        IDonationPool.PoolAdmin storage admin,
        address creator
    ) internal {
        admin.creator = creator;
    }

    function setPlatformFeeRate(
        IDonationPool.PoolAdmin storage admin,
        uint16 platformFeeRate
    ) internal {
        admin.platformFeeRate = platformFeeRate;
    }

    function setDisputed(
        IDonationPool.PoolAdmin storage admin,
        bool disputed
    ) internal {
        admin.disputed = disputed;
    }
}
