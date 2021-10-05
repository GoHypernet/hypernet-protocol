// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./NonFungibleRegistryUpgradeable.sol";

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";

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
contract UpgradeableRegistryFactory is AccessControlEnumerable {

    // address of our upgradeble registry proxy beacon
    address public registryBeacon;

    // its anticipated that the number of registries will be on the order of 100 in the long run
    // so storing in an array should be fine
    address[] public registries;

    // enable registry discovery by human-readable name
    mapping (string => address) public nameToAddress;

     /**
     * @dev Emitted when `DEFAULT_ADMIN_ROLE` creates a new registry.
     */
    event RegistryCreated(address registryAddress);

    /// @notice constructor called on contract deployment
    /// @param _admin address who can call the createRegistry function
    /// @param _names array of names for the registries created on deployment 
    /// @param _symbols array of symbols for the registries created on deployment 
    /// @param _registrars array of addresses to recieve the REGISTRAR_ROLE for the registries created on deployment 
    constructor(address _admin, string[] memory _names, string[] memory _symbols, address[] memory _registrars)  {
        require(_names.length == _symbols.length, "RegistryFactory: Initializer arrays must be equal length.");
        require(_symbols.length == _registrars.length, "RegistryFactory: Initializer arrays must be equal length.");

        // set the administrator of the registry factory
        _setupRole(DEFAULT_ADMIN_ROLE, _admin);

        // during construction, deploy the upgradable beacon instance of our registry contract
        UpgradeableBeacon _registryBeacon = new UpgradeableBeacon(address(new NonFungibleRegistryUpgradeable()));
        _registryBeacon.transferOwnership(_admin);
        registryBeacon = address(_registryBeacon);

        // deploy initial registries 
        for (uint256 i = 0; i < _names.length; ++i) {
            _createRegistry(_names[i], _symbols[i], _registrars[i]);
        }
    }

    /// @notice createRegistry called on contract deployment
    /// @param _name name of the registry that will be created
    /// @param _symbol symbol to associate with the registry
    /// @param _registrar address that will recieve the REGISTRAR_ROLE
    function createRegistry(string memory _name, string memory _symbol, address _registrar) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "RegistryFactory: must have admin role to create a registry");

        _createRegistry(_name, _symbol, _registrar);        
    }

    /**
    * @dev private function for creating a new registry with the given name, symbol and admin address.
    * Address of deployed registry is stored in an array for easy lookup
    */
    function _createRegistry(string memory _name, string memory _symbol, address _registrar) private {
        require(_registrar != address(0), "RegistryFactory: Registrar address must not be 0.");
        require(!_registryExists(_name), "RegistryFactory: Registry by that name exists.");
        
        // cloning the beacon implementation reduced gas by ~80% over naive approach 
        BeaconProxy proxy = new BeaconProxy(registryBeacon, abi.encodeWithSelector(NonFungibleRegistryUpgradeable.initialize.selector, _name, _symbol, _registrar, getRoleMember(DEFAULT_ADMIN_ROLE, 0)));
        registries.push(address(proxy));
        nameToAddress[_name] = address(proxy);
        emit RegistryCreated(address(proxy));
    }

    /**
    * @dev Returns whether the registry name exists already exists.
    */
    function _registryExists(string memory _name) internal view virtual returns (bool) {
        return !(nameToAddress[_name] == address(0));
    }
}