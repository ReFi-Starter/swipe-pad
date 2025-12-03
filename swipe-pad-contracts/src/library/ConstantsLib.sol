// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @dev 2 decimals precision in percentage for fees.
/// @dev 0.01% to 100%.
/// @dev 1 to 10000.
uint16 constant FEES_PRECISION = 10000;

/// @dev Timelock for admin to forfeit winnings.
uint40 constant FORFEIT_WINNINGS_TIMELOCK = 5 days;
