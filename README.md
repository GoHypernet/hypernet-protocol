<p align="center">
  <img src="/documentation/images/hypernet-protocol-black.svg" width="500">
</p>

# The Hypernet Protocol

## Summary 

The Hypernet Protocol aims to amalgamate instantly finalized, blockchain-based payments with a privacy-preserving,
"non-fungible" identity registry framework. The combination of these two elements enables merchants to accept cyptocurrency
payments in their traditional online platforms with minimal code intrusion and without specialized knowledge of Web3
technology while also complying with various regulations regarding electronic funds transfer. The authors of the
Hypernet Protocol believe that a decentralized, blockchain-secured, community-driven payment and identity solution will
revolutionize the cyber-infrastructure landscape and that it is broadly generalizable to various decentralized marketplaces
and subscription-based services.

This monorepo contains several packages:

- [hypernet-core](/packages/hypernet-core): The core of the protocol. HNP is encapsulated into the HypernetCore class, which can be instantiated in a variety of ways.
- [contracts](/packages/contracts): A package containing solidity contracts for Hypernet Protocol Governance, Hypertoken, and Non-Fungible Registy.
- [iframe](/packages/iframe): HypernetCore is designed to run in a browser, but that is a hostile environment. The iframe package is designed to host the running instance of HNC inside an iframe and expose an interface for cross-frame communication. The host window will communicate with the HNC via a proxy.
- [gateway-connector](/packages/gateway-connector): This package is designed for gateways that want to support the Hypernet Protocol. Gateways will need to publish an API and "connector" code that HNP clients will run. Payments sent via HNP are each moderated by a gateway, the connector allows the gateway to keep up to date with the payments the client is actually sending and recieving so that, should any disputes arrive, they can properly moderate the dispute. This package includes the OpenApi specification for the required API, as well as the typescript interface that their published connector must implement.
- [gateway-iframe](/packages/gateway-iframe): Gateway connectors are not allowed to run directly in the same window as HNC for security reasons, to prevent a rogue connector causing issues. gateway-iframe is the source for the iframe that will host the gateway connector. It is responsible for checking the signature of the connector and providing a cross-frame proxy interface to HNC. In production, this pacakge would be published somewhere like IPFS.
- [web-demo](/packages/web-demo): An example package demonstrating how to consume the Hypernet Core SDK.
- [web-integration](/packages/web-integration): This is the package that gateways would include on their actual website if they want to support HNP. This package will instantiate HNC in an iframe and provides a proxy interface to it for the gateway to interface with; from the gateway's POV it should be like working directly with a HypernetCore object. It also provides a number of pre-built UI widgets, along with easy utility functions, that make it trivial to display information from HNC on the gateway's website.
- [mobile-integration](/packages/mobile-integration): This is the mobile variant of web-integration. It is designed to run HNC in a WebView, and provides a proxy object for the host to work with.
- [web-ui](/packages/web-ui): The web-ui package contains all the ui components used by web-integration when using React.
- [test-gateway](/packages/test-gateway): This is an example of a gateway integration. It contains two parts- an example implementation of IGatewayConnector, and a simple NodeJS/Express server that hosts the required gateway API. This particular gateway connector implementation is used for integration testing of the overall system. Gateways looking to support the Hypernet Protocol should look closely at this package.

# Development

Using VSCode is recommended; all workflows and setup have been setup with this environment in mind. You should install and use the ESLint extention, details on 
that are [here](https://code.visualstudio.com/api/advanced-topics/tslint-eslint-migration). On the windows platform, development within the WSL2 environment is 
also highly recommended.

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

All commands should be run at the root of the repository. Most of them use Lerna to run subcommands inside the different packages. Most of these commands can be 
run on an individual package from the packages directory if necessary.

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

This will start a LOT of docker images: 1. A hardhat based ethereum development node. The node will have all the necessary contracts deployed, and the various 
development accounts funded. It is available at http://localhost:8545 2. All the servers needed for the Vector protocol. These consist of a server node for the 
router, a router, a host for the Vector iframe, and the messaging stack. 3. The core iframe server, which delivers the webpacked Hypernet Protocol Core Iframe. 
This is just an NGINX host, and is available at http://localhost:5020 4. The gateway iframe server. Similar to the core iframe server, it just delivers the 
webpacked Hypernet Protocol Gateway Iframe. It is available at http://localhost:5005 5. The user dashboard server. Another NGINX host, it is available at 
http://localhost:5016 6. A test gateway server. This is a Node and Express based server that simulates the function of a gateway. It is available at 
http://localhost:5010

6. Open the user dashboard in your browser: http://localhost:5016. You can add the test gateway using the URL http://localhost:5010.

## Structure

This is organized as a monorepo, using [this](https://github.com/wixplosives/sample-monorepo) as an example. You must use yarn, because NPM does not 
support workspaces. All the dev dependencies are installed in the root package.json and should be the same for all pacakages. Sub packages are in the 
packages directory, and overall documentation is in the documentation directory.

## Maintenance

### Adding dependencies

Dev dependencies should be added to the root of the repository, via

`yarn add <package name> --dev -W`

Normal dependencies and peer dependencies should be added via yarn to the actual pacakge. Refer to the example monorepo above for more examples.
