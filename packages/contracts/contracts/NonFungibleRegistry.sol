// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

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
contract NonFungibleRegistry is
    Context,
    AccessControlEnumerable,
    ERC721Enumerable,
    ERC721URIStorage
{
    using Counters for Counters.Counter;

    // mapping a human-readable label to a tokenID
    mapping(string => uint256) public registryMap;

    // reverse mapping from tokenID to a human-readable label
    mapping(uint256 => string) public reverseRegistryMap;

    // allow lazy minting in this registry
    // Warning: ensure allowLabelChange is false before enabling
    bool public allowLazyRegister = false;

    // allow for tokenURI to be updated
    bool public allowStorageUpdate = true;

    // allow for token label to be updated
    bool public allowLabelChange = false;

    // disallow token transfers for all but DEFAULT_ADMIN_ROLE
    bool public allowTransfers = true;

    // create a REGISTRAR_ROLE to manage registry functionality
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    Counters.Counter private _tokenIdTracker;

    /**
     * @dev Grants `DEFAULT_ADMIN_ROLE`, and `REGISTRAR_ROLE` to the
     * account passed into the constructor.
     *
     * Token URIs are set by the REGISTRAR_ROLE and can be updated by 
     * the token owner or the REGISTRAR_ROLE once minted if the contract
     * is set to allow for URI updates
     * See {ERC721-tokenURI}.
     */
    constructor(string memory name_, string memory symbol_, address _registrar, address _admin) ERC721(name_, symbol_) {

        _setupRole(DEFAULT_ADMIN_ROLE, _admin);

        _setupRole(REGISTRAR_ROLE, _registrar);
    }

    /**
    * @dev Permanently destroys the registry, making it inaccessible
    */
    function destroyRegistry(address recipient) public virtual {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "NonFungibleRegistry: only admin can destroy the registry.");
        selfdestruct(payable(recipient));
    }

    /**
    * @dev set lazy register functionality
    */
    function setLazyRegister(bool _allowLazyRegister) public virtual {
        require(hasRole(REGISTRAR_ROLE, _msgSender()), "NonFungibleRegistry: must be registrar.");
        allowLazyRegister = _allowLazyRegister;
    }

    /**
    * @dev set token URI modification rule
    */
    function setStorageUpdate(bool _allowStorageUpdate) public virtual {
        require(hasRole(REGISTRAR_ROLE, _msgSender()), "NonFungibleRegistry: must be registrar.");
        allowStorageUpdate = _allowStorageUpdate;
    }

    /**
     * @dev Returns whether registration data can be updated or caller is REGISTRAR_ROLE
     */
    function _storageCanBeUpdated() internal view virtual returns (bool) {
        return (allowStorageUpdate || hasRole(REGISTRAR_ROLE, _msgSender()));
    }

    /**
    * @dev set token label modification rule
    */
    function setLabelUpdate(bool _allowLabelChange) public virtual {
        require(hasRole(REGISTRAR_ROLE, _msgSender()), "NonFungibleRegistry: must be registrar.");
        allowLabelChange = _allowLabelChange;
    }

    /**
     * @dev Returns whether labels can be updated or caller is REGISTRAR_ROLE
     */
    function _labelCanBeChanged() internal view virtual returns (bool) {
        return (allowLabelChange || hasRole(REGISTRAR_ROLE, _msgSender()));
    }

   /**
    * @dev dissallow the transfer of NFIs
    */
    function setAllowTransfers(bool _allowTransfers) public virtual {
        require(hasRole(REGISTRAR_ROLE, _msgSender()), "NonFungibleRegistry: must be registrar.");
        allowTransfers = _allowTransfers;
    }

    /**
     * @dev Returns whether transfers are allowed or caller is REGISTRAR_ROLE
     */
    function _transfersAllowed() internal view virtual returns (bool) {
        return (allowTransfers || hasRole(REGISTRAR_ROLE, _msgSender()));
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
    function register(address to, string memory label, string memory registrationData) public virtual {
        require(hasRole(REGISTRAR_ROLE, _msgSender()), "ERC721PresetMinterPauserAutoId: must have registrar role to register.");
        require(!_mappingExists(label), "NonFungibleRegistry: label is already registered.");

        // We cannot just use balanceOf to create the new tokenId because tokens
        // can be burned (destroyed), so we need a separate counter.
        // Enforce that the counter start at 1 (not 0) so that we can check 
        // if a name exists
        uint256 tokenId = _tokenIdTracker.current() + 1;
        
        _mint(to, tokenId);
        _tokenIdTracker.increment();
        _setTokenURI(tokenId, registrationData);

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
    function registerNoLabel(address to, string memory registrationData) public virtual {
        require(hasRole(REGISTRAR_ROLE, _msgSender()), "ERC721PresetMinterPauserAutoId: must have registrar role to mint");

        // We cannot just use balanceOf to create the new tokenId because tokens
        // can be burned (destroyed), so we need a separate counter.
        // Enforce that the counter start at 1 (not 0) so that we can check 
        // if a name exists
        uint256 tokenId = _tokenIdTracker.current() + 1;
        _mint(to, tokenId);
        _tokenIdTracker.increment();
        _setTokenURI(tokenId, registrationData);
    }

    /**
     * @dev Updates the data stored in the token at tokenId
     *
     * Requirements:
     *
     * - the caller must have the `DEFAULT_ADMIN_ROLE` or own the token.
     * - allowStorageUpdate must be set to true.
     */
    function updateRegistration(uint256 tokenId, string memory registrationData) public virtual {
        require(_storageCanBeUpdated(), "NonFungibleRegistry: Storage updating is disabled.");
        require(_isApprovedOrOwnerOrRegistrar(_msgSender(), tokenId), "NonFungibleRegistry: caller is not owner nor approved nor registrar.");
        _setTokenURI(tokenId, registrationData);
    }

    /**
     * @dev Updates the label assigned to the token at tokenId
     *
     * Requirements:
     *
     * - the caller must have the `DEFAULT_ADMIN_ROLE` or own the token.
     * - allowStorageUpdate must be set to true.
     */
    function updateLabel(uint256 tokenId, string memory label) public virtual {
        require(_labelCanBeChanged(), "NonFungibleRegistry: Label updating is disabled.");
        require(_isApprovedOrOwnerOrRegistrar(_msgSender(), tokenId), "NonFungibleRegistry: caller is not owner nor approved nor registrar.");
        require(!_mappingExists(label), "NonFungibleRegistry: label is already registered.");

        registryMap[label] = tokenId;
        reverseRegistryMap[tokenId] = label;
    }

    /**
     * @dev Burns `tokenId`. See {ERC721-_burn}.
     *
     * Requirements:
     *
     * - The caller must own `tokenId` or be an approved operator.
     */
    function burn(uint256 tokenId) public virtual {
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
        override(ERC721, ERC721URIStorage)
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
        address owner = ERC721.ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender) || hasRole(REGISTRAR_ROLE, _msgSender()));
    }

    /**
     * @dev See {IERC721URIStorage-tokenURI}.
     */
    function tokenURI(
        uint256 tokenId
    ) 
        public 
        view 
        virtual 
        override(ERC721URIStorage, ERC721)
        returns (string memory) 
    {
        return ERC721URIStorage.tokenURI(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable) {
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
        override(AccessControlEnumerable, ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev implicit ('lazy') minting by the recipient of an NFT in posession of a valid signature.
     * This allows for offloading gas costs to the recipient.
     * Requirements:
     *
     * - the caller must have a signature from someone with the `REGISTRAR_ROLE`.
     */ 
    function lazyRegister(address to, string memory label, string memory registrationData, bytes memory signature)
        public {
        // check if lazy registration is allowed for this NFI
        require(allowLazyRegister, "NonFungibleRegistry: Lazy registration is disabled.");

        // the token label is the nonce to prevent replay attack
        require(!_mappingExists(label), "NonFungibleRegistry: Registration label already exists.");
        
        // transaction caller must be recipient
        require(_msgSender() == to, "NonFungibleRegistry: Caller is not recipient.");
        
        // require a valid signature from a member of REGISTRAR_ROLE
        require(isValidSignature(to, label, registrationData, signature), "NonFungibleRegistry: signature failure.");
        
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
    function isValidSignature(address to, string memory label, string memory registrationData, bytes memory signature)
        internal
        view
        returns (bool)
    {
        // convert the payload to a 32 byte hash
        bytes32 hash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(to, label, registrationData)));
        
        // check that the signature is from REGISTRAR_ROLE
        return hasRole(REGISTRAR_ROLE, ECDSA.recover(hash, signature));
    }
}
