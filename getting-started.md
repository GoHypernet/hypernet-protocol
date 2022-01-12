# Getting Started

## Environment

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
