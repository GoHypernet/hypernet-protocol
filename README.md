# hypernet-protocol
Hypernet smart contracts, SDK, and everything else needed to start building on top of the Hypernet Protocol.

## Preqrequisites
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
upgrade them, etc. OpenZeppelin is more dedicated toward provide example contracts to inherit as well as the upgrading
process, and Truffle is more about testing, deploying, and migration of code; while we are using both, this project
has been initiated as a Truffle project with OpenZeppelin added in after, as the OZ tools auto-detect and adapt to the
Truffle project (while the reverse is not true)

In order to efficiently develop in this repo, you should know primarily how Truffle works, and have a casual understanding
of what OpenZeppelin offers.

ganache-cli is also used (which contains ganache-core), and is the main set of tools that Truffle (and us) will use for
deploying, testing, and migrating smart contracts; it is very powerful and helpful if you know how to use it.
