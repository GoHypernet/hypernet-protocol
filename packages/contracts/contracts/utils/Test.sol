// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/interfaces/IERC165.sol";
import "contracts/access/NFTAccessControlUpgradeable.sol";
import "contracts/access/INFTAccessControlUpgradeable.sol";

/**
 * @title Helper contract for Hypernet Protocol unit tests
 * @author Todd Chapman
 * @dev Used for testing NFT-based access control extension and intropective interfaces
 *
 * See the documentation for more details:
 * https://docs.hypernet.foundation/hypernet-protocol/identity/access
 *
 * See the unit tests for example usage:
 * https://github.com/GoHypernet/hypernet-protocol/blob/dev/packages/contracts/test/NFTAccessControl-test.js
 */
contract Test is NFTAccessControlUpgradeable {

    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    // initialize the contract with the administrative registry and admin tokenId
    function initialize(address nftRegistry, uint256 tokenId) public initializer {
        __NFTAccessControl_init(nftRegistry);
        _setupRole(DEFAULT_ADMIN_ROLE, tokenId);
    }

    function checkForEIP2981(address _contract) external view returns (bool) {
        (bool success) = IERC165(_contract).supportsInterface(_INTERFACE_ID_ERC2981);
        return success;
    }
}