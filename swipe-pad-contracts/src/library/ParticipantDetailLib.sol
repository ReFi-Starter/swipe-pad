// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IPool} from "../interface/IPool.sol";
import {EventsLib} from "./EventsLib.sol";

library ParticipantDetailLib {
    function getDeposit(
        mapping(address => mapping(uint256 => IPool.ParticipantDetail)) storage participantDetail,
        address participant,
        uint256 poolId
    ) internal view returns (uint256) {
        return participantDetail[participant][poolId].deposit;
    }

    function getFeesCharged(
        mapping(address => mapping(uint256 => IPool.ParticipantDetail)) storage participantDetail,
        address participant,
        uint256 poolId
    ) internal view returns (uint256) {
        return participantDetail[participant][poolId].feesCharged;
    }

    function removeParticipantFromPool(
        mapping(address => mapping(uint256 => IPool.ParticipantDetail)) storage participantDetail,
        mapping(uint256 => address[]) storage participants,
        mapping(address => mapping(uint256 => bool)) storage isParticipant,
        address participant,
        uint256 poolId
    ) internal {
        uint256 i = getParticipantIndex(participantDetail[participant][poolId]);
        assert(participant == participants[poolId][i]);
        if (i < participants[poolId].length - 1) {
            // Move last to replace current index
            address lastParticipant = participants[poolId][participants[poolId].length - 1];
            participants[poolId][i] = lastParticipant;
            setParticipantIndex(participantDetail[lastParticipant][poolId], i);
        }
        participants[poolId].pop();
        isParticipant[participant][poolId] = false;

        emit EventsLib.ParticipantRemoved(poolId, participant);
    }

    function removeFromJoinedPool(
        mapping(address => mapping(uint256 => IPool.ParticipantDetail)) storage participantDetail,
        mapping(address => uint256[]) storage joinedPools,
        address participant,
        uint256 poolId
    ) internal {
        uint256 i = getJoinedPoolsIndex(participantDetail[participant][poolId]);
        assert(poolId == joinedPools[participant][i]);
        if (i < joinedPools[participant].length - 1) {
            // Move last to replace current index
            uint256 lastPool = joinedPools[participant][joinedPools[participant].length - 1];
            joinedPools[participant][i] = lastPool;
            setJoinedPoolsIndex(participantDetail[participant][lastPool], i);
        }
        joinedPools[participant].pop();

        emit EventsLib.JoinedPoolsRemoved(poolId, participant);
    }

    function setParticipantIndex(IPool.ParticipantDetail storage self, uint256 _participantIndex) internal {
        self.participantIndex = uint120(_participantIndex);
    }

    function getParticipantIndex(IPool.ParticipantDetail storage self) internal view returns (uint256) {
        return self.participantIndex;
    }

    function setJoinedPoolsIndex(IPool.ParticipantDetail storage self, uint256 _joinedPoolsIndex) internal {
        self.joinedPoolsIndex = uint120(_joinedPoolsIndex);
    }

    function getJoinedPoolsIndex(IPool.ParticipantDetail storage self) internal view returns (uint256) {
        return self.joinedPoolsIndex;
    }

    function isRefunded(IPool.ParticipantDetail storage self) internal view returns (bool) {
        return self.refunded;
    }
}
