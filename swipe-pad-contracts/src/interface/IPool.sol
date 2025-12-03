// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {IERC20} from "./IERC20.sol";

interface IPool {
    enum POOLSTATUS {
        INACTIVE,
        DEPOSIT_ENABLED,
        STARTED,
        ENDED,
        DELETED
    }

    struct PoolAdmin {
        address host;
        uint16 penaltyFeeRate; // 0.01% (1) to 100% (10000)
    }

    struct PoolDetail {
        uint40 timeStart;
        uint40 timeEnd;
        string poolName;
        uint256 depositAmountPerPerson;
    }

    struct PoolBalance {
        uint256 totalDeposits; // total deposit amount (won't reduce, for record)
        uint256 feesAccumulated;
        uint256 feesCollected;
        uint256 balance; // real current balance of pool
        uint256 sponsored; // extra balance from sponsor or participants
    }

    struct ParticipantDetail {
        uint256 deposit; // used for record
        uint256 feesCharged;
        uint120 participantIndex; // store index for easy removal
        uint120 joinedPoolsIndex; // store index for easy removal
        bool refunded;
    }

    struct WinnerDetail {
        uint256 amountWon;
        uint256 amountClaimed;
        uint40 timeWon;
        bool claimed;
        bool forfeited;
        bool alreadyInList; // check for skipping array.push operation
    }

    struct SponsorDetail {
        string name;
        uint256 amount;
    }

    // ----------------------------------------------------------------------------
    // Participant Functions
    // ----------------------------------------------------------------------------

    /**
     * @notice Deposit tokens into a pool
     * @param poolId The pool id
     * @param amount The amount to deposit
     * @dev Pool status must be DEPOSIT_ENABLED
     * @dev Pool must not have started
     * @dev User must not be a participant
     * @dev Amount must be equal to depositAmountPerPerson
     * @dev Emits Deposit event
     */
    function deposit(uint256 poolId, uint256 amount) external returns (bool);

    /**
     * @notice Claim winning from a pool
     * @param poolId The pool id
     * @dev Pool status must be ENDED
     * @dev User must be a winner
     * @dev User must not have claimed
     * @dev Emits WinningClaimed event
     */
    function claimWinning(uint256 poolId, address winner) external;

    /// @notice Claim winnings from multiple pools
    function claimWinnings(uint256[] calldata poolIds, address[] calldata _winners) external;

    /**
     * @notice Self refund from a pool
     * @param poolId The pool id
     * @dev Pool status must not be ENDED
     * @dev User must be a participant
     * @dev User must not have been refunded
     * @dev Emits Refund event
     */
    function selfRefund(uint256 poolId) external;

    // ----------------------------------------------------------------------------
    // Host Functions
    // ----------------------------------------------------------------------------

    /**
     * @notice Create a new pool, current impletation allows only whitelisted address to create pool
     * @param timeStart The start time of the pool
     * @param timeEnd The end time of the pool
     * @param poolName The name of the pool
     * @param depositAmountPerPerson The amount to deposit per person
     * @param penaltyFeeRate The penalty fee rate
     * @param token The token to use for the pool
     * @dev Pool status will be INACTIVE
     * @dev Emits PoolCreated event
     */
    function createPool(
        uint40 timeStart,
        uint40 timeEnd,
        string calldata poolName,
        uint256 depositAmountPerPerson, // Can be 0 in case of sponsored pool
        uint16 penaltyFeeRate, // 10000 = 100%
        address token
    ) external returns (uint256);

    /**
     * @notice Enable deposit for a pool, to prevent frontrunning deposit
     * @param poolId The pool id
     * @dev Only the host can enable deposit
     * @dev Pool status must be INACTIVE
     * @dev Pool status will be changed to DEPOSIT_ENABLED
     * @dev Emits PoolStatusChanged event
     */
    function enableDeposit(uint256 poolId) external;

    /**
     * @notice Change start time of a pool
     * @param poolId The pool id
     * @param timeStart The new start time
     * @dev Only the host can change start time
     * @dev Pool status must not be STARTED
     */
    function changeStartTime(uint256 poolId, uint40 timeStart) external;

