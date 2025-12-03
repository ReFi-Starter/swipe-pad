// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

/// @title Pool - A contract for managing time-based deposit pools with winners
/// @author Your Name
/// @notice Manages pools where users deposit a fixed amount, a host selects winners, and penalties may apply for early withdrawal
/// @dev Uses Ownable2Step, AccessControl, Pausable for control and security
/// @custom:security-contact security@yourplatform.com

/// Interfaces
import {IPool} from "./interface/IPool.sol";
import {IERC20} from "./interface/IERC20.sol";

/// Libraries
import {FEES_PRECISION, FORFEIT_WINNINGS_TIMELOCK} from "./library/ConstantsLib.sol";
import {EventsLib} from "./library/EventsLib.sol";
import {ErrorsLib} from "./library/ErrorsLib.sol";
import {PoolAdminLib} from "./library/PoolAdminLib.sol";
import {PoolDetailLib} from "./library/PoolDetailLib.sol";
import {PoolBalanceLib} from "./library/PoolBalanceLib.sol";
import {ParticipantDetailLib} from "./library/ParticipantDetailLib.sol";
import {WinnerDetailLib} from "./library/WinnerDetailLib.sol";
import {UtilsLib} from "./library/UtilsLib.sol";
import {SafeTransferLib} from "./library/SafeTransferLib.sol";
import {SponsorDetailLib} from "./library/SponsorDetailLib.sol";

