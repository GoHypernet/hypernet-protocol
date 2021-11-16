// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleModule {

    string public name; 

    constructor(string memory _name)
    {
        name = _name; 
    }

    /// @notice redeem offload gas cost of minting to recieveres
    /// @dev scalable distribution of NFIs
    /// @param to address of the recipient of the token
    /// @param label a unique label to attach to the token
    /// @param registrationData data to store in the tokenURI
    /// @param tokenId unique uint256 identifier for the newly created token
    /// @param proof merkle traversal proof (see merkletreejs)
    /// @param registry address of the target NFR
    function redeem(address to, string calldata label, string calldata registrationData, uint256 tokenId, bytes32[] calldata proof, address registry)
    external
    {
        bytes32 root = INfr(registry).merkleRoot();
        require(_verify(_leaf(to, label, registrationData, tokenId), proof, root), "MerkleModule: Invalid merkle proof");
        INfr(registry).register(to, label, registrationData, tokenId);
    }

    function _leaf(address to, string calldata label, string calldata registrationData, uint256 tokenId)
    internal pure returns (bytes32)
    {
        return keccak256(abi.encodePacked(to, label, registrationData, tokenId));
    }

    function _verify(bytes32 leaf, bytes32[] memory proof, bytes32 root)
    internal pure returns (bool)
    {
        return MerkleProof.verify(proof, root, leaf);
    }
}

// minimal interface for the NonFungibleRegistry register function
interface INfr {
    function register(address to, string calldata label, string calldata registrationData, uint256 tokenId) external;
    function merkleRoot() external view returns (bytes32);
}