// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library ErrorsLib {
    /// @dev Error when caller is not authorized.
    error Unauthorized(address caller);
    error EventStarted(uint256 timeNow, uint256 timeStart, address caller);
}