/// Dependencies
import {Ownable2Step} from "./dependency/Ownable2Step.sol";
import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @notice Main contract for deposit pools
/// @dev Handles participant deposits, winner selection, refunds, fees, and sponsorship
contract Pool is IPool, Ownable2Step, AccessControl, Pausable {
    using SafeTransferLib for IERC20;
    using PoolAdminLib for IPool.PoolAdmin;
    using PoolDetailLib for IPool.PoolDetail;
    using PoolBalanceLib for IPool.PoolBalance;
    using ParticipantDetailLib for IPool.ParticipantDetail;
    using WinnerDetailLib for IPool.WinnerDetail;
    using SponsorDetailLib for IPool.SponsorDetail;

    /// @notice Latest pool ID (starts from 1, 0 is invalid)
    uint256 public latestPoolId;
    
    /// @notice Role identifier for whitelisted pool hosts
    /// @dev Keccak256 hash of "WHITELISTED_HOST"
    bytes32 public constant WHITELISTED_HOST = keccak256("WHITELISTED_HOST");
    
    /// @notice Role identifier for whitelisted pool sponsors
    /// @dev Keccak256 hash of "WHITELISTED_SPONSOR"
    bytes32 public constant WHITELISTED_SPONSOR = keccak256("WHITELISTED_SPONSOR");

    /// @notice Mapping of pool ID to admin details
    mapping(uint256 => PoolAdmin) public poolAdmin;
    
    /// @notice Mapping of pool ID to pool details
    mapping(uint256 => PoolDetail) public poolDetail;
    
    /// @notice Mapping of pool ID to the pool's token
    mapping(uint256 => IERC20) public poolToken;
    
    /// @notice Mapping of pool ID to balance information
    mapping(uint256 => PoolBalance) public poolBalance;
    
    /// @notice Mapping of pool ID to current status
    mapping(uint256 => POOLSTATUS) public poolStatus;
    
    /// @notice Mapping of pool ID to list of participant addresses
    mapping(uint256 => address[]) public participants;
    
    /// @notice Mapping of pool ID to list of winner addresses
    mapping(uint256 => address[]) public winners;

    /// @notice Mapping of host address to their created pool IDs
    mapping(address => uint256[]) public createdPools;
    
    /// @notice Mapping to check if an address is the host for a pool
    mapping(address => mapping(uint256 poolId => bool)) public isHost;

    /// @notice Mapping of participant address to pools they've joined
    mapping(address => uint256[]) public joinedPools;
    
    /// @notice Mapping to check if an address is a participant in a pool
    mapping(address => mapping(uint256 poolId => bool)) public isParticipant;
    
    /// @notice Mapping of participant details for each pool
    mapping(address => mapping(uint256 poolId => ParticipantDetail)) public participantDetail;
    
    /// @notice Mapping of winner details for each pool
    mapping(address => mapping(uint256 poolId => WinnerDetail)) public winnerDetail;
    
    /// @notice Mapping of winner address to pool IDs they can claim from
    mapping(address => uint256[]) public claimablePools;

    /// @notice Mapping of sponsor details for each pool
    mapping(address => mapping(uint256 poolId => SponsorDetail)) public sponsorDetail;
    
    /// @notice Mapping of pool ID to list of sponsor addresses
    mapping(uint256 => address[]) public sponsors;

    /// @notice Ensures only the pool host can call the function
    /// @param poolId The ID of the pool
    modifier onlyHost(uint256 poolId) {
        if (!isHost[msg.sender][poolId]) {
            revert ErrorsLib.Unauthorized(msg.sender);
        }
        _;
    }

    /// @notice Initializes the contract, granting admin role to the deployer
    constructor() Ownable2Step(msg.sender) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // ----------------------------------------------------------------------------
    // Participant Functions
    // ----------------------------------------------------------------------------

    /// @notice Deposit `amount` tokens into pool ID `poolId`
    /// @dev Requires pool status DEPOSIT_ENABLED, user not already participant, and `amount` >= deposit amount. Extra is treated as donation.
    /// @param poolId The ID of the pool to deposit into
    /// @param amount The amount of tokens to deposit (must meet or exceed required deposit)
    /// @return success True if deposit was successful
    /// @custom:event Deposit Emitted on successful deposit
    /// @custom:event ExtraDeposit Emitted if `amount` exceeds required deposit
    /// @custom:event ParticipantRejoined Emitted if a previously refunded/claimed participant rejoins
    function deposit(uint256 poolId, uint256 amount) external whenNotPaused returns (bool) {
        require(poolStatus[poolId] == POOLSTATUS.DEPOSIT_ENABLED, "Deposit not enabled");
        require(!isParticipant[msg.sender][poolId], "Already in pool");
        uint256 amountPerPerson = poolDetail[poolId].getDepositAmountPerPerson();
        require(amount >= amountPerPerson, "Incorrect amount");

        // Excess as extra donation
        if (amount > amountPerPerson) {
            poolBalance[poolId].sponsored += amount - amountPerPerson;
            emit EventsLib.ExtraDeposit(poolId, msg.sender, amount - amountPerPerson);
        }
        // Update pool details
        poolBalance[poolId].totalDeposits += amount;
        poolBalance[poolId].balance += amount;
        participantDetail[msg.sender][poolId].setParticipantIndex(participants[poolId].length);
        participants[poolId].push(msg.sender);

        // Update participant details
        participantDetail[msg.sender][poolId].setJoinedPoolsIndex(joinedPools[msg.sender].length);
        joinedPools[msg.sender].push(poolId);
        isParticipant[msg.sender][poolId] = true;
        participantDetail[msg.sender][poolId].deposit = amountPerPerson;

        // Edge case for rejoin
        if (participantDetail[msg.sender][poolId].isRefunded() || winnerDetail[msg.sender][poolId].isClaimed()) {
            participantDetail[msg.sender][poolId].refunded = false;
            winnerDetail[msg.sender][poolId].claimed = false;
            emit EventsLib.ParticipantRejoined(poolId, msg.sender);
        }

        // Transfer tokens from user to pool
        poolToken[poolId].safeTransferFrom(msg.sender, address(this), amount);

        emit EventsLib.Deposit(poolId, msg.sender, amount);
        return true;
    }

    /// @notice Claim winnings for `winner` from pool ID `poolId`
    /// @dev Transfers the available winnings to the `winner`. Can be called by anyone if winnings are available and not claimed.
    /// @param poolId The ID of the pool
    /// @param winner The address of the winner to claim for
    /// @custom:event WinningsClaimed Emitted when winnings are successfully claimed
    function claimWinning(uint256 poolId, address winner) public whenNotPaused {
        require(!winnerDetail[winner][poolId].isClaimed(), "Already claimed");

        uint256 amount = winnerDetail[winner][poolId].getAmountWon() - winnerDetail[winner][poolId].getAmountClaimed();
        require(amount > 0, "No winnings");

        winnerDetail[winner][poolId].claimed = true;
        winnerDetail[winner][poolId].amountClaimed += amount;
        poolToken[poolId].safeTransfer(winner, amount);

        emit EventsLib.WinningsClaimed(poolId, winner, amount);
    }

    /// @notice Claim winnings for multiple winners across specified pools
    /// @dev Convenience function to batch claim winnings.
    /// @param poolIds Array of pool IDs to claim from
    /// @param _winners Array of winner addresses corresponding to `poolIds`
    function claimWinnings(uint256[] calldata poolIds, address[] calldata _winners) external whenNotPaused {
        require(poolIds.length == poolIds.length, "Invalid input");
        for (uint256 i; i < poolIds.length; i++) {
            claimWinning(poolIds[i], _winners[i]);
        }
    }

    /// @notice Withdraw your deposit from pool ID `poolId` before it starts
    /// @dev Requires pool not STARTED or ENDED. Fees may apply if called close to start time.
    /// @param poolId The ID of the pool to withdraw from
    /// @custom:event Refund Emitted on successful refund
    /// @custom:event FeesCharged Emitted if penalty fees were applied
    function selfRefund(uint256 poolId) external whenNotPaused {
        require(poolStatus[poolId] != POOLSTATUS.STARTED, "Pool started");
        require(poolStatus[poolId] != POOLSTATUS.ENDED, "Pool ended");
        require(!participantDetail[msg.sender][poolId].isRefunded(), "Already refunded");
        require(isParticipant[msg.sender][poolId], "Not a participant");
        require(winnerDetail[msg.sender][poolId].getAmountWon() == 0, "Winner cannot do refund");

        // Apply fees if pool is not deleted
        if (poolStatus[poolId] != POOLSTATUS.DELETED) {
            _applyFees(poolId);
        }
        _refund(poolId, msg.sender, 0); // 0 means use default deposit amount after fees
    }

    // ----------------------------------------------------------------------------
    // Sponsor Functions
    // ----------------------------------------------------------------------------

    /// @notice Add `amount` sponsorship tokens to pool ID `poolId` as `name`
    /// @dev Only callable by whitelisted sponsors. Requires pool status INACTIVE or DEPOSIT_ENABLED.
    /// @param name The name of the sponsor
    /// @param poolId The ID of the pool to sponsor
    /// @param amount The amount of tokens to sponsor
    /// @custom:event SponsorshipAdded Emitted when sponsorship is added
    function sponsor(string calldata name, uint256 poolId, uint256 amount)
        external
        onlyRole(WHITELISTED_SPONSOR)
        whenNotPaused
    {
        require(
            poolStatus[poolId] == POOLSTATUS.INACTIVE || poolStatus[poolId] == POOLSTATUS.DEPOSIT_ENABLED,
            "Pool started"
        );
        require(poolAdmin[poolId].host != address(0), "Pool not created");
        require(amount > 0, "Invalid amount");

        // Update pool details
        poolBalance[poolId].totalDeposits += amount;
        poolBalance[poolId].balance += amount;
        poolBalance[poolId].sponsored += amount;

        // Update sponsor details
        if (sponsorDetail[msg.sender][poolId].amount != 0) {
            sponsorDetail[msg.sender][poolId].amount += amount;
        } else {
            sponsorDetail[msg.sender][poolId].init(name, amount);
            sponsors[poolId].push(msg.sender);
        }

        // Transfer tokens from user to pool
        poolToken[poolId].safeTransferFrom(msg.sender, address(this), amount);

        emit EventsLib.SponsorshipAdded(poolId, msg.sender, amount);
    }

    // ----------------------------------------------------------------------------
    // Host Functions
    // ----------------------------------------------------------------------------

    /// @notice Create a new pool named `poolName` with deposit amount `depositAmountPerPerson`
    /// @dev Only callable by whitelisted hosts. Sets initial parameters and assigns `msg.sender` as host.
    /// @param timeStart Pool deposit start timestamp
    /// @param timeEnd Pool deposit end timestamp
    /// @param poolName Name of the pool
    /// @param depositAmountPerPerson Required deposit amount per participant (can be 0 for sponsored pools)
    /// @param penaltyFeeRate Fee rate (basis points) for early withdrawal (e.g., 100 = 1%)
    /// @param token Address of the ERC20 token used for the pool
    /// @return poolId The ID of the newly created pool
    /// @custom:event PoolCreated Emitted when pool is created
    function createPool(
        uint40 timeStart,
        uint40 timeEnd,
        string calldata poolName,
        uint256 depositAmountPerPerson,
        uint16 penaltyFeeRate,
        address token
    ) external onlyRole(WHITELISTED_HOST) whenNotPaused returns (uint256) {
        require(timeStart < timeEnd, "Invalid timing");
        require(penaltyFeeRate <= FEES_PRECISION, "Invalid fees rate");
        require(UtilsLib.isContract(token), "Token not contract");

        // Increment pool id
        latestPoolId++;

        // Pool details
        poolDetail[latestPoolId].setTimeStart(timeStart);
        poolDetail[latestPoolId].setTimeEnd(timeEnd);
        poolDetail[latestPoolId].setPoolName(poolName);
        poolDetail[latestPoolId].setDepositAmountPerPerson(depositAmountPerPerson);

        // Pool admin details
        poolAdmin[latestPoolId].setPenaltyFeeRate(penaltyFeeRate);
        poolAdmin[latestPoolId].setHost(msg.sender);
        isHost[msg.sender][latestPoolId] = true;
        createdPools[msg.sender].push(latestPoolId);

        // Pool token
        poolToken[latestPoolId] = IERC20(token);

        emit EventsLib.PoolCreated(latestPoolId, msg.sender, poolName, depositAmountPerPerson, penaltyFeeRate, token);
        return latestPoolId;
    }

    /// @notice Enable deposits for pool ID `poolId`
    /// @dev Changes status from INACTIVE to DEPOSIT_ENABLED. Only callable by host.
    /// @param poolId The ID of the pool
    /// @custom:event PoolStatusChanged Emitted (status -> DEPOSIT_ENABLED)
    function enableDeposit(uint256 poolId) external onlyHost(poolId) whenNotPaused {
        require(poolStatus[poolId] == POOLSTATUS.INACTIVE, "Pool already active");

        poolStatus[poolId] = POOLSTATUS.DEPOSIT_ENABLED;
        emit EventsLib.PoolStatusChanged(poolId, POOLSTATUS.DEPOSIT_ENABLED);
    }

    /// @notice Change the name of pool ID `poolId` to `poolName`
    /// @dev Only callable by host.
    /// @param poolId The ID of the pool
    /// @param poolName The new name for the pool
    /// @custom:event PoolNameChanged Emitted when name is changed
    function changePoolName(uint256 poolId, string calldata poolName) external onlyHost(poolId) whenNotPaused {
        poolDetail[poolId].setPoolName(poolName);
        emit EventsLib.PoolNameChanged(poolId, poolName);
    }

    /// @notice Change the start time of pool ID `poolId` to `timeStart`
    /// @dev Only callable by host before the pool has started.
    /// @param poolId The ID of the pool
    /// @param timeStart The new start timestamp
    /// @custom:event PoolStartTimeChanged Emitted when start time is changed
    function changeStartTime(uint256 poolId, uint40 timeStart) external onlyHost(poolId) whenNotPaused {
        require(
            poolStatus[poolId] == POOLSTATUS.INACTIVE || poolStatus[poolId] == POOLSTATUS.DEPOSIT_ENABLED,
            "Pool already started"
        );
        poolDetail[poolId].setTimeStart(timeStart);

        emit EventsLib.PoolStartTimeChanged(poolId, timeStart);
    }

    /// @notice Change the end time of pool ID `poolId` to `timeEnd`
    /// @dev Only callable by host before the pool has ended.
    /// @param poolId The ID of the pool
    /// @param timeEnd The new end timestamp
    /// @custom:event PoolEndTimeChanged Emitted when end time is changed
    function changeEndTime(uint256 poolId, uint40 timeEnd) external onlyHost(poolId) whenNotPaused {
        require(
            poolStatus[poolId] != POOLSTATUS.ENDED && poolStatus[poolId] != POOLSTATUS.DELETED, "Pool already ended"
        );
        poolDetail[poolId].setTimeEnd(timeEnd);

        emit EventsLib.PoolEndTimeChanged(poolId, timeEnd);
    }

    /// @notice Start pool ID `poolId`, preventing further deposits
    /// @dev Changes status from DEPOSIT_ENABLED to STARTED. Updates actual start time. Only callable by host.
    /// @param poolId The ID of the pool
    /// @custom:event PoolStatusChanged Emitted (status -> STARTED)
    function startPool(uint256 poolId) external onlyHost(poolId) whenNotPaused {
        require(poolStatus[poolId] == POOLSTATUS.DEPOSIT_ENABLED, "Deposit not enabled yet");

        poolStatus[poolId] = POOLSTATUS.STARTED;
        poolDetail[poolId].setTimeStart(uint40(block.timestamp)); // update actual start time
        emit EventsLib.PoolStatusChanged(poolId, POOLSTATUS.STARTED);
    }

    /// @notice Re-enable deposits for pool ID `poolId` after starting
    /// @dev Changes status from STARTED back to DEPOSIT_ENABLED. Only callable by host.
    /// @param poolId The ID of the pool
    /// @custom:event PoolStatusChanged Emitted (status -> DEPOSIT_ENABLED)
    function reenableDeposit(uint256 poolId) external onlyHost(poolId) whenNotPaused {
        require(poolStatus[poolId] == POOLSTATUS.STARTED, "Pool not started");

        poolStatus[poolId] = POOLSTATUS.DEPOSIT_ENABLED;
        emit EventsLib.PoolStatusChanged(poolId, POOLSTATUS.DEPOSIT_ENABLED);
    }

    /// @notice End pool ID `poolId`, allowing winner selection and claims
    /// @dev Changes status from STARTED to ENDED. Updates actual end time. Only callable by host.
    /// @param poolId The ID of the pool
    /// @custom:event PoolStatusChanged Emitted (status -> ENDED)
    function endPool(uint256 poolId) external onlyHost(poolId) whenNotPaused {
        require(poolStatus[poolId] == POOLSTATUS.STARTED, "Pool not started");

        poolStatus[poolId] = POOLSTATUS.ENDED;
        poolDetail[poolId].setTimeEnd(uint40(block.timestamp)); // update actual end time
        emit EventsLib.PoolStatusChanged(poolId, POOLSTATUS.ENDED);
    }

    /// @notice Mark pool ID `poolId` as deleted
    /// @dev Allows participants to refund without penalty. Only callable by host.
    /// @param poolId The ID of the pool
    /// @custom:event PoolStatusChanged Emitted (status -> DELETED)
    function deletePool(uint256 poolId) external onlyHost(poolId) whenNotPaused {
        poolStatus[poolId] = POOLSTATUS.DELETED;

        emit EventsLib.PoolStatusChanged(poolId, POOLSTATUS.DELETED);
    }

    /// @notice Designate `winner` to receive `amount` tokens from pool ID `poolId`
    /// @dev Requires pool not INACTIVE or DELETED. `winner` must be participant. Deducts `amount` from pool balance.
    /// @param poolId The ID of the pool
    /// @param winner The address of the participant designated as a winner
    /// @param amount The amount of tokens awarded to the winner
    /// @custom:event WinnerSet Emitted when a winner amount is designated
    function setWinner(uint256 poolId, address winner, uint256 amount) public onlyHost(poolId) whenNotPaused {
        require(
            poolStatus[poolId] != POOLSTATUS.INACTIVE && poolStatus[poolId] != POOLSTATUS.DELETED, "Pool status invalid"
        );
        require(isParticipant[winner][poolId], "Not a participant");
        require(amount <= poolBalance[poolId].getBalance(), "Not enough balance");
        require(!winnerDetail[winner][poolId].isClaimed(), "Already claimed");

        // Update pool balance
        poolBalance[poolId].balance -= amount;

        // Update winner details
        winnerDetail[winner][poolId].addAmountWon(amount);

        // Prevent duplicate entry in winners array
        if (!winnerDetail[winner][poolId].alreadyInList) {
            winners[poolId].push(winner);
            claimablePools[winner].push(poolId);
            winnerDetail[winner][poolId].alreadyInList = true;
        }
        emit EventsLib.WinnerSet(poolId, winner, amount);
    }

    /// @notice Designate multiple winners `_winners` with corresponding `amounts` for pool ID `poolId`
    /// @dev Convenience function to batch designate winners.
    /// @param poolId The ID of the pool
    /// @param _winners Array of winner addresses
    /// @param amounts Array of corresponding amounts to award
    function setWinners(uint256 poolId, address[] calldata _winners, uint256[] calldata amounts)
        external
        onlyHost(poolId)
        whenNotPaused
    {
        require(_winners.length == amounts.length, "Invalid input");

        for (uint256 i; i < _winners.length; i++) {
            setWinner(poolId, _winners[i], amounts[i]);
        }
    }

    /// @notice Refund `amount` tokens to `participant` from pool ID `poolId`
    /// @dev Only callable by host. Requires pool not ENDED. Use `amount = 0` to refund deposit minus fees.
    /// @param poolId The ID of the pool
    /// @param participant The address of the participant to refund
    /// @param amount The specific amount to refund (or 0 for default deposit minus fees)
    /// @custom:event Refund Emitted on successful refund
    function refundParticipant(uint256 poolId, address participant, uint256 amount)
        external
        onlyHost(poolId)
        whenNotPaused
    {
        require(poolStatus[poolId] != POOLSTATUS.ENDED, "Pool is not ended");
        require(participantDetail[participant][poolId].isRefunded() == false, "Already refunded");
        require(isParticipant[participant][poolId], "Not a participant");
        require(poolBalance[poolId].getBalance() > 0, "Pool has no balance");

        _refund(poolId, participant, amount);
    }

    /// @notice Collect accumulated penalty fees from pool ID `poolId`
    /// @dev Transfers available fees to the caller (host).
    /// @param poolId The ID of the pool
    /// @custom:event FeesCollected Emitted when fees are collected
    function collectFees(uint256 poolId) external whenNotPaused {
        // Transfer fees to host
        uint256 fees = poolBalance[poolId].getFeesAccumulated() - poolBalance[poolId].getFeesCollected();
        require(fees != 0, "No fees to collect");
        poolBalance[poolId].feesCollected += fees;

        address host = poolAdmin[poolId].getHost();
        poolToken[poolId].safeTransfer(host, fees);

        emit EventsLib.FeesCollected(poolId, host, fees);
    }

    /// @notice Collect any remaining balance in pool ID `poolId` after it has ended/deleted
    /// @dev Transfers remaining balance to the caller (host).
    /// @param poolId The ID of the pool
    /// @custom:event RemainingBalanceCollected Emitted when balance is collected
    function collectRemainingBalance(uint256 poolId) external onlyHost(poolId) whenNotPaused {
        require(poolStatus[poolId] == POOLSTATUS.ENDED || poolStatus[poolId] == POOLSTATUS.DELETED, "Pool not ended");
        uint256 amount = poolBalance[poolId].getBalance();
        require(amount > 0, "Nothing to withdraw");

        poolBalance[poolId].balance = 0;
        address host = poolAdmin[poolId].getHost();
        poolToken[poolId].safeTransfer(host, amount);

        emit EventsLib.RemainingBalanceCollected(poolId, host, amount);
    }

    /// @notice Forfeit unclaimed winnings for `winner` in pool ID `poolId` back to the pool balance
    /// @dev Only callable by host after a timelock period past the pool end time.
    /// @param poolId The ID of the pool
    /// @param winner The address of the winner whose winnings are forfeited
    /// @custom:event WinningForfeited Emitted when winnings are forfeited
    function forfeitWinnings(uint256 poolId, address winner) external onlyHost(poolId) whenNotPaused {
        require(poolStatus[poolId] == POOLSTATUS.ENDED, "Pool not ended");
        require(block.timestamp > poolDetail[poolId].getTimeEnd() + FORFEIT_WINNINGS_TIMELOCK, "Still in timelock");
        require(!winnerDetail[winner][poolId].isClaimed(), "Already claimed");

        uint256 amount = winnerDetail[winner][poolId].getAmountWon();
        require(amount > 0, "No winnings");

        winnerDetail[winner][poolId].forfeited = true;
        winnerDetail[winner][poolId].amountWon = 0;
        poolBalance[poolId].balance += amount;

        emit EventsLib.WinningForfeited(poolId, winner, amount);
    }

    // ----------------------------------------------------------------------------
    // View Functions
    // ----------------------------------------------------------------------------

    /// @notice Get the host address for pool ID `poolId`
    /// @param poolId The ID of the pool
    /// @return Host address
    function getHost(uint256 poolId) external view returns (address) {
        return poolAdmin[poolId].getHost();
    }

    /// @notice Get all sponsor addresses for pool ID `poolId`
    /// @param poolId The ID of the pool
    /// @return Array of sponsor addresses
    function getSponsors(uint256 poolId) external view returns (address[] memory) {
        return sponsors[poolId];
    }

    /// @notice Get details for sponsor `_sponsor` in pool ID `poolId`
    /// @param poolId The ID of the pool
    /// @param _sponsor The sponsor address
    /// @return Sponsor details (name, amount sponsored)
    function getSponsorDetail(uint256 poolId, address _sponsor) external view returns (IPool.SponsorDetail memory) {
        return sponsorDetail[_sponsor][poolId];
    }

    /// @notice Get the penalty fee rate (basis points) for pool ID `poolId`
    /// @param poolId The ID of the pool
    /// @return penaltyFeeRate The penalty fee rate (e.g., 100 = 1%)
    function getPoolFeeRate(uint256 poolId) public view returns (uint16) {
        return poolAdmin[poolId].getPenaltyFeeRate();
    }

    /// @notice Get details for pool ID `poolId`
    /// @param poolId The ID of the pool
    /// @return poolDetail Struct containing pool details (times, name, deposit amount)
    function getPoolDetail(uint256 poolId) external view returns (IPool.PoolDetail memory) {
        return poolDetail[poolId];
    }

    /// @notice Get the current token balance for pool ID `poolId`
    /// @param poolId The ID of the pool
    /// @return balance The current token balance of the pool
    function getPoolBalance(uint256 poolId) external view returns (uint256) {
        return poolBalance[poolId].getBalance();
    }

    /// @notice Get the total sponsored amount for pool ID `poolId`
    /// @param poolId The ID of the pool
    /// @return sponsorshipAmount The total amount sponsored
    function getSponsorshipAmount(uint256 poolId) external view returns (uint256) {
        return poolBalance[poolId].getSponsorshipAmount();
    }

    /// @notice Get the total penalty fees accumulated in pool ID `poolId`
    /// @param poolId The ID of the pool
    /// @return feesAccumulated The total fees accumulated
    function getFeesAccumulated(uint256 poolId) external view returns (uint256) {
        return poolBalance[poolId].getFeesAccumulated();
    }

    /// @notice Get the amount of penalty fees already collected by the host for pool ID `poolId`
    /// @param poolId The ID of the pool
    /// @return feesCollected The amount of fees collected
    function getFeesCollected(uint256 poolId) external view returns (uint256) {
        return poolBalance[poolId].getFeesCollected();
    }

    /// @notice Get the deposit amount for `participant` in pool ID `poolId`
    /// @param participant The participant address
    /// @param poolId The ID of the pool
    /// @return deposit The participant's deposit amount
    function getParticipantDeposit(address participant, uint256 poolId) public view returns (uint256) {
        return ParticipantDetailLib.getDeposit(participantDetail, participant, poolId);
    }

    /// @notice Get details for `participant` in pool ID `poolId`
    /// @param participant The participant address
    /// @param poolId The ID of the pool
    /// @return participantDetail Struct containing participant details (deposit, fees, status)
    function getParticipantDetail(address participant, uint256 poolId)
        public
        view
        returns (IPool.ParticipantDetail memory)
    {
        return participantDetail[participant][poolId];
    }

    /// @notice Get the total amount designated as winnings for `winner` in pool ID `poolId`
    /// @param poolId The ID of the pool
    /// @param winner The winner address
    /// @return amountWon The total amount awarded
    function getWinningAmount(uint256 poolId, address winner) external view returns (uint256) {
        return winnerDetail[winner][poolId].getAmountWon();
    }

    /// @notice Get details for `winner` in pool ID `poolId`
    /// @param poolId The ID of the pool
    /// @param winner The winner address
    /// @return winnerDetail Struct containing winner details (amount won, claimed, forfeited)
    function getWinnerDetail(uint256 poolId, address winner) external view returns (IPool.WinnerDetail memory) {
        return winnerDetail[winner][poolId];
    }

    /// @notice Get all pool IDs created by `host`
    /// @param host The host address
    /// @return poolIds Array of pool IDs created by the host
    function getPoolsCreatedBy(address host) external view returns (uint256[] memory) {
        return createdPools[host];
    }

    /// @notice Get all pool IDs joined by `participant`
    /// @param participant The participant address
    /// @return poolIds Array of pool IDs joined by the participant
    function getPoolsJoinedBy(address participant) external view returns (uint256[] memory) {
        return joinedPools[participant];
    }

    /// @notice Get all participant addresses for pool ID `poolId`
    /// @param poolId The ID of the pool
    /// @return participants Array of participant addresses
    function getParticipants(uint256 poolId) external view returns (address[] memory) {
        return participants[poolId];
    }

    /// @notice Get all winner addresses for pool ID `poolId`
    /// @param poolId The ID of the pool
    /// @return winners Array of winner addresses
    function getWinners(uint256 poolId) external view returns (address[] memory) {
        return winners[poolId];
    }

    /// @notice Get all pool IDs `winner` can claim winnings from
    /// @param winner The winner address
    /// @return claimablePools Array of pool IDs with claimable winnings
    /// @return isClaimed Array indicating if winnings have been claimed for each pool ID
    function getClaimablePools(address winner) external view returns (uint256[] memory, bool[] memory) {
        bool[] memory isClaimed = new bool[](claimablePools[winner].length);
        for (uint256 i; i < claimablePools[winner].length; i++) {
            isClaimed[i] = winnerDetail[winner][claimablePools[winner][i]].isClaimed();
        }
        return (claimablePools[winner], isClaimed);
    }

    /// @notice Get details for all winners in pool ID `poolId`
    /// @param poolId The ID of the pool
    /// @return winners Array of winner addresses
    /// @return _winners Array of corresponding WinnerDetail structs
    function getWinnersDetails(uint256 poolId) external view returns (address[] memory, IPool.WinnerDetail[] memory) {
        IPool.WinnerDetail[] memory _winners = new IPool.WinnerDetail[](winners[poolId].length);
        for (uint256 i; i < winners[poolId].length; i++) {
            _winners[i] = winnerDetail[winners[poolId][i]][poolId];
        }
        return (winners[poolId], _winners);
    }

    /// @notice Get all core information for pool ID `poolId`
    /// @dev Returns admin, details, balance, status, token, participants, and winners. Useful for UIs.
    /// @param poolId The ID of the pool
    /// @return _poolAdmin Admin details
    /// @return _poolDetail Pool details
    /// @return _poolBalance Balance information
    /// @return _poolStatus Current status
    /// @return _poolToken Address of the pool token
    /// @return _participants Array of participant addresses
    /// @return _winners Array of winner addresses
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
        )
    {
        return (
            poolAdmin[poolId],
            poolDetail[poolId],
            poolBalance[poolId],
            poolStatus[poolId],
            address(poolToken[poolId]),
            participants[poolId],
            winners[poolId]
        );
    }

    // ----------------------------------------------------------------------------
    // Admin Functions
    // ----------------------------------------------------------------------------

    /// @notice Pause all contract interactions (except owner functions)
    /// @dev Only callable by contract owner. Useful for emergencies.
    /// @custom:event Paused Emitted when contract is paused
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Resume contract interactions after a pause
    /// @dev Only callable by contract owner.
    /// @custom:event Unpaused Emitted when contract is unpaused
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice Withdraw `amount` of `token` in an emergency
    /// @dev Only callable by owner when the contract is paused. Use with extreme caution.
    /// @param token The ERC20 token address to withdraw
    /// @param amount The amount to withdraw
    /// @custom:event EmergencyWithdraw Emitted when emergency withdrawal occurs
    function emergencyWithdraw(IERC20 token, uint256 amount) external onlyOwner whenPaused {
        token.safeTransfer(msg.sender, amount);
    }

    // ----------------------------------------------------------------------------
    // Internal Functions
    // ----------------------------------------------------------------------------

    /**
     * @dev Internal logic to process a participant refund
     * @param poolId The pool id
     * @param participant The participant address
     * @param amount The specific amount to refund (or 0 to use deposit minus fees)
     */
    function _refund(uint256 poolId, address participant, uint256 amount) internal {
        uint256 deposited = ParticipantDetailLib.getDeposit(participantDetail, participant, poolId);
        if (amount == 0) {
            amount = deposited - ParticipantDetailLib.getFeesCharged(participantDetail, participant, poolId);
        }
        require(amount <= deposited, "Not enough balance");

        // Update participant details
        participantDetail[participant][poolId].refunded = true;
        participantDetail[participant][poolId].deposit = 0;

        // Update pool balance
        poolBalance[poolId].balance -= amount;
        poolBalance[poolId].totalDeposits -= amount;

        // Delete participant from pool
        ParticipantDetailLib.removeParticipantFromPool(
            participantDetail, participants, isParticipant, participant, poolId
        );

        // Delete pool from participant
        ParticipantDetailLib.removeFromJoinedPool(participantDetail, joinedPools, participant, poolId);

        poolToken[poolId].safeTransfer(participant, amount);

        emit EventsLib.Refund(poolId, participant, amount);
    }

    /**
     * @dev Internal logic to apply penalty fees for early withdrawal
     * @param poolId The pool id
     */
    function _applyFees(uint256 poolId) internal {
        // Charge fees if event is < 24 hours to start or started
        uint40 timeStart = poolDetail[poolId].getTimeStart();
        if (block.timestamp >= timeStart - 1 days && block.timestamp <= timeStart) {
            uint256 fees = (getPoolFeeRate(poolId) * getParticipantDeposit(msg.sender, poolId)) / FEES_PRECISION;
            uint256 prevBalance = poolBalance[poolId].getBalance();
            poolBalance[poolId].balance -= fees;
            participantDetail[msg.sender][poolId].feesCharged += fees;
            poolBalance[poolId].feesAccumulated += fees;

            emit EventsLib.FeesCharged(poolId, msg.sender, fees);
            emit EventsLib.PoolBalanceUpdated(poolId, prevBalance, prevBalance - fees);
        } else if (block.timestamp > timeStart) {
            revert ErrorsLib.EventStarted(block.timestamp, timeStart, msg.sender);
        }
    }
}
