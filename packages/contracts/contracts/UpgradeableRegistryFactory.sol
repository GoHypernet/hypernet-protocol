// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./NonFungibleRegistryUpgradeable.sol";

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";

contract UpgradeableRegistryFactory is AccessControlEnumerable {

    // address of our upgradeble registry proxy beacon
    address public registryBeacon;

    // extra array storage fascilitates paginated UI
    address[] public registries;

    // enable registry discovery by human-readable name
    mapping (string => address) public nameToAddress;

    // address of ERC20 token used for token-based regsitry creation
    address public registrationToken = address(0);

    // amount of registration token required to create a registry
    uint256 public registrationFee = 50e18; // assume 18 decimal places

    // address that token is sent to after registry creation
    address public burnAddress = address(0); 

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

    /// @notice setRegistrationToken setter function for configuring which ERC20 token is burned when adding new apps
    /// @dev can only be called by the DEFAULT_ADMIN_ROLE
    /// @param _registrationToken address of ERC20 token burned during registration
    function setRegistrationToken(address _registrationToken) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "RegistryFactory: must have admin role to create a registry");
        registrationToken = _registrationToken;
    }

    /// @notice setRegistrationFee setter function for configuring how much token is burned when adding new apps
    /// @dev can only be called by the DEFAULT_ADMIN_ROLE
    /// @param _registrationFee burn fee amount
    function setRegistrationFee(uint256 _registrationFee) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "RegistryFactory: must have admin role to create a registry");
        registrationFee = _registrationFee;
    }

    /// @notice setBurnAddress setter function for configuring where tokens are sent when calling createRegistryByToken
    /// @dev can only be called by the DEFAULT_ADMIN_ROLE
    /// @param _burnAddress address where creation fee is to be sent
    function setBurnAddress(address _burnAddress) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "RegistryFactory: must have admin role to create a registry");
        burnAddress = _burnAddress;
    }

    /// @notice createRegistry called on contract deployment
    /// @dev the registry inherents the same admin as the factory
    /// @param _name name of the registry that will be created
    /// @param _symbol symbol to associate with the registry
    /// @param _registrar address that will recieve the REGISTRAR_ROLE
    function createRegistry(string memory _name, string memory _symbol, address _registrar) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "RegistryFactory: must have admin role to create a registry");

        _createRegistry(_name, _symbol, _registrar);        
    }

    /// @notice createRegistryByToken called on contract deployment
    /// @dev the registry inherents the same admin as the factory
    /// @param _name name of the registry that will be created
    /// @param _symbol symbol to associate with the registry
    /// @param _registrar address that will recieve the REGISTRAR_ROLE
    function createRegistryByToken(string memory _name, string memory _symbol, address _registrar) external {
        require(registrationToken != address(0), "RegistryFactory: registration by token not enabled.");

        // user must call approve first
        IERC20Upgradeable(registrationToken).transferFrom(_msgSender(), burnAddress, registrationFee);
        _createRegistry(_name, _symbol, _registrar);        
    }

    function _createRegistry(string memory _name, string memory _symbol, address _registrar) private {
        require(_registrar != address(0), "RegistryFactory: Registrar address must not be 0.");
        require(!_registryExists(_name), "RegistryFactory: Registry by that name exists.");
        
        // cloning the beacon implementation reduced gas by ~80% over naive approach 
        BeaconProxy proxy = new BeaconProxy(registryBeacon, abi.encodeWithSelector(NonFungibleRegistryUpgradeable.initialize.selector, _name, _symbol, _registrar, getRoleMember(DEFAULT_ADMIN_ROLE, 0)));
        registries.push(address(proxy));
        nameToAddress[_name] = address(proxy);
        emit RegistryCreated(address(proxy));
    }

    function _registryExists(string memory _name) internal view virtual returns (bool) {
        return !(nameToAddress[_name] == address(0));
    }
}