# `gateway-iframe`

This package contains the code for the Gateway Connector proxy. It is very similar to the `iframe` package, in that it produces a webpacked (and optionally dockerized) Postmate-based child proxy, designed to be hosted as an iframe in Web mode use. Unlike the iframe package, the gateway-iframe also includes some non-proxy logic. When the iframe is created, it must be given several parameters, including the Gateway URL, Address (Account), and Signature, all retrieved from the blockchain Gateway Registry by the core. It will first setup a Postmate child proxy, and is then responsible for independently connecting to the gateway, pulling down the code from /connector, and verifying the signature of the code. It will attempt to bust the cache if necessary so that it has the most up to date version of the connector code. 

If and only if the code matches the signature will the connector code be activated, via putting the downloaded code into a `<script>` tag. The connector is required to instantiate itself and put a reference to the IGatewayConnector object into the window at window.connector. This model keeps the actual HNC instance completely isolated from all direct communication with the outside world. The Gateway Connector code iself has complete control over the iframe, including the ability to do bad things in it. As the gateway connector can import other libraries, the gateway iframe should be considered a very hostile environment. This is somewhat ameliorated by strict auditing of the gateway connector code before the signature is accepted, but must be considered a systemic risk. It is recommended that the governance system to not allow a gateway to publish non webpacked (or equivalent single-file package) code, to prevent the code from pulling in outside, non-signed code if possible, although there is no way to enforce this at a technology level, at least that I am aware of. 

One idea was to actually run the gateway connector code inside of ANOTHER iframe, but the only thing that would protect against would be destruction or corruption of the proxy mechanism. By the time the gateway code is executed, its signature has already been checked and there is no ongoing signature checking to corrupt so that is also not a risk. If the bad code removes the proxy mechanism, it also removes the ability to communicate at all with HNC, so that is not considered a risk, and thus, no extra iframe protection seems worthwhile. 

## Design

This package uses the standard 4 layer design (see `hypernet-core` for details), with a call-down, event-up pattern, and adheres to SOLID principles. Unlike `iframe`, this package properly subscribes to events from the IGatewayConnnector and passes them down the stack.

## Development

This package inclucde a webpack configuration, which is considered the final deliverable.  

`yarn compile`

Compiles the package, but does not build the webpack file.

`yarn build`

Compiles the package and builds the webpacked output.

`yarn dockerize`

Builds an NGINX docker image that serves the webpacked content.

`yarn docker-push`

Pushes the built docker image with the :local tag up to Docker Hub. Must have permissions to do this.

`yarn test`

Runs the unit and integration tests on the package.

