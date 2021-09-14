# test-gateway-connector

This package demonstrates how to create a Gateway Connector, and is used for testing purposes in the overall Hypernet Protocol. It demonstrates a number of very useful behaviors.

- It consumes the `gateway-connector` package, instantiates it's own `TestGatewayConnector` object and puts that into `window.connector`.
- It demonstrates using a UI inside the Gateway Connector.
- It can generate payments, resolve insurance, and properly returns GatewayTokenInfo.

## Development

This package includes a webpack configuration, which is considered its proper deliverable. 

`yarn compile`

Compiles the package itself, mainly used for testing.

`yarn build`

Compiles the package and runs webpack, creating connector.js. However, this file is placed directly into the `test-gateway` package's dist folder. These two packages are designed to work together and this command only works within the confines of the monorepo.
