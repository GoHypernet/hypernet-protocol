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

 3) Install packages for the Embark framework:

 `cd embark/Hypernet && npm install`

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
❯ oz deploy
Nothing to compile, all contracts are up to date.
? Choose the kind of deployment upgradeable
? Pick a network forked
? Pick a contract to deploy HypernetProtocol
✓ Deploying @openzeppelin/contracts-ethereum-package dependency to network dev-1595834217091
✓ Contract HypernetProtocol deployed
All implementations have been deployed
? Call a function to initialize the instance after creating it? Yes
? Select which function * initialize()
✓ Setting everything up to create contract instances
✓ Instance created at 0x0290FB167208Af455bB137780163b7B7a9a10C16
To upgrade this instance run 'oz upgrade'
0x0290FB167208Af455bB137780163b7B7a9a10C16
❯ oz deploy
Nothing to compile, all contracts are up to date.
? Choose the kind of deployment upgradeable
? Pick a network forked
? Pick a contract to deploy Hypertoken
✓ Contract Hypertoken deployed
All implementations have been deployed
? Call a function to initialize the instance after creating it? Yes
? Select which function * initalize()
✓ Instance created at 0x67B5656d60a809915323Bf2C40A8bEF15A152e3e
To upgrade this instance run 'oz upgrade'
0x67B5656d60a809915323Bf2C40A8bEF15A152e3e
```

Note that above, we deploy the `ERC20PresetMinterPauserUpgradeSafe` [library contract from OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts-ethereum-package), which was added to the project via an earlier (not shown in the Readme) command:

`npx oz link @openzeppelin/contracts-ethereum-project`

We were able to deploy this even without having any contracts in the `contracts/` directory.

3) Spin up the frontend & dashboard with Embark:

`cd embark/Hypernet && npx embark run`

4) Access the dApp & dashboard, respectively, via `localhost:8000` & `localhost:55555`. Use the token generated via step 3 to access the dashboard and view deployed contracts, interact with the dApp, explorer the blockchain, etc.

---

However, we obviously want to [extend the base contracts](https://github.com/OpenZeppelin/openzeppelin-contracts-ethereum-package#extending-contracts), which we've done in `contracts/Hypertoken.sol`. This just extends the base upgradeable erc20 preset with a dummy function to mint a single token to the caller.

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

**Important Note**: The difference between ForceMove and ForceMoveApp is critical! ForceMove is the protocol; ForceMoveApp is an inheritable contract that apps can use
to implement their specific state machine. ForceMove and implementations of ForceMoveApp are **not** linked to each other! For our case, we'll do the following:

**NitroAdjuticator** is **ForceMove** <-- NitroAdjudicator is the actual deployed impelmentation of ForceMove that contains the rules and functions governing the channel

**GalileoApp** is **ForceMoveApp** <-- GalileoApp is an implementatio of ForceMoveApp that defines what a valid transition of the state machine should be

## Embark Framework Details

The embark framework has been initialized at the top level of the project. Some folders have been merged, but it theoretically shouldn't cause any issues.

 - `embark.json` - contains the base embark configs, including where it looks for smart contracts (ie, in the OpenZeppelin directory)
 - `config/contracts.js'` - specifies where smart contracts are deployed (if at all) on various environments, among other things

The frontend for the dApp, at least for development, will be contained within `app/`

## Files, Structure, & Other Notes

 - Normally, when using Truffle, we'd run `truffle migrate` to deploy contracts and migrations. Because we're using the OpenZeppelin framework, we use `oz deploy` instead.
 - We'll handle the deployment & compilation of the smart contracts with the (Embark framework.)[https://framework.embarklabs.io/]
 - We'll also handle the frontend with Embark.
 - OpenZeppelin stores information about deployed contracts in `.openzeppelin/` as JSON files.
 - Contracts added to `contracts/` will be shown as a choice to deploy when running `oz deploy`
 - Contracts added to `contracts/` will also be picked up by Embark (and callable on the web UI!)
