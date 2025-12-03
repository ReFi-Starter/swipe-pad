// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

/// @dev 2 decimals precision in percentage for fees.
/// @dev 0.01% to 100%.
/// @dev 1 to 10000.
uint16 constant FEES_PRECISION = 10000;

/// @dev Default platform fee rate (1% = 100)
uint16 constant DEFAULT_PLATFORM_FEE = 100;

/// @dev Minimum funding period (1 day)
uint40 constant MIN_FUNDING_PERIOD = 1 days;

/// @dev Maximum funding period (180 days)
uint40 constant MAX_FUNDING_PERIOD = 180 days;

/// @dev Minimum funding goal (1 token unit)
uint256 constant MIN_FUNDING_GOAL = 1;

/// @dev Grace period for refunds after project failure (14 days)
uint40 constant REFUND_GRACE_PERIOD = 14 days;

/// @dev Dispute resolution period (7 days)
uint40 constant DISPUTE_RESOLUTION_PERIOD = 7 days;
