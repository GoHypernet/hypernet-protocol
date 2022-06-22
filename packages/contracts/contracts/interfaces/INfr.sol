// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/// @dev a minimal interface for interacting with Hypernet Protocol NFRs
interface INfr {
    function ownerOf(uint256 tokenId) external view returns (address);
    function hasRole(bytes32 role, address account) external view returns (bool);
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function REGISTRAR_ROLE() external view returns (bytes32);
    function registrationFee() external view returns (uint256);
    function registrationToken() external view returns (address);
    function burnAddress() external view returns (address);
    function register(address to, string calldata label, string calldata registrationData, uint256 tokenId) external;
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}