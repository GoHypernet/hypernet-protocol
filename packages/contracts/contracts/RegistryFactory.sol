// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./NonFungibleRegistry.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

/**
 * @dev {ERC721} factory contract, including
 *
 *  - ability to name each new registry
 *  - set the `DEFAULT_ADMIN_ROLE` and `MINTER_ROLE`
 *
 * This contract uses {AccessControl} to lock permissioned functions using the
 * different roles - head to its documentation for details.
 *
 * The account that deploys the contract will be granted the minter and pauser
 * roles, as well as the default admin role, which will let it grant both minter
 * and pauser roles to other accounts.
 */
contract RegistryFactory is AccessControlEnumerable {

    // its anticipated that the number of registries will be on the order of 100 in the long run
    // so storing in an array should be fine
    address[] public registries;

    // enable registry discovery by human-readable name
    mapping (string => address) public nameToAddress;

     /**
     * @dev Emitted when `DEFAULT_ADMIN_ROLE` creates a new registry.
     */
    event RegistryCreated(address registryAddress);

    /**
     * @dev Emitted when `DEFAULT_ADMIN_ROLE` destroys an existing registry.
     */
    event RegistryDestroyed(address registryAddress);

    /**
     * @dev Grants `DEFAULT_ADMIN_ROLE`, to the
     * account passed into the constructor.
     */
    constructor(address[] memory _admins)  {
                // register executors
        for (uint256 i = 0; i < _admins.length; ++i) {
            _setupRole(DEFAULT_ADMIN_ROLE, _admins[i]);
        }
    }

    /**
    * @dev create a new registry with the given name, symbol and admin address.
    * Address of deployed registry is stored in an array for easy lookup
    */
    function createRegistry(string memory _name, string memory _symbol, address _admin) external {
        require(_admin != address(0), "RegistryFactory: Admin address must not be 0.");
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "RegistryFactory: must have admin role to create a registry");
        require(!_registryExists(_name), "RegistryFactory: Registry by that name exists.");
        
        NonFungibleRegistry registry = new NonFungibleRegistry(_name, _symbol, _admin);
        registries.push(address(registry));
        nameToAddress[_name] = address(registry);
        emit RegistryCreated(address(registry));
    }

    /**
    * @dev destroy an existing registry with the given name.
    * Address of deployed registry is stored in an array for easy lookup
    */
    function destroyRegistry(string memory _name) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "RegistryFactory: must have admin role to destroy a registry");
        require(_registryExists(_name), "RegistryFactory: No registry by that name exists.");
        
        address regAddress = nameToAddress[_name];
        NonFungibleRegistry(regAddress).destroyRegistry(getRoleMember(DEFAULT_ADMIN_ROLE,0)); //send any ETH to the timelock
        delete nameToAddress[_name];
        emit RegistryDestroyed(address(regAddress));
    }

    /**
    * @dev Returns whether the registry name exists already exists.
    */
    function _registryExists(string memory _name) internal view virtual returns (bool) {
        return !(nameToAddress[_name] == address(0));
    }
}