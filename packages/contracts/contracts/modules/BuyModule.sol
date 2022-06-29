// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../interfaces/INfr.sol";

/**
 * @title Hypernet Protocol Buy Module for NFRs
 * @author Todd Chapman
 * @dev Implementation of a simple purchasing extension for NFRs
 *
 * See the documentation for more details:
 * https://docs.hypernet.foundation/hypernet-protocol/identity/modules#buy-nfi
 *
 * See the unit tests for example usage:
 * https://github.com/GoHypernet/hypernet-protocol/blob/dev/packages/contracts/test/upgradeable-registry-enumerable-test.js#L493
 */
contract BuyModule is Context {

    using SafeERC20 for IERC20;

    /// @dev the name to be listed in the Hypernet Protocol Registry Modules NFR
    /// @dev see https://docs.hypernet.foundation/hypernet-protocol/identity#registry-modules
    string public name;

    constructor(string memory _name) 
    {
        name = _name; 
    }

    /// @notice buyNFI purchase any NFIs still held by a REGISTRAR_ROLE account from the specified NFR
    /// @dev The price is set by the registrationFee and 
    /// @param tokenId id of the token you want to buy
    /// @param registry address of the target registry to call
    function buyNFI( 
        uint256 tokenId,
        address registry
        ) 
        external 
        virtual 
        {
            require(registry != address(0), "BuyModule: Invalid registry address.");
            address seller = INfr(registry).ownerOf(tokenId);
            uint256 price = INfr(registry).registrationFee();
            // the current owner of the tokenid must be an account in the REGISTRAR_ROLE
            require(INfr(registry).hasRole(INfr(registry).REGISTRAR_ROLE(), seller), "BuyModule: token not for sale.");
            // to use this module, the registrationFee should be non-zero
            require(price > 0, "BuyModule: purchase price must be greater than 0.");
            // transfer the registrationToken from the purchaser to the burnAddress
            require(IERC20(INfr(registry).registrationToken()).transferFrom(_msgSender(), INfr(registry).burnAddress(), price), "BuyModule: ERC20 token transfer failed.");
            // transfer the NFI from the REGISTRAR_ROLE holder to the purchaser
            INfr(registry).safeTransferFrom(seller, _msgSender(), tokenId);
            require(INfr(registry).ownerOf(tokenId) == _msgSender(), "BuyModule: NFI purchase transfer failed");
        }
}
