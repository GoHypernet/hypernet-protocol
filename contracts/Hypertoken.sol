pragma solidity ^0.6.2;

import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/presets/ERC20PresetMinterPauser.sol";

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
