// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SwipeDonation
 * @dev Handles direct and batch donations to projects.
 */
contract SwipeDonation is Ownable {
    using SafeERC20 for IERC20;

    event Donation(address indexed donor, address indexed recipient, address indexed token, uint256 amount);
    event BatchDonation(address indexed donor, address indexed token, uint256 totalAmount, uint256 recipientCount);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Donates a specific amount of tokens to a recipient.
     * @param token The address of the ERC20 token to donate.
     * @param recipient The address of the project wallet.
     * @param amount The amount to donate.
     */
    function donate(address token, address recipient, uint256 amount) external {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than 0");

        IERC20(token).safeTransferFrom(msg.sender, recipient, amount);

        emit Donation(msg.sender, recipient, token, amount);
    }

    /**
     * @dev Batch donates tokens to multiple recipients.
     * @param token The address of the ERC20 token to donate.
     * @param recipients Array of recipient addresses.
     * @param amounts Array of amounts for each recipient.
     */
    function batchDonate(address token, address[] calldata recipients, uint256[] calldata amounts) external {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length > 0, "No recipients provided");

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");
            require(amounts[i] > 0, "Amount must be greater than 0");
            
            IERC20(token).safeTransferFrom(msg.sender, recipients[i], amounts[i]);
            totalAmount += amounts[i];
            
            emit Donation(msg.sender, recipients[i], token, amounts[i]);
        }

        emit BatchDonation(msg.sender, token, totalAmount, recipients.length);
    }
}
