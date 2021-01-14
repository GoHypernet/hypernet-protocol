# `web-demo`

<!-- web-demo is a minimal demonstration showing how to consume the SDK that the Hypernet Core exposes to create a Hypernet Link between two agents.

## Usage

First, make sure you have [Metamask](https://metamask.io/) installed. In the future you (probably) won't need this, but for now it's the easiest way to interact with the Ethereum blockchain (which Hypernet Core uses under the hood).

Once you've set up Metamask, change the Network to "Localhost:8545"

`docker-compose down` - if you want to clean your docker-compose images, helps sometimes

`docker-compose pull` - to get the lastest docker images

`docker-compose up` - to bring up the stack

> Note: there seems to be a race condition sometimes when running docker-compose. If you notice that one of the containers within has stopped ore otherwise exited/errored, simply run `docker-compose up` *concurrently* in a new terminal, and this should fix the issue

`yarn start-web` - to bring up the web ui. After it comes up, import the two private keys shown on the web-ui into Metamask. These are your "Carol" and "Dave" test accounts.

### Docker-Compose Info

*list out each image in the docker stack and a short description of what it does* -->
