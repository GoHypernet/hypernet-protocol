// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./INFTAccessControlUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";

/**
 * @dev Contract module that allows children to implement role-based access
 * control mechanisms in which roles are denoted by ownership of an ERC721
 * compatible token. This is a lightweight version that doesn't allow enumerating role
 * members except through off-chain means by accessing the contract event logs. Some
 * applications may benefit from on-chain enumerability, for those cases see
 * {AccessControlEnumerable}.
 *
 * Roles are referred to by their `bytes32` identifier. These should be exposed
 * in the external API and be unique. The best way to achieve this is by
 * using `public constant` hash digests:
 *
 * ```
 * bytes32 public constant MY_ROLE = keccak256("MY_ROLE");
 * ```
 *
 * Roles can be used to represent a set of permissions. To restrict access to a
 * function call, use {hasRole}:
 *
 * ```
 * function foo() public {
 *     require(hasRole(MY_ROLE, msg.sender));
 *     ...
 * }
 * ```
 *
 * Roles can be granted and revoked dynamically via the {grantRole} and
 * {revokeRole} functions. Each role has an associated admin role, and only
 * accounts that have a role's admin role can call {grantRole} and {revokeRole}.
 *
 * By default, the admin role for all roles is `DEFAULT_ADMIN_ROLE`, which means
 * that only accounts with this role will be able to grant or revoke other
 * roles. More complex role relationships can be created by using
 * {_setRoleAdmin}.
 *
 * WARNING: The `DEFAULT_ADMIN_ROLE` is also its own admin: it has permission to
 * grant and revoke this role. Extra precautions should be taken to secure
 * accounts that have been granted it.
 */
abstract contract NFTAccessControlUpgradeable is Initializable, ContextUpgradeable, INFTAccessControlUpgradeable, ERC165Upgradeable {
    function __NFTAccessControl_init(address registry) internal initializer {
        __Context_init_unchained();
        __ERC165_init_unchained();
        __NFTAccessControl_init_unchained();

        _nftRegistry = registry;
    }

    function __NFTAccessControl_init_unchained() internal initializer {
    }
    struct RoleData {
        mapping(uint256 => bool) members;
        bytes32 adminRole;
    }

    mapping(bytes32 => RoleData) private _roles;

    address private _nftRegistry;

    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

    /**
     * @dev Modifier that checks that an account owns a token associated with a 
     * specific role. Reverts with a standardized message including the required role.
     *
     * The format of the revert reason is given by the following regular expression:
     *
     *  /^NFTAccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
     *
     * _Available since v4.1._
     */
    modifier onlyRole(bytes32 role) {
        _checkRole(role, _msgSender());
        _;
    }

    /**
     * @dev Returns `true` if `tokenId` has been granted `role`.
     */
    function hasRole(bytes32 role, uint256 tokenId) public view override returns (bool) {
        return _roles[role].members[tokenId];
    }

    /**
     * @dev Returns `true` if `account` owns an ERC721 token that has been granted `role`.
     */
    function hasRole(bytes32 role, address account) public view override returns (bool) {
        uint256 length = ERC721EnumerableUpgradeable(_nftRegistry).balanceOf(account);
        for (uint256 i = 0; i < length; ++i) {
            if (_roles[role].members[ERC721EnumerableUpgradeable(_nftRegistry).tokenOfOwnerByIndex(account, i)]) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(INFTAccessControlUpgradeable).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev Revert with a standard message if `account` is missing `role`.
     *
     * The format of the revert reason is given by the following regular expression:
     *
     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
     */
    function _checkRole(bytes32 role, address account) internal view {
        if (!hasRole(role, account)) {
            revert(
                string(
                    abi.encodePacked(
                        "NFTAccessControl: account ",
                        StringsUpgradeable.toHexString(uint160(account), 20),
                        " is missing role ",
                        StringsUpgradeable.toHexString(uint256(role), 32)
                    )
                )
            );
        }
    }

    /**
     * @dev Returns the admin role that controls `role`. See {grantRole} and
     * {revokeRole}.
     *
     * To change a role's admin, use {_setRoleAdmin}.
     */
    function getRoleAdmin(bytes32 role) public view override returns (bytes32) {
        return _roles[role].adminRole;
    }

    /**
     * @dev Grants `role` to `tokenId`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function grantRole(bytes32 role, uint256 tokenId) public virtual override onlyRole(getRoleAdmin(role)) {
        _grantRole(role, tokenId);
    }

    /**
     * @dev Revokes `role` from `tokenId`.
     *
     * If `tokenId` had been granted `role`, emits a {RoleRevoked} event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function revokeRole(bytes32 role, uint256 tokenId) public virtual override onlyRole(getRoleAdmin(role)) {
        _revokeRole(role, tokenId);
    }

    /**
     * @dev Revokes `role` from the calling account.
     *
     * Roles are often managed via {grantRole} and {revokeRole}: this function's
     * purpose is to provide a mechanism for accounts to lose their privileges
     * if they are compromised (such as when a trusted device is misplaced).
     *
     * If the calling account had been granted `role`, emits a {RoleRevoked}
     * event.
     *
     * Requirements:
     *
     * - the caller must be `account`.
     */
    function renounceRole(bytes32 role, uint256 tokenId) public virtual override {
        require(ERC721EnumerableUpgradeable(_nftRegistry).ownerOf(tokenId) == _msgSender(), "NFTAccessControl: can only renounce roles for self");
        _revokeRole(role, tokenId);
    }

    /**
     * @dev Grants `role` to `tokenId`.
     *
     * If `tokenId` had not been already granted `role`, emits a {RoleGranted}
     * event. Note that unlike {grantRole}, this function doesn't perform any
     * checks on the calling account.
     *
     * [WARNING]
     * ====
     * This function should only be called from the constructor when setting
     * up the initial roles for the system.
     *
     * Using this function in any other way is effectively circumventing the admin
     * system imposed by {AccessControl}.
     * ====
     */
    function _setupRole(bytes32 role, uint256 tokenId) internal virtual {
        _grantRole(role, tokenId);
    }

    /**
     * @dev Sets `adminRole` as ``role``'s admin role.
     *
     * Emits a {RoleAdminChanged} event.
     */
    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
        bytes32 previousAdminRole = getRoleAdmin(role);
        _roles[role].adminRole = adminRole;
        emit RoleAdminChanged(role, previousAdminRole, adminRole);
    }

    function _grantRole(bytes32 role, uint256 tokenId) private {
        if (!hasRole(role, tokenId)) {
            _roles[role].members[tokenId] = true;
            emit RoleGranted(role, tokenId, _msgSender());
        }
    }

    function _revokeRole(bytes32 role, uint256 tokenId) private {
        if (hasRole(role, tokenId)) {
            _roles[role].members[tokenId] = false;
            emit RoleRevoked(role, tokenId, _msgSender());
        }
    }
    uint256[49] private __gap;
}
