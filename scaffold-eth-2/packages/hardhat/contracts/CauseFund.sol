// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CauseVault
 * @dev Holds funds for a specific cause.
 */
contract CauseVault is Ownable {
    using SafeERC20 for IERC20;

    string public name;

    event FundsReceived(address indexed donor, address indexed token, uint256 amount);
    event FundsWithdrawn(address indexed recipient, address indexed token, uint256 amount);

    constructor(string memory _name, address _owner) Ownable(_owner) {
        name = _name;
    }

    /**
     * @dev Allows anyone to deposit funds into the vault.
     * @param token The address of the ERC20 token.
     * @param amount The amount to deposit.
     */
    function deposit(address token, uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        emit FundsReceived(msg.sender, token, amount);
    }

    /**
     * @dev Allows the owner to withdraw funds.
     * @param token The address of the ERC20 token.
     * @param recipient The address to send funds to.
     * @param amount The amount to withdraw.
     */
    function withdraw(address token, address recipient, uint256 amount) external onlyOwner {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be greater than 0");
        IERC20(token).safeTransfer(recipient, amount);
        emit FundsWithdrawn(recipient, token, amount);
    }
}

/**
 * @title CauseFundFactory
 * @dev Deploys and manages CauseVaults.
 */
contract CauseFundFactory is Ownable {
    event CauseVaultCreated(string name, address vaultAddress);

    address[] public vaults;

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Creates a new CauseVault.
     * @param name The name of the cause.
     */
    function createCauseVault(string memory name) external onlyOwner returns (address) {
        CauseVault newVault = new CauseVault(name, msg.sender);
        vaults.push(address(newVault));
        emit CauseVaultCreated(name, address(newVault));
        return address(newVault);
    }

    function getVaults() external view returns (address[] memory) {
        return vaults;
    }
}
