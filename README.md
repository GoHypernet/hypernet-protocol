
![alt](https://github.com/GoHypernet/hypernet-protocol/tree/dev/documentation/images/Hypernet_Logo.png)

# The Hypernet Protocol

The Hypernet Protocol aims to amalgamate blockchain and traditional payment technologies into a secure,
user-friendly, high-throughput payment stack for use by merchants looking for way to accept cyptocurrency
payments in their traditional online platforms. The authors of the Hypernet Protocol believe that a decentralized, 
blockchain-secured, community-drive payment solution will revolutionize the cyber-infrastructure landscape
and that it is broadly generalizable to various decentralized marketplaces and subscription-based services. 

A successful payment protocol must solve problem on both sides of the market. On the consumer side, users
expect a payment solution that quickly executes transactions and is intuitive. To accomplish this, the
Hypernet Protocol integrates Connext's Vector library to enable fast, secure, microtransactions, with
miminal user intervention. On the merchant side, adopters expect a similarly refined onboarding process.
The Hypernet Protocol stack offers Merchant developers a flexible platform that can adapt to the 
idiosyncratic requirements of their particular business, and tools to streamline software integration. 
Meeting these needs has led to the developement light-weight developer abstraction layer.
Developer's are isolated from the particulars of layer 2 scaling protocols and are presented with a small 
set of function calls bundled together in an npm package that looks familiar to those who have
used a traditional payment service provider sdk.  

This monorepo contains several packages:  

- developer-ui: An example package demonstrating how to consume the Hypernet Core SDK. 
- hypernet-contracts: A package containing the Hypernet Protocol smart contracts.
- iframe: A package for running an iframe process in the browser which connects to a merchant service.
- web-demo: An example package demonstrating how to consume the Hypernet Core SDK.  
- web-integration: 
- web-ui: 


## Prerequisites
 - linux/(maybe mac?); windows users: [WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
 - [nvm](https://github.com/nvm-sh/nvm#install--update-script)
 - [yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable)
 - docker. if on windows, docker-desktop + enable the wsl integration

## Installing
1) Switch to correct version of Node:

    `nvm install 12 && nvm alias default 12`

2) Install packages:

    `yarn`

## Packages

### hypernet-core

Contains the bulk of the code in the monorepo; consumes the Connext SDK and exposes the concept of (and an SDK for) a "Hypernet Link". See package readme for more details on how this works exactly.

### Hypernet-Contracts

Contains the smart contracts needed for Hypernet Links to function, including Hypertoken.

### developer-ui

A minimal demo that demonstrates consumption of the Hypernet Core SDK, as well as usage of both of the custom transfer definitions that Hypernet created (and pr'd into the Connext Vector repo).
