// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract NonFungibleRegistryEnumerableUpgradeable is
    Initializable,
    ContextUpgradeable,
    AccessControlEnumerableUpgradeable,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable
{
    using SafeERC20Upgradeable for IERC20Upgradeable;

    // since the registration token could be changed by the registrar
    // we need to store which token the fee was payed in along with 
    // the amount
    struct Fee {
      address token;
      uint256 amount;
    }

    struct RegistryParams {
        string[] _schema;
        bool[] _allowStorageUpdate;
        bool[] _allowLabelChange;
        bool[] _allowTransfers;
        address[] _registrationToken;
        uint256[]  _registrationFee;
        address[] _burnAddress;
        uint256[] _burnFee;
    }

    // DFDL schema definition for metadata stored in tokenURI
    string public schema;

    // optional mapping a human-readable label to a tokenID
    mapping(string => uint256) public registryMap;

    // optional reverse mapping from tokenID to a human-readable label
    mapping(uint256 => string) public reverseRegistryMap;

    // registration fee belonging to each token which is refunded on burning
    mapping(uint256 => Fee) public identityStakes; 

    // allow for tokenURI to be updated
    bool public allowStorageUpdate;

    // allow for token label to be updated
    bool public allowLabelChange;

    // disallow token transfers for all but DEFAULT_ADMIN_ROLE
    bool public allowTransfers;

    // address of ERC20 token used for token-based registration
    address public registrationToken;

    // amount of registration token required to call registerByToken
    uint256 public registrationFee; 

    // address that burned token is sent to
    address public burnAddress; 

    // percentage (in basis points) of registration token burned by registerByToken
    uint256 public burnFee;

    // address of primary NFR registry required for participation
    // if the primaryRegistry is address(0), then this variable is ignored
    // if the primaryRegistry is an ERC721, then the recipient of an NFI must 
    // have a non-zero balance in that ERC721 contract in order to recieve 
    // an NFI
    address public primaryRegistry;

    // optional merkle proof that can be used with the external merkle drop module
    bytes32 public merkleRoot; 

    // flag used in conjunction with merkleRoot, if true then the merkleRoot can no 
    // longer be updated by the REGISTRAR_ROLE
    bool public frozen;

    // create a REGISTRAR_ROLE to manage registry functionality
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    // create a REGISTRAR_ROLE to manage registry functionality
    bytes32 public constant REGISTRAR_ROLE_ADMIN = keccak256("REGISTRAR_ROLE_ADMIN");

    event LabelUpdated(uint256 tokenId, string label);

    event StorageUpdated(uint256 tokenId, bytes32 registrationData);

    event MerkleRootUpdated(bytes32 merkleRoot, bool frozen); 

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    /// @notice initialize is called once on the creation of an upgradable proxy
    /// @dev can only be called once due to the initializer modifier
    /// @param name_ name to be given to the Non Fungible Registry
    /// @param symbol_ shorthand symbol to be given to the Non Fungible Registry
    /// @param _registrar address to be given to the REGISTRAR_ROLE
    /// @param _admin address that will have the DEFAULT_ADMIN_ROLE
    function initialize(string memory name_, string memory symbol_, address _registrar, address _admin) public initializer {
        __Context_init();
        __AccessControlEnumerable_init();
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __ERC721_init(name_, symbol_);

        _setupRole(DEFAULT_ADMIN_ROLE, _admin);
        _setupRole(REGISTRAR_ROLE, _registrar);

        _setRoleAdmin (REGISTRAR_ROLE, REGISTRAR_ROLE_ADMIN);
        _setupRole(REGISTRAR_ROLE_ADMIN, _registrar);

        allowStorageUpdate = true;
        allowLabelChange = false;
        allowTransfers = true;
        registrationToken = address(0);
        registrationFee = 1e18; // assume there are 18 decimal places in the token
        burnAddress = _admin;
        burnFee = 500; // basis points, 500 bp = 5%
        primaryRegistry = address(0);
        frozen = false;
    }

    /// @notice setRegistryParameters enable or disable the lazy registration feature
    /// @dev only callable by the REGISTRAR_ROLE, use arrays so we don't have to always pass every
    /// parameter if we don't want to chage it.
    /// @param encodedParameters encoded calldata for registry parameters
    function setRegistryParameters(bytes calldata encodedParameters)
        external 
        virtual {
        require(hasRole(REGISTRAR_ROLE, _msgSender()), "NonFungibleRegistry: must be registrar.");

        RegistryParams memory params = abi.decode(encodedParameters, (RegistryParams));

        if (params._schema.length > 0) { schema = params._schema[0];}
        if (params._allowStorageUpdate.length > 0) { allowStorageUpdate = params._allowStorageUpdate[0]; }
        if (params._allowLabelChange.length > 0) { allowLabelChange = params._allowLabelChange[0]; }
        if (params._allowTransfers.length > 0) { allowTransfers = params._allowTransfers[0]; }
        if (params._registrationToken.length > 0) { registrationToken = params._registrationToken[0]; }
        if (params._registrationFee.length > 0) { registrationFee = params._registrationFee[0]; }
        if (params._burnAddress.length > 0) { burnAddress = params._burnAddress[0]; }
        if (params._burnFee.length > 0) { 
            require(params._burnFee[0] <= 10000, 
            "NonFungibleRegistry: burnFee must be le 10000.");
            burnFee = params._burnFee[0]; 
        }
    }

    /// @notice setMerkleRoot enable or disable requirement for pre-registration
    /// @dev only callable by the DEFAULT_ADMIN_ROLE
    /// @param _merkleRoot address to set as the primary registry
    function setMerkleRoot(bytes32 _merkleRoot, bool freeze) external {
        require(hasRole(REGISTRAR_ROLE, _msgSender()), "NonFungibleRegistry: must be registrar.");
        require(!frozen, "NonFungibleRegistry: merkleRoot has been frozen."); 

        merkleRoot = _merkleRoot;
        frozen = freeze; 
        emit MerkleRootUpdated(merkleRoot, frozen);
    }

    /// @notice setPrimaryRegistry enable or disable requirement for pre-registration
    /// @dev only callable by the DEFAULT_ADMIN_ROLE
    /// @param _primaryRegistry address to set as the primary registry
    function setPrimaryRegistry(address _primaryRegistry) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "NonFungibleRegistry: must be admin.");
        // allow this feature to be disablled by setting to 0 address
        if (address(_primaryRegistry) == address(0)) {
            primaryRegistry = address(0); 
        } else {
            // if not disabling, make sure the address is an ERC721 token contract
            require(IERC721Upgradeable(_primaryRegistry).supportsInterface(type(IERC721Upgradeable).interfaceId), 
                    "NonFungibleRegistry: Address does not support ERC721 interface.");
            primaryRegistry = _primaryRegistry; 
        }
    }

    function _storageCanBeUpdated() internal view virtual returns (bool) {
        return (allowStorageUpdate || hasRole(REGISTRAR_ROLE, _msgSender()));
    }

    function _labelCanBeChanged() internal view virtual returns (bool) {
        return (allowLabelChange || hasRole(REGISTRAR_ROLE, _msgSender()));
    }

    function _transfersAllowed() internal view virtual returns (bool) {
        return (allowTransfers || hasRole(REGISTRAR_ROLE, _msgSender()));
    }

    /// @notice register mints a new Non-Fungible Identity token
    /// @dev only callable by the REGISTRAR_ROLE
    /// @param to address of the recipient of the token
    /// @param label a unique label to attach to the token, can pass an empty string to skip labeling
    /// @param registrationData data to store in the tokenURI
    /// @param tokenId unique uint256 identifier for the newly created token
    function register(address to, string calldata label, string calldata registrationData, uint256 tokenId) external virtual {
        require(hasRole(REGISTRAR_ROLE, _msgSender()), "NonFungibleRegistry: must have registrar role to register.");
        _createLabeledToken(to, label, registrationData, tokenId);
    }

    /// @notice registerByToken mints a new Non-Fungible Identity token by staking an ERC20 registration token
    /// @dev callable by anyone with enough registration token, caller must call `approve` first
    /// @param to address of the recipient of the token
    /// @param label a unique label to attach to the token
    /// @param registrationData data to store in the tokenURI
    /// @param tokenId unique uint256 identifier for the newly created token
    function registerByToken(address to, string calldata label, string calldata registrationData, uint256 tokenId) external virtual {
        require(registrationToken != address(0), "NonFungibleRegistry: registration by token not enabled.");
        require(!_mappingExists(label), "NonFungibleRegistry: label is already registered.");

        // user must approve the registry to collect the registration fee from their wallet
        IERC20Upgradeable(registrationToken).transferFrom(_msgSender(), address(this), registrationFee);
        _createLabeledToken(to, label, registrationData, tokenId);

        uint256 burnAmount = registrationFee * burnFee / 10000;
        IERC20Upgradeable(registrationToken).transfer(burnAddress, burnAmount);
        // the fee stays with the token, not the token owner
        identityStakes[tokenId] = Fee(registrationToken, registrationFee-burnAmount);
    }

    function _createLabeledToken(address to, string memory label, string memory registrationData, uint256 tokenId) private {
        if (bytes(label).length > 0) {
            require(!_mappingExists(label), "NonFungibleRegistry: label is already registered.");
            _createToken(to, registrationData, tokenId);
            // extend the registry mapping for lookup via token label
            registryMap[label] = tokenId;
            reverseRegistryMap[tokenId] = label;
        } else {
            // if label is empty, save some gas
            _createToken(to, registrationData, tokenId);
        }
    }

    function _createToken(address to, string memory registrationData, uint256 tokenId) private {
        require(_preRegistered(to), "NonFungibleRegistry: recipient must have non-zero balance in primary registry.");
        require(tokenId != 0, "NonFungibleRegistry: tokenId cannot be 0");

        _mint(to, tokenId);
        _setTokenURI(tokenId, registrationData);
    }

    /// @notice updateRegistration updates the tokenURI denoted by tokenId
    /// @dev only callable by the owner, approved caller when allowStorageUpdate is true or REGISTRAR_ROLE
    /// @param tokenId the tokenId of the target registration
    /// @param registrationData new data to store in the tokenURI
    function updateRegistration(uint256 tokenId, string calldata registrationData) external virtual {
        require(_storageCanBeUpdated(), "NonFungibleRegistry: Storage updating is disabled.");
        require(_isApprovedOrOwnerOrRegistrar(_msgSender(), tokenId), "NonFungibleRegistry: caller is not owner nor approved nor registrar.");
        _setTokenURI(tokenId, registrationData);
        emit StorageUpdated(tokenId, keccak256(abi.encodePacked(registrationData)));
    }

    /// @notice updateLabel updates the label of the token denoted by tokenId
    /// @dev only callable by the owner, approved caller when allowLabelChange is true or REGISTRAR_ROLE
    /// @param tokenId the tokenId of the target registration
    /// @param label new data to associate with the token label
    function updateLabel(uint256 tokenId, string calldata label) external virtual {
        require(_labelCanBeChanged(), "NonFungibleRegistry: Label updating is disabled.");
        require(_isApprovedOrOwnerOrRegistrar(_msgSender(), tokenId), "NonFungibleRegistry: caller is not owner nor approved nor registrar.");
        require(!_mappingExists(label), "NonFungibleRegistry: label is already registered.");

        registryMap[label] = tokenId;
        reverseRegistryMap[tokenId] = label;
        emit LabelUpdated(tokenId, label);
    }

    /// @notice transferFrom transfers ownership of a registration token
    /// @dev only callable by the owner, approved caller when allowTransfers is true or REGISTRAR_ROLE
    /// @param from the tokenId of the target registration
    /// @param to new data to store in the tokenURI
    /// @param tokenId unique id to refence the target token
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwnerOrRegistrar(_msgSender(), tokenId), "NonFungibleRegistry: caller is not owner nor approved nor registrar.");
        require(_preRegistered(to), "NonFungibleRegistry: recipient must have non-zero balance in primary registry.");

        _transfer(from, to, tokenId);
    }

    /// @notice safeTransferFrom transfers ownership of a registration token, recipient must implement callback
    /// @dev only callable by the owner, approved caller when allowTransfers is true or REGISTRAR_ROLE
    /// @param from the tokenId of the target registration
    /// @param to new data to store in the tokenURI
    /// @param tokenId unique id to refence the target token
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) public virtual override {
        require(_isApprovedOrOwnerOrRegistrar(_msgSender(), tokenId), "NonFungibleRegistry: caller is not owner nor approved nor registrar.");
        require(_preRegistered(to), "NonFungibleRegistry: recipient must have non-zero balance in primary registry.");
        _safeTransfer(from, to, tokenId, _data);
    }

    /// @notice burn removes a token from the registry enumeration and refunds registration fee to burner
    /// @dev only callable by the owner, approved caller when allowTransfers is true or REGISTRAR_ROLE
    /// @param tokenId unique id to refence the target token
    function burn(uint256 tokenId) public virtual {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwnerOrRegistrar(_msgSender(), tokenId), "NonFungibleRegistry: caller is not owner nor approved nor registrar.");
        _burn(tokenId);

        // when burning, check if there is a registration fee tied to the token identity 
        if (identityStakes[tokenId].amount != 0) {
            // send the registration fee to the token burner
            IERC20Upgradeable(identityStakes[tokenId].token).transfer(_msgSender(), identityStakes[tokenId].amount);
            delete identityStakes[tokenId];
        }
    }

    function _burn(
        uint256 tokenId
    ) 
        internal 
        virtual 
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);

        // remove the registry and reverse registry mappings
        string memory label = reverseRegistryMap[tokenId];
        delete reverseRegistryMap[tokenId];
        delete registryMap[label];
    }

    function _isApprovedOrOwnerOrRegistrar(address spender, uint256 tokenId) internal view virtual returns (bool) {
        require(_exists(tokenId), "ERC721: operator query for nonexistent token");
        address owner = ERC721Upgradeable.ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender) || hasRole(REGISTRAR_ROLE, spender));
    }

    /// @notice tokenURI view function that returns tokenURI associated with the target token
    /// @param tokenId unique id to refence the target token
    function tokenURI(
        uint256 tokenId
    ) 
        public 
        view 
        virtual 
        override(ERC721URIStorageUpgradeable, ERC721Upgradeable)
        returns (string memory) 
    {
        return ERC721URIStorageUpgradeable.tokenURI(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        require(_transfersAllowed(), "NonFungibleRegistry: transfers are disabled.");
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _mappingExists(string memory label) internal view virtual returns (bool) {
        return !(registryMap[label] == 0);
    }

    function _preRegistered(address to) internal view virtual returns (bool) {
        // check if there is a primary registry linked to this registry and if so
        // does the recipient have a non-zero balance. 
        return ((primaryRegistry == address(0)) || (IERC721Upgradeable(primaryRegistry).balanceOf(to) > 0));
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControlEnumerableUpgradeable, ERC721Upgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}