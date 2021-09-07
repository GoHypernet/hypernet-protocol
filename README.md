<p align="center">
  <img src="https://github.com/GoHypernet/hypernet-protocol/blob/dev/documentation/images/Hypernet-logo.svg" width="500">
</p>

# The Hypernet Protocol

The Hypernet Protocol aims to amalgamate blockchain and traditional payment technologies into a secure, 
high-throughput payment stack that enables merchants to accept cyptocurrency payments in their traditional online 
platforms with minimal intrusion into their existing platform and without specialized knowledge of web3 technology. 
The authors of the Hypernet Protocol believe that a decentralized, blockchain-secured, community-driven payment solution
will revolutionize the cyber-infrastructure landscape and that it is broadly generalizable to various decentralized 
marketplaces and subscription-based services.

A successful payment protocol must solve problem on both sides of the market. On the consumer side, users expect a 
payment solution that quickly executes transactions and is intuitive. To accomplish this, the Hypernet Protocol 
integrates Connext's [Vector](https://github.com/connext/vector) library to enable fast, secure, microtransactions, 
with minimal user intervention. On the merchant side, adopters expect a similarly refined onboarding process. The 
Hypernet Protocol stack offers merchant developers a flexible platform that can adapt to the idiosyncratic requirements 
of their particular business, and tools to streamline software integration. Meeting these needs has led to the development 
light-weight developer abstraction layer. Developer's are isolated from the particulars of Layer 2 scaling protocols and 
are presented with a small set of function calls bundled together in an npm package that looks familiar to those who 
have used a traditional payment service provider SDK.

This monorepo contains several packages:

- [hypernet-core](packages/hypernet-core): The core of the protocol. HNP is encapsulated into the HypernetCore class, which can be instantiated in a variety of ways.
- [developer-ui](packages/developer-ui): An example package demonstrating how to consume the Hypernet Core SDK. It is also used for integration testing.
- [contracts](packages/contracts): A package containing solidity contracts for Hypernet Protocol Governance, Hypertoken, and Non-Fungible Registy. 
- [iframe](packages/iframe): HypernetCore is designed to run in a browser, but that is a hostile environment. The iframe package is designed to host the running instance of HNC inside an iframe and expose an interface for cross-frame communication. The host window will communicate with the HNC via a proxy.
- [gateway-connector](packages/gateway-connector): This package is designed for gateways that want to support the Hypernet Protocol. Gateways will need to publish an API and "connector" code that HNP clients will run. Payments sent via HNP are each moderated by a gateway, the connector allows the gateway to keep up to date with the payments the client is actually sending and recieving so that, should any disputes arrive, they can properly moderate the dispute. This package includes the OpenApi specification for the required API, as well as the typescript interface that their published connector must implement.
- [gateway-iframe](packages/gateway-iframe): Gateway connectors are not allowed to run directly in the same window as HNC for security reasons, to prevent a rogue connector causing issues. gateway-iframe is the source for the iframe that will host the gateway connector. It is responsible for checking the signature of the connector and providing a cross-frame proxy interface to HNC. In production, this pacakge would be published somewhere like IPFS.
- [web-demo](packages/web-demo): An example package demonstrating how to consume the Hypernet Core SDK.
- [web-integration](packages/web-integration): This is the package that gateways would include on their actual website if they want to support HNP. This package will instantiate HNC in an iframe and provides a proxy interface to it for the gateway to interface with; from the gateway's POV it should be like working directly with a HypernetCore object. It also provides a number of pre-built UI widgets, along with easy utility functions, that make it trivial to display information from HNC on the gateway's website.
- [mobile-integration](packages/mobile-integration): This is the mobile variant of web-integration. It is designed to run HNC in a WebView, and provides a proxy object for the host to work with.
- [web-ui](packages/web-ui): The web-ui package contains all the ui components used by web-integration when using React.
- [test-gateway](packages/test-gateway): This is an example of a gateway integration. It contains two parts- an example implementation of IGatewayConnector, and a simple NodeJS/Express server that hosts the required gateway API. This particular gateway connector implementation is used for integration testing of the overall system. Gateways looking to support the Hypernet Protocol should look closely at this package.

## Purpose

Hypernet Core is meant to be a drop-in component of applications that wish to quickly and easily send funds from a service or product consumer to a service or product provider. It is meant to be a payment protocol that allows funds to be sent quickly, often, and with minimal (or no!) fees (most of the time). While developers that build on top of Hypernet Core may need to somewhat know how it works, the goal is for the Core to be completely transparent to end users - they shouldn't even need to know how blockchain works, or even what blockchain is, in order to use the Core.

## Key Concepts

As a developer or contributor to the Core, there are a few key concepts that need to be understood; most relate to blockchain and the underlying technologies used by the core.

### Hypernet Core as a _Serverless_ Payment Infrastructure Protocol

Most payment protocols requires a central server infrastructure; Visa processes credit card transactions via mainframes; Stripe processes payments in their cloud.

_Hypernet Core_ is peer to peer and serverless - mostly. Right now (as of Q4 2020), two clients communicate with each other via a central NATS messaging server, and payments are _routed_ (via the Vector protocol) via a _routing node_ to the end participant.

Though the routing node is an active participant in transfers, it has no knowledge of participant activity otherwise; it simply routes a payment from one person to another. Routing nodes never have custody of end user funds, and if they go (even permanently) offline, funds are not lost (though the end users that had active payment channels open will have to submit a blockchain transaction in order to claim their funds; more on that in the payment channels section!)

