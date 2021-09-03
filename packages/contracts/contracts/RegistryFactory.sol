// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./NonFungibleRegistry.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

contract RegistryFactory is AccessControlEnumerable {

    // its anticipated that the number of registries will be on the order of 100 in the long run
    // so storing in an array should be fine
    address[] public registries;

    event RegistryCreated(address registryAddress);

    constructor(address _admin)  {
        _setupRole(DEFAULT_ADMIN_ROLE, _admin);
    }

    function createRegistry(string memory name_, string memory symbol_, address _admin) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "RegistryFactory: must have admin role to create a registry");
        
        NonFungibleRegistry registry = new NonFungibleRegistry(name_, symbol_, _admin);
        registries.push(address(registry));
        emit RegistryCreated(address(registry));
    }
}