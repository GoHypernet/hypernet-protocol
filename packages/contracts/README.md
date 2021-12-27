<p align="center">
  <img src="/documentation/images/hypernet-protocol-black.svg" width="500">
</p>

# Hypernet Protocol Contracts package

## Package Contents

- [contracts](/packages/contracts/contracts/): Subdirectory containing all Hypernet Protocol smart contract impelementations. 
- [deployments](/packages/contracts/deployments/): Subdirectory containing deployment artifacts for all chains in which the Hypernet Protocol has been deployed to. 
- [scripts](/packages/contracts/scripts/): Hardhat [scripts](https://hardhat.org/guides/scripts.html) for deploying the contract stack. 
- [tasks](/packages/contracts/tasks/): Hardhat [task](https://hardhat.org/guides/create-task.html) definitions for use with Hypernet Protocol contract deployments. 
- [test](/packages/contracts/test/): Hardhat [unit tests](https://hardhat.org/guides/waffle-testing.html) for the Hypernet Protocol smart contracts. 
- [hardhat.config.js](/packages/contracts/hardhat.config.js): [Configuration](https://hardhat.org/config/) file for the Hardhat smart contract development framework. 

## Summary

The Hypernet Protocol contracts package consists of the following primary components:

### [access](/packages/contracts/contracts/access)

Contains an experimental fork of OpenZeppelin's AccessControl library but specialized 
for NFT-based accounts.

### [governance](/packages/contracts/contracts/governance)

Includes the EIP20 compatible token contract and the Governance DAO implementation.

### [identity](/packages/contracts/contracts/identity)

Contains the enumerable and non-enumerable implementations of the NFR as well as the 
NFR factory contract.

### [modules](/packages/contracts/contracts/modules)

Contains various stand-alone contracts intended to augment the registration process
with additional or specialized functionality. 

### [utils](/packages/contracts/contracts/utils)

Contains various helper contracts including vesting contracts.

## Deployment Addresses

A comprehensive list of contract deployment addresses can be found [here](/packages/contracts/deployments.md).

## Install dependencies

```shell
git clone https://github.com/GoHypernet/hypernet-protocol.git
cd hypernet-protocol/packages/contracts
npm install
```

## Running contract tests

```shell
npx hardhat test --logs
```

## Compiling contracts to generate artifacts

```shell
npx hardhat compile
```

## Environment Variables

If can set the following environment variable in order to customize your hardhat environment for testing
or deployment purposes. 

`ETH_PROVIDER_URL`: URL that hardhat will use for its RPC provider, if blank then `localhost` is assumed. 

```shell
export ETH_PROVIDER_URL=https://station-hundred-assure-neighborhood.trycloudflare.com/http/
```

`MNEMONIC`: Mnemonic phrase that hardhat will use to generate accounts for use in scripts and tasks. If blank the 
default is `test test test test test test test test test test test junk`.  

```shell
export MNEMONIC="candy maple cake sugar pudding cream honey rich smooth crumble sweet treat"
```

## Hardhat network - full contract deployment

First, start a hardhat node (edit [hardhat.config.js](https://hardhat.org/config/#networks-configuration)
to customize the Hardhat network settings):

```shell
npx hardhat node
```

You can run the node on a custom port by adding the `--port flag`:

```shell
npx hardhat node --port 8569
```

Once the node is running, deploy the full Solidity contract stack to the Hardhat network (be sure to set the target network):

```shell
npx hardhat run scripts/hardhat-full-stack.js --network dev
```

## SECURITY NOTES:

* [Known Timelock.sol contract vulnerability](https://forum.openzeppelin.com/t/timelockcontroller-vulnerability-post-mortem/14958)
* [Initialization vulnerability](https://forum.openzeppelin.com/t/security-advisory-initialize-uups-implementation-contracts/15301)