### Blockchain, Payment Channels, & Layer 2

Developers will need to know the basics of how blockchain works, as well as what payment channels are and how they work at a high level overview, in order to develop Hypernet Core.

#### Blockchain & Ethereum

Though most of the payments and activity occur at Layer 2 (see below), the Core must go down to Layer 1 for disputes, deposits, withdrawals, and other (hopefully rare) occasions.

As of Q4 2020, the Ethereum blockchain is capable of processing only 15 transactions per second; the supply and demand market for the fees associated with transactions on the blockchain, paired with this slow transaction speed, mean that individual transactions can be costly (sometimes as much as a few dollars!)

Helpful links / primers on blockchain, smart contracts, and Ethereum below:

- [3Blue1Brown, Youtube: "How does bitcoin actually work?](https://www.youtube.com/watch?v=bBC-nXj3Ng4&t=3s)
- [Intro to Ethereum](https://ethereum.org/en/developers/docs/intro-to-ethereum/)
- [Smart Contracts](https://ethereum.org/en/developers/docs/smart-contracts/)
- [Ethereum Whitepaper](https://ethereum.org/en/whitepaper/)

#### Payment Channels & Layer 2

As noted above, transacting on Ethereum itself is still slow. Thus, "Layer 2" solutions are needed. Layer 2 refers to the group of solutions that allow applications to transact "off-chain", and return to the chain when trust or communication breaks down. The below link is a very good primer & high level overview on layer 2 in general. Pay particular attention to the section on "Channels" - this is what Hypernet Core uses.

- [ethereum.org - Layer 2 Scaling](https://ethereum.org/en/developers/docs/layer-2-scaling/)

Hypernet Core specifically uses the payment channel framework developed by Connext called "Vector". In-progress documentation and a quick start guide on Vector can be found at the below link.

- [Connext - Vector](https://connext.github.io/vector/)

### Definitions & Key Terms

#### Hypernet Link

A _Hypernet Link_ is an abstraction representing the collective group of payments & transfers between two participants in the Hypernet Core ecosystem - namely, a service/product provider and a service/product consumer.

There can be up to _two_ Hypernet Links between two individuals/clients - one where Alice is a consumer and Bob is a provider, and one where Alice is a provider and Bob is a consumer.

#### Payment Channel

Similar to a _Hypernet Link_, but at a lower level of abstraction; a _payment channel_ represents an agreed-upon set of parameters between two participants on the Ethereum blockchain. When using the term payment channel henceforth, we are specifically referring to payment channels within the Connext/Vector framework.

**Important** - **Note the difference between a Hypernet Link and a Payment Channel, and at what layers they each live. It can be very easy to confuse the two if one isn't careful**

# Development
Using VSCode is recommended; all workflows and setup have been setup with this environment in mind. You should install and use the ESLint extention, details on that are [here](https://code.visualstudio.com/api/advanced-topics/tslint-eslint-migration). On the windows platform, development within the WSL2 environment is also highly recommended.

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
All commands should be run at the root of the repository. Most of them use Lerna to run subcommands inside the different packages. Most of these commands can be run on an 
individual package from the packages directory if necessary.

1. Switch to correct version of Node:

   `nvm install 12 && nvm alias default 12`

2. Install packages:

   `yarn`

3. Compile the whole repository to make sure everything is working

  `yarn compile`

4. Create all the development docker images

  `yarn dockerize`

5. Start the docker world

  `yarn start`

  This will start a LOT of docker images:
    1. A hardhat based ethereum development node. The node will have all the necessary contracts deployed, and the various development accounts funded. It is available at http://localhost:8545
    2. All the servers needed for the Vector protocol. These consist of a server node for the router, a router, a host for the Vector iframe, and the messaging stack.
    3. The core iframe server, which delivers the webpacked Hypernet Protocol Core Iframe. This is just an NGINX host, and is available at http://localhost:5020
    4. The gateway iframe server. Similar to the core iframe server, it just delivers the webpacked Hypernet Protocol Gateway Iframe. It is available at http://localhost:5005
    5. The user dashboard server. Another NGINX host, it is available at http://localhost:5016
    6. A test gateway server. This is a Node and Express based server that simulates the function of a gateway. It is available at http://localhost:5010

6. Open the user dashboard in your browser: http://localhost:5016. You can add the test gateway using the URL http://localhost:5010.


## Structure

This is organized as a monorepo, using [this](https://github.com/wixplosives/sample-monorepo) as an example. You must use yarn, because NPM does not support workspaces. All the dev dependencies are installed in the root package.json and should be the same for all pacakages. Sub packages are in the packages directory, and overall documentation is in the documentation directory.

## Maintenance

### Adding dependencies

Dev dependencies should be added to the root of the repository, via

`yarn add <package name> --dev -W`

Normal dependencies and peer dependencies should be added via yarn to the actual pacakge. Refer to the example monorepo above for more examples.

## System Architecture

Hypernet Core is built using a layered architecture with 4 layers; see the system diagram below for a brief description of each one and a sample of the modules within.

![HypernetCore System Architecture](https://github.com/GoHypernet/hypernet-protocol/raw/dev/documentation/images/HypernetCore.png)

## Usage

This will be one of the last sections filled in.
For now, see the `web-demo` package.

```
const core = require('core');
// TODO: DEMONSTRATE API
```