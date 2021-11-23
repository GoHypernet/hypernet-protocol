# test-gateway

This package creates a docker container with an Express server that acts as a Gateway for test purposes. The Test Gateway demonstrates the required Gateway API, as well as how to sign insurance releases and sign the Gateway Connector.

## Development

This package is designed to be dockerized, with the docker container running a Node application using Express.

`yarn compile`

Compiles the package itself, mainly used for testing.

`yarn build`

Compiles the package AND the `test-gateway-connector` package. These two are a set; `test-gateway` requires that `test-gateway-connector` be located next to it. This command only works and makes sense inside the monorepo. This command really only needs to be run inside the docker container as part of dockerize.

`yarn dockerize`

Builds the docker image that hosts the test gateway.

`yarn docker-push`

Pushes the built docker image with the :local tag up to Docker Hub. Must have permissions to do this.