    /**
     * @notice Change end time of a pool
     * @param poolId The pool id
     * @param timeEnd The new end time
     * @dev Only the host can change end time
     * @dev Pool status must not be ENDED
     */
    function changeEndTime(uint256 poolId, uint40 timeEnd) external;

    /**
     * @notice Start a pool, to prevent further deposits
     * @param poolId The pool id
     * @dev Only the host can start the pool
     * @dev Pool status must be DEPOSIT_ENABLED
     * @dev Pool status will be changed to STARTED
     * @dev Emits PoolStatusChanged event
     */
    function startPool(uint256 poolId) external;

    /**
     * @notice Re-enable deposit for a pool in case host wants to accept more deposit
     * @param poolId The pool id
     * @dev Only the host can re-enable deposit
     * @dev Pool status must be STARTED
     * @dev Pool status will be changed to DEPOSIT_ENABLED
     * @dev Emits PoolStatusChanged event
     */
    function reenableDeposit(uint256 poolId) external;

    /**
     * @notice End a pool
     * @param poolId The pool id
     * @dev Only the host can end the pool
     * @dev Pool status must be STARTED
     * @dev Pool status will be changed to ENDED
     * @dev Emits PoolStatusChanged event
     */
    function endPool(uint256 poolId) external;

    /**
     * @notice Delete a pool
     * @param poolId The pool id
     * @dev Only the host can delete the pool
     * @dev Pool status will be changed to DELETED
     * @dev Emits PoolStatusChanged event
     */
    function deletePool(uint256 poolId) external;

    /**
     * @notice Set winner of pool
     * @param poolId The pool id
     * @param winner The winner address
     * @param amount The amount to set as winner
     * @dev Only the host can set the winner
     * @dev Winner must be a participant
     * @dev Amount must be greater than or equal to pool balance
     * @dev Emits WinnerSet event
     */
    function setWinner(uint256 poolId, address winner, uint256 amount) external;

    /// @notice Set multiple winners of pool
    function setWinners(uint256 poolId, address[] calldata _winners, uint256[] calldata amounts) external;

    /**
     * @notice Refund a participant
     * @param poolId The pool id
     * @param participant The participant address
     * @dev Only the host can refund a participant
     * @dev Pool status must be STARTED
     * @dev Participant must be a participant
     * @dev Pool balance must be greater than 0
     * @dev Emits Refund event
     */
    function refundParticipant(uint256 poolId, address participant, uint256 amount) external;

    /**
     * @notice Collect fees
     * @param poolId The pool id
     * @dev Only send to host
     * @dev Emits FeesCollected event
     */
    function collectFees(uint256 poolId) external;

    /**
     * @notice Collect remaining balance if any
     * @param poolId The pool id
     * @dev Only send to host
     * @dev Emits RemainingBalanceCollected event
     */
    function collectRemainingBalance(uint256 poolId) external;

    /**
     * @notice Forfeit winnings of a winner back to pool,
     *          used when winner not claim for long time
     * @param poolId The pool id
     * @param winner The winner address
     * @dev Only the host can forfeit winnings
     * @dev Winner must have winnings
     * @dev Winner must not have claimed
     * @dev Emits WinningForfeited event
     */
    function forfeitWinnings(uint256 poolId, address winner) external;

    // ----------------------------------------------------------------------------
    // View Functions
    // ----------------------------------------------------------------------------

    /**
     * @notice Get host of a pool
     * @param poolId The pool id
     */
    function getHost(uint256 poolId) external view returns (address);

    /**
     * @notice Get fees rate of late refund
     * @param poolId The pool id
     * @return penaltyFeeRate The penalty fee rate
     */
    function getPoolFeeRate(uint256 poolId) external view returns (uint16);

    /**
     * @notice Get pool details
     * @param poolId The pool id
     * @return poolDetail The pool details
     */
    function getPoolDetail(uint256 poolId) external view returns (IPool.PoolDetail memory);

    /**
     * @notice Get pool balance
     * @param poolId The pool id
     * @return balance The balance of the pool
     */
    function getPoolBalance(uint256 poolId) external view returns (uint256);

