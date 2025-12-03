// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {IDonationPool} from "../interface/IDonationPool.sol";

library DonorDetailLib {
    function hasDonated(
        mapping(address => mapping(uint256 => IDonationPool.DonorDetail))
            storage donorDetails,
        address donor,
        uint256 poolId
    ) internal view returns (bool) {
        return donorDetails[donor][poolId].totalDonated > 0;
    }

    function hasRefunded(
        mapping(address => mapping(uint256 => IDonationPool.DonorDetail))
            storage donorDetails,
        address donor,
        uint256 poolId
    ) internal view returns (bool) {
        return donorDetails[donor][poolId].hasRefunded;
    }

    function getRemainingRefund(
        mapping(address => mapping(uint256 => IDonationPool.DonorDetail))
            storage donorDetails,
        address donor,
        uint256 poolId
    ) internal view returns (uint256) {
        // Calculate refundable amount accounting for platform fees
        // The totalDonated is the gross amount including fees
        // For a 1% fee, only 99% of the totalDonated amount should be refundable
        uint256 donatedAmount = donorDetails[donor][poolId].totalDonated;
        uint256 refundClaimed = donorDetails[donor][poolId].refundClaimed;

        // The donor should only get back what's in the pool's balance (after fees)
        // For a standard 1% fee rate, that would be 99% of what they donated
        return donatedAmount - refundClaimed;
    }

    function addDonation(
        mapping(address => mapping(uint256 => IDonationPool.DonorDetail))
            storage donorDetails,
        address donor,
        uint256 poolId,
        uint256 amount
    ) internal {
        donorDetails[donor][poolId].totalDonated += amount;
    }

    function markAsRefunded(
        mapping(address => mapping(uint256 => IDonationPool.DonorDetail))
            storage donorDetails,
        address donor,
        uint256 poolId,
        uint256 amount
    ) internal {
        donorDetails[donor][poolId].hasRefunded = true;
        donorDetails[donor][poolId].refundClaimed += amount;
    }
}
