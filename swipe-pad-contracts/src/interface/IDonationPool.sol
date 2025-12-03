// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {IERC20} from "./IERC20.sol";

interface IDonationPool {
    enum POOLSTATUS {
        ACTIVE, // Pool is active and accepting donations
        SUCCESSFUL, // Funding goal reached
        FAILED, // Deadline reached without meeting goal
        DELETED // Pool deleted by admin
    }

    enum FUNDINGMODEL {
        ALL_OR_NOTHING, // Funds only released if goal is reached
        KEEP_WHAT_YOU_RAISE // Funds released regardless of goal
    }

    struct PoolAdmin {
        address creator; // Campaign creator
        uint16 platformFeeRate; // Fee rate for platform (0.01% to 100%)
        bool disputed; // Flag for disputed campaigns
    }

    struct PoolDetail {
        uint40 startTime; // Start time for the donation period
        uint40 endTime; // End time for the donation period
        string campaignName; // Name of the campaign
        string campaignDescription; // Description of the campaign
        string campaignUrl; // URL for more information
        string imageUrl; // URL for campaign image
        uint256 fundingGoal; // Target amount to raise
        FUNDINGMODEL fundingModel; // Funding model for the campaign
    }

    struct PoolBalance {
        uint256 totalDonations; // Total donations received
        uint256 feesAccumulated; // Platform fees accumulated
        uint256 feesCollected; // Platform fees collected
        uint256 balance; // Current balance in the pool
    }

    struct DonorDetail {
        uint256 totalDonated; // Total amount donated by this donor
        uint256 refundClaimed; // Amount of refund claimed (for ALL_OR_NOTHING model)
        bool hasRefunded; // Whether donor has claimed refund
    }

    // ----------------------------------------------------------------------------
    // Donor Functions
    // ----------------------------------------------------------------------------

    /**
     * @notice Donate to a campaign
     * @param poolId The pool id
     * @param amount The amount to donate
     * @return success Whether the donation was successful
     */
    function donate(uint256 poolId, uint256 amount) external returns (bool);

    /**
     * @notice Claim refund for failed ALL_OR_NOTHING campaign
     * @param poolId The pool id
     */
    function claimRefund(uint256 poolId) external;

    // ----------------------------------------------------------------------------
    // Creator Functions
    // ----------------------------------------------------------------------------

    /**
     * @notice Create a new donation campaign
     * @param startTime When the donation period starts
     * @param endTime When the donation period ends
     * @param campaignName Name of the campaign
     * @param campaignDescription Description of the campaign
     * @param campaignUrl URL for more information
     * @param imageUrl URL for campaign image
     * @param fundingGoal Target amount to raise
     * @param fundingModel Funding model (ALL_OR_NOTHING or KEEP_WHAT_YOU_RAISE)
     * @param token Token used for donations (e.g., cUSD)
     * @return poolId The ID of the created campaign
     */
    function createCampaign(
        uint40 startTime,
        uint40 endTime,
        string calldata campaignName,
        string calldata campaignDescription,
        string calldata campaignUrl,
        string calldata imageUrl,
        uint256 fundingGoal,
        FUNDINGMODEL fundingModel,
        address token
    ) external returns (uint256);

    /**
     * @notice Update campaign details
     * @param poolId The pool id
     * @param campaignName New name for the campaign
     * @param campaignDescription New description for the campaign
     * @param campaignUrl New URL for more information
     * @param imageUrl New URL for campaign image
     */
    function updateCampaignDetails(
        uint256 poolId,
        string calldata campaignName,
        string calldata campaignDescription,
        string calldata campaignUrl,
        string calldata imageUrl
    ) external;

    /**
     * @notice Change the end time of a campaign
     * @param poolId The pool id
     * @param endTime New end time
     */
    function changeEndTime(uint256 poolId, uint40 endTime) external;

