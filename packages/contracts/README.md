# Hypernet Protocol Contracts

This package contains the Hypernet Protocol solidity contracts for the token and governance. The token is 
[EIP20](https://eips.ethereum.org/EIPS/eip-20) compliant and is limited to a total supploy of `100,000,000` 
with `18` decimal places of precision. The governance contracts are based on OpenZeppelin's 
[Governor](https://docs.openzeppelin.com/contracts/4.x/governance) library which are based on a reference 
implementation by [Compound Finance](https://compound.finance/docs/governance).

This particular governance architecture has been adopted by a number of highly successful projects including
[Uniswap](https://docs.uniswap.org/protocol/V2/concepts/governance/governance-reference) and has proven highly
successful in practice at adopting beneficial proposals to protocol upgrades while preventing adversarial attacks. 

The Hypernet Governance application is used for proposing and vetting new NonFungibleRegisties (NFR) which are deployed
through a RegistryFactory contract. NonFungleRegistries are based on the [EIP721](https://eips.ethereum.org/EIPS/eip-721) 
non-fungible token standard. Each NFR has a `MINTER_ROLE`, which can mint new entries to the registry, and a 
`DEFAULT_ADMIN_ROLE` which can make modifications to the registry contract parameters. These roles are set through the NFR 
constructor. 


## Install Dependencies

```shell
npm install
```

## Running Contract Tests

```shell
npx hardhat test
```

## Compiling Contracts to Generate Artifacts

```shell
npx hardhat compile
```

## Hardhat Network

First, start a hardhat node (edit [hardhat.config.js](https://hardhat.org/config/#networks-configuration) 
to customize the Hardhat network settings):

```shell
npx hardhat node
```

You can run the node on a custom port by adding the `--port flag`:

```shell
npx hardhat node --port 8569
```

Once the node is running, deploy the Solidity contracts to the Hardhat network:

```shell
npx hardhat run scripts/hardhat-script.js --network hardhat
```

Use the help tasks defined in `hardhat.config.js` to interact with the deployed contracts.

Get Governance contract parameters:

```shell
npx hardhat governanceParameters --network hardhat
```

Propose a new Non-Fungible Registry:

```shell
npx hardhat proposeRegistry --network hardhat --name Gateways --symbol GTW --owner 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
```

Check the state of an existing Proposal:

```shell
npx hardhat proposalState --network hardhat --id 28355135410951088116862211885830833164558945639064469703190055895859500299438
```

Delegate your voting power to a given address:

```shell
npx hardhat delegateVote --network hardhat --delegate 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

Cast a vote on a proposal (Against (0), For (1), Abstain (2)):

```shell
npx hardhat castVote --network hardhat --id 28355135410951088116862211885830833164558945639064469703190055895859500299438 --support 1
```