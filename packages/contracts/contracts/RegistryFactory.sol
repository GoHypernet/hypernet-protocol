// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./NonFungibleRegistry.sol";

contract RegistryFactory {
    NonFungibleRegistry[] public registries;

    event RegistryCreated(address registryAddress);

    function createRegistry(string memory name_, string memory symbol_, address _admin) external {
        NonFungibleRegistry registry = new NonFungibleRegistry(name_, symbol_, _admin);
        registries.push(registry);
        emit RegistryCreated(address(registry));
    }
}