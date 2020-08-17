// SPDX-License-Identifier: UNLICSENSED

pragma solidity ^0.6.1;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
import "@statechannels/nitro-protocol/contracts/ERC20AssetHolder.sol";

/* Just extending the contract so that we can reference it explicity in the config */
contract HypertokenAssetHolder is ERC20AssetHolder {
	constructor(address _AdjudicatorAddress, address _TokenAddress) ERC20AssetHolder(_AdjudicatorAddress, _TokenAddress) public {}
}
