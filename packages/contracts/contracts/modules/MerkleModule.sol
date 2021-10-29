// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleModule {
    // root proof of merkle tree
    bytes32 immutable public root;
    address public registry;

    constructor(address _registry, bytes32 merkleroot)
    {
        root = merkleroot;
        registry = _registry;
    }

    function redeem(address to, string calldata label, string calldata registrationData, bytes32[] calldata proof)
    external
    {
        require(_verify(_leaf(to, label, registrationData), proof), "Invalid merkle proof");
        INfr(registry).register(to, label, registrationData);
    }

    function _leaf(address to, string calldata label, string calldata registrationData)
    internal pure returns (bytes32)
    {
        return keccak256(abi.encodePacked(to, label, registrationData));
    }

    function _verify(bytes32 leaf, bytes32[] memory proof)
    internal view returns (bool)
    {
        return MerkleProof.verify(proof, root, leaf);
    }
}

// minimal interfact for the NonFungibleRegistry register function
interface INfr {
    function register(address to, string calldata label, string calldata registrationData) external;
}