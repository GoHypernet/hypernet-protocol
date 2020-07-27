// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.2;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
import "@statechannels/nitro-protocol/contracts/interfaces/ForceMoveApp.sol";
import "@statechannels/nitro-protocol/contracts/Outcome.sol";
import "@statechannels/nitro-protocol/contracts/examples/SingleAssetPayments.sol";

/**
 * The actual state/payment channel contract/controller system!
 * This runs off of the ForceMove protocol; we only need to implement
 * the validTransition function tomake this work.
 *
 * For now, we're just extending the SingleAssetPayments.sol example payment
 * channels system; it's pretty basic, but good for learning/initial development.
 * See https://git.io/JJ04I for the source - you should understand it if trying to
 * develop on the Hypernet protocl source!
 **/
contract HypernetProtocol is Initializable, SingleAssetPayments {

	// Remember, because we've inherited the Initializable base, we must implement
	// the initialize() function!
	function initialize() public initializer {
		// nothing really to initialize at the moment
	}
}