    /**
     * @notice Withdraw funds from a successful campaign or KEEP_WHAT_YOU_RAISE campaign after deadline
     * @param poolId The pool id
     */
    function withdrawFunds(uint256 poolId) external;

    /**
     * @notice Cancel a campaign (only if no donations received)
     * @param poolId The pool id
     */
    function cancelCampaign(uint256 poolId) external;

    // ----------------------------------------------------------------------------
    // View Functions
    // ----------------------------------------------------------------------------

    /**
     * @notice Get campaign creator
     * @param poolId The pool id
     * @return creator The creator address
     */
    function getCampaignCreator(uint256 poolId) external view returns (address);

    /**
     * @notice Get campaign details
     * @param poolId The pool id
     * @return details The campaign details
     */
    function getCampaignDetails(
        uint256 poolId
    ) external view returns (PoolDetail memory);

    /**
     * @notice Get campaign balance
     * @param poolId The pool id
     * @return balance The current balance of the campaign
     */
    function getCampaignBalance(uint256 poolId) external view returns (uint256);

    /**
     * @notice Get funding progress
     * @param poolId The pool id
     * @return progress The current funding progress (0-100%)
     */
    function getFundingProgress(uint256 poolId) external view returns (uint256);

    /**
     * @notice Get campaigns created by an address
     * @param creator The creator address
     * @return poolIds The campaign IDs created by this address
     */
    function getCampaignsCreatedBy(
        address creator
    ) external view returns (uint256[] memory);

    /**
     * @notice Get campaigns donated to by an address
     * @param donor The donor address
     * @return poolIds The campaign IDs donated to by this address
     */
    function getCampaignsDonatedToBy(
        address donor
    ) external view returns (uint256[] memory);

    /**
     * @notice Get donation details for a donor
     * @param poolId The pool id
     * @param donor The donor address
     * @return details The donation details
     */
    function getDonationDetails(
        uint256 poolId,
        address donor
    ) external view returns (DonorDetail memory);

    /**
     * @notice Get all donors for a campaign
     * @param poolId The pool id
     * @return donors The list of donor addresses
     */
    function getCampaignDonors(
        uint256 poolId
    ) external view returns (address[] memory);

    /**
     * @notice Check if a campaign is successful (reached its funding goal)
     * @param poolId The pool id
     * @return isSuccessful Whether the campaign reached its funding goal
     */
    function isCampaignSuccessful(uint256 poolId) external view returns (bool);

    /**
     * @notice Check if a campaign has failed (deadline reached without meeting goal)
     * @param poolId The pool id
     * @return hasFailed Whether the campaign has failed
     */
    function hasCampaignFailed(uint256 poolId) external view returns (bool);

    // ----------------------------------------------------------------------------
    // Admin Functions
    // ----------------------------------------------------------------------------

    /**
     * @notice Pause all contract operations (admin only)
     */
    function pause() external;

    /**
     * @notice Unpause contract operations (admin only)
     */
    function unpause() external;

    /**
     * @notice Flag a campaign as disputed (admin only)
     * @param poolId The pool id
     */
    function flagCampaignAsDisputed(uint256 poolId) external;

    /**
     * @notice Resolve a disputed campaign (admin only)
     * @param poolId The pool id
     * @param resolveInFavorOfCreator Whether to resolve in favor of the creator
     */
    function resolveDispute(
        uint256 poolId,
        bool resolveInFavorOfCreator
    ) external;

    /**
     * @notice Set platform fee rate (admin only)
     * @param newFeeRate The new platform fee rate (0.01% to 100%)
     */
    function setPlatformFeeRate(uint16 newFeeRate) external;

    /**
     * @notice Collect platform fees (admin only)
     * @param token The token to collect fees for
     */
    function collectPlatformFees(IERC20 token) external;

    /**
     * @notice Emergency withdraw in case of critical issues (admin only, when paused)
     * @param token The token to withdraw
     * @param amount The amount to withdraw
     */
    function emergencyWithdraw(IERC20 token, uint256 amount) external;
}
