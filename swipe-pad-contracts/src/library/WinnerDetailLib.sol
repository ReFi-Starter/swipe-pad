// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IPool} from "../interface/IPool.sol";

library WinnerDetailLib {
    function addAmountWon(IPool.WinnerDetail storage self, uint256 amount) internal {
        self.timeWon = uint40(block.timestamp);
        self.amountWon += amount;
    }

    function getAmountWon(IPool.WinnerDetail storage self) internal view returns (uint256) {
        return self.amountWon;
    }

    function getAmountClaimed(IPool.WinnerDetail storage self) internal view returns (uint256) {
        return self.amountClaimed;
    }

    function getTimeWon(IPool.WinnerDetail storage self) internal view returns (uint40) {
        return self.timeWon;
    }

    function isClaimed(IPool.WinnerDetail storage self) internal view returns (bool) {
        return self.claimed;
    }
}
