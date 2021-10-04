// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @dev {ERC721} compatible Registry, including:
 *
 *  - ability for holders or governance to burn (destroy) their tokens
 *  - a registrar role that allows for token minting (creation)
 *  - an admin role that allows for updating registry functionality
 *  - token lookup via human readable label that is unique to the registry
 *  - tokens may be lazy minted but admin should ensure that label updating is disabled
 * This contract uses {AccessControl} to lock permissioned functions using the
 * different roles - head to its documentation for details.
 *
 * The account that deploys the contract will be granted the registrar and pauser
 * roles, as well as the default admin role, which will let it grant both registrar
 * and pauser roles to other accounts.
 */
contract NonFungibleRegistryUpgradeable is
    Initializable,
    ContextUpgradeable,
    OwnableUpgradeable,
    AccessControlEnumerableUpgradeable,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable,
    UUPSUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    // since the registration token could be changed by the registrar
    // we need to store which token the fee was payed in along with 
    // the amount
    struct Fee {
      address token;
      uint256 amount;
    }

    // mapping a human-readable label to a tokenID
    mapping(string => uint256) public registryMap;

    // reverse mapping from tokenID to a human-readable label
    mapping(uint256 => string) public reverseRegistryMap;

    // registration fee belonging to each token which is refunded on burning
    mapping(uint256 => Fee) public identityStakes; 

    // allow lazy minting in this registry
    // Warning: ensure allowLabelChange is false before enabling
    // since the label is used as a nonce
    bool public allowLazyRegister;

    // allow for tokenURI to be updated
    bool public allowStorageUpdate;

    // allow for token label to be updated
    bool public allowLabelChange;

    // disallow token transfers for all but DEFAULT_ADMIN_ROLE
    bool public allowTransfers;

    // address of token used for token-based registration
    address public registrationToken;

    // amount of token required to call registerByToken
    uint256 public registrationFee; 

    // create a REGISTRAR_ROLE to manage registry functionality
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    CountersUpgradeable.Counter private _tokenIdTracker;

    /// @notice initialize is called once on the creation of an upgradable proxy
    /// @dev can only be called once due to the initializer modifier
    /// @param name_ name to be given to the Non Fungible Registry
    /// @param symbol_ shorthand symbol to be given to the Non Fungible Registry
    /// @param _registrar address to be given to the REGISTRAR_ROLE
    /// @param _admin address that will have the DEFAULT_ADMIN_ROLE
    function initialize(string memory name_, string memory symbol_, address _registrar, address _admin) public initializer {
        __Context_init();
        __Ownable_init();
        __AccessControlEnumerable_init();
        __ERC721Enumerable_init();
        __ERC721URIStorage_init();
        __ERC721_init(name_, symbol_);

        _setupRole(DEFAULT_ADMIN_ROLE, _admin);

        _setupRole(REGISTRAR_ROLE, _registrar);

        allowLazyRegister = false;
        allowStorageUpdate = true;
        allowLabelChange = false;
        allowTransfers = true;
        registrationFee = 1e18; // assume there are 18 decimal places in the token
    }

    // we must implement this function at top level contract definition for the upgradable proxy pattern
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /// @notice setLazyRegister enable or disable the lazy registration feature
    /// @dev only callable by the REGISTRAR_ROLE
    /// @param _allowLazyRegister boolean flag; false disables lazy registration
    function setLazyRegister(bool _allowLazyRegister) public virtual onlyProxy {
        require(hasRole(REGISTRAR_ROLE, _msgSender()), "NonFungibleRegistry: must be registrar.");
        allowLazyRegister = _allowLazyRegister;
    }

    /// @notice setStorageUpdate enable or disable updating the tokenURI field
    /// @dev only callable by the REGISTRAR_ROLE
    /// @param _allowStorageUpdate boolean flag; false disables updating the tokenURI field for all but REGISTRAR_ROLE
    function setStorageUpdate(bool _allowStorageUpdate) public virtual onlyProxy {
        require(hasRole(REGISTRAR_ROLE, _msgSender()), "NonFungibleRegistry: must be registrar.");
        allowStorageUpdate = _allowStorageUpdate;
    }

    /**
     * @dev Returns whether registration data can be updated or caller is REGISTRAR_ROLE
     */
    function _storageCanBeUpdated() internal view virtual returns (bool) {
        return (allowStorageUpdate || hasRole(REGISTRAR_ROLE, _msgSender()));
    }

    /// @notice setLabelUpdate enable or disable changing a token's label
    /// @dev only callable by the REGISTRAR_ROLE
    /// @param _allowLabelChange boolean flag; false disables transfers for all but REGISTRAR_ROLE
    function setLabelUpdate(bool _allowLabelChange) public virtual onlyProxy {
        require(hasRole(REGISTRAR_ROLE, _msgSender()), "NonFungibleRegistry: must be registrar.");
        allowLabelChange = _allowLabelChange;
    }

    /**
     * @dev Returns whether labels can be updated or caller is REGISTRAR_ROLE
     */
    function _labelCanBeChanged() internal view virtual returns (bool) {
        return (allowLabelChange || hasRole(REGISTRAR_ROLE, _msgSender()));
    }

    /// @notice setAllowTransfers enable or disable transfer of ownership of registry tokens
    /// @dev only callable by the REGISTRAR_ROLE
    /// @param _allowTransfers address of the token to use for regsitration
    function setAllowTransfers(bool _allowTransfers) public virtual onlyProxy {
        require(hasRole(REGISTRAR_ROLE, _msgSender()), "NonFungibleRegistry: must be registrar.");
        allowTransfers = _allowTransfers;
    }

    /**
     * @dev Returns whether transfers are allowed or caller is REGISTRAR_ROLE
     */
    function _transfersAllowed() internal view virtual returns (bool) {
        return (allowTransfers || hasRole(REGISTRAR_ROLE, _msgSender()));
    }

    /// @notice setRegistrationToken change the address of the token used for registration
    /// @dev only callable by the REGISTRAR_ROLE
    /// @param _registrationToken address of the token to use for regsitration
    function setRegistrationToken(address _registrationToken) public virtual onlyProxy {
        require(hasRole(REGISTRAR_ROLE, _msgSender()), "NonFungibleRegistry: must be registrar.");
        registrationToken = _registrationToken;
    }

    /// @notice setRegistrationFee change the amount of token required for registerByToken
    /// @dev only callable by the REGISTRAR_ROLE
    /// @param _registrationFee data to store in the tokenURI
    function setRegistrationFee(uint256 _registrationFee) public virtual onlyProxy {
        require(hasRole(REGISTRAR_ROLE, _msgSender()), "NonFungibleRegistry: must be registrar.");
        registrationFee = _registrationFee;
    }

    /// @notice register mints a new Non-Fungible Identity token
    /// @dev only callable by the REGISTRAR_ROLE
    /// @param to address of the recipient of the token
    /// @param label a unique label to attach to the token
    /// @param registrationData data to store in the tokenURI
    function register(address to, string memory label, string memory registrationData) public virtual onlyProxy {
        require(hasRole(REGISTRAR_ROLE, _msgSender()), "ERC721PresetMinterPauserAutoId: must have registrar role to register.");
        require(!_mappingExists(label), "NonFungibleRegistry: label is already registered.");

        uint256 tokenId = _createToken(to, registrationData);

        // extend the registry mapping for lookup via gateway URL
        registryMap[label] = tokenId;
        reverseRegistryMap[tokenId] = label;
    }

    /// @notice register mints a new Non-Fungible Identity token without a label
    /// @dev only callable by the REGISTRAR_ROLE
    /// @param to address of the recipient of the token
    /// @param registrationData data to store in the tokenURI
    function registerNoLabel(address to, string memory registrationData) public virtual onlyProxy {
        require(hasRole(REGISTRAR_ROLE, _msgSender()), "ERC721PresetMinterPauserAutoId: must have registrar role to mint");
        _createToken(to, registrationData);
    }

    /// @notice register mints a new Non-Fungible Identity token without a label
    /// @dev callable by anyone with enough registration token
    /// @param to address of the recipient of the token
    /// @param registrationData data to store in the tokenURI
    function registerByToken(address to, string memory label, string memory registrationData) public virtual onlyProxy {
        require(registrationToken != address(0), "NonFungibleRegistry: registration by token not enabled.");
        require(!_mappingExists(label), "NonFungibleRegistry: label is already registered.");

        // user must approve the registry to collect the registration fee from their wallet
        IERC20Upgradeable(registrationToken).transferFrom(_msgSender(), address(this), registrationFee);

        uint256 tokenId = _createToken(to, registrationData);

        // the fee stays with the token, not the token owner
        identityStakes[tokenId] = Fee(registrationToken, registrationFee); 

        // extend the registry mapping for lookup via gateway URL
        registryMap[label] = tokenId;
        reverseRegistryMap[tokenId] = label;
    }

    /**
     * @dev Creates a new token for `to`. Its token ID will be automatically
     * assigned (and available on the emitted {IERC721-Transfer} event), and the token
     * URI autogenerated based on the base URI passed at construction.
     *
     * See {ERC721-_mint}.
     *
     * Requirements:
     *
     * - the caller must have the `REGISTRAR_ROLE`.
     */
    function _createToken(address to, string memory registrationData) private returns (uint256 tokenId) {

        // We cannot just use balanceOf to create the new tokenId because tokens
        // can be burned (destroyed), so we need a separate counter.
        // Enforce that the counter start at 1 (not 0) so that we can check 
        // if a name exists
        tokenId = _tokenIdTracker.current() + 1;
        _mint(to, tokenId);
        _tokenIdTracker.increment();
        _setTokenURI(tokenId, registrationData);
    }

    /// @notice updateRegistration updates the tokenURI denoted by tokenId
    /// @dev only callable by the owner, approved caller when allowStorageUpdate is true or REGISTRAR_ROLE
    /// @param tokenId the tokenId of the target registration
    /// @param registrationData new data to store in the tokenURI
    function updateRegistration(uint256 tokenId, string memory registrationData) public virtual onlyProxy {
        require(_storageCanBeUpdated(), "NonFungibleRegistry: Storage updating is disabled.");
        require(_isApprovedOrOwnerOrRegistrar(_msgSender(), tokenId), "NonFungibleRegistry: caller is not owner nor approved nor registrar.");
        _setTokenURI(tokenId, registrationData);
    }

    /// @notice updateLabel updates the label of the token denoted by tokenId
    /// @dev only callable by the owner, approved caller when allowLabelChange is true or REGISTRAR_ROLE
    /// @param tokenId the tokenId of the target registration
    /// @param label new data to associate with the token label
    function updateLabel(uint256 tokenId, string memory label) public virtual onlyProxy {
        require(_labelCanBeChanged(), "NonFungibleRegistry: Label updating is disabled.");
        require(_isApprovedOrOwnerOrRegistrar(_msgSender(), tokenId), "NonFungibleRegistry: caller is not owner nor approved nor registrar.");
        require(!_mappingExists(label), "NonFungibleRegistry: label is already registered.");

        registryMap[label] = tokenId;
        reverseRegistryMap[tokenId] = label;
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
        _safeTransfer(from, to, tokenId, _data);
    }

    /// @notice burn removes a token from the registry enumeration
    /// @dev only callable by the owner, approved caller when allowTransfers is true or REGISTRAR_ROLE
    /// @param tokenId unique id to refence the target token
    function burn(uint256 tokenId) public virtual onlyProxy {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwnerOrRegistrar(_msgSender(), tokenId), "NonFungibleRegistry: caller is not owner nor approved nor registrar.");
        _burn(tokenId);
    }

    /**
     * @dev Burns `tokenId`. See {ERC721-_burn}.
     *
     * Requirements:
     *
     * - The caller must own `tokenId` or be an approved operator.
     */
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

    /**
     * @dev Returns whether `spender` is allowed to manage `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
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

    /**
     * @dev Returns whether the registry mapping exists already exists.
     */
    function _mappingExists(string memory label) internal view virtual returns (bool) {
        return !(registryMap[label] == 0);
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

    /// @notice lazyRegister REGISTRAR_ROLE to offload gas cost of minting to reciever 
    /// @dev REGISTRAR_ROLE must provide a signature and allowLabelChange must be false to prevent replay
    /// @param to address of the recipient of the token
    /// @param label a unique label to attach to the token
    /// @param registrationData data to store in the tokenURI 
    /// @param signature signature from REGISTRAR_ROLE 
    function lazyRegister(address to, string memory label, string memory registrationData, bytes memory signature)
        public onlyProxy {
        // check if lazy registration is allowed for this NFI
        require(allowLazyRegister, "NonFungibleRegistry: Lazy registration is disabled.");

        // ensure that label changing is disabled since the label is used at the token's nonce
        require(allowLabelChange, "NonFungibleRegistry: label changes must be disabled for lazy registration.");

        // the token label is the nonce to prevent replay attack
        require(!_mappingExists(label), "NonFungibleRegistry: Registration label already exists.");
        
        // transaction caller must be recipient
        require(_msgSender() == to, "NonFungibleRegistry: Caller is not recipient.");
        
        // require a valid signature from a member of REGISTRAR_ROLE
        require(_isValidSignature(to, label, registrationData, signature), "NonFungibleRegistry: signature failure.");
        
        // issue new Ntoken FT here
        uint256 tokenId = _tokenIdTracker.current() + 1;
        _mint(to, tokenId);
        _tokenIdTracker.increment();
        _setTokenURI(tokenId, registrationData);

        // extend the registry mapping for lookup via gateway URL
        registryMap[label] = tokenId;
        reverseRegistryMap[tokenId] = label;
    }
    
    /**
     * @dev helper function that validates a signature 
     */ 
    function _isValidSignature(address to, string memory label, string memory registrationData, bytes memory signature)
        internal
        view
        returns (bool)
    {
        // convert the payload to a 32 byte hash
        bytes32 hash = ECDSAUpgradeable.toEthSignedMessageHash(keccak256(abi.encodePacked(to, label, registrationData)));
        
        // check that the signature is from REGISTRAR_ROLE
        return hasRole(REGISTRAR_ROLE, ECDSAUpgradeable.recover(hash, signature));
    }
}
