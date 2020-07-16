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

2) Run the (Truffle) migrations:

`truffle migrate`

This should run any migrations that have not been deployed to the development network.
It will throw an error if it cannot connect to the development network, or if there is a transaction error in the migrations.

```
$ truffle migrate

Compiling your contracts...
===========================
> Everything is up to date, there is nothing to compile.



Starting migrations...
======================
> Network name:    'development'
> Network id:      1594931142764
> Block gas limit: 6721975 (0x6691b7)


1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0x1bc07139b4d74d7c1499953e2b4456725617bd0c089d5d086c5bbf1e8a807c7e
   > Blocks: 0            Seconds: 0
   > contract address:    0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab
   > block number:        1
   > block timestamp:     1594931157
   > account:             0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1
   > balance:             99.9967165
   > gas used:            164175 (0x2814f)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.0032835 ETH


   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:           0.0032835 ETH


Summary
=======
> Total deployments:   1
> Final cost:          0.0032835 ETH

```
