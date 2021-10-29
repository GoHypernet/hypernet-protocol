# access
This directory contains a modified version of OpenZeppelin's 
[`AccessControl.sol`](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol) library.
`NFTAccessControlUpgradeable.sol` assigns access rights to the owner of a particular NFI (NFT) rather than a specific address. This 
extension is intended to fascilitate new modes of tokenized access control not currently possible by assigning roles directly to a 
contract address or externally owned account (EOA). 