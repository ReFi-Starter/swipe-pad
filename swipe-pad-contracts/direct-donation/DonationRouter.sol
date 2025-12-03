cat > contracts/direct-donation/DonationRouter.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title DonationRouter
 * @dev Intermediary contract for direct donations (0% fee)
 */
contract DonationRouter is ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct DonationRecord {
        address donor;
        bytes32 projectId;
        uint256 amount;
        address token;
        uint256 timestamp;
        string memo;
    }

    mapping(bytes32 => DonationRecord[]) public projectDonations;
    mapping(address => DonationRecord[]) public donorHistory;
    
    bytes32[] public projectIds;

    event DonationRouted(
        address indexed donor,
        bytes32 indexed projectId,
        address indexed projectWallet,
        uint256 amount,
        address token,
        string memo
    );

    /**
     * @dev Make direct donation to project
     * @param _projectId Project identifier
     * @param _projectWallet Destination wallet
     * @param _token Token address
     * @param _amount Amount to donate
     * @param _memo Optional message
     */
    function donate(
        bytes32 _projectId,
        address _projectWallet,
        address _token,
        uint256 _amount,
        string calldata _memo
    ) external nonReentrant {
        require(_projectWallet != address(0), "Invalid wallet");
        require(_amount > 0, "Amount must be > 0");

        // Transfer from donor to project wallet
        IERC20(_token).safeTransferFrom(msg.sender, _projectWallet, _amount);

        // Record donation
        DonationRecord memory record = DonationRecord({
            donor: msg.sender,
            projectId: _projectId,
            amount: _amount,
            token: _token,
            timestamp: block.timestamp,
            memo: _memo
        });

        projectDonations[_projectId].push(record);
        donorHistory[msg.sender].push(record);

        emit DonationRouted(
            msg.sender,
            _projectId,
            _projectWallet,
            _amount,
            _token,
            _memo
        );
    }

    /**
     * @dev Get donation statistics for a project
     */
    function getProjectDonations(bytes32 _projectId) external view returns (
        uint256 totalDonations,
        uint256 totalAmount,
        DonationRecord[] memory records
    ) {
        DonationRecord[] storage recs = projectDonations[_projectId];
        totalDonations = recs.length;
        
        for (uint256 i = 0; i < recs.length; i++) {
            totalAmount += recs[i].amount;
        }
        
        return (totalDonations, totalAmount, recs);
    }

    /**
     * @dev Get donor's donation history
     */
    function getDonorHistory(address _donor) external view returns (DonationRecord[] memory) {
        return donorHistory[_donor];
    }
}
EOF
