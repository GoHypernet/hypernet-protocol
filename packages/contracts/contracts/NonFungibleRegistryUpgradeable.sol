// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract NonFungibleRegistryUpgradeable is
    Initializable,
    ContextUpgradeable,
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

    // DFDL schema definition for metadata stored in tokenURI
    string public schema;

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

    // create an `UPGRADER_ROLE` for safe upgrading
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    CountersUpgradeable.Counter private _tokenIdTracker;

    event LabelUpdated(uint256 tokenId, string label);

    event StorageUpdated(uint256 tokenId, bytes32 registrationData);

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
        __UUPSUpgradeable_init();
        __ERC721_init(name_, symbol_);

        _setupRole(DEFAULT_ADMIN_ROLE, _admin);

        _setupRole(REGISTRAR_ROLE, _registrar);

        _setupRole(UPGRADER_ROLE, _msgSender());

        allowLazyRegister = false;
        allowStorageUpdate = true;
        allowLabelChange = false;
        allowTransfers = true;
        registrationToken = address(0);
        registrationFee = 1e18; // assume there are 18 decimal places in the token
    }

    // we must implement this function at top level contract definition for the upgradable proxy pattern
    function _authorizeUpgrade(address newImplementation) internal onlyRole(UPGRADER_ROLE) override {}

    /// @notice setRegistryParameters enable or disable the lazy registration feature
    /// @dev only callable by the REGISTRAR_ROLE, use arrays so we don't have to always pass every
    /// parameter if we don't want to chage it.
    /// @param _schema DFDL-compatible schema definition
    /// @param _allowLazyRegister boolean flag; false disables lazy registration
    /// @param _allowStorageUpdate boolean flag; false disables updating the tokenURI field for all but REGISTRAR_ROLE
    /// @param _allowLabelChange boolean flag; false disables transfers for all but REGISTRAR_ROLE
    /// @param _allowTransfers address of the token to use for regsitration
    /// @param _registrationToken address of the token to use for regsitration
    /// @param _registrationFee data to store in the tokenURI
    function setRegistryParameters(string[] memory _schema, 
                                   bool[] memory _allowLazyRegister,
                                   bool[] memory _allowStorageUpdate,
                                   bool[] memory _allowLabelChange,
                                   bool[] memory _allowTransfers,
                                   address[] memory _registrationToken,
                                   uint256[] memory  _registrationFee
                                   )
        external 
        virtual {
        require(hasRole(REGISTRAR_ROLE, _msgSender()), "NonFungibleRegistry: must be registrar.");
        if (_schema.length > 0) {schema = _schema[0];}
        if (_allowLazyRegister.length > 0) {allowLazyRegister = _allowLazyRegister[0];}
        if (_allowStorageUpdate.length > 0) {allowStorageUpdate = _allowStorageUpdate[0];}
        if (_allowLabelChange.length > 0) {allowLabelChange = _allowLabelChange[0];}
        if (_allowTransfers.length > 0) {allowTransfers = _allowTransfers[0];}
        if (_registrationToken.length > 0) {registrationToken = _registrationToken[0];}
        if (_registrationFee.length > 0) {registrationFee = _registrationFee[0];}
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
    function register(address to, string memory label, string memory registrationData) external virtual {
        require(hasRole(REGISTRAR_ROLE, _msgSender()), "NonFungibleRegistry: must have registrar role to register.");
        _createLabeledToken(to, label, registrationData);
    }

    /// @notice batchRegister batch mints a sequence of Non-Fungible Identity tokens in one transaction
    /// @dev only callable by the REGISTRAR_ROLE
    /// @param recipients address array of the recipients of the tokens
    /// @param labels an array of unique labels to attach to the tokens
    /// @param registrationDatas data to store in the tokenURI
    function batchRegister(address[] memory recipients, string[] memory labels, string[] memory registrationDatas) external virtual {
        require(hasRole(REGISTRAR_ROLE, _msgSender()), "NonFungibleRegistry: must have registrar role to register.");
        require(recipients.length == labels.length, "NonFungibleRegistry: recipients array must be same length as labels array.");
        require(registrationDatas.length == labels.length, "NonFungibleRegistry: registrationDatas array must be same length as labels array.");

        for (uint256 i = 0; i < recipients.length; ++i) {
            _createLabeledToken(recipients[i], labels[i], registrationDatas[i]);
        }
    }

    /// @notice registerByToken mints a new Non-Fungible Identity token by staking an ERC20 registration token
    /// @dev callable by anyone with enough registration token, caller must call `approve` first
    /// @param to address of the recipient of the token
    /// @param label a unique label to attach to the token
    /// @param registrationData data to store in the tokenURI
    function registerByToken(address to, string memory label, string memory registrationData) external virtual {
        require(registrationToken != address(0), "NonFungibleRegistry: registration by token not enabled.");
        require(!_mappingExists(label), "NonFungibleRegistry: label is already registered.");

        // user must approve the registry to collect the registration fee from their wallet
        IERC20Upgradeable(registrationToken).transferFrom(_msgSender(), address(this), registrationFee);
        uint256 tokenId = _createLabeledToken(to, label, registrationData);
        // the fee stays with the token, not the token owner
        identityStakes[tokenId] = Fee(registrationToken, registrationFee);
    }

    function _createLabeledToken(address to, string memory label, string memory registrationData) private returns (uint256 tokenId) {

        // We cannot just use balanceOf to create the new tokenId because tokens
        // can be burned (destroyed), so we need a separate counter.
        // Enforce that the counter start at 1 (not 0) so that we can check 
        // if a name exists
        if (bytes(label).length > 0) {
            require(!_mappingExists(label), "NonFungibleRegistry: label is already registered.");
            tokenId = _createToken(to, registrationData);
            // extend the registry mapping for lookup via token label
            registryMap[label] = tokenId;
            reverseRegistryMap[tokenId] = label;
        } else {
            // if label is empty, save some gas
            tokenId = _createToken(to, registrationData);
        }
    }

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
    function updateRegistration(uint256 tokenId, string memory registrationData) external virtual {
        require(_storageCanBeUpdated(), "NonFungibleRegistry: Storage updating is disabled.");
        require(_isApprovedOrOwnerOrRegistrar(_msgSender(), tokenId), "NonFungibleRegistry: caller is not owner nor approved nor registrar.");
        _setTokenURI(tokenId, registrationData);
        emit StorageUpdated(tokenId, keccak256(abi.encodePacked(registrationData)));
    }

    /// @notice updateLabel updates the label of the token denoted by tokenId
    /// @dev only callable by the owner, approved caller when allowLabelChange is true or REGISTRAR_ROLE
    /// @param tokenId the tokenId of the target registration
    /// @param label new data to associate with the token label
    function updateLabel(uint256 tokenId, string memory label) external virtual {
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
            IERC20Upgradeable(identityStakes[tokenId].token).transfer(_msgSender(), registrationFee);
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
    function lazyRegister(address to, 
                          string memory label, 
                          string memory registrationData, 
                          bytes memory signature)
        public {
        // check if lazy registration is allowed for this NFI
        require(allowLazyRegister, "NonFungibleRegistry: Lazy registration is disabled.");

        // ensure that label changing is disabled since the label is used at the token's nonce
        require(!allowLabelChange, "NonFungibleRegistry: label changes must be disabled for lazy registration.");

        // the token label is the nonce to prevent replay attack
        require(!_mappingExists(label), "NonFungibleRegistry: Registration label already exists.");
        
        // transaction caller must be recipient
        require(_msgSender() == to, "NonFungibleRegistry: Caller is not recipient.");
        
        // require a valid signature from a member of REGISTRAR_ROLE
        require(_isValidSignature(to, label, registrationData, signature), "NonFungibleRegistry: signature failure.");
        
        // issue new token here
        _createLabeledToken(to, label, registrationData);
    }
    
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