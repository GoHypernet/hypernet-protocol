# hypernet-protocol
Hypernet smart contracts, SDK, and everything else needed to start building on top of the Hypernet Protocol.

## Prerequisites
 - linux/(maybe mac?); windows users: [WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
 - [nvm](https://github.com/nvm-sh/nvm#install--update-script)
 - [yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable)

## Installing
1) Switch to correct version of Node:

    `nvm install 12 && nvm alias default 12`

2) Install packages:

    `yarn`

## Packages

### Hypernet-Core

`yarn build-core`

Contains the bulk of the code in the monorepo; consumes the Connext SDK and exposes the concept of (and an SDK for) a "Hypernet Link". See package readme for more details on how this works exactly.

### Hypernet-Contracts

Contains the smart contracts needed for Hypernet Links to function, including Hypertoken.

### Web-Demo

`yarn web-demo`

A minimal demo that demonstrates consumption of the Hypernet Core SDK, as well as usage of both of the custom transfer definitions that Hypernet created (and pr'd into the Connext Vector repo).
