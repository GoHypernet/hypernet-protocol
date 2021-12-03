# Hypernet Protocol Contracts package

## Contents

- [contracts](/packages/contracts/contracts): Subdirectory containing all Hypernet Protocol smart contract impelementations. 
- [deployments](/packages/contracts/deployments): Subdirectory containing deployment artifacts for all chains in which the Hypernet Protocol has been deployed to. 
- [scripts](/packages/contracts/scripts): Hardhat [scripts](https://hardhat.org/guides/scripts.html) for deploying the contract stack. 
- [src](/packages/contracts/src): Typscript definitions for UI elements.
- [tasks](/packages/contracts/tasks): Hardhat [task](https://hardhat.org/guides/create-task.html) definitions for use with Hypernet Protocol contract deployments. 
- [test](/packages/contracts/test): Hardhat [unit tests](https://hardhat.org/guides/waffle-testing.html) for the Hypernet Protocol smart contracts. 
- [hardhat.config.js](/packages/contracts/hardhat.config.js): [Configuration](https://hardhat.org/config/) file for the Hardhat smart contract development framework. 

## Summary

This package contains the Hypernet Protocol solidity contracts for the token, governance, and identity registries. 
The [token](/packages/contracts/contracts/governance/Hypertoken.sol) is [EIP20](https://eips.ethereum.org/EIPS/eip-20) compliant and 
is limited to a total supploy of `100,000,000` with `18` decimal places of precision. The governance contracts are based on OpenZeppelin's 
[Governor](https://docs.openzeppelin.com/contracts/4.x/governance) library which is itself based on a reference implementation by 
[Compound Finance](https://compound.finance/docs/governance). Given below is a sequence diagram for the proposal lifecycle. 

![alt text](/documentation/images/Governance-sequence-diagram.png)

This particular governance architecture has been adopted by a number of highly successful projects including
[Uniswap](https://docs.uniswap.org/protocol/V2/concepts/governance/governance-reference) and has proven quite
successful in practice at adopting beneficial proposals to protocol upgrades while preventing
[adversarial attacks](https://docs.uniswap.org/protocol/V2/concepts/governance/adversarial-circumstances).

![alt text](/documentation/images/Hypernet-Contract-Flow.png)

The [Hypernet Governance](/packages/contracts/contracts/governance/HypernetGovernor.sol) application is used for proposing and vetting 
(by the token holder community) new Non-Fungible Registries (NFRs), which are deployed through the 
[registry factory contract](/packages/contracts/contracts/identity/UpgradeableRegistryFactory.sol), and 
updating various parameters in the protocol itself. The factory contract implements an 
[upgradable beacon pattern](https://docs.openzeppelin.com/contracts/4.x/api/proxy#UpgradeableBeacon) for deploying new NFRs in a gas-efficient 
manner (~80% reduction in gas fees over naive implementation). Each new NFR stores its state in a proxy layer and function calls to that 
proxy layer are delegated to an implementation contract shared by all copies of the original beacon implementation. Since the reference 
implementation deployments are not intented to be used directly, the 
[initializer](https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable#initializers) pattern is used for setting parameters 
upon the creation of a new NFR. 

Non-Fungible Registries are an extension of the [EIP721](https://eips.ethereum.org/EIPS/eip-721) non-fungible token standard and have 
several customizable functionalities. An NFR is can be deployed 
[with](/packages/contracts/contracts/identity/NonFungibleRegistryEnumerableUpgradeable.sol) or 
[without](/packages/contracts/contracts/identity/NonFungibleRegistryUpgradeable.sol) the enumeration property and every entry is an ownable 
token that has a corresponding `label` (seperate from the `tokenURI` or `tokenId`) that is unique within that specific NFR. That is, two 
entries can have the same `tokenURI`, but they cannot have the same `label`. Labels fascilitate lookups more easily for applications in 
which the registry is used for identity or authenticity verification in which the `tokenId` may not be known *a priori* but the label is 
(for instance when label is a URL). Entries in an NFR are referred to, within the protocol, as Non-Fungible Identities (NFIs). 

Each NFR has a `REGISTRAR_ROLE`, which can register new identities, a `REGISTRAR_ROLE_ADMIN` which can add and remove addresses from the 
`REGISTRAR_ROLE` as well as update NFR parameters, and a `DEFAULT_ADMIN_ROLE` which can make modifications to which addresses have the 
`REGISTRAR_ROLE` and `REGISTRAR_ROLE_ADMIN`. Both of these roles are set up through the NFR constructor. Additionally, the 
`REGISTRAR_ROLE` and the owner of an NFI have the option to update the information stored in the `tokenURI` after registration unless 
`allowStorageUpdate` is set to `false` (which it is by default and can be updated by the `REGISTRAR_ROLE`). The same applies for the 
token `label` through the `allowLabelChange` flag (which is false by default). In some cases, it can be useful to dissallow the transfer 
of ownership of NFIs. This can be done if `REGISTRAR_ROLE` sets `allowTransfers` to `false`. In this case, the `REGISTRAR_ROLE` can still 
transfer an NFI on the owners behalf if the NFI owner gives approval to the `REGISTRAR_ROLE` through the `approve` function.

Each NFR can augment its registration logic (as well as add novel functionality) through the use of external 
[*modules*](/packages/contracts/contracts/modules). A module is a stateless external contract which can be given the `REGISTRAR_ROLE` 
and thus extend an NFR's capability in an algorithmic fashion. For example, the a 
[LazyMintModule.sol](/packages/contracts/contracts/modules/LazyMintModule.sol) contract offers a means to add lazy minting functionality 
to an NFR, while the [MerkleModule.sol](/packages/contracts/contracts/modules/MerkleModule.sol) contract implements a mechanism to 
fascilitate [airdrop](https://blog.openzeppelin.com/workshop-recap-building-an-nft-merkle-drop/) functionality. The `REGISTRAR_ROLE_ADMIN` 
can add and remove these modules from their NFR as needed. 

Lastly, the Hypernet NFR implements a native mechanism for registration by staking and ERC20-compatible token. By default, this feature is 
disabled, but the `REGISTRAR_ROLE` can set `registrationToken` to an address of an EIP20-compatible token which will enable the feature. The 
default registration fee is `1e18` (1 token assuming 18 decimal places) which can also be updated by the `REGISTRAR_ROLE`. In order to use this 
feature, a participant will `approve` the NFR to spend `registrationFee` amount of `registrationToken` from their account. The NFR will 
record the registration token address used and fee amount and associate this staking fee with the NFI `tokenId`. Upon burning of the NFI, 
any non-zero registration fee associated with the burned `tokenId` will be transfered to the account who burned the token, *not* the owner
of the token at the time of burning. 

SECURITY NOTES:

* [Known Timelock.sol contract vulnerability](https://forum.openzeppelin.com/t/timelockcontroller-vulnerability-post-mortem/14958)
* [Initialization vulnerability](https://forum.openzeppelin.com/t/security-advisory-initialize-uups-implementation-contracts/15301)

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