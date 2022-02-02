# Registry Modules

## Summary 

Registry modules are intended to augment the functionality of an [NFR](/packages/contracts/contracts/identity/README.md#summary). Ideally, 
a module contract should be stateless and its functions should take a target registry address as one of the parameters so that it can 
be used with multiple registries simltaneously. Separating customizable logic from the NFR contract itself helps to reduce 
the size, complexity, and cost of deploying an NFR from the NFR factory. 

## Usage

In order for an NFR to make use of a module, a `REGISTRAR_ROLE_ADMIN` should grant the `REGISTRAR_ROLE` to the address 
of the module contract implementing the desired functionality. Once the module has served its purpose, the 
`REGISTRAR_ROLE_ADMIN` can revoke the `REGISTRAR_ROLE` from the module. 

A list of officially supported modules are curated by the Hypernet Protocol DAO via the 
[Registry Modules](/packages/contracts/contracts/identity/README.md#registry-modules) registry. The 
[Hypernet launchpad](https://rinkeby.launchpad.hypernet.foundation/registries) dashboard makes it easy to add a module to an NFR in which 
you occupy the `REGISTRAR_ROLE_ADMIN` role. Adding and removing modules to an NFR requires submitting 1 transaction each. 

## Official Modules

The name and contract address of officially supported modules are given by the 
[Registry Modules](https://rinkeby.launchpad.hypernet.foundation/registries/Registry%20Modules/entries) NFR which can be viewed from the 
Hypernet launchpad dashboard. The currently supported modules are as follows:

### Batch Minting

This [module](/packages/contracts/contracts/modules/BatchModule.sol) allows for accounts occupying the `REGISTRAR_ROLE` to mint multiple 
NFIs in a single transaction, thereby reducing gas costs. The number of NFIs that can be minted in a single transaction is limited by the 
gas limit of the layer 1 blockchain protocol. See the Hypernet Protocol unit tests for an 
[example](/packages/contracts/test/upgradeable-registry-enumerable-test.js#L438) of how to interact with a contract using the batch minting 
feature. 

### Buy NFI

This [module](/packages/contracts/contracts/modules/BuyModule.sol) lets `REGISTRAR_ROLE_ADMIN`s bulk sell pre-minted NFIs from their NFR. 
Any NFI held by an address with the `REGISTRAR_ROLE`, can be bought by first approving this contract to pull `registrationFee` amount of 
`registrationToken` from the purchaser's account and then calling `buyNFI` with the desired `tokenid` and NFR contract address. Here is an
[example](/packages/contracts/test/upgradeable-registry-enumerable-test.js#L493) of how to buy and sell NFI's with this module. 

### Lazy Minting

Lazy Minting is a common technique in many projects for offloading gas cost of an NFT creator to the recipient of the NFT. The 
[Lazy Minting module](/packages/contracts/contracts/modules/LazyMintModule.sol) checks the given signature against the list of current addresses
occupying the `REGISTRAR_ROLE` role in the target NFR. An [example](/packages/contracts/test/upgradeable-registry-enumerable-test.js#L563) of how 
to use this module can be seen in the unit tests directory. 

### Merkle drop

The [Uniswap](https://github.com/Uniswap/merkle-distributor) team was an early pioneer in setting the standard for large-scale airdrops in settings 
where gas price is a concern. This module can be added to a NFR to enable merkle drop capability in an NFR. The merkle root must be declared in the NFR 
(and optionally frozen) using the the [`setMerkleRoot`](/packages/contracts/contracts/identity/NonFungibleRegistryEnumerableUpgradeable.sol#L175) function. 
An example of the life-cycle of a merkle drop can be seen [here](/packages/contracts/test/upgradeable-registry-enumerable-test.js#L663). 