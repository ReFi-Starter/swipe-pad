cat > contracts/boost/BoostPayment.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title BoostPayment
 * @dev Handles payments for project boosting with ranking logic
 */
contract BoostPayment is ReentrancyGuard, AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct Boost {
        address projectWallet;
        uint256 amount;
        uint256 startTime;
        uint256 duration;
        bool active;
    }

    struct ProjectRanking {
        bytes32 projectId;
        uint256 totalBoosted;
        uint256 lastBoostTime;
    }

    mapping(bytes32 => Boost[]) public projectBoosts; // projectId => Boost[]
    mapping(bytes32 => uint256) public projectBoostScore;
    
    ProjectRanking[] public rankings;
    mapping(bytes32 => uint256) private rankingIndex; // projectId => index in rankings array

    uint256 public constant BOOST_DURATION = 30 days;
    uint256 public constant MIN_BOOST_AMOUNT = 10 * 1e18; // 10 cUSD

    event BoostPurchased(
        bytes32 indexed projectId,
        address indexed projectWallet,
        uint256 amount,
        uint256 boostScore
    );
    
    event BoostExpired(bytes32 indexed projectId, uint256 boostIndex);
    event RankingUpdated(bytes32 indexed projectId, uint256 newScore);

    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Not authorized");
        _;
    }

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Purchase boost for a project
     * @param _projectId Project identifier
     * @param _projectWallet Wallet receiving the boost payment
     * @param _paymentToken Token address (cUSD)
     */
    function purchaseBoost(
        bytes32 _projectId,
        address _projectWallet,
        address _paymentToken,
        uint256 _amount
    ) external nonReentrant {
        require(_amount >= MIN_BOOST_AMOUNT, "Amount too low");
        require(_projectWallet != address(0), "Invalid wallet");

        // Transfer payment to project wallet
        IERC20(_paymentToken).safeTransferFrom(msg.sender, _projectWallet, _amount);

        // Record boost
        Boost memory newBoost = Boost({
            projectWallet: _projectWallet,
            amount: _amount,
            startTime: block.timestamp,
            duration: BOOST_DURATION,
            active: true
        });

        projectBoosts[_projectId].push(newBoost);

        // Update boost score (simple: amount * timeWeight)
        uint256 timeWeight = block.timestamp / 1 days;
        uint256 boostScore = _amount * timeWeight;
        projectBoostScore[_projectId] += boostScore;

        // Update rankings
        _updateRanking(_projectId, projectBoostScore[_projectId]);

        emit BoostPurchased(_projectId, _projectWallet, _amount, projectBoostScore[_projectId]);
    }

    /**
     * @dev Update project rankings
     */
    function _updateRanking(bytes32 _projectId, uint256 _score) internal {
        if (rankingIndex[_projectId] == 0 && rankings.length == 0) {
            // First project
            rankings.push(ProjectRanking(_projectId, _score, block.timestamp));
            rankingIndex[_projectId] = 0;
        } else if (rankingIndex[_projectId] > 0 || 
                  (rankings.length > 0 && rankings[0].projectId == _projectId)) {
            // Update existing
            uint256 idx = rankingIndex[_projectId];
            rankings[idx].totalBoosted = _score;
            rankings[idx].lastBoostTime = block.timestamp;
        } else {
            // New project
            rankings.push(ProjectRanking(_projectId, _score, block.timestamp));
            rankingIndex[_projectId] = rankings.length - 1;
        }

        emit RankingUpdated(_projectId, _score);
    }

    /**
     * @dev Get top boosted projects (returns top 10)
     */
    function getTopProjects() external view returns (ProjectRanking[] memory) {
        uint256 length = rankings.length > 10 ? 10 : rankings.length;
        ProjectRanking[] memory top = new ProjectRanking[](length);
        
        for (uint256 i = 0; i < length; i++) {
            top[i] = rankings[i];
        }
        
        return top;
    }

    /**
     * @dev Clean expired boosts (anyone can call)
     */
    function cleanupExpiredBoosts(bytes32 _projectId) external {
        Boost[] storage boosts = projectBoosts[_projectId];
        
        for (uint256 i = 0; i < boosts.length; i++) {
            if (boosts[i].active && block.timestamp > boosts[i].startTime + boosts[i].duration) {
                boosts[i].active = false;
                emit BoostExpired(_projectId, i);
            }
        }
    }
}
EOF


