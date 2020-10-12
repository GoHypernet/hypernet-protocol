pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import './interfaces/ForceMoveApp.sol';

/**
 * @dev The Trivialp contracts complies with the ForceMoveApp interface and allows all transitions, regardless of the data. Used for testing purposes.
 */
contract TrivialApp is ForceMoveApp {
    /**
     * @notice Encodes trivial rules.
     * @dev Encodes trivial rules.
     * @return true.
     */
    function validTransition(
        VariablePart memory, // a
        VariablePart memory, // b
        uint48, // turnNumB
        uint256 // nParticipants
    ) public override pure returns (bool) {
        return true;
    }
}
