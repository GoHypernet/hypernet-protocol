<p align="center">
  <img src="/documentation/images/hypernet-protocol-black.svg" width="500">
</p>

# Hypernet Protocol Contracts package

## Package Contents

- [contracts](/packages/contracts/contracts): Subdirectory containing all Hypernet Protocol smart contract impelementations. 
- [deployments](/packages/contracts/deployments): Subdirectory containing deployment artifacts for all chains in which the Hypernet Protocol has been deployed to. 
- [scripts](/packages/contracts/scripts): Hardhat [scripts](https://hardhat.org/guides/scripts.html) for deploying the contract stack. 
- [src](/packages/contracts/src): Typscript definitions for UI elements.
- [tasks](/packages/contracts/tasks): Hardhat [task](https://hardhat.org/guides/create-task.html) definitions for use with Hypernet Protocol contract deployments. 
- [test](/packages/contracts/test): Hardhat [unit tests](https://hardhat.org/guides/waffle-testing.html) for the Hypernet Protocol smart contracts. 
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

### Rinkeby

- Hypertoken: [`0x6D4eE7f794103672490830e15308A99eB7a89024`](https://rinkeby.etherscan.io/address/0x6D4eE7f794103672490830e15308A99eB7a89024)
- Timelock: [`0xc5b292502cDb63f6c19A9a85a29B5F5834b9146a`](https://rinkeby.etherscan.io/address/0xc5b292502cDb63f6c19A9a85a29B5F5834b9146a)
- DAO: [`0x3353da0f24fCACd83832b09e9371a937195D2640`](https://rinkeby.etherscan.io/address/0x3353da0f24fCACd83832b09e9371a937195D2640)
- Registry Factory: [`0x60eFCb4dDA1bef87aA244006273e3DdDb0E4abCB`](https://rinkeby.etherscan.io/address/0x60eFCb4dDA1bef87aA244006273e3DdDb0E4abCB)
- Hypernet Profiles: [`0x6c355Ad248477eeDcadf1d6724154C6152C0edca`](https://rinkeby.etherscan.io/address/0x6c355Ad248477eeDcadf1d6724154C6152C0edca)
- Gateways: [`0x507D5F4E81db1c7fa078CBf1e59B37cC91640258`](https://rinkeby.etherscan.io/address/0x507D5F4E81db1c7fa078CBf1e59B37cC91640258)
- Liquidity Providers: [`0xc616c67f9c680E662103b26cEfFcC70a121CD5d5`](https://rinkeby.etherscan.io/address/0xc616c67f9c680E662103b26cEfFcC70a121CD5d5)
- Payment Tokens: [`0x4BE5BA85859B124a52fBE822d042AcdCd3b4eC4D`](https://rinkeby.etherscan.io/address/0x4BE5BA85859B124a52fBE822d042AcdCd3b4eC4D)
- Batch Module: [`0x5B72838Fc364Ef73301E4ac32d2050B095666244`](https://rinkeby.etherscan.io/address/0x5B72838Fc364Ef73301E4ac32d2050B095666244)
- Lazy Mint Module: [`0x66643a91fD95a8B41Ae673f1861589fb454DEe55`](https://rinkeby.etherscan.io/address/0x66643a91fD95a8B41Ae673f1861589fb454DEe55)
- Merkle Module: [`0xE7CE51dba04E0Bd4bE4B264Ea72782D0bF620450`](https://rinkeby.etherscan.io/address/0xE7CE51dba04E0Bd4bE4B264Ea72782D0bF620450)

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