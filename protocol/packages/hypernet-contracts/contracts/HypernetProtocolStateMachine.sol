// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.1;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
import "@statechannels/nitro-protocol/contracts/interfaces/ForceMoveApp.sol";
import "@statechannels/nitro-protocol/contracts/Outcome.sol";
import "@statechannels/nitro-protocol/contracts/examples/SingleAssetPayments.sol";

/* This is the contract that sets up the state machine rules */
contract HypernetProtocolStateMachine is Initializable, SingleAssetPayments {

	// Remember, because we've inherited the Initializable base, we must implement
	// the initialize() function!
	function initialize() public initializer {
		// nothing really to initialize at the moment
	}
}

