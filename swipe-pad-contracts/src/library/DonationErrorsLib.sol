// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

library DonationErrorsLib {
    // Access control errors
    error Unauthorized(address caller);
    error OnlyCreator(address caller, address creator);
    error OnlyAdmin(address caller);

    // Validation errors
    error InvalidToken(address token);
    error InvalidAmount(uint256 amount);
    error InvalidFundingGoal(uint256 goal);
    error InvalidTimeframe(uint40 startTime, uint40 endTime);
    error InvalidFeeRate(uint16 feeRate);

    // State errors
    error CampaignNotActive(uint256 poolId);
    error CampaignAlreadyEnded(uint256 poolId);
    error DeadlineNotReached(uint256 poolId, uint40 endTime);
    error RefundPeriodExpired(uint256 poolId, uint40 endTime);
    error FundingGoalNotReached(
        uint256 poolId,
        uint256 currentAmount,
        uint256 goal
    );
    error CampaignDisputed(uint256 poolId);
    error CampaignHasDonations(uint256 poolId, uint256 totalDonations);

    // Operation errors
    error NoRefundAvailable(uint256 poolId, address donor);
    error NoFundsToWithdraw(uint256 poolId);
    error TransferFailed(address token, address to, uint256 amount);
    error ContractPaused();
}
