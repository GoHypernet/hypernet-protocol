// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract LazyMintModule is Context {

    string public name; 

    constructor(string memory _name)
    {
        name = _name; 
    }

    /// @notice lazyRegister REGISTRAR_ROLE to offload gas cost of minting to reciever 
    /// @dev REGISTRAR_ROLE must provide a signature and allowLabelChange must be false to prevent replay
    /// @param to address of the recipient of the token
    /// @param label a unique label to attach to the token
    /// @param registrationData data to store in the tokenURI 
    /// @param tokenId unique uint256 identifier for the newly created token
    /// @param signature signature from REGISTRAR_ROLE 
    function lazyRegister(address to, 
                          string calldata label, 
                          string calldata registrationData, 
                          uint256 tokenId,
                          bytes calldata signature,
                          address registry)
        external {        
        // transaction caller must be recipient
        require(_msgSender() == to, "LazyMintModule: Caller is not recipient.");
        
        // require a valid signature from a member of REGISTRAR_ROLE
        require(_isValidSignature(to, label, registrationData, tokenId, signature, registry), "LazyMintModule: signature failure.");
        
        // issue new token here
        INfr(registry).register(to, label, registrationData, tokenId);
    }
    
    function _isValidSignature(address to, string memory label, string memory registrationData, uint256 tokenId, bytes memory signature, address registry)
        internal
        view
        returns (bool)
    {
        // convert the payload to a 32 byte hash
        bytes32 hash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(to, label, registrationData, tokenId)));
        
        // check that the signature is from REGISTRAR_ROLE
        address signer = ECDSA.recover(hash, signature);
        require(signer != address(0), "LazyMintModule: Signer cannot be 0 address.");
        return INfr(registry).hasRole(INfr(registry).REGISTRAR_ROLE(), signer);
    }
}

// minimal interface for the NonFungibleRegistry register function
interface INfr {
    function register(address to, string calldata label, string calldata registrationData, uint256 tokenId) external;
    function hasRole(bytes32 role, address account) external view returns (bool);
    function REGISTRAR_ROLE() external view returns (bytes32);
}