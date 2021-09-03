# eth-provider

This package is an overload for the eth-provider provided by Connext in their Vector stack. It is just a configured Hardhat instance packaged as a docker file.

The included overloads replace Connext's deploy.ts file with our own customized version. That file is where the magic happens. Our version of the eth-provider will deploy all the Vector related contracts, and then proceeds to deploy all of the Hypernet Protocol contracts, including the additional transfer types, and the various registry and governance contracts. The provider then populates several blockchain accounts with the three types of tokens used for development, Ethereum, Test Token (Connext's), and HyperToken. Last, it populates the router registry with data compatible with both the Test Gateway and HyperPay. 

The gateway is responsible for registering itself in the provider. This is mainly to provide an example of how to do this for future Gateway developers, as they will need to do it themselves, but probably will be able to do it via the Governance DAPP. Router owners will also use the Governance DAPP to submit their registration information.