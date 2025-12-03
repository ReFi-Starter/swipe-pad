// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BoostManager
 * @dev Handles fees for boosting projects.
 */
contract BoostManager is Ownable {
    using SafeERC20 for IERC20;

    address public treasury;

    event ProjectBoosted(address indexed booster, string projectId, address indexed token, uint256 amount);
    event TreasuryUpdated(address indexed oldTreasury, address indexed newTreasury);

    constructor(address _treasury) Ownable(msg.sender) {
        require(_treasury != address(0), "Invalid treasury address");
        treasury = _treasury;
    }

    /**
     * @dev Boosts a project by paying a fee to the treasury.
     * @param projectId The ID of the project to boost.
     * @param token The address of the ERC20 token used for payment.
     * @param amount The amount of fee to pay.
     */
    function boostProject(string memory projectId, address token, uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");

        IERC20(token).safeTransferFrom(msg.sender, treasury, amount);

        emit ProjectBoosted(msg.sender, projectId, token, amount);
    }

    /**
     * @dev Updates the treasury address.
     * @param _newTreasury The new treasury address.
     */
    function setTreasury(address _newTreasury) external onlyOwner {
        require(_newTreasury != address(0), "Invalid treasury address");
        emit TreasuryUpdated(treasury, _newTreasury);
        treasury = _newTreasury;
    }
}
