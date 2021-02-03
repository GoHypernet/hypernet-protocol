
![alt](documentation/images/Hypernet_Logo.jpg)

# The Hypernet Protocol

The Hypernet Protocol aims to amalgamate blockchain and traditional payment technologies into a secure,
user-friendly, high-throughput payment stack for use by merchants looking for way to accept cyptocurrency
payments in their traditional online platforms. The authors of the Hypernet Protocol believe that a decentralized, 
blockchain-secured, community-drive payment solution will revolutionize the cyber-infrastructure landscape
and that it is broadly generalizable to various decentralized marketplaces and subscription-based services. 

A successful payment protocol must solve problem on both sides of the market. On the consumer side, users
expect a payment solution that quickly executes transactions and is intuitive. To accomplish this, the
Hypernet Protocol integrates Connext's [Vector](https://github.com/connext/vector) library to enable 
fast, secure, microtransactions, with minimal user intervention. On the merchant side, adopters expect 
a similarly refined onboarding process. The Hypernet Protocol stack offers Merchant developers a flexible 
platform that can adapt to the idiosyncratic requirements of their particular business, and tools to 
streamline software integration. Meeting these needs has led to the development light-weight developer 
abstraction layer. Developer's are isolated from the particulars of layer 2 scaling protocols and are 
presented with a small set of function calls bundled together in an npm package that looks familiar to 
those who have used a traditional payment service provider SDK.  

This monorepo contains several packages:  

- [developer-ui](packages/developer-ui): An example package demonstrating how to consume the Hypernet Core SDK. 
- [hypernet-contracts](packages/hypernet-contracts): A package containing the Hypernet Protocol smart contracts.
- [iframe](packages/iframe): A package for running an iframe process in the browser which connects to a merchant service.
- [web-demo](packages/web-demo): An example package demonstrating how to consume the Hypernet Core SDK.  
- [web-integration](packages/web-integrations): 
- [web-ui](packages/web-ui): 


## Prerequisites
 - Supported OS:
	- Linux: Ubuntu, Debian
	- Mac
	- Windows 10: [WSL](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
 - [nvm](https://github.com/nvm-sh/nvm#install--update-script)
 - [yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable)
 - [Docker](https://www.docker.com/products/docker-desktop): If you are developing on a Windows platform, 
   enable WSL integration when you install Docker-Desktop.

## Installing
1) Switch to correct version of Node:

    `nvm install 12 && nvm alias default 12`

2) Install packages:

    `yarn`

## Structure
This is organized as a monorepo, using [this](https://github.com/wixplosives/sample-monorepo) as an example.

## Maintenance
### Adding dependencies
Dev dependencies should be added to the root of the repository, via 

`yarn add <package name> --dev -W`

Normal dependencies and peer dependencies should be added via yarn to the actual pacakge. Refer to the example monorepo above for more examples.