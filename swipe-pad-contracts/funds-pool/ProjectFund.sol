cat > contracts/funds-pool/ProjectFund.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title ProjectFund
 * @dev Multi-purpose donation pool with multi-sig withdrawal
 */
contract ProjectFund is ReentrancyGuard, AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant FUND_MANAGER_ROLE = keccak256("FUND_MANAGER_ROLE");

    struct Fund {
        string name;
        string purpose;
        address[] signers;
        uint256 requiredSignatures;
        uint256 totalDonations;
        mapping(address => uint256) tokenBalances;
        bool active;
    }

    struct WithdrawalProposal {
        bytes32 fundId;
        address token;
        uint256 amount;
        address destination;
        bytes32 proposalId;
        uint256 approvals;
        mapping(address => bool) hasApproved;
        bool executed;
    }

    mapping(bytes32 => Fund) public funds;
    mapping(bytes32 => WithdrawalProposal) public proposals;
    bytes32[] public fundIds;

    event FundCreated(
        bytes32 indexed fundId,
        string name,
        string purpose,
        address[] signers,
        uint256 requiredSignatures
    );
    
    event DonationToFund(
        bytes32 indexed fundId,
        address indexed donor,
        address indexed token,
        uint256 amount
    );
    
    event WithdrawalProposed(
        bytes32 indexed proposalId,
        bytes32 indexed fundId,
        address token,
        uint256 amount,
        address destination
    );
    
    event WithdrawalApproved(bytes32 indexed proposalId, address indexed approver);
    event WithdrawalExecuted(bytes32 indexed proposalId, address indexed executor);

    modifier onlyFundSigner(bytes32 _fundId) {
        require(_isFundSigner(_fundId, msg.sender), "Not fund signer");
        _;
    }

    modifier onlyFundManager(bytes32 _fundId) {
        require(hasRole(FUND_MANAGER_ROLE, msg.sender), "Not fund manager");
        _;
    }

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev Create a new fund/pool
     */
    function createFund(
        bytes32 _fundId,
        string calldata _name,
        string calldata _purpose,
        address[] calldata _signers,
        uint256 _requiredSignatures
    ) external onlyRole(ADMIN_ROLE) {
        require(_signers.length >= _requiredSignatures, "Invalid signer config");
        require(_requiredSignatures > 0, "Required signatures must be > 0");
        
        Fund storage fund = funds[_fundId];
        fund.name = _name;
        fund.purpose = _purpose;
        fund.signers = _signers;
        fund.requiredSignatures = _requiredSignatures;
        fund.active = true;
        
        fundIds.push(_fundId);
        
        emit FundCreated(_fundId, _name, _purpose, _signers, _requiredSignatures);
    }

    /**
     * @dev Donate to a specific fund
     */
    function donateToFund(
        bytes32 _fundId,
        address _token,
        uint256 _amount
    ) external nonReentrant {
        require(funds[_fundId].active, "Fund inactive");
        require(_amount > 0, "Amount must be > 0");
        
        Fund storage fund = funds[_fundId];
        
        // Transfer tokens
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
        
        // Update balances
        fund.totalDonations += _amount;
        fund.tokenBalances[_token] += _amount;
        
        emit DonationToFund(_fundId, msg.sender, _token, _amount);
    }

    /**
     * @dev Propose withdrawal from fund (requires multi-sig)
     */
    function proposeWithdrawal(
        bytes32 _fundId,
        address _token,
        uint256 _amount,
        address _destination
    ) external onlyFundSigner(_fundId) {
        require(funds[_fundId].active, "Fund inactive");
        require(_destination != address(0), "Invalid destination");
        require(_amount <= funds[_fundId].tokenBalances[_token], "Insufficient balance");
        
        bytes32 proposalId = keccak256(
            abi.encodePacked(_fundId, _token, _amount, _destination, block.timestamp)
        );
        
        WithdrawalProposal storage proposal = proposals[proposalId];
        proposal.fundId = _fundId;
        proposal.token = _token;
        proposal.amount = _amount;
        proposal.destination = _destination;
        proposal.proposalId = proposalId;
        
        emit WithdrawalProposed(proposalId, _fundId, _token, _amount, _destination);
    }

    /**
     * @dev Approve withdrawal proposal
     */
    function approveWithdrawal(bytes32 _proposalId) external onlyFundSigner(proposals[_proposalId].fundId) {
        WithdrawalProposal storage proposal = proposals[_proposalId];
        require(!proposal.executed, "Already executed");
        require(!proposal.hasApproved[msg.sender], "Already approved");
        
        proposal.hasApproved[msg.sender] = true;
        proposal.approvals++;
        
        emit WithdrawalApproved(_proposalId, msg.sender);
    }

    /**
     * @dev Execute withdrawal after enough approvals
     */
    function executeWithdrawal(bytes32 _proposalId) external nonReentrant {
        WithdrawalProposal storage proposal = proposals[_proposalId];
        require(!proposal.executed, "Already executed");
        
        Fund storage fund = funds[proposal.fundId];
        require(proposal.approvals >= fund.requiredSignatures, "Insufficient approvals");
        
        proposal.executed = true;
        fund.tokenBalances[proposal.token] -= proposal.amount;
        
        // Transfer tokens
        IERC20(proposal.token).safeTransfer(proposal.destination, proposal.amount);
        
        emit WithdrawalExecuted(_proposalId, msg.sender);
    }

    /**
     * @dev Check if address is fund signer
     */
    function _isFundSigner(bytes32 _fundId, address _address) internal view returns (bool) {
        address[] memory signers = funds[_fundId].signers;
        for (uint256 i = 0; i < signers.length; i++) {
            if (signers[i] == _address) return true;
        }
        return false;
    }

    /**
     * @dev Get fund details
     */
    function getFund(bytes32 _fundId) external view returns (
        string memory name,
        string memory purpose,
        address[] memory signers,
        uint256 requiredSignatures,
        uint256 totalDonations,
        bool active
    ) {
        Fund storage fund = funds[_fundId];
        return (
            fund.name,
            fund.purpose,
            fund.signers,
            fund.requiredSignatures,
            fund.totalDonations,
            fund.active
        );
    }

    /**
     * @dev Get fund balance for specific token
     */
    function getFundBalance(bytes32 _fundId, address _token) external view returns (uint256) {
        return funds[_fundId].tokenBalances[_token];
    }
}
EOF
