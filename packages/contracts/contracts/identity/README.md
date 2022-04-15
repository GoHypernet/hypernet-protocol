<p align="center">
  <img src="/documentation/images/hypernet-protocol-black.svg" width="500">
</p>

# Hypernet Protocol Digital Identity

## Summary

One of the key aspects of the Hypernet Protocol is digital identity, both human and non-human. The primary identity data structure
of the Hypernet Protocol is the **Non-Fungible Registry** (NFR); instances of which are deployed through the 
[registry factory contract](/packages/contracts/contracts/identity/UpgradeableRegistryFactory.sol). The factory contract implements an 
[upgradable beacon pattern](https://docs.openzeppelin.com/contracts/4.x/api/proxy#UpgradeableBeacon) for deploying new NFRs in a gas-efficient 
manner (~80% reduction in gas fees over naive implementation). Each new NFR stores its state in a proxy layer and function calls to that 
proxy layer are delegated to an implementation contract shared by all copies of the original beacon implementation. Since the reference 
implementation deployments are not intended to be used directly, the 
[initializer](https://docs.openzeppelin.com/upgrades-plugins/1.x/writing-upgradeable#initializers) pattern is used for setting parameters 
upon the creation of a new NFR.

## Functionality

Non-Fungible Registries are a multi-purpose extension of the [EIP721](https://eips.ethereum.org/EIPS/eip-721) non-fungible token (NFT) standard and therefor has
all methods specified by the base standard specification. Additionally, the NFR has several customizable attributes. They can be deployed 
[with](/packages/contracts/contracts/identity/NonFungibleRegistryEnumerableUpgradeable.sol) or 
[without](/packages/contracts/contracts/identity/NonFungibleRegistryUpgradeable.sol) the enumeration property and every entry is an ownable 
token that has a corresponding `label` (seperate from the `tokenURI` or `tokenId`) that is unique within that specific NFR. That is, two 
entries can have the same `tokenURI`, but they cannot have the same `label`. Labels fascilitate lookups more easily for applications in 
which the registry is used for identity or authenticity verification in which the `tokenId` may not be known *a priori* but the label is 
(for instance when label is a URL). Entries in an NFR are referred to, within the protocol, as **Non-Fungible Identities** (NFIs). 

### Authenticity

The identity component of the Hypernet Protocol allows for a simple yet effective method for verifying the authenticity of NFRs. The address of the 
resulting NFR proxy contract created via the Hypernet Protocol NFR factory is stored in either the 
[`registries`](https://github.com/GoHypernet/hypernet-protocol/blob/dev/packages/contracts/contracts/identity/UpgradeableRegistryFactory.sol#L39) or 
[`enumerableRegistries`](https://github.com/GoHypernet/hypernet-protocol/blob/dev/packages/contracts/contracts/identity/UpgradeableRegistryFactory.sol#L36) 
public array variable (depending on if the NFR is deployed with or without the enumeration property). Additionally, a mapping from the human-readable name 
of the NFR (retrieved by calling the `name()` function on any Hypernet NFR) to its proxy contract address is stored in the public 
[`nameToAddress`](https://github.com/GoHypernet/hypernet-protocol/blob/dev/packages/contracts/contracts/identity/UpgradeableRegistryFactory.sol#L43) mapping 
variable. This has the additional effect of enforcing that every NFR within the Hypernet Protocol has a unique name. Thus, any external user wishing to 
ensure that they are interacting with an authentic Hypernet Protocol NFR need only query the contract factory with the name of the target NFR in order to 
obtain the address of the true registry. 

### Royalty supported

Hypernet Protocol NFRs support the [EIP-2981](https://eips.ethereum.org/EIPS/eip-2981) interface for reporting royalty fees and recipients. The royalty 
recipient address is denoted by the `burnAddress` (see the section of [Token-Based Registration](#token-based-registration)) and the the royalty fee is 
calculated via the `burnFee` setting which has units of basis-points. Both variables are set by an account with the `REGISTRAR_ROLE` permission setting. 
The `burnFee`, which acts as the royalty percentage, is applied equivalently to all NFIs in an NFR. 

## Roles and Minting

### Enumerable roles

Every NFR defines the following enumerated roles:

- `DEFAULT_ADMIN_ROLE`: super-user style account than can add and remove addresses from any other role (the Hypernet DAO is the admin of every NFR)
- `REGISTRAR_ROLE_ADMIN`: can add and remove addresses from the `REGISTRAR_ROLE`
- `REGISTRAR_ROLE`: can register new identities as well as update NFR parameters via the `setRegistryParameters` function

All roles are set up through the NFR constructor/initializer which is called by the registry factory. Additionally, the 
`REGISTRAR_ROLE` and the owner of an NFI have the option to update the information stored in the `tokenURI` after registration unless 
`allowStorageUpdate` is set to `false` (which it is by default and can be updated by the `REGISTRAR_ROLE`). The same applies for the 
token `label` through the `allowLabelChange` flag (which is false by default). In some cases, it can be useful to dissallow the transfer 
of ownership of NFIs. This can be done if `REGISTRAR_ROLE` sets `allowTransfers` to `false`. In this case, the `REGISTRAR_ROLE` can still 
transfer an NFI on the owner's behalf if the NFI owner gives approval to the `REGISTRAR_ROLE` through the `approve` function.

### Extending registry functionality 

Each NFR can augment its registration logic (as well as add novel functionality) via external logic
[*modules*](/packages/contracts/contracts/modules/README.md). A module is a stateless external contract which can be given the `REGISTRAR_ROLE` 
and thus extend an NFR's capability in an algorithmic fashion. For example, the a 
[LazyMintModule.sol](/packages/contracts/contracts/modules/LazyMintModule.sol) contract offers a means to add lazy minting functionality 
to an NFR, while the [MerkleModule.sol](/packages/contracts/contracts/modules/MerkleModule.sol) contract implements a mechanism to 
fascilitate [airdrop](https://blog.openzeppelin.com/workshop-recap-building-an-nft-merkle-drop/) functionality. The `REGISTRAR_ROLE_ADMIN` 
can add and remove these modules from their NFR as needed. 

### Token-based registration

Lastly, the Hypernet NFR implements a native mechanism for registration by sending an EIP20-compatible token to the registry. By default, this feature is 
disabled, but the `REGISTRAR_ROLE` can set `registrationToken` to an address of an EIP20-compatible token which will enable the feature. The 
default registration fee is `1e18` (1 token assuming 18 decimal places) which can also be updated by the `REGISTRAR_ROLE`. Utilization of this 
feature requires that a participant must `approve` the NFR to spend `registrationFee` amount of `registrationToken` from their account. The NFR will 
record the registration token address used and fee amount and associate this staking fee with the NFI `tokenId`. Upon burning of the NFI, 
any non-zero registration fee associated with the burned `tokenId` will be transfered to the account who burned the token, *not* the owner
of the token at the time of burning. 

## Official Hypernet Protocol Non-Fungible Registries

The Hypernet Protocol instantiates several NFRs at protocol launch that are necessary for the secure functioning of payments, goverance, and identity 
functionality. All NFRs in this list are managed by the Hypernet Protocol [DAO](/packages/contracts/contracts/governance/README.md). That is, all 
[roles](#roles-and-minting) are occupied by the Hypernet DAO contract.

### [Hypernet Profiles](https://rinkeby.launchpad.hypernet.foundation/registries/Hypernet%20Profiles/entries)

The Hypernet Profile NFR is the primary registry of the Hypernet Protocol ecosystem. For an account to receive a NFI in any other NFR, that 
account must first create an NFI profile token in this registry. This is done by locking Hypertoken in the registry itself by approving the registry to 
pull `registrationFee` amound of Hypertoken from the transaction initiator's account and then calling the `registryByToken` function. The `label` that 
is claimed in this action becomes the unique username of the entity within the Hypernet Protocol ecosystem (this username can be traded with other 
users or burned to reclaim some of the Hypertoken that was staked in its creation).

### [Gateways](https://rinkeby.launchpad.hypernet.foundation/registries/Gateways/entries)

This NFR tracks official payment processing gateway providers. An NFI must be claimed in this registry for a payment processor, implemented on top of the 
Hypernet Protocol, to function within the Hypernet Protocol network. The `label` of an NFI in this registry denotes the publicly accessible URL which hosts 
the payment processor's iframe for interacting with the payment processor. Then `tokenURI` consists of the follow json attributes:

- `address`: address of the signing wallet used for code authenticity verification of the gateway provider's iframe
- `signature`: the digital signature of the iframe code blob that is ingested by the Hypernet core package for payment processing

The owning wallet of a Gateways NFI can be different than that of the signing wallet denoted in the `tokenURI`. 

### [Liquidity Providers](https://rinkeby.launchpad.hypernet.foundation/registries/Liquidity%20Providers/entries)

The Liquidity Providers registry provides a public list for discovering layer 2 liquidity providers and what Gateway providers they are officially doing 
business with. The `label` of each NFI contains the routing identifier for the underlying Vector payment channel protocol. The `tokenURI` has the following 
json structure:

- `supportedTokens`: array token addresses and chain id's of EIP20 compatible tokens supported by the liquidity provider
- `allowedGateways`: array of URLs denoting Gateways the liquidity provider is willing to process transfers for. These URLs are the same as the labels used in the Gateways registry. 

### [Payment Tokens](https://rinkeby.launchpad.hypernet.foundation/registries/Payment%20Tokens/entries)

Not all EIP20 compatible token contracts expose the necessary metadata fields for safe interaction with the Hypernet Payment protocol. For example, the Wrapped Bitcoin
contract on the Ethereum mainnet does not expose the decimals field; token decimals must the included as an offchain configuration which can inadvertenly lead to transaction sizes 
that are off by orders of magnitude. The `label` field in this registry takes the form `<chainid>:<token name>`. The `tokenURI` is a json blob with the following structure:

- `name`: Name to be displayed in Hypernet Protocol component library impelementations
- `symbol`: Token symbol to be displayed in Hypernet Protocol component library impelementations
- `chainId`: id of the network the token contract is deployed to
- `address`: contract address where the token can be found given the chainid in the `label`
- `nativeToken`: a special boolean field for indicating if the token is the native token of the chain denoted by the chainid
- `erc20`: special boolean flag for indicating if all necessary functions are present for ERC20 compatibility (native tokens may or may not be ERC20 compliant)
- `decimals`: the number of decimal places to be applied to transactions with this token
- `logoUrl`: URL to pull logo asset for display purposes in Hypernet Protocal UI library components

All NFIs in this regsitry are owned by the Hypernet Protocol DAO. 

### [Registry Modules](https://rinkeby.launchpad.hypernet.foundation/registries/Registry%20Modules/entries)

Hypernet Protocol NFRs can modify their functionality by adding external contracts to the `REGISTRAR_ROLE`. This can be a potentially dangerous modification, so the
Registry Modules registry lists official contracts that are safe to use for modifying the functionality of a NFR deployment. The `label` field is the human-readable 
name of the module contract and the `tokenURI` is the address of the module contract. All NFIs in this registry are owned by the Hypernet Protocol DAO. 