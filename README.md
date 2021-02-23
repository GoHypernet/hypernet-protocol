
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
- [hypernet-core](packages/hypernet-core): The core of the protocol. HNP is encapsulated into the HypernetCore class, which can be instantiated in a variety of ways.
- [developer-ui](packages/developer-ui): An example package demonstrating how to consume the Hypernet Core SDK. It is also used for integration testing.
- [hypernet-contracts](packages/hypernet-contracts): A package containing the Hypernet Protocol smart contracts.
- [iframe](packages/iframe): HypernetCore is designed to run in a browser, but that is a hostile environment. The iframe package is designed to host the running instance of HNC inside an iframe and expose an interface for cross-frame communication. The host window will communicate with the HNC via a proxy.
- [merchant-connector](packages/merchant-connector): This package is designed for merchants that want to support the Hypernet Protocol. Merchants will need to publish an API and "connector" code that HNP clients will run. Payments sent via HNP are each moderated by a merchant, the connector allows the merchant to keep up to date with the payments the client is actually sending and recieving so that, should any disputes arrive, they can properly moderate the dispute. This package includes the OpenApi specification for the required API, as well as the typescript interface that their published connector must implement.
- [merchant-iframe](packages/merchant-iframe): Merchant connectors are not allowed to run directly in the same window as HNC for security reasons, to prevent a rogue connector causing issues. merchant-iframe is the source for the iframe that will host the merchant connector. It is responsible for checking the signature of the connector and providing a cross-frame proxy interface to HNC. In production, this pacakge would be published somewhere like IPFS.
- [web-demo](packages/web-demo): An example package demonstrating how to consume the Hypernet Core SDK.  
- [web-integration](packages/web-integrations): This is the package that merchants would include on their actual website if they want to support HNP. This package will instantiate HNC in an iframe and provides a proxy interface to it for the merchant to interface with; from the merchant's POV it should be like working directly with a HypernetCore object. It also provides a number of pre-built UI widgets, along with easy utility functions, that make it trivial to display information from HNC on the merchant's website.
- [mobile-integration](packages/mobile-integration): This is the mobile variant of web-integration. It is designed to run HNC in a WebView, and provides a proxy object for the host to work with. 
- [web-ui](packages/web-ui): The web-ui package contains all the widgets used by web-integration and mobile-integration when using React Native.
- [test-merchant-connector](packages/test-merchant-connector): This is an example of a merchant integration. It contains two parts- an example implementation of IMerchantConnector, and a simple NodeJS/Express server that hosts the required merchant API. This particular merchant connector implementation is used for integration testing of the overall system. Merchants looking to support the Hypernet Protocol should look closely at this package.


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