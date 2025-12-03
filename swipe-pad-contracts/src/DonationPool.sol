// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

/// @title DonationPool - A decentralized crowdfunding platform
/// @author ottodevs
/// @notice This contract allows users to create and manage donation campaigns with different funding models
/// @dev Implements crowdfunding functionality with ALL_OR_NOTHING and KEEP_WHAT_YOU_RAISE models
/// @custom:security-contact 5030059+ottodevs@users.noreply.github.com

/// Interfaces
import {IDonationPool} from "./interface/IDonationPool.sol";
import {IERC20} from "./interface/IERC20.sol";

/// Libraries
import {FEES_PRECISION, DEFAULT_PLATFORM_FEE, MIN_FUNDING_PERIOD, MAX_FUNDING_PERIOD, MIN_FUNDING_GOAL, REFUND_GRACE_PERIOD, DISPUTE_RESOLUTION_PERIOD} from "./library/DonationConstantsLib.sol";
import {DonationEventsLib} from "./library/DonationEventsLib.sol";
import {DonationErrorsLib} from "./library/DonationErrorsLib.sol";
import {DonationPoolAdminLib} from "./library/DonationPoolAdminLib.sol";
import {DonationPoolDetailLib} from "./library/DonationPoolDetailLib.sol";
import {DonationPoolBalanceLib} from "./library/DonationPoolBalanceLib.sol";
import {DonorDetailLib} from "./library/DonorDetailLib.sol";
import {UtilsLib} from "./library/UtilsLib.sol";
import {SafeTransferLib} from "./library/SafeTransferLib.sol";

