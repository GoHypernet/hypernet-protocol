// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "./NonFungibleRegistryEnumerableUpgradeable.sol";
import "./NonFungibleRegistryUpgradeable.sol";

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Hypernet Protocol Non Fungible Registry Factory
 * @author Todd Chapman
 * @dev Upgradable beacon factor contract for efficiently deploying new
 * Non Fungible Registries.
 *
 * See the Hypernet Protocol documentation for more information:
 * https://docs.hypernet.foundation/hypernet-protocol/governance
 * 
 * See unit tests for example usage:
 * https://github.com/GoHypernet/hypernet-protocol/blob/dev/packages/contracts/test/upgradeable-factory-test.js
 */
contract UpgradeableRegistryFactory is AccessControlEnumerable, ReentrancyGuard {

    /// @dev address of our upgradeble registry with enumeration proxy beacon
    address public enumerableRegistryBeacon;

    /// @dev address of our upgradable registry proxy beacon
    address public registryBeacon;

    /// @dev address of registry that serves os the Hypernet User Profile registry
    address public hypernetProfileRegistry = address(0);

    /// @dev extra array storage fascilitates paginated UI
    address[] public enumerableRegistries;

    /// @dev extra array storage fascilitates paginated UI
    address[] public registries;

    /// @notice Use this mapping to find the true deployment address of a project's NFR via the project name
    /// @dev This mapping is updated everytime this is a new NFR created by the factory
    mapping (string => address) public nameToAddress;

    /// @notice Address indicating what ERC-20 token can be used with createRegistryByToken
    /// @dev This address variable is used in conjunction with burnFee and burnAddress for the registerByToken function. Setting to the zero address disables the feature.
    address public registrationToken;

    /// @notice The amount of registrationToken required to call createRegistryByToken
    /// @dev Be sure you check the number of decimals associated with the ERC-20 contract at the registrationToken address
    uint256 public registrationFee = 50e18; // assume 18 decimal places

    /// @notice This is the address where registrationToken is forwarded upon a call to createRegistryByToken
    /// @dev The amount of registrationToken sent to this address is equal to {registrationFee * burnFee / 10000}
    address public burnAddress;

    /**
     * @dev Emitted when `DEFAULT_ADMIN_ROLE` creates a new registry.
     */
    event RegistryCreated(address registryAddress);

    /// @notice constructor called on contract deployment
    /// @param _admin address who can call the createRegistry function
    /// @param _names array of names for the registries created on deployment 
    /// @param _symbols array of symbols for the registries created on deployment 
    /// @param _registrars array of addresses to recieve the REGISTRAR_ROLE for the registries created on deployment 
    /// @param _enumerableRegistry address of implementation of enumerable NFR
    /// @param _registry address of implementation of non-enumerable NFR
    /// @param _registrationToken address of ERC20 token used for enabling the creation of registries by burning token
    constructor(address _admin, 
                string[] memory _names, 
                string[] memory _symbols, 
                address[] memory _registrars, 
                address _enumerableRegistry, 
                address _registry,
                address _registrationToken)  {
        require(_names.length == _symbols.length, "RegistryFactory: Initializer arrays must be equal length.");
        require(_symbols.length == _registrars.length, "RegistryFactory: Initializer arrays must be equal length.");
        require(address(_enumerableRegistry) != address(0), "RegistryFactory: Invalid enumerableRegistry address.");
        require(address(_registry) != address(0), "RegistryFactory: Invalid registry address.");
        require(address(_registrationToken) != address(0), "RegistryFactory: Invalid registrationToken address.");

        // set the administrator of the registry factory
        _setupRole(DEFAULT_ADMIN_ROLE, _admin);

        // deploy upgradable beacon instance of enumerable registry contract
        UpgradeableBeacon _enumerableRegistryBeacon = new UpgradeableBeacon(_enumerableRegistry);
        _enumerableRegistryBeacon.transferOwnership(_admin);
        enumerableRegistryBeacon = address(_enumerableRegistryBeacon);

        // deploy upgradable beacon instance of registry contract
        UpgradeableBeacon _registryBeacon = new UpgradeableBeacon(_registry);
        _registryBeacon.transferOwnership(_admin);
        registryBeacon = address(_registryBeacon);

        registrationToken = _registrationToken;
        burnAddress = _admin;

        // deploy initial enumerable registries 
        for (uint256 i = 0; i < _names.length; ++i) {
            _createEnumerableRegistry(_names[i], _symbols[i], _registrars[i]);

            // use the first enumerable registry as the hypernet profile registry
            if (i == 0) {
                hypernetProfileRegistry = enumerableRegistries[0]; 
            }
        }
    }

    /// @notice getNumberOfEnumerableRegistries getter function for reading the number of enumerable registries
    /// @dev useful for paginated UIs
    function getNumberOfEnumerableRegistries() public view returns (uint256 numReg) {
        numReg = enumerableRegistries.length;
    }

    /// @notice getNumberOfRegistries getter function for reading the number of registries
    /// @dev useful for paginated UIs
    function getNumberOfRegistries() public view returns (uint256 numReg) {
        numReg = registries.length;
    }

    /// @notice setProfileRegistryAddress change the address of the profile registry contract
    /// @dev can only be called by the DEFAULT_ADMIN_ROLE
    /// @param _hypernetProfileRegistry address of ERC721 token to use as profile contract
    function setProfileRegistryAddress(address _hypernetProfileRegistry) external isAdmin {
        require(address(_hypernetProfileRegistry) != address(0), "NonFungibleRegistry: Invalid hypernetProfileRegistry address.");
        hypernetProfileRegistry = _hypernetProfileRegistry;
    }

    /// @notice setRegistrationToken setter function for configuring which ERC20 token is burned when adding new apps
    /// @dev can only be called by the DEFAULT_ADMIN_ROLE
    /// @param _registrationToken address of ERC20 token burned during registration
    function setRegistrationToken(address _registrationToken) external isAdmin {
        require(_registrationToken != address(0), """RegistryFactory: Invalid registrationToken address");
        registrationToken = _registrationToken;
    }

    /// @notice setRegistrationFee setter function for configuring how much token is burned when adding new apps
    /// @dev can only be called by the DEFAULT_ADMIN_ROLE
    /// @param _registrationFee burn fee amount
    function setRegistrationFee(uint256 _registrationFee) external isAdmin {
        require(_registrationFee >= 0, "RegistryFactory: Registration fee must be nonnegative.");
        registrationFee = _registrationFee;
    }

    /// @notice setBurnAddress setter function for configuring where tokens are sent when calling createRegistryByToken
    /// @dev can only be called by the DEFAULT_ADMIN_ROLE
    /// @param _burnAddress address where creation fee is to be sent
    function setBurnAddress(address _burnAddress) external isAdmin {
        burnAddress = _burnAddress;
    }

    /// @notice createRegistry called by DEFAULT_ADMIN_ROLE to create registries without a fee
    /// @dev the registry inherents the same admin as the factory
    /// @param _name name of the registry that will be created
    /// @param _symbol symbol to associate with the registry
    /// @param _registrar address that will recieve the REGISTRAR_ROLE
    /// @param _enumerable boolean declaring if the registry should have the enumeration property
    function createRegistry(string calldata _name, string calldata _symbol, address _registrar, bool _enumerable) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "RegistryFactory: must have admin role to create a registry");
        if (_enumerable) {
            _createEnumerableRegistry(_name, _symbol, _registrar);
        } else {
            _createRegistry(_name, _symbol, _registrar);
        }
    }

    /// @notice createRegistryByToken called by any user with sufficient registration token
    /// @dev the registry inherents the same admin as the factory
    /// @param _name name of the registry that will be created
    /// @param _symbol symbol to associate with the registry
    /// @param _registrar address that will recieve the REGISTRAR_ROLE
    function createRegistryByToken(string memory _name, string memory _symbol, address _registrar, bool _enumerable) external {
        require(_preRegistered(_msgSender()), "RegistryFactory: caller must have a Hypernet Profile.");
        require(registrationToken != address(0), "RegistryFactory: registration by token not enabled.");
        // user must call approve first
        require(IERC20Upgradeable(registrationToken).transferFrom(_msgSender(), burnAddress, registrationFee), "RegistryFactory: token transfer failed.");

        if (_enumerable) {
            _createEnumerableRegistry(_name, _symbol, _registrar);
        } else {
            _createRegistry(_name, _symbol, _registrar);
        }
    }

    function _createEnumerableRegistry(string memory _name, string memory _symbol, address _registrar) private nonReentrant {
        require(_registrar != address(0), "RegistryFactory: Registrar address must not be 0.");
        require(!_registryExists(_name), "RegistryFactory: Registry by that name exists.");
        
        // cloning the beacon implementation reduced gas by ~80% over naive approach 
        BeaconProxy proxy = new BeaconProxy(enumerableRegistryBeacon, abi.encodeWithSelector(NonFungibleRegistryEnumerableUpgradeable.initialize.selector, _name, _symbol, hypernetProfileRegistry, _registrar, getRoleMember(DEFAULT_ADMIN_ROLE, 0)));
        enumerableRegistries.push(address(proxy));
        nameToAddress[_name] = address(proxy);
        emit RegistryCreated(address(proxy));
    }

    function _createRegistry(string memory _name, string memory _symbol, address _registrar) private nonReentrant {
        require(_registrar != address(0), "RegistryFactory: Registrar address must not be 0.");
        require(!_registryExists(_name), "RegistryFactory: Registry by that name exists.");
        
        // cloning the beacon implementation reduced gas by ~80% over naive approach 
        BeaconProxy proxy = new BeaconProxy(registryBeacon, abi.encodeWithSelector(NonFungibleRegistryUpgradeable.initialize.selector, _name, _symbol, hypernetProfileRegistry, _registrar, getRoleMember(DEFAULT_ADMIN_ROLE, 0)));
        registries.push(address(proxy));
        nameToAddress[_name] = address(proxy);
        emit RegistryCreated(address(proxy));
    }

    function _registryExists(string memory _name) internal view virtual returns (bool) {
        // registry name must have non-zero length and must not exist already
        return !((bytes(_name).length > 0) && nameToAddress[_name] == address(0));
    }

    function _preRegistered(address owner) internal view virtual returns (bool) {
        // check if there if a profile is required and if so 
        // does the recipient have a non-zero balance. 
        return ((hypernetProfileRegistry == address(0)) || (IERC721Upgradeable(hypernetProfileRegistry).balanceOf(owner) > 0));
    }

    modifier isAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "RegistryFactory: must have admin role to set parameters");
        _;
    }
}