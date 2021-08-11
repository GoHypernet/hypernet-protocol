# First step is to build everything
FROM node:14 AS builder

WORKDIR /build

# Copy all the stuff needed to run and cache yarn
COPY ./package.json /build/package.json
COPY ./yarn.lock /build/yarn.lock
COPY ./packages/developer-ui/package.json /build/packages/developer-ui/package.json
COPY ./packages/development/package.json /build/packages/development/package.json
COPY ./packages/governance-app/package.json /build/packages/governance-app/package.json
COPY ./packages/hypernet-core/package.json /build/packages/hypernet-core/package.json
COPY ./packages/iframe/package.json /build/packages/iframe/package.json
COPY ./packages/gateway-connector/package.json /build/packages/gateway-connector/package.json
COPY ./packages/gateway-iframe/package.json /build/packages/gateway-iframe/package.json
COPY ./packages/mobile-integration/package.json /build/packages/mobile-integration/package.json
COPY ./packages/objects/package.json /build/packages/objects/package.json
COPY ./packages/test-gateway/package.json /build/packages/test-gateway/package.json
COPY ./packages/user-dashboard/package.json /build/packages/user-dashboard/package.json
COPY ./packages/utils/package.json /build/packages/utils/package.json
COPY ./packages/web-demo/package.json /build/packages/web-demo/package.json
COPY ./packages/web-integration/package.json /build/packages/web-integration/package.json
COPY ./packages/web-ui/package.json /build/packages/web-ui/package.json
RUN yarn config set network-timeout 300000
RUN yarn install

# Configuration for the protocol is baked in at build time
# We create a bunch of ARGs so that we can configure it properly
# for the environment.
ARG BUILD_ENV=development
ENV __BUILD_ENV__ $BUILD_ENV

ARG IFRAME_SOURCE=http://localhost:5000
ENV __IFRAME_SOURCE__ $IFRAME_SOURCE

ARG CHAIN_PROVIDERS='{"1337": "http://localhost:8545"}'
ENV __CHAIN_PROVIDERS__ $CHAIN_PROVIDERS

ARG CHAIN_ADDRESSES='{ \
      "1337": { \
        "channelFactoryAddress": "0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da", \
        "transferRegistryAddress": "0x8f0483125FCb9aaAEFA9209D8E9d7b9C8B9Fb90F", \
        "hypertokenAddress": "0x9FBDa871d559710256a2502A2517b794B482Db40", \
        "messageTransferAddress": "0xFB88dE099e13c3ED21F80a7a1E49f8CAEcF10df6", \
        "insuranceTransferAddress": "0x30753E4A8aad7F8597332E813735Def5dD395028", \
        "parameterizedTransferAddress": "0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4", \
        "gatewayRegistryAddress": "0xf204a4Ef082f5c04bB89F7D5E6568B796096735a", \
        "liquidityRegistryAddress": "0x75c35C980C0d37ef46DF04d31A140b65503c0eEd" \
      }, \
      "1369": { \
        "channelFactoryAddress": "0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da", \
        "transferRegistryAddress": "0x8f0483125FCb9aaAEFA9209D8E9d7b9C8B9Fb90F", \
        "hypertokenAddress": "0x9FBDa871d559710256a2502A2517b794B482Db40", \
        "messageTransferAddress": "0xFB88dE099e13c3ED21F80a7a1E49f8CAEcF10df6", \
        "insuranceTransferAddress": "0x30753E4A8aad7F8597332E813735Def5dD395028", \
        "parameterizedTransferAddress": "0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4", \
        "gatewayRegistryAddress": "0xf204a4Ef082f5c04bB89F7D5E6568B796096735a", \
        "liquidityRegistryAddress": "0x75c35C980C0d37ef46DF04d31A140b65503c0eEd" \
      } \
    }'
ENV __CHAIN_ADDRESSES__ $CHAIN_ADDRESSES

ENV DEFAULT_CHAIN_ID=1337
ARG __DEFAULT_CHAIN_ID__ $DEFAULT_CHAIN_ID

ARG NATS_URL=ws://localhost:4221
ENV __NATS_URL__ $NATS_URL

ARG AUTH_URL=http://localhost:5040
ENV __AUTH_URL__ $AUTH_URL

ARG VALIDATOR_IFRAME_URL=http://localhost:5005
ENV __VALIDATOR_IFRAME_URL__ $VALIDATOR_IFRAME_URL

ARG CERAMIC_NODE_URL=https://ceramic-clay.3boxlabs.com
ENV __CERAMIC_NODE_URL__ $CERAMIC_NODE_URL

ARG INFURA_ID=72827ccd538446f2a20e35a632664c52
ENV __INFURA_ID__ $INFURA_ID

ARG DEBUG=true
ENV __DEBUG__ $DEBUG

# Copy the rest of the stuff and build
COPY . /build
RUN cd packages/iframe && yarn build

FROM nginx:latest AS server

# Copy over the dist files
COPY --from=builder /build/packages/iframe/dist/bundle /usr/share/nginx/html