/// Dependencies
import {Ownable2Step} from "./dependency/Ownable2Step.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @notice Main contract for managing donation campaigns
/// @dev Inherits from Ownable2Step, AccessControl, and Pausable for security and control
contract DonationPool is IDonationPool, Ownable2Step, AccessControl, Pausable {
    using SafeTransferLib for IERC20;
    using DonationPoolAdminLib for IDonationPool.PoolAdmin;
    using DonationPoolDetailLib for IDonationPool.PoolDetail;
    using DonationPoolBalanceLib for IDonationPool.PoolBalance;
    using DonorDetailLib for IDonationPool.DonorDetail;

    /// @notice Role identifier for admin privileges
    /// @dev Keccak256 hash of "ADMIN_ROLE"
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    /// @notice Latest campaign ID (starts from 1, 0 is invalid)
    uint256 public latestPoolId;
    
    /// @notice Platform fee rate in basis points (e.g., 100 = 1%)
    uint16 public platformFeeRate;

    /// @notice Mapping of campaign ID to admin details
    mapping(uint256 => PoolAdmin) public poolAdmin;
    
    /// @notice Mapping of campaign ID to campaign details
    mapping(uint256 => PoolDetail) public poolDetail;
    
    /// @notice Mapping of campaign ID to donation token
    mapping(uint256 => IERC20) public poolToken;
    
    /// @notice Mapping of campaign ID to balance information
    mapping(uint256 => PoolBalance) public poolBalance;
    
    /// @notice Mapping of campaign ID to current status
    mapping(uint256 => POOLSTATUS) public poolStatus;
    
    /// @notice Mapping of campaign ID to list of donors
    mapping(uint256 => address[]) public donors;

    /// @notice Mapping of creator address to their campaign IDs
    mapping(address => uint256[]) public createdCampaigns;
    
    /// @notice Mapping to check if an address is a creator for a campaign
    mapping(address => mapping(uint256 poolId => bool)) public isCreator;

    /// @notice Mapping of donor address to campaigns they've donated to
    mapping(address => uint256[]) public donatedCampaigns;
    
    /// @notice Mapping to check if an address has donated to a campaign
    mapping(address => mapping(uint256 poolId => bool)) public isDonor;
    
    /// @notice Mapping of donor details for each campaign
    mapping(address => mapping(uint256 poolId => DonorDetail)) public donorDetail;

    /// @notice Mapping of token address to total platform fees collected
    mapping(address => uint256) public platformFeesCollected;

    /// @notice Ensures only the campaign creator can call the function
    /// @param poolId The ID of the campaign
    modifier onlyCreator(uint256 poolId) {
        if (msg.sender != poolAdmin[poolId].getCreator()) {
            revert DonationErrorsLib.OnlyCreator(
                msg.sender,
                poolAdmin[poolId].getCreator()
            );
        }
        _;
    }

    /// @notice Ensures the campaign is not in disputed state
    /// @param poolId The ID of the campaign
    modifier notDisputed(uint256 poolId) {
        if (poolAdmin[poolId].isDisputed()) {
            revert DonationErrorsLib.CampaignDisputed(poolId);
        }
        _;
    }

    /// @notice Initializes the contract with default settings
    /// @dev Sets up initial roles and platform fee
    constructor() Ownable2Step(msg.sender) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        platformFeeRate = DEFAULT_PLATFORM_FEE;
    }

    // ----------------------------------------------------------------------------
    // Donor Functions
    // ----------------------------------------------------------------------------

    /// @notice Donate `amount` tokens to campaign ID `poolId`
    /// @dev Handles platform fee calculation and updates all relevant state
    /// @param poolId The ID of the campaign to donate to
    /// @param amount The amount of tokens to donate
    /// @return success True if the donation was successful
    /// @custom:event DonationReceived Emitted when donation is received
    /// @custom:event CampaignStatusChanged Emitted if campaign becomes successful
    /// @custom:event FundingGoalReached Emitted if funding goal is reached
    function donate(
        uint256 poolId,
        uint256 amount
    ) external whenNotPaused notDisputed(poolId) returns (bool) {
        if (amount == 0) {
            revert DonationErrorsLib.InvalidAmount(amount);
        }

        if (poolStatus[poolId] != POOLSTATUS.ACTIVE) {
            revert DonationErrorsLib.CampaignNotActive(poolId);
        }

        // Calculate platform fee
        uint256 feeAmount = (amount * platformFeeRate) / FEES_PRECISION;

        // Update pool balance
        poolBalance[poolId].addDonation(amount, feeAmount);

        // Update donor details
        if (!isDonor[msg.sender][poolId]) {
            donors[poolId].push(msg.sender);
            donatedCampaigns[msg.sender].push(poolId);
            isDonor[msg.sender][poolId] = true;
        }

        DonorDetailLib.addDonation(donorDetail, msg.sender, poolId, amount);

        // Transfer tokens from donor to contract
        poolToken[poolId].safeTransferFrom(msg.sender, address(this), amount);

        // Check if funding goal is reached
        if (
            poolBalance[poolId].getTotalDonations() >=
            poolDetail[poolId].getFundingGoal() &&
            poolStatus[poolId] == POOLSTATUS.ACTIVE
        ) {
            poolStatus[poolId] = POOLSTATUS.SUCCESSFUL;
            emit DonationEventsLib.CampaignStatusChanged(
                poolId,
                POOLSTATUS.SUCCESSFUL
            );
            emit DonationEventsLib.FundingGoalReached(
                poolId,
                poolBalance[poolId].getTotalDonations()
            );
        }

        emit DonationEventsLib.DonationReceived(poolId, msg.sender, amount);

        return true;
    }

    /// @notice Claim available refund for campaign ID `poolId`
    /// @dev Only available for failed ALL_OR_NOTHING campaigns during the refund grace period
    /// @param poolId The ID of the campaign to claim refund from
    /// @custom:event RefundClaimed Emitted when refund is claimed
    /// @custom:event CampaignStatusChanged Emitted if campaign status changes to FAILED
    /// @custom:event FundingFailed Emitted if funding goal was not reached
    function claimRefund(uint256 poolId) external whenNotPaused {
        // Check campaign status and funding model
        if (poolStatus[poolId] != POOLSTATUS.FAILED) {
            // Campaign must be in FAILED state
            if (
                poolDetail[poolId].hasFundingModel(
                    FUNDINGMODEL.ALL_OR_NOTHING
                ) &&
                poolDetail[poolId].hasEnded() &&
                poolBalance[poolId].getTotalDonations() <
                poolDetail[poolId].getFundingGoal()
            ) {
                // Automatically mark as failed if conditions are met
                poolStatus[poolId] = POOLSTATUS.FAILED;
                emit DonationEventsLib.CampaignStatusChanged(
                    poolId,
                    POOLSTATUS.FAILED
                );
                emit DonationEventsLib.FundingFailed(
                    poolId,
                    poolBalance[poolId].getTotalDonations(),
                    poolDetail[poolId].getFundingGoal()
                );
            } else {
                revert DonationErrorsLib.NoRefundAvailable(poolId, msg.sender);
            }
        }

        // Ensure this is a refundable campaign
        if (!poolDetail[poolId].hasFundingModel(FUNDINGMODEL.ALL_OR_NOTHING)) {
            revert DonationErrorsLib.NoRefundAvailable(poolId, msg.sender);
        }

        // Check if user has donated and hasn't already refunded
        if (
            !DonorDetailLib.hasDonated(donorDetail, msg.sender, poolId) ||
            DonorDetailLib.hasRefunded(donorDetail, msg.sender, poolId)
        ) {
            revert DonationErrorsLib.NoRefundAvailable(poolId, msg.sender);
        }

        // Get the end time for this campaign
        uint40 endTime = poolDetail[poolId].getEndTime();

        // Check if refund grace period is still valid using safe comparison
        // If current time is past the refund deadline (end time + grace period), revert
        if (
            block.timestamp > endTime &&
            (block.timestamp - endTime) > REFUND_GRACE_PERIOD
        ) {
            revert DonationErrorsLib.RefundPeriodExpired(
                poolId,
                endTime + REFUND_GRACE_PERIOD
            );
        }

        // Get total amount donated by user
        uint256 totalDonated = donorDetail[msg.sender][poolId].totalDonated;
        uint256 refundClaimed = donorDetail[msg.sender][poolId].refundClaimed;

        // Calculate the actual refundable amount (accounting for fees)
        uint16 feeRate = poolAdmin[poolId].getPlatformFeeRate();
        uint256 feeAmount = (totalDonated * feeRate) / FEES_PRECISION;
        uint256 refundAmount = totalDonated - feeAmount - refundClaimed;

        if (refundAmount == 0) {
            revert DonationErrorsLib.NoRefundAvailable(poolId, msg.sender);
        }

        // Update state
        DonorDetailLib.markAsRefunded(
            donorDetail,
            msg.sender,
            poolId,
            refundAmount
        );
        poolBalance[poolId].deductFromBalance(refundAmount);

        // Send refund
        poolToken[poolId].safeTransfer(msg.sender, refundAmount);

        emit DonationEventsLib.RefundClaimed(poolId, msg.sender, refundAmount);
    }

    // ----------------------------------------------------------------------------
    // Creator Functions
    // ----------------------------------------------------------------------------

    /// @notice Creates a new campaign named `campaignName` using token `token`
    /// @dev Validates parameters, sets up initial state, and assigns `msg.sender` as creator
    /// @param startTime Campaign start timestamp
    /// @param endTime Campaign end timestamp
    /// @param campaignName Name of the campaign
    /// @param campaignDescription Description of the campaign
    /// @param campaignUrl URL for more information
    /// @param imageUrl URL for campaign image
    /// @param fundingGoal Target amount to raise in token `token`
    /// @param fundingModel Funding model (ALL_OR_NOTHING or KEEP_WHAT_YOU_RAISE)
    /// @param token Address of the ERC20 token used for donations
    /// @return poolId The ID of the newly created campaign
    /// @custom:event CampaignCreated Emitted when campaign is created
    /// @custom:event CampaignStatusChanged Emitted when campaign becomes active
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
    ) external whenNotPaused returns (uint256) {
        // Validation
        if (startTime >= endTime) {
            revert DonationErrorsLib.InvalidTimeframe(startTime, endTime);
        }

        if (
            endTime - startTime < MIN_FUNDING_PERIOD ||
            endTime - startTime > MAX_FUNDING_PERIOD
        ) {
            revert DonationErrorsLib.InvalidTimeframe(startTime, endTime);
        }

        if (fundingGoal < MIN_FUNDING_GOAL) {
            revert DonationErrorsLib.InvalidFundingGoal(fundingGoal);
        }

        if (!UtilsLib.isContract(token)) {
            revert DonationErrorsLib.InvalidToken(token);
        }

        // Increment pool id
        latestPoolId++;

        // Pool details
        poolDetail[latestPoolId].setStartTime(startTime);
        poolDetail[latestPoolId].setEndTime(endTime);
        poolDetail[latestPoolId].setCampaignName(campaignName);
        poolDetail[latestPoolId].setCampaignDescription(campaignDescription);
        poolDetail[latestPoolId].setCampaignUrl(campaignUrl);
        poolDetail[latestPoolId].setImageUrl(imageUrl);
        poolDetail[latestPoolId].fundingGoal = fundingGoal;
        poolDetail[latestPoolId].fundingModel = fundingModel;

        // Pool admin details
        poolAdmin[latestPoolId].setCreator(msg.sender);
        poolAdmin[latestPoolId].setPlatformFeeRate(platformFeeRate);
        isCreator[msg.sender][latestPoolId] = true;
        createdCampaigns[msg.sender].push(latestPoolId);

        // Pool token
        poolToken[latestPoolId] = IERC20(token);

        // Set pool status
        poolStatus[latestPoolId] = POOLSTATUS.ACTIVE;

        emit DonationEventsLib.CampaignCreated(
            latestPoolId,
            msg.sender,
            campaignName,
            fundingGoal,
            token,
            fundingModel
        );

        emit DonationEventsLib.CampaignStatusChanged(
            latestPoolId,
            POOLSTATUS.ACTIVE
        );

        return latestPoolId;
    }

    /// @notice Update details for campaign ID `poolId`
    /// @dev Updates name to `campaignName`, description to `campaignDescription`, etc. Only callable by creator while active.
    /// @param poolId The ID of the campaign to update
    /// @param campaignName New name for the campaign
    /// @param campaignDescription New description for the campaign
    /// @param campaignUrl New URL for more information
    /// @param imageUrl New URL for campaign image
    /// @custom:event CampaignDetailsUpdated Emitted when details are updated
    function updateCampaignDetails(
        uint256 poolId,
        string calldata campaignName,
        string calldata campaignDescription,
        string calldata campaignUrl,
        string calldata imageUrl
    ) external whenNotPaused onlyCreator(poolId) notDisputed(poolId) {
        if (poolStatus[poolId] != POOLSTATUS.ACTIVE) {
            revert DonationErrorsLib.CampaignNotActive(poolId);
        }

        poolDetail[poolId].setCampaignName(campaignName);
        poolDetail[poolId].setCampaignDescription(campaignDescription);
        poolDetail[poolId].setCampaignUrl(campaignUrl);
        poolDetail[poolId].setImageUrl(imageUrl);

        emit DonationEventsLib.CampaignDetailsUpdated(
            poolId,
            campaignName,
            campaignDescription,
            campaignUrl,
            imageUrl
        );
    }

    /// @notice Change the end time for campaign ID `poolId` to `endTime`
    /// @dev Only callable by creator. Must respect MIN/MAX funding periods.
    /// @param poolId The ID of the campaign to update
    /// @param endTime New end timestamp for the campaign
    /// @custom:event CampaignEndTimeChanged Emitted when end time is changed
    function changeEndTime(
        uint256 poolId,
        uint40 endTime
    ) external whenNotPaused onlyCreator(poolId) notDisputed(poolId) {
        if (poolStatus[poolId] != POOLSTATUS.ACTIVE) {
            revert DonationErrorsLib.CampaignNotActive(poolId);
        }

        uint40 startTime = poolDetail[poolId].getStartTime();

        if (endTime <= block.timestamp) {
            revert DonationErrorsLib.InvalidTimeframe(startTime, endTime);
        }

        if (
            endTime - startTime < MIN_FUNDING_PERIOD ||
            endTime - startTime > MAX_FUNDING_PERIOD
        ) {
            revert DonationErrorsLib.InvalidTimeframe(startTime, endTime);
        }

        poolDetail[poolId].setEndTime(endTime);

        emit DonationEventsLib.CampaignEndTimeChanged(poolId, endTime);
    }

    /// @notice Withdraw collected funds from campaign ID `poolId`
    /// @dev Available for successful campaigns or KEEP_WHAT_YOU_RAISE after deadline. Funds sent to creator.
    /// @param poolId The ID of the campaign to withdraw from
    /// @custom:event FundsWithdrawn Emitted when funds are withdrawn
    function withdrawFunds(
        uint256 poolId
    ) external whenNotPaused onlyCreator(poolId) notDisputed(poolId) {
        bool canWithdraw = false;

        // For successful campaigns (reached funding goal)
        if (poolStatus[poolId] == POOLSTATUS.SUCCESSFUL) {
            canWithdraw = true;
        }
        // For KEEP_WHAT_YOU_RAISE campaigns after deadline
        else if (
            poolDetail[poolId].hasFundingModel(
                FUNDINGMODEL.KEEP_WHAT_YOU_RAISE
            ) && poolDetail[poolId].hasEnded()
        ) {
            canWithdraw = true;
        }

        if (!canWithdraw) {
            if (!poolDetail[poolId].hasEnded()) {
                revert DonationErrorsLib.DeadlineNotReached(
                    poolId,
                    poolDetail[poolId].getEndTime()
                );
            } else if (
                poolDetail[poolId].hasFundingModel(
                    FUNDINGMODEL.ALL_OR_NOTHING
                ) &&
                poolBalance[poolId].getTotalDonations() <
                poolDetail[poolId].getFundingGoal()
            ) {
                revert DonationErrorsLib.FundingGoalNotReached(
                    poolId,
                    poolBalance[poolId].getTotalDonations(),
                    poolDetail[poolId].getFundingGoal()
                );
            }
        }

        uint256 amount = poolBalance[poolId].getBalance();
        if (amount == 0) {
            revert DonationErrorsLib.NoFundsToWithdraw(poolId);
        }

        // Update state
        poolBalance[poolId].deductFromBalance(amount);

        // Send funds to creator
        poolToken[poolId].safeTransfer(msg.sender, amount);

        emit DonationEventsLib.FundsWithdrawn(poolId, msg.sender, amount);
    }

    /// @notice Cancel campaign ID `poolId`
    /// @dev Only callable by creator if the campaign is active and has received zero donations.
    /// @param poolId The ID of the campaign to cancel
    /// @custom:event CampaignCancelled Emitted when campaign is cancelled
    /// @custom:event CampaignStatusChanged Emitted when status changes to DELETED
    function cancelCampaign(
        uint256 poolId
    ) external whenNotPaused onlyCreator(poolId) {
        if (poolStatus[poolId] != POOLSTATUS.ACTIVE) {
            revert DonationErrorsLib.CampaignNotActive(poolId);
        }

        if (poolBalance[poolId].getTotalDonations() > 0) {
            revert DonationErrorsLib.CampaignHasDonations(
                poolId,
                poolBalance[poolId].getTotalDonations()
            );
        }

        poolStatus[poolId] = POOLSTATUS.DELETED;

        emit DonationEventsLib.CampaignCancelled(poolId, msg.sender);
        emit DonationEventsLib.CampaignStatusChanged(poolId, POOLSTATUS.DELETED);
    }

    // ----------------------------------------------------------------------------
    // View Functions
    // ----------------------------------------------------------------------------

    /// @notice Get the creator address for campaign ID `poolId`
    /// @param poolId The ID of the campaign
    /// @return creator The address of the campaign creator
    function getCampaignCreator(uint256 poolId) external view returns (address) {
        return poolAdmin[poolId].getCreator();
    }

    /// @notice Get all details for campaign ID `poolId`
    /// @param poolId The ID of the campaign
    /// @return details Struct containing all campaign details
    function getCampaignDetails(
        uint256 poolId
    ) external view returns (PoolDetail memory) {
        return poolDetail[poolId];
    }

    /// @notice Get the current token balance for campaign ID `poolId`
    /// @param poolId The ID of the campaign
    /// @return balance The current balance in tokens
    function getCampaignBalance(uint256 poolId) external view returns (uint256) {
        return poolBalance[poolId].getBalance();
    }

    /// @notice Get the funding progress for campaign ID `poolId` as a percentage
    /// @dev Returns percentage (0-100)
    /// @param poolId The ID of the campaign
    /// @return progress The funding progress as a percentage (0-100)
    function getFundingProgress(
        uint256 poolId
    ) external view returns (uint256) {
        uint256 goal = poolDetail[poolId].getFundingGoal();
        if (goal == 0) return 0;

        return (poolBalance[poolId].getTotalDonations() * 100) / goal;
    }

    /// @notice Get all campaign IDs created by `creator`
    /// @param creator The address to check
    /// @return poolIds Array of campaign IDs created by this address
    function getCampaignsCreatedBy(
        address creator
    ) external view returns (uint256[] memory) {
        return createdCampaigns[creator];
    }

    /// @notice Get all campaign IDs `donor` has donated to
    /// @param donor The address to check
    /// @return poolIds Array of campaign IDs the address has donated to
    function getCampaignsDonatedToBy(
        address donor
    ) external view returns (uint256[] memory) {
        return donatedCampaigns[donor];
    }

    /// @notice Get donation details for `donor` in campaign ID `poolId`
    /// @param poolId The ID of the campaign
    /// @param donor The address of the donor
    /// @return details Struct containing donation details (total donated, refund claimed)
    function getDonationDetails(
        uint256 poolId,
        address donor
    ) external view returns (DonorDetail memory) {
        return donorDetail[donor][poolId];
    }

    /// @notice Get all donor addresses for campaign ID `poolId`
    /// @param poolId The ID of the campaign
    /// @return donors Array of donor addresses
    function getCampaignDonors(
        uint256 poolId
    ) external view returns (address[] memory) {
        return donors[poolId];
    }

    /// @notice Check if campaign ID `poolId` is considered successful
    /// @dev Returns true if status is SUCCESSFUL or funding goal is reached
    /// @param poolId The ID of the campaign
    /// @return isSuccessful True if campaign is successful
    function isCampaignSuccessful(uint256 poolId) external view returns (bool) {
        return
            poolStatus[poolId] == POOLSTATUS.SUCCESSFUL ||
            (poolBalance[poolId].getTotalDonations() >=
                poolDetail[poolId].getFundingGoal());
    }

    /// @notice Check if campaign ID `poolId` has failed
    /// @dev Returns true if status is FAILED or conditions for failure are met (ALL_OR_NOTHING, ended, goal not met)
    /// @param poolId The ID of the campaign
    /// @return hasFailed True if campaign has failed
    function hasCampaignFailed(uint256 poolId) external view returns (bool) {
        return
            poolStatus[poolId] == POOLSTATUS.FAILED ||
            (poolDetail[poolId].hasEnded() &&
                poolDetail[poolId].hasFundingModel(
                    FUNDINGMODEL.ALL_OR_NOTHING
                ) &&
                poolBalance[poolId].getTotalDonations() <
                poolDetail[poolId].getFundingGoal());
    }

    /// @notice Get all core information for campaign ID `poolId`
    /// @dev Returns admin, details, balance, status, token, and donors. Useful for UIs.
    /// @param poolId The ID of the campaign
    /// @return _poolAdmin Admin details of the campaign
    /// @return _poolDetail Campaign details
    /// @return _poolBalance Balance information
    /// @return _poolStatus Current status
    /// @return _poolToken Address of the donation token
    /// @return _donors Array of donor addresses
    function getAllCampaignInfo(
        uint256 poolId
    )
        external
        view
        returns (
            IDonationPool.PoolAdmin memory _poolAdmin,
            IDonationPool.PoolDetail memory _poolDetail,
            IDonationPool.PoolBalance memory _poolBalance,
            IDonationPool.POOLSTATUS _poolStatus,
            address _poolToken,
            address[] memory _donors
        )
    {
        return (
            poolAdmin[poolId],
            poolDetail[poolId],
            poolBalance[poolId],
            poolStatus[poolId],
            address(poolToken[poolId]),
            donors[poolId]
        );
    }

    // ----------------------------------------------------------------------------
    // Admin Functions
    // ----------------------------------------------------------------------------

    /// @notice Pause all contract interactions (except admin functions)
    /// @dev Only callable by accounts with ADMIN_ROLE. Useful for emergencies.
    /// @custom:event Paused Emitted when contract is paused
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /// @notice Resume contract interactions after a pause
    /// @dev Only callable by accounts with ADMIN_ROLE.
    /// @custom:event Unpaused Emitted when contract is unpaused
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    /// @notice Flag campaign ID `poolId` as disputed
    /// @dev Prevents withdrawals and donations. Only callable by ADMIN_ROLE.
    /// @param poolId The ID of the campaign to flag
    /// @custom:event CampaignDisputed Emitted when campaign is marked as disputed
    function flagCampaignAsDisputed(
        uint256 poolId
    ) external onlyRole(ADMIN_ROLE) {
        if (poolAdmin[poolId].isDisputed()) {
            return; // Already disputed
        }

        poolAdmin[poolId].setDisputed(true);

        emit DonationEventsLib.CampaignDisputed(poolId, msg.sender);
    }

    /// @notice Resolve dispute for campaign ID `poolId`. Optionally resolve in favor of creator.
    /// @dev Removes disputed flag. If `resolveInFavorOfCreator` is false, sets status to FAILED to enable refunds. Only callable by ADMIN_ROLE.
    /// @param poolId The ID of the campaign to resolve
    /// @param resolveInFavorOfCreator If true, campaign continues; if false, enables refunds
    /// @custom:event DisputeResolved Emitted when dispute is resolved
    /// @custom:event CampaignStatusChanged Emitted if status changes to FAILED
    function resolveDispute(
        uint256 poolId,
        bool resolveInFavorOfCreator
    ) external onlyRole(ADMIN_ROLE) {
        if (!poolAdmin[poolId].isDisputed()) {
            return; // Not disputed
        }

        poolAdmin[poolId].setDisputed(false);

        if (!resolveInFavorOfCreator) {
            // If not resolved in favor of creator, set status to FAILED to allow refunds
            poolStatus[poolId] = POOLSTATUS.FAILED;
            emit DonationEventsLib.CampaignStatusChanged(
                poolId,
                POOLSTATUS.FAILED
            );
        }

        emit DonationEventsLib.DisputeResolved(poolId, resolveInFavorOfCreator);
    }

    /// @notice Set the platform fee rate to `newFeeRate` basis points
    /// @dev Fee rate applies to future donations. Max rate is 10000 (100%). Only callable by ADMIN_ROLE.
    /// @param newFeeRate New fee rate in basis points (e.g., 100 = 1%)
    /// @custom:event PlatformFeeRateChanged Emitted when fee rate is updated
    function setPlatformFeeRate(
        uint16 newFeeRate
    ) external onlyRole(ADMIN_ROLE) {
        if (newFeeRate > FEES_PRECISION) {
            revert DonationErrorsLib.InvalidFeeRate(newFeeRate);
        }

        uint16 oldRate = platformFeeRate;
        platformFeeRate = newFeeRate;

        emit DonationEventsLib.PlatformFeeRateChanged(oldRate, newFeeRate);
    }

    /// @notice Collect accumulated platform fees for `token`
    /// @dev Transfers collected fees to the caller (admin). Only callable by ADMIN_ROLE.
    /// @param token The ERC20 token address to collect fees for
    /// @custom:event PlatformFeeCollected Emitted when fees are collected
    function collectPlatformFees(IERC20 token) external onlyRole(ADMIN_ROLE) {
        uint256 feesToCollect = 0;

        // Collect fees from all pools using this token
        for (uint256 i = 1; i <= latestPoolId; i++) {
            if (address(poolToken[i]) == address(token)) {
                uint256 poolFeesToCollect = poolBalance[i].getFeesToCollect();
                if (poolFeesToCollect > 0) {
                    poolBalance[i].collectFees(poolFeesToCollect);
                    feesToCollect += poolFeesToCollect;
                }
            }
        }

        if (feesToCollect == 0) {
            return;
        }

        // Update tracking
        platformFeesCollected[address(token)] += feesToCollect;

        // Transfer fees to admin
        token.safeTransfer(msg.sender, feesToCollect);

        emit DonationEventsLib.PlatformFeeCollected(
            address(token),
            feesToCollect
        );
    }

    /// @notice Withdraw `amount` of `token` in an emergency
    /// @dev Only callable by ADMIN_ROLE when the contract is paused. Use with extreme caution.
    /// @param token The ERC20 token address to withdraw
    /// @param amount The amount to withdraw
    /// @custom:event EmergencyWithdraw Emitted when emergency withdrawal occurs
    function emergencyWithdraw(
        IERC20 token,
        uint256 amount
    ) external onlyRole(ADMIN_ROLE) whenPaused {
        token.safeTransfer(msg.sender, amount);

        emit DonationEventsLib.EmergencyWithdraw(address(token), amount);
    }

    // ----------------------------------------------------------------------------
    // Access Control Functions
    // ----------------------------------------------------------------------------

    /// @notice Grant ADMIN_ROLE to `account`
    /// @dev Allows `account` to perform administrative actions. Only callable by contract owner.
    /// @param account The address to grant admin role to
    /// @custom:event RoleGranted Emitted when role is granted
    function addAdmin(address account) external onlyOwner {
        _grantRole(ADMIN_ROLE, account);
    }

    /// @notice Revoke ADMIN_ROLE from `account`
    /// @dev Removes administrative privileges from `account`. Only callable by contract owner.
    /// @param account The address to revoke admin role from
    /// @custom:event RoleRevoked Emitted when role is revoked
    function removeAdmin(address account) external onlyOwner {
        _revokeRole(ADMIN_ROLE, account);
    }
}
