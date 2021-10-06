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

The Hypernet Governance application is used for proposing and vetting (by the token holder community) new Non-Fungible Registries (NFRs), 
which are deployed through a registry factory contract, and updating various parameters in the protocol itself. The factory contract 
implements an [upgradable proxy pattern](https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies#upgrading-via-the-proxy-pattern) 
for deploying new NFRs in a gas-efficient manner (~82% reduction in gas fee over naive implementation). Each new NFR stores its state 
in a proxy layer and function calls to that proxy layer are delegated to an implementation contract shared by all copies of the original 
[beacon implementation](https://docs.openzeppelin.com/contracts/4.x/api/proxy#UpgradeableBeacon).

Non-Fungible Registries are an extension of the [EIP721](https://eips.ethereum.org/EIPS/eip-721) non-fungible token standard and have 
several customizable functionalities. An NFR is enumerable and every entry is an ownable token that has a corresponding `label` 
(seperate from the `tokenURI`) that is unique within that specific NFR. That is, two entries can have the same `tokenURI`, but 
they cannot have the same `label`. Labels fascilitate lookups more easily for applications in which the registry is used for identity 
or authenticity verification in which the `tokenId` may not be known *a priori* what the label is. Entries in an NFR are referred to, 
within the protocol, as Non-Fungible Identities (NFIs). 

Each NFR has a `REGISTRAR_ROLE`, which can register new identities, and a `DEFAULT_ADMIN_ROLE` which can make modifications 
to which address have the `REGISTRAR_ROLE` and can also call `selfdestruct` on the registry. Both of these roles are set through 
the NFR constructor. Additionally, the `REGISTRAR_ROLE` and the owner of a token have the option to update the information stored 
in the `tokenURI` after registration unless `allowStorageUpdate` is set to `false` (which it is by default and can be updated by 
the `REGISTRAR_ROLE`). The same applies for the token `label` through the `allowLabelChange` flag (which is false by default). 
In some cases, it can be useful to dissallow the transfer of ownership of NFIs. This can be done if `REGISTRAR_ROLE` sets 
`allowTransfers` to `false`. In this case, the `REGISTRAR_ROLE` can still transfer an NFI on the owners behalf if the NFI owner 
gives approval to the `REGISTRAR_ROLE` through the `approve` function.

Each NFR exposes a *lazy registration* interface through the `lazyRegister` function. This allows the owner of the `REGISTRAR_ROLE` 
to offload the burden of gas costs to the recipient of the NFI by providing them with signature that the recipient can then present to 
the contract to register at their convenience with the token `label` serving as a nonce to prevent duplicate registration. This feature 
is disabled by default but can be activated by the `REGISTRAR_ROLE` through the `allowLazyRegister` variable. **NOTE**: If lazy registration
is enabled, the `allowLabelChange` should be set to `false` as the token label serves as the nonce for lazy registration. If a user is allowed 
to change their token label, they can register multiple times. 

Lastly, the Hypernet NFR implementation allows for registration by staking token. By default, this feature is disabled, but the 
`REGISTRAR_ROLE` can set `registrationToken` to an address of an EIP20-compatible token which will enable the feature. The default 
registration fee is `1e18` (1 token assuming 18 decimal places) which can also be updated by the `REGISTRAR_ROLE`. In order to use this 
feature, a participant will `allow` the NFR to spend `registrationFee` amount of `registrationToken` from their account. The NFR will 
record the registration token address used and fee amount and associate this staking fee with the NFI `tokenId`. Upon burning of the NFI, 
any non-zero registration fee associated with the burned `tokenId` will be transfered to the account who burned the token, *not* the owner
of the token at the time of burning. 

SECURITY NOTES:

* [Known Timelock.sol contract vulnerability](https://forum.openzeppelin.com/t/timelockcontroller-vulnerability-post-mortem/14958)
* [Known UUPSUpgradeable.sol contract vulnerability](https://forum.openzeppelin.com/t/uupsupgradeable-vulnerability-post-mortem/15680)
* [UUPSUpgradeable initialization vulnerability](https://forum.openzeppelin.com/t/security-advisory-initialize-uups-implementation-contracts/15301)

## Install dependencies

```shell
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

Set the registration token address for an NFR:

```shell
npx hardhat setRegistryParameters --network dev --name Gateways --regtoken 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Add a new NFI by staking tokens:

```shell
npx hardhat registerWithToken --network dev --name Gateways --label "https://hyperpay.io" --data "biglongsignatureblock" --recipient 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
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
