// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract BuyModule is Context {

    using SafeERC20 for IERC20;

    string public name;

    constructor(string memory _name) 
    {
        name = _name; 
    }

    /// @notice buyNFI purchase any NFIs still held by a REGISTRAR_ROLE account
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
            // the current owner of the tokenid must be an account in the REGISTRAR_ROLE
            require(INfr(registry).hasRole(INfr(registry).REGISTRAR_ROLE(), INfr(registry).ownerOf(tokenId)), "BuyModule: token already sold.");
            // to use this module, the registrationFee should be non-zero
            require(INfr(registry).registrationFee() > 0, "BuyModule: purchase price must be greater than 0.");
            // transfer the registrationToken from the purchaser to the burnAddress
            require(IERC20(INfr(registry).registrationToken()).transferFrom(_msgSender(), INfr(registry).burnAddress(), INfr(registry).registrationFee()), "BuyModule: ERC20 token transfer failed.");
            // transfer the NFI from the REGISTRAR_ROLE holder to the purchaser
            INfr(registry).safeTransferFrom(INfr(registry).ownerOf(tokenId), _msgSender(), tokenId);
            require(INfr(registry).ownerOf(tokenId) == _msgSender(), "BuyModule: NFI purchase transfer failed");
        }
}

// minimal interface for the NonFungibleRegistry register function
interface INfr {
    function ownerOf(uint256 tokenId) external view returns (address);
    function hasRole(bytes32 role, address account) external view returns (bool);
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function REGISTRAR_ROLE() external view returns (bytes32);
    function registrationFee() external view returns (uint256);
    function registrationToken() external view returns (address);
    function burnAddress() external view returns (address);
}