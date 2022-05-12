// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

abstract contract OwnableClaimable is OwnableUpgradeable, AccessControlEnumerableUpgradeable {
    /** @notice claims ownership of the collection if one is not set
     *  @dev this can be used to claim ownership of un-owned collections
     */
    function claimOwner() external {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "NonFungibleRegistry: must be admin.");
        require(owner() == address(0), "NonFungibleRegistry: owner already set.");

        _transferOwnership(_msgSender());
    }
}