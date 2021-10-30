# `development`

This package consists of sub-packages that are useful for the development of Hypernet Protocol. 
Look at the readme file for the sub-package for details. Currently, the only sub-package is `eth-provider`.
The `eth-provider` subpackage defines a docker image containerizing a hardhat development node with all 
contracts deployed to predictable addresses on startup of the service. NOTE: The address for various contracts
listed in deploy.ts should also be updated in `iframe/Dockerfile` as well as in `test-gateway\src\BlockchainRepository.tx`

# Updating Docker Image

Building and pushing (to DockerHub) the base image defined in `eth-provder` is scripted via the following commands:

```shell
yarn dockerize
yarn docker-push
```

After pushing to the container image repo, be sure to pull and run the latest version.