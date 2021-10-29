// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Context.sol";

contract BatchModule is Context {

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
    /// @param registry address of the target registry to call
    function batchRegister(
        address[] memory recipients, 
        string[] memory labels, 
        string[] memory registrationDatas, 
        address registry
        ) 
        external 
        virtual 
        {
            require(INfr(registry).hasRole(INfr(registry).REGISTRAR_ROLE(), _msgSender()), "BatchModule: msgSender must be registrar.");
            require(recipients.length == labels.length, "BatchModule: recipients array must be same length as labels array.");
            require(registrationDatas.length == labels.length, "BatchModule: registrationDatas array must be same length as labels array.");

            for (uint256 i = 0; i < recipients.length; ++i) {
                INfr(registry).register(recipients[i], labels[i], registrationDatas[i]);
            }
        }
}

// minimal interface for the NonFungibleRegistry register function
interface INfr {
    function register(address to, string calldata label, string calldata registrationData) external;
    function hasRole(bytes32 role, address account) external view returns (bool);
    function REGISTRAR_ROLE() external view returns (bytes32);
}