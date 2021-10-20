// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "contracts/access/NFTAccessControlUpgradeable.sol";
import "contracts/access/INFTAccessControlUpgradeable.sol";

contract Test is NFTAccessControlUpgradeable {

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    // initialize the contract with the administrative registry and admin tokenId
    function initialize(address nftRegistry, uint256 tokenId) public initializer {
        __NFTAccessControl_init(nftRegistry);
        _setupRole(DEFAULT_ADMIN_ROLE, tokenId);
    }
}