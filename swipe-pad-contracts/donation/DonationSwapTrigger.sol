cat > contracts/donation/DonationSwapTrigger.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title DonationSwapTrigger
 * @dev Automatically triggers donations after N swaps to project wallets
 */
contract DonationSwapTrigger is ReentrancyGuard, AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant SWIPEPAD_ROLE = keccak256("SWIPEPAD_ROLE");

    struct Project {
        address wallet;
        uint256 swapCount;
        uint256 lastDonationBlock;
        bool active;
    }

    struct DonationConfig {
        uint256 swapThreshold; // 20, 30, or 40 swaps
        uint256 donationAmount; // Fixed cUSD amount
        address cUSDAddress;
    }

    mapping(bytes32 => Project) public projects; // projectId => Project
    mapping(bytes32 => DonationConfig) public donationConfigs;
    
    bytes32[] public projectIds;
    
    event DonationTriggered(
        bytes32 indexed projectId,
        address indexed projectWallet,
        uint256 amount,
        uint256 swapCount
    );
    
    event ProjectUpdated(bytes32 indexed projectId, address wallet, bool active);
    event DonationConfigUpdated(bytes32 indexed projectId, uint256 threshold, uint256 amount);

    modifier onlySwipePad() {
        require(hasRole(SWIPEPAD_ROLE, msg.sender), "Not authorized");
        _;
    }

    constructor(address _cUSD) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Register or update a project
     */
    function setProject(
        bytes32 _projectId,
        address _wallet,
        uint256 _swapThreshold,
        uint256 _donationAmount
    ) external onlyRole(ADMIN_ROLE) {
        require(_wallet != address(0), "Invalid wallet");
        
        projects[_projectId] = Project({
            wallet: _wallet,
            swapCount: 0,
            lastDonationBlock: 0,
            active: true
        });

        donationConfigs[_projectId] = DonationConfig({
            swapThreshold: _swapThreshold,
            donationAmount: _donationAmount,
            cUSDAddress: address(0) // Set via separate function
        });

        projectIds.push(_projectId);
        emit ProjectUpdated(_projectId, _wallet, true);
    }

    /**
     * @dev Called by SwipePad after each swap
     */
    function recordSwap(bytes32 _projectId) external onlySwipePad nonReentrant {
        Project storage project = projects[_projectId];
        require(project.active, "Project inactive");
        
        project.swapCount++;
        
        DonationConfig memory config = donationConfigs[_projectId];
        
        // Check if threshold reached
        if (project.swapCount >= config.swapThreshold) {
            _executeDonation(_projectId, project, config);
        }
    }

    /**
     * @dev Execute donation to project wallet
     */
    function _executeDonation(
        bytes32 _projectId,
        Project storage _project,
        DonationConfig memory _config
    ) internal {
        // Reset counter
        _project.swapCount = 0;
        _project.lastDonationBlock = block.number;
        
        // Transfer cUSD to project wallet
        IERC20(_config.cUSDAddress).safeTransfer(_project.wallet, _config.donationAmount);
        
        emit DonationTriggered(
            _projectId,
            _project.wallet,
            _config.donationAmount,
            _config.swapThreshold
        );
    }

    /**
     * @dev Manual trigger for admin
     */
    function forceDonation(bytes32 _projectId) external onlyRole(ADMIN_ROLE) nonReentrant {
        Project storage project = projects[_projectId];
        require(project.active, "Project inactive");
        
        _executeDonation(_projectId, project, donationConfigs[_projectId]);
    }

    /**
     * @dev Get project stats
     */
    function getProjectStats(bytes32 _projectId) external view returns (
        address wallet,
        uint256 swapCount,
        uint256 lastDonationBlock,
        bool active,
        uint256 threshold,
        uint256 donationAmount
    ) {
        Project memory p = projects[_projectId];
        DonationConfig memory d = donationConfigs[_projectId];
        
        return (p.wallet, p.swapCount, p.lastDonationBlock, p.active, d.swapThreshold, d.donationAmount);
    }
}
EOF

