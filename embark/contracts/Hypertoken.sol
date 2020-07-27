// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.6.2;

import "/home/caleb/hypernet-protocol/embark/Hypernet/.embark/node_modules/@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
import "/home/caleb/hypernet-protocol/embark/Hypernet/.embark/node_modules/@openzeppelin/contracts-ethereum-package/contracts/presets/ERC20PresetMinterPauser.sol";

/**
 * The Hypertoken ERC20 contracts.
 * Right now just has a dummy function to justify extending
 * the base preset contracts. Initializable, so make sure you know
 * the difference between initializable and constructor-based contracts!
 **/
contract Hypertoken is Initializable, ERC20PresetMinterPauserUpgradeSafe {
	function initalize() public initializer {
		ERC20PresetMinterPauserUpgradeSafe.initialize(
			"Hypertoken",
			"HYPE"
		);
	}

	/**
	 * Just a small test function that uses the internal _mint(to, amount)
	 * function to mint a single token and give it to the caller.
	 * (remember, _mint() does generate a transfer event!)
	 */
	function getAFreeToken() public {
		_mint(msg.sender, 1 ether);
	}
}
