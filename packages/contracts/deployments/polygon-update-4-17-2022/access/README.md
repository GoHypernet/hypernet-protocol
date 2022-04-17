# Hypernet Protocol NFR-based Access

## Summary 

Hypernet Protocol includes an experimental fork of 
[OpenZeppelin's AccessControl library](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/AccessControl.sol).
[`NFTAccessControlUpgradeable.sol`](/packages/contracts/contracts/access/NFTAccessControlUpgradeable.sol) assigns access rights 
to the owner of a particular [NFI](/packages/contracts/contracts/identity/README.md#functionality) rather than a specific address. This extension 
is intended to fascilitate new modes of tokenized access control not currently possible by assigning roles directly to a contract address or 
externally owned account (EOA). 

## Example Usage

The [`Test.sol`](/packages/contracts/contracts/utils/Test.sol) contract under the `utils` subdirectory is used to help test this library. 
See [`test/NFTAccessControl-test.js`](/packages/contracts/test/NFTAccessControl-test.js) for an example of how to interact with a contract
inheriting from `NFTAccessControlUpgradeable.sol`. 