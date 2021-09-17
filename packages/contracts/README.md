# Hypernet Protocol Contracts

This package contains the Hypernet Protocol solidity contracts for the token, governance, and identity registries. 
The token is [EIP20](https://eips.ethereum.org/EIPS/eip-20) compliant and is limited to a total supploy of `100,000,000` 
with `18` decimal places of precision. The governance contracts are based on OpenZeppelin's 
[Governor](https://docs.openzeppelin.com/contracts/4.x/governance) library which are based on a reference 
implementation by [Compound Finance](https://compound.finance/docs/governance).

![alt text](/documentation/images/Governance-sequence-diagram.png)

This particular governance architecture has been adopted by a number of highly successful projects including
[Uniswap](https://docs.uniswap.org/protocol/V2/concepts/governance/governance-reference) and has proven quite
successful in practice at adopting beneficial proposals to protocol upgrades while preventing 
[adversarial attacks](https://docs.uniswap.org/protocol/V2/concepts/governance/adversarial-circumstances). 

![alt text](/documentation/images/Hypernet-Contract-Flow.png)

The Hypernet Governance application is used for proposing and vetting (by the token holder community) new Non-Fungible Registries (NFRs) 
which are deployed through a registry factory contract. Non-Fungible Registries are an extension of the [EIP721](https://eips.ethereum.org/EIPS/eip-721) 
non-fungible token standard and have several customizable functionalities. An NFR is enumerable and every entry is an ownable token 
that has a corresponding `label` (seperate from the `tokenURI`) that is unique within that specific NFR. That is, two entries can have 
the same `tokenURI`, but they cannot have the same `label`. Labels fascilitate lookups more easily for applications in which the registry 
is used for identity or authenticity verification in which the `tokenId` may not be known *a priori* but the label is. Entries in an 
Non-Fungible Registry are referred to, within the protocol, as Non-Fungible Identities (NFIs). 

Each NFR has a `MINTER_ROLE`, which can mint new entries to the registry, and a `DEFAULT_ADMIN_ROLE` which can make modifications 
to the registry contract parameters. These roles are set through the NFR constructor. Additionally, the `MINTER_ROLE` and 
the owner of a token have the option to update the information stored in the `tokenURI` after minting unless `allowStorageUpdate` is 
set to `false` (which it is by default and can be updated by the `DEFAULT_ADMIN_ROLE`). The same applies for the token `label`
through the `allowLabelChange` flag (which is false by default). In some cases, it can be useful to dissallow the transfer of ownership
of NFIs. This can be done if `DEFAULT_ADMIN_ROLE` sets `allowTransfers` to `false`. 

Lastly, each NFR exposes a *lazy registration* interface through the `lazyRegister` function. This allows the owner of the `MINTER_ROLE` 
to offload the burden of gas costs to the recipient of the NFI by providing them with signature that the recipient can then present to 
the contract to register at their convenience with the token `label` serving as a nonce to prevent duplicate registration. This feature 
is disabled by default but can be activated by the `DEFAULT_ADMIN_ROLE` through the `allowLazyRegister` variable. **NOTE**: If lazy registration
is enabled, the `allowLabelChange` should be set to `false` as the token label serves as the nonce for lazy registration. If a user is allowed 
to change their token label, they can register multiple times. 

## Install dependencies

```shell
npm install
```

## Running contract tests

```shell
npx hardhat test
```

## Compiling contracts to generate artifacts

```shell
npx hardhat compile
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

Once the node is running, deploy the full Solidity contract stack to the Hardhat network:

```shell
npx hardhat run scripts/hardhat-full-stack.js --network dev
```

Use the help tasks defined in `hardhat.config.js` to interact with the deployed contracts.

Get Governance contract parameters:

```shell
npx hardhat governanceParameters --network dev
```

Propose a new Non-Fungible Registry, your account must have at least `1000000` Hypertoken (1% of the total supply) 
for the proposal to go through:

```shell
npx hardhat proposeRegistry --network dev --name Gateways --symbol GTW --owner 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
```

Additionally, if at any point during the voting process your voting power drops below this 1% threshold, your proposal 
is vulnerable to being canceled:

```shell
npx hardhat cancelProposal --network dev --id 22104418028353388202287425060500442898792900291568640533228773866112567147490
```

Check the state of an existing Proposal:

```shell
npx hardhat proposalState --network dev --id 22104418028353388202287425060500442898792900291568640533228773866112567147490
```

Delegate your voting power to a given address:

```shell
npx hardhat delegateVote --network dev --delegate 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

Cast a vote on a proposal (Against (0), For (1), Abstain (2)):

```shell
npx hardhat castVote --network dev --id 22104418028353388202287425060500442898792900291568640533228773866112567147490 --support 1
```

If a proposal has reached quorum and >50% of votes are in favor, once its deadline has passed it can be queued then executed:

```shell
npx hardhat queueProposal --network dev --id 22104418028353388202287425060500442898792900291568640533228773866112567147490
npx hardhat executeProposal --network dev --id 22104418028353388202287425060500442898792900291568640533228773866112567147490
```

Once a registry has been deployed via the proposal process, get the registry's info:

```shell
npx hardhat registryParameters --network dev --name Gateways
```

Propose a new Gateway be added to the Gateways NonFunglebleRegistry we just deployed:

```shell
npx hardhat proposeRegistryEntry --network dev --name Gateways --label "https://hyperpay.io" --data "biglongsignatureblock" --recipient 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
```

Retrieve data pertaining to a specific entry in a named Hypernet Gateway:

```shell
npx hardhat registryEntryByLabel --network dev --label https://hyperpay.io --name Gateways
```

## Hardhat network - registry testing deployment 

To simply deploy two registies for registering gateways and liquidity providers, run:

```shell
npx hardhat run scripts/hardhat-registies-only.js --network hardhat
```
