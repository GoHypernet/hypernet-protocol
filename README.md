# hypernet-protocol
Hypernet smart contracts, SDK, and everything else needed to start building on top of the Hypernet Protocol.

## Prerequisites
 - nvm
 - yarn

## Installing
 1) Switch to correct version of Node:

 `nvm install 14` or `nvm use 14` if already installed

 2) Install packages:

 `yarn install` or just `yarn`

## Components

  - [Truffle](https://www.trufflesuite.com/)
  - [OpenZeppelin](https://openzeppelin.com/)
  - [ganache-cli](https://github.com/trufflesuite/ganache-cli)
	- [Embark Framework](https://framework.embarklabs.io/)

Truffle and OpenZeppelin both provide frameworks and CLI tools to help develop smart contracts, test them,
upgrade them, etc. OpenZeppelin is more dedicated toward providing example contracts to inherit as well as the upgrading
process, and Truffle is more about testing, deploying, and migration of code; while we are using both, this project
has been initiated as a Truffle project with OpenZeppelin added in after, as the OZ tools auto-detect and adapt to the
Truffle project (while the reverse is not true).

The embark framework is an integrated ecosystem with not only command line tools, but a web UI (called the Cockpit) that helps
with compilation, deployment, and debugging of smart contracts as well as an easy-to-develop-on front-end system for the basics.

In order to efficiently develop in this repo, you should know primarily how OpenZeppelin works, as we'll be using the OZ cli
primarily for compiling and deploying of smart contracts (initially), and then later on, the Embark framework for deploying,
testing, and basic front-end development. Truffle is also helpful, but not necessary, to know.

ganache-cli is also used (which contains ganache-core), and is the main set of tools that Truffle, OZ, embark (and us) will use for
deploying, testing, and migrating smart contracts; it is very powerful and helpful if you know how to use it.

## Usage

1) Spin up the development ganache instance:

`npx ganache-cli --deterministic`

2) Deploy via OpenZeppelin, which uses Truffle under hood.

`npx openzeppelin deploy`

This will begin an interactive prompt that will ask you what network you want to deploy on,
what contract you want to deploy, and will let you call any functions on it.

Because we are using the Openzeppelin Upgradeable contracts, we must use initializers, and not constructors,
for contracts. [Make sure you read up on the differences.](https://docs.openzeppelin.com/upgrades/2.8/writing-upgradeable)

```
$ npx openzeppelin deploy

✓ Compiling contracts with Truffle, using settings from truffle.js file
Truffle output:

Compiling your contracts...
===========================
> Compiling ./contracts/Migrations.sol
> Artifacts written to /home/caleb/hypernet-protocol/build/contracts
> Compiled successfully using:
   - solc: 0.5.16+commit.9c3226ce.Emscripten.clang


? Choose the kind of deployment upgradeable
? Pick a network development
? Pick a contract to deploy @openzeppelin/contracts-ethereum-package/ERC20PresetMinterPauserUpgradeSafe
✓ Deploying @openzeppelin/contracts-ethereum-package dependency to network dev-1594933911016
All implementations are up to date
? Call a function to initialize the instance after creating it? Yes
? Select which function initialize(name: string, symbol: string)
? name: string: Hypertoken
? symbol: string: HYPE
✓ Setting everything up to create contract instances
✓ Instance created at 0x59d3631c86BbE35EF041872d502F218A39FBa150
To upgrade this instance run 'oz upgrade'
0x59d3631c86BbE35EF041872d502F218A39FBa150
```

Note that above, we deploy the `ERC20PresetMinterPauserUpgradeSafe` [library contract from OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts-ethereum-package), which was added to the project via an earlier (not shown in the Readme) command:

`npx oz link @openzeppelin/contracts-ethereum-project`

We were able to deploy this even without having any contracts in the `contracts/` directory.

---

However, we obviously want to [extend the base contracts](https://github.com/OpenZeppelin/openzeppelin-contracts-ethereum-package#extending-contracts), which we've done in `contracts/Hypertoken.sol`. This just extends the base upgradeable erc20 preset with a dummy function to mint a single token to the caller.

---

Next: We're going to add in the framework for payment channels.

## Payment/State Channel Overview

### Nitro Framework Resources

[ForceMove.sol](https://protocol.statechannels.org/docs/contract-devs/force-move) - implementation of the ForceMove protocol, which allows state channels to be adjudicated and finalized

**[ForceMoveApp.sol](https://protocol.statechannels.org/docs/contract-api/natspec/forcemoveapp)** - interface requiring children to implement a `validTransition` function, defining the state machine of a ForceMove state channel dApp. This one is important! More on this below.

**[Outcome.sol](https://github.com/statechannels/statechannels/blob/master/packages/nitro-protocol/contracts/Outcome.sol)** - library containing utilities for state channel outcomes! It's very important to know how this works.

[TrivialApp.sol](https://protocol.statechannels.org/docs/contract-api/natspec/trivialapp) - example app implementing ForceMove; all possible state transitions are valid

[SingleAssetPayments.sol](https://protocol.statechannels.org/docs/contract-api/natspec/singleassetpayments) - example app implementing ForceMove; implements a simple payment channel with a single asset type

[Nitro Tutorial](https://github.com/statechannels/nitro-tutorial) - minimal example tutorial for Nitro

### Nitro Framework Detailed

The Nitro framework specifies what an app that complies to the `ForceMoveApp.sol` interface must implement - the `validTransition(a,b)` function. This function needs to decode the appData, from state channel updates a and b, and decide if b is an acceptable transition from a. For example, in a game of chess, the position of the king in b.appData must be within one square of its position in a.appData.

Because our implementation, at least at first, is going to be a simple payment channel, we can use the base from `SingleAssetPayments.sol`, and build from there. `SingleAssetPayments.sol` lets only the person who's turn it is (the *mover*) send funds, and assumes that on the `nth` turn, the `n%2` participant is the mover.

## Files, Structure, & Other Notes

 - Normally, when using Truffle, we'd run `truffle migrate` to deploy contracts and migrations. Because we're using the OpenZeppelin framework, we use `oz deploy` instead.
 - We'll handle the deployment & compilation of the smart contracts with the (Embark framework.)[https://framework.embarklabs.io/]
 - We'll also handle the frontend with Embark.
 - OpenZeppelin stores information about deployed contracts in `.openzeppelin/` as JSON files.
 - Contracts added to `contracts/` will be shown as a choice to deploy when running `oz deploy`

## Future

EmbarkLabs will be used to actually do the deploying, development front-end, and monitoring of our dApps once we have a base with OpenZeppelin.
It's the next step though, so no need to start using it now (especially as we're getting used to OpenZeppelin).
