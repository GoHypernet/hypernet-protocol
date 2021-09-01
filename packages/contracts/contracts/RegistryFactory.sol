// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./NonFungibleRegistry.sol";

contract RegistryFactory {

    // its anticipated that the number of registries will be on the order of 100 in the long run
    // a new factory 
    address[] public registries;

    event RegistryCreated(address registryAddress);

    function createRegistry(string memory name_, string memory symbol_, address _admin) external {
        NonFungibleRegistry registry = new NonFungibleRegistry(name_, symbol_, _admin);
        registries.push(address(registry));
        emit RegistryCreated(address(registry));
    }
}