    /**
     * @notice Get sponsored balance of a pool
     * @param poolId The pool id
     * @return sponsorshipAmount The sponsored balance of the pool
     */
    function getSponsorshipAmount(uint256 poolId) external view returns (uint256);

    /**
     * @notice Get fees accumulated in a pool
     * @param poolId The pool id
     * @return feesAccumulated The fees accumulated in the pool
     */
    function getFeesAccumulated(uint256 poolId) external view returns (uint256);

    /**
     * @notice Get fees collected in a pool
     * @param poolId The pool id
     * @return feesCollected The fees collected in the pool
     */
    function getFeesCollected(uint256 poolId) external view returns (uint256);

    /**
     * @notice Get deposit of a participant in a pool
     * @param participant The participant address
     * @param poolId The pool id
     * @return deposit The deposit of the participant
     */
    function getParticipantDeposit(address participant, uint256 poolId) external view returns (uint256);

    /**
     * @notice Get details of a participant in a pool
     * @param participant The participant address
     * @param poolId The pool id
     * @return participantDetail The participant details
     */
    function getParticipantDetail(address participant, uint256 poolId)
        external
        view
        returns (IPool.ParticipantDetail memory);

    /**
     * @notice Get amount won by a winner in a pool
     * @param poolId The pool id
     * @param winner The winner address
     * @return amountWon The amount won by the winner
     */
    function getWinningAmount(uint256 poolId, address winner) external view returns (uint256);

    /**
     * @notice Get details of a winner in a pool
     * @param poolId The pool id
     * @param winner The winner address
     * @return winnerDetail The winner details
     */
    function getWinnerDetail(uint256 poolId, address winner) external view returns (IPool.WinnerDetail memory);

    /**
     * @notice Get created pools by a host
     * @param host The host address
     * @return poolIds The pool ids created by the host
     */
    function getPoolsCreatedBy(address host) external view returns (uint256[] memory);

    /**
     * @notice Get joined pools by a participant
     * @param participant The participant address
     * @return poolIds The pool ids joined by the participant
     */
    function getPoolsJoinedBy(address participant) external view returns (uint256[] memory);

    /**
     * @notice Get participants list of a pool
     * @param poolId The pool id
     * @return participants The list of participants
     */
    function getParticipants(uint256 poolId) external view returns (address[] memory);

    /**
     * @notice Get winners of a pool
     * @param poolId The pool id
     * @return winners The list of winners
     */
    function getWinners(uint256 poolId) external view returns (address[] memory);

    /**
     * @notice Get claimable pools of a winner
     * @param winner The winner address
     * @return claimablePools The list of claimable pools
     * @return isClaimed The list of claim status
     */
    function getClaimablePools(address winner) external view returns (uint256[] memory, bool[] memory);

    /**
     * @notice Get winners details in array of structs of a pool
     * @param poolId The pool id
     * @return winners The list of winners
     * @return _winners The list of winners details
     */
    function getWinnersDetails(uint256 poolId) external view returns (address[] memory, IPool.WinnerDetail[] memory);

    // @dev Get everthing about a pool
    function getAllPoolInfo(uint256 poolId)
        external
        view
        returns (
            IPool.PoolAdmin memory _poolAdmin,
            IPool.PoolDetail memory _poolDetail,
            IPool.PoolBalance memory _poolBalance,
            IPool.POOLSTATUS _poolStatus,
            address _poolToken,
            address[] memory _participants,
            address[] memory _winners
        );

    // ----------------------------------------------------------------------------
    // Admin Functions
    // ----------------------------------------------------------------------------

    function pause() external;
    function unpause() external;
    // function paused() external view returns (bool);
    function emergencyWithdraw(IERC20 token, uint256 amount) external;
    // function pendingOwner() external view returns (address);
    // function transferOwnership(address newOwner) external;
    // function acceptOwnership() external;
    // function supportsInterface(bytes4 interfaceId) external view returns (bool);
    // function hasRole(bytes32 role, address account) external view returns (bool);
    // function getRoleAdmin(bytes32 role) external view returns (bytes32);
    // function grantRole(bytes32 role, address account) external;
    // function revokeRole(bytes32 role, address account) external;
    // function renounceRole(bytes32 role, address callerConfirmation) external;
}
