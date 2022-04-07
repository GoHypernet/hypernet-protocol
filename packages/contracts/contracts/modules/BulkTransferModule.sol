// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Context.sol";

/**
 * @title Hypernet Protocol Bulk Transfer Module for NFRs
 * @author Todd Chapman
 * @dev Implementation of bulk NFI transfer functionality
 *
 * See the documentation for more details:
 * https://docs.hypernet.foundation/hypernet-protocol/identity/modules#bulk-transfers
 * 
 * See the unit tests for example usage:
 * https://github.com/GoHypernet/hypernet-protocol/blob/dev/packages/contracts/test/upgradeable-registry-enumerable-test.js#L438
 */
contract BulkTransferModule is Context {

    /// @dev the name to be listed in the Hypernet Protocol Registry Modules NFR
    /// @dev see https://docs.hypernet.foundation/hypernet-protocol/identity#registry-modules
    string public name;

    constructor(string memory _name) 
    {
        name = _name; 
    }

    /// @notice bulkTransfer allows for the bulk transfer of multiple NFIs in a single transaction
    /// @dev msgSender must be approvedForAll to call this function
    /// @param owner address of the current NFI holder
    /// @param recipients address array of the recipients of the tokens
    /// @param tokenIds tokenids of the target NFIs to be transfered
    /// @param registry address of the target registry to call
    function bulkTransfer(
        address owner,
        address[] memory recipients, 
        uint256[] memory tokenIds,
        address registry
        ) 
        external 
        virtual 
        {
            require(recipients.length == tokenIds.length, "BulkTransferModule: recipients array must be same length as tokenIds array.");
            require(INfr(registry).isApprovedForAll(owner, _msgSender()), "BulkTransferModule: msgSender is not approved.");

            for (uint256 i = 0; i < recipients.length; ++i) {
                INfr(registry).safeTransferFrom(owner, recipients[i], tokenIds[i]);
            }
        }
}

/// @dev a minimal interface for interacting with Hypernet Protocol NFRs
interface INfr {
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function isApprovedForAll(address owner, address operator) external view returns (bool);
    function REGISTRAR_ROLE() external view returns (bytes32);
}