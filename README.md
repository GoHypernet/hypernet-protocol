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

Truffle and OpenZeppelin both provide frameworks and CLI tools to help develop smart contracts, test them,
upgrade them, etc. OpenZeppelin is more dedicated toward providing example contracts to inherit as well as the upgrading
process, and Truffle is more about testing, deploying, and migration of code; while we are using both, this project
has been initiated as a Truffle project with OpenZeppelin added in after, as the OZ tools auto-detect and adapt to the
Truffle project (while the reverse is not true).

In order to efficiently develop in this repo, you should know primarily how Truffle works, and have a casual understanding
of what OpenZeppelin offers.

ganache-cli is also used (which contains ganache-core), and is the main set of tools that Truffle (and us) will use for
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

[Note: Next, we'll actually extend the base contract instead of deploying it - needed for Hypertoken.](https://github.com/OpenZeppelin/openzeppelin-contracts-ethereum-package#extending-contracts)

## Files, Structure, & Other Notes

 - Normally, when using Truffle, we'd run `truffle migrate` to deploy contracts and migrations. Because we're using the OpenZeppelin framework, we use `oz deploy` instead.
 - OpenZeppelin stores information about deployed contracts in `.openzeppelin/` as JSON files.
 - Contracts added to `contracts/` will be shown as a choice to deploy when running `oz deploy`

## Future

EmbarkLabs will be used to actually do the deploying, development front-end, and monitoring of our dApps once we have a base with OpenZeppelin.
It's the next step though, so no need to start using it now (especially as we're getting used to OpenZeppelin).
