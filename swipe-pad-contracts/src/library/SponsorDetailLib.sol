// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IPool} from "../interface/IPool.sol";

library SponsorDetailLib {
    function init(IPool.SponsorDetail storage self, string calldata name, uint256 amount) internal {
        self.name = name;
        self.amount = amount;
    }
}
