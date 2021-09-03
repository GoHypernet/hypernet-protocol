# `gateway-connector`

This package contains the definitions necessary to create a Gateway Connector. It is the only package that a Gateway will actually need in order to create their service, and even then, it is technically optional because of the nature of Javascript, assuming their published Gateway Connector conforms to this contract.

This package consists only of Typescript interfaces that define the contracts a Gateway Connector should adhere to. The most critical is IGatewayConnector, which defines the main interface point between Hypernet Protocol and the Gateway itself. The Gateway Connector code, when executed, but create an instance of an IGatewayConnector, and assign that instance to `window.connector`. 

## Development

This package is just meant to be an NPM package that is published publicly.

`yarn compile`

Compiles the package.

