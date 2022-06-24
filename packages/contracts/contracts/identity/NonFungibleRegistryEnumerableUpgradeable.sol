// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "../external/RoyaltiesV2.sol";

/**
 * @title Hypernet Protocol Enumerable Non Fungible Registry
 * @author Todd Chapman
 * @dev Implementation of the Hypernet Protocol Non Fungible Registry with Enumeration
 *
 * This implementation is based on OpenZeppelin's ERC-721 library with the enumeration extension
 *
 * See the Hypernet Protocol documentation for more information:
 * https://docs.hypernet.foundation/hypernet-protocol/identity
 *
 * See unit tests for example usage:
 * https://github.com/GoHypernet/hypernet-protocol/blob/dev/packages/contracts/test/upgradeable-registry-enumerable-test.js
 */
contract NonFungibleRegistryEnumerableUpgradeable is
    Initializable,
    ContextUpgradeable,
    AccessControlEnumerableUpgradeable,
    ReentrancyGuardUpgradeable,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable,
    OwnableUpgradeable,
    RoyaltiesV2Impl
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
        string[] _baseURI;
    }

    /// @notice This is a reserved variable intended to be used by dynamic UI's
    /// @dev This variable is intended to store DFDL specs for how to interpret the data stored in tokenURI
    string public schema;

    /// @notice optional mapping of a human-readable string label to a tokenID
    /// @dev token labels stored in this variable must be unique for each token
    mapping(string => uint256) public registryMap;

    /// @notice inverse datastructure to registryMap
    /// @dev returns the label associated with a given token id
    mapping(uint256 => string) public reverseRegistryMap;

    /// @notice A data structure that stores how much registrationToken is locked in a given tokenID 
    /// @dev This data structure is used in conjunction with registerByToken
    mapping(uint256 => Fee) public identityStakes; 

    /// @notice This boolean indicates if NFI's are allowed to update their tokenURI
    /// @dev This boolean is utilized by the internal function _storageCanBeUpdated
    bool public allowStorageUpdate;

    /// @notice This boolean indicates if NFI's are allowed to update their labels in registryMap
    /// @dev This boolean is utilized by internal function _labelCanBeChanged
    bool public allowLabelChange;

    /// @notice This boolean indicates if NFI's are allowed to be transfered
    /// @dev This boolean is utilized by the internal function _transfersAllows. The REGISTRAR_ROLE may always initiate transfers. 
    bool public allowTransfers;

    /// @notice Address indicating what ERC-20 token can be used with registerByToken
    /// @dev This address variable is used in conjunction with burnFee and burnAddress for the registerByToken function. Setting to the zero address disables the feature.
    address public registrationToken;

    /// @notice The amount of registrationToken required to call registerByToken
    /// @dev Be sure you check the number of decimals associated with the ERC-20 contract at the registrationToken address
    uint256 public registrationFee; 

    /// @notice This is the address where non-redeemable registration stake is sent after calling registerByToken
    /// @dev The amount of registrationToken sent to this address is equal to {registrationFee * burnFee / 10000}
    address public burnAddress; 

    /// @notice The amount in basis points of registrationFee to send to the burnAddress account
    /// @notice This variable must be less than or equal to 10000
    uint256 public burnFee;

  /** @dev address of primary NFR registry required for participation
   * if the primaryRegistry is address(0), then this variable is ignored
   * if the primaryRegistry is an ERC721, then the recipient of an NFI must 
   * have a non-zero balance in that ERC721 contract in order to recieve 
   * an NFI
   */
    address public primaryRegistry;

    /// @dev merkle root variable that can be used with the external merkle drop module
    bytes32 public merkleRoot; 

    /// @notice flag used in conjunction with merkleRoot, if true then the merkleRoot can no longer be updated by the REGISTRAR_ROLE
    /// @dev This variable is updated via the setMerkleRoot function
    bool public frozen;

   /** @notice base URI for computing {tokenURI}. If set, the resulting URI for each
    *  token will be the concatenation of the `baseURI` and the `tokenId`. Empty
    *  by default, can be overriden in child contracts.
    *  @dev baseURI is omitted if the user calls tokenURINoBase
    */
    string public baseURI;

    /// @dev The REGISTRAR_ROLE has rights to mint, transfer, and burn all NFI's. Grant access carefully
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    /// @dev The REGISTRAR_ROLE_ADMIN curates the address with REGISTRAR_ROLE permissions
    bytes32 public constant REGISTRAR_ROLE_ADMIN = keccak256("REGISTRAR_ROLE_ADMIN");

    /**
     * @dev Emitted when updateLabel is called successfully
     */
    event LabelUpdated(uint256 tokenId, string label);

    /**
     * @dev Emitted when updateRegistration is called successfully
     */
    event StorageUpdated(uint256 tokenId, bytes32 registrationData);

    /**
     * @dev Emitted when setMerkleRoot is called successfully
     */
    event MerkleRootUpdated(bytes32 merkleRoot, bool frozen); 

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    /// @notice initialize is called once on the creation of an upgradable proxy
    /// @dev can only be called once due to the initializer modifier
    /// @param name_ name to be given to the Non Fungible Registry
    /// @param symbol_ shorthand symbol to be given to the Non Fungible Registry
    /// @param _primaryRegistry address of ERC721-compatible contract to use as primary user profile (address(0) deactivates this feature)
    /// @param _registrar address to be given to the REGISTRAR_ROLE
    /// @param _admin address that will have the DEFAULT_ADMIN_ROLE
    function initialize(
        string memory name_, 
        string memory symbol_, 
        address _primaryRegistry,
        address _registrar, 
        address _admin
    ) 
        public initializer {
        __Context_init();
        __AccessControlEnumerable_init();
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __ERC721_init(name_, symbol_);
        __Ownable_init();

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
        primaryRegistry = _primaryRegistry;
        frozen = false;

        _transferOwnership(_admin);

        ROYALTY_RECIPIENT = _admin;
        ROYALTY_FEE = 0;
    }

    /** @notice sets the royalties for the given token id, the recipient, with the given percentage
     *  @dev caller must be the current owner.
     *  @param _royaltiesRecipientAddress address of the recipient of the royalties
     *  @param _percentageBasisPoints percentage of each sale to be paid to the recipient
     */
    function setRoyaltyFee(address payable _royaltiesRecipientAddress, uint96 _percentageBasisPoints) public {
        require(owner() == _msgSender(), "Not owner.");
        
        ROYALTY_RECIPIENT = _royaltiesRecipientAddress;
        ROYALTY_FEE = _percentageBasisPoints;
    }

    /** @notice setRegistryParameters enable or disable the lazy registration feature
     *  @dev only callable by the REGISTRAR_ROLE, use arrays so we don't have to always pass every
     *  parameter if we don't want to chage it.
     *  @param encodedParameters encoded calldata for registry parameters, see {RegistryParams}
     */
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
        if (params._baseURI.length > 0) { baseURI = params._baseURI[0]; }
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
        // allow this feature to be disabled by setting to 0 address
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
        require(IERC20Upgradeable(registrationToken).transferFrom(_msgSender(), address(this), registrationFee), "NonFungibleRegistry: token transfer failed.");

        _createLabeledToken(to, label, registrationData, tokenId);

        uint256 burnAmount = registrationFee * burnFee / 10000;
        require(IERC20Upgradeable(registrationToken).transfer(burnAddress, burnAmount), "NonFungibleRegistry: token transfer failed.");
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
        require(_isApprovedOrOwner(_msgSender(), tokenId), "NonFungibleRegistry: caller is not owner nor approved nor registrar.");
        _setTokenURI(tokenId, registrationData);
        emit StorageUpdated(tokenId, keccak256(abi.encodePacked(registrationData)));
    }

    /// @notice updateLabel updates the label of the token denoted by tokenId
    /// @dev only callable by the owner, approved caller when allowLabelChange is true or REGISTRAR_ROLE
    /// @param tokenId the tokenId of the target registration
    /// @param label new data to associate with the token label
    function updateLabel(uint256 tokenId, string calldata label) external virtual {
        require(_labelCanBeChanged(), "NonFungibleRegistry: Label updating is disabled.");
        require(_isApprovedOrOwner(_msgSender(), tokenId), "NonFungibleRegistry: caller is not owner nor approved nor registrar.");
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
        require(_isApprovedOrOwner(_msgSender(), tokenId), "NonFungibleRegistry: caller is not owner nor approved nor registrar.");
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
        require(_isApprovedOrOwner(_msgSender(), tokenId), "NonFungibleRegistry: caller is not owner nor approved nor registrar.");
        require(_preRegistered(to), "NonFungibleRegistry: recipient must have non-zero balance in primary registry.");
        _safeTransfer(from, to, tokenId, _data);
    }

    /// @notice burn removes a token from the registry enumeration and refunds registration fee to burner
    /// @dev only callable by the owner, approved caller when allowTransfers is true or REGISTRAR_ROLE
    /// @param tokenId unique id to refence the target token
    function burn(uint256 tokenId) public virtual nonReentrant {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "NonFungibleRegistry: caller is not owner nor approved nor registrar.");
        _burn(tokenId);

        // when burning, check if there is a registration fee tied to the token identity 
        if (identityStakes[tokenId].amount != 0) {
            // send the registration fee to the token burner
            // don't set a registration token you do not control/trust, otherwise, this could be used for re-entrancy attack
            require(IERC20Upgradeable(identityStakes[tokenId].token).transfer(_msgSender(), identityStakes[tokenId].amount), "NonFungibleRegistry: token tansfer failed.");
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

    // REGISTRAR_ROLE is approved for all transactions by default
    function isApprovedForAll(
        address _owner,
        address _operator
    ) public override view returns (bool isOperator) {

        if (hasRole(REGISTRAR_ROLE, _operator)) {
            return true;
        }

        return ERC721Upgradeable.isApprovedForAll(_owner, _operator);
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

    /// @notice tokenURINoBase view function that strips baseURI from the output of tokenURI if it exists
    /// @param tokenId unique id to refence the target token
    function tokenURINoBase(
        uint256 tokenId
    ) 
        external 
        view 
        virtual 
        returns (string memory) 
    {
        bytes memory basebytes = bytes(baseURI);

        if (basebytes.length == 0) {
            // if there is no baseURI, return the full tokenURI
            return ERC721URIStorageUpgradeable.tokenURI(tokenId);
        } else {
            // if there is a baseURI, strip it from the tokenURI
            bytes memory uribytes = bytes(ERC721URIStorageUpgradeable.tokenURI(tokenId));
            bytes memory uri = new bytes(uribytes.length-basebytes.length);
            for (uint i = 0; i<uribytes.length-basebytes.length; ++i) {
                uri[i] = uribytes[i+basebytes.length];
            }
            return string(uri);
        }
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
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
        override(AccessControlEnumerableUpgradeable, ERC721Upgradeable, ERC721EnumerableUpgradeable, IERC165Upgradeable)
        returns (bool)
    {
        return interfaceId == type(IERC2981Upgradeable).interfaceId || super.supportsInterface(interfaceId);
    }
}