cat > contracts/identity/SelfVerification.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SelfVerification
 * @dev Integrates with Self Protocol for decentralized identity verification
 * @notice This contract acts as a bridge between Self Protocol and SwipePad
 */
contract SelfVerification {
    address public selfProtocolOracle;
    mapping(address => bool) public verifiedUsers;
    mapping(address => bytes32) public userCredentials;
    
    event UserVerified(address indexed user, bytes32 credentialHash);
    event OracleUpdated(address indexed newOracle);

    modifier onlySelfOracle() {
        require(msg.sender == selfProtocolOracle, "Not Self Protocol oracle");
        _;
    }

    constructor(address _selfProtocolOracle) {
        selfProtocolOracle = _selfProtocolOracle;
    }

    /**
     * @dev Verify a user's identity through Self Protocol
     * @param _user Address to verify
     * @param _credentialHash Hash of verified credential
     */
    function verifyUser(address _user, bytes32 _credentialHash) external onlySelfOracle {
        verifiedUsers[_user] = true;
        userCredentials[_user] = _credentialHash;
        emit UserVerified(_user, _credentialHash);
    }

    /**
     * @dev Check if user is verified (used by other SwipePad contracts)
     */
    function isVerified(address _user) external view returns (bool) {
        return verifiedUsers[_user];
    }

    /**
     * @dev Update Self Protocol oracle address
     */
    function setOracle(address _newOracle) external {
        require(msg.sender == selfProtocolOracle, "Unauthorized");
        selfProtocolOracle = _newOracle;
        emit OracleUpdated(_newOracle);
    }

    /**
     * @dev Required check before donation (can be called by other contracts)
     */
    function requireVerification(address _user) external view {
        require(verifiedUsers[_user], "User not verified by Self Protocol");
    }
}
EOF


