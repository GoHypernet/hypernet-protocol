<p align="center">
  <img src="/documentation/images/hypernet-protocol-black.svg" width="500">
</p>

# The Hypernet Protocol

## Summary 

The Hypernet Protocol aims to amalgamate instantly finalized, blockchain-based [payments](/documentation/gitbook/digital-payments.md) with a privacy-preserving, 
[sybil-resistant](https://en.wikipedia.org/wiki/Sybil_attack), "non-fungible" [identity registry framework](/packages/contracts/contracts/identity/README.md)
that is governed by the Hypertoken community through a [Decentralized Autonomous Organization](/packages/contracts/contracts/governance/README.md). 
The combination of these elements enables merchants to securely accept cyptocurrency payments in their traditional online 
platforms with minimal code intrusion and without specialized knowledge of Web3 technology and digital assets while also complying with 
various regulations regarding electronic funds transfer. The authors of the Hypernet Protocol believe that a decentralized, 
blockchain-secured, community-driven payment and identity solution will revolutionize the cyber-infrastructure landscape and 
that it is broadly generalizable to various decentralized marketplaces and subscription-based services.

## Protocol Contents

The Hypernet Protocol monorepo contains several packages:

- [Hypernet Core](/packages/hypernet-core): The core of the protocol. HNP is encapsulated into the HypernetCore class, which can be instantiated in a variety of ways.
- [Contracts](/packages/contracts): A package containing solidity contracts for Hypernet Protocol Governance, Hypertoken, and Non-Fungible Registy.
- [IFrame](/packages/iframe): HypernetCore is designed to run in a browser, but that is a hostile environment. The iframe package is designed to host the running instance of HNC inside an iframe and expose an interface for cross-frame communication. The host window will communicate with the HNC via a proxy.
- [Payment Gateway Connector](/packages/gateway-connector): This package is designed for gateways that want to support the Hypernet Protocol. Gateways will need to publish an API and "connector" code that HNP clients will run. Payments sent via HNP are each moderated by a gateway, the connector allows the gateway to keep up to date with the payments the client is actually sending and recieving so that, should any disputes arrive, they can properly moderate the dispute. This package includes the OpenApi specification for the required API, as well as the typescript interface that their published connector must implement.
- [Payment Gateway IFrame](/packages/gateway-iframe): Gateway connectors are not allowed to run directly in the same window as HNC for security reasons, to prevent a rogue connector causing issues. gateway-iframe is the source for the iframe that will host the gateway connector. It is responsible for checking the signature of the connector and providing a cross-frame proxy interface to HNC. In production, this pacakge would be published somewhere like IPFS.
- [Web Demo](/packages/web-demo): An example package demonstrating how to consume the Hypernet Core SDK.
- [Web Integration](/packages/web-integration): This is the package that gateways would include on their actual website if they want to support HNP. This package will instantiate HNC in an iframe and provides a proxy interface to it for the gateway to interface with; from the gateway's POV it should be like working directly with a HypernetCore object. It also provides a number of pre-built UI widgets, along with easy utility functions, that make it trivial to display information from HNC on the gateway's website.
- [Mobile Integration](/packages/mobile-integration): This is the mobile variant of web-integration. It is designed to run HNC in a WebView, and provides a proxy object for the host to work with.
- [Web UI](/packages/web-ui): The web-ui package contains all the ui components used by web-integration when using React.
- [Test Payment Gateway](/packages/test-gateway): This is an example of a gateway integration. It contains two parts- an example implementation of IGatewayConnector, and a simple NodeJS/Express server that hosts the required gateway API. This particular gateway connector implementation is used for integration testing of the overall system. Gateways looking to support the Hypernet Protocol should look closely at this package.
