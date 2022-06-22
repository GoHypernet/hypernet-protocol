// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Context.sol";
import "../interfaces/INfr.sol";

/**
 * @title Hypernet Protocol Batch Minting Module for NFRs
 * @author Todd Chapman
 * @dev Implementation of a batch minting extension for NFRs
 *
 * See the documentation for more details:
 * https://docs.hypernet.foundation/hypernet-protocol/identity/modules#batch-minting
 * 
 * See the unit tests for example usage:
 * https://github.com/GoHypernet/hypernet-protocol/blob/dev/packages/contracts/test/upgradeable-registry-enumerable-test.js#L438
 */
contract BatchModule is Context {

    /// @dev the name to be listed in the Hypernet Protocol Registry Modules NFR
    /// @dev see https://docs.hypernet.foundation/hypernet-protocol/identity#registry-modules
    string public name;

    constructor(string memory _name) 
    {
        name = _name; 
    }

    /// @notice batchRegister batch mints a sequence of Non-Fungible Identity tokens in one transaction
    /// @dev msgSender must must have the REGISTRAR_ROLE as well as this contract
    /// @param recipients address array of the recipients of the tokens
    /// @param labels an array of unique labels to attach to the tokens
    /// @param registrationDatas data to store in the tokenURI
    /// @param tokenIds tokenIds to be given to NFIs produced by the batch registration
    /// @param registry address of the target registry to call
    function batchRegister(
        address[] memory recipients, 
        string[] memory labels, 
        string[] memory registrationDatas,
        uint256[] memory tokenIds,
        address registry
        ) 
        external 
        virtual 
        {
            require(INfr(registry).hasRole(INfr(registry).REGISTRAR_ROLE(), _msgSender()), "BatchModule: msgSender must be registrar.");
            require(recipients.length == labels.length, "BatchModule: recipients array must be same length as labels array.");
            require(registrationDatas.length == labels.length, "BatchModule: registrationDatas array must be same length as labels array.");
            require(tokenIds.length == labels.length, "BatchModule: tokenIds array must be same length as labels array.");

            for (uint256 i = 0; i < recipients.length; ++i) {
                INfr(registry).register(recipients[i], labels[i], registrationDatas[i], tokenIds[i]);
            }
        }
}
