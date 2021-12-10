# First step is to build everything
FROM node:14 AS builder

WORKDIR /build

# Copy all the stuff needed to run and cache yarn
COPY ./package.json /build/package.json
COPY ./yarn.lock /build/yarn.lock
COPY ./packages/contracts/package.json /build/packages/contracts/package.json
COPY ./packages/development/package.json /build/packages/development/package.json
COPY ./packages/hypernet-core/package.json /build/packages/hypernet-core/package.json
COPY ./packages/iframe/package.json /build/packages/iframe/package.json
COPY ./packages/gateway-connector/package.json /build/packages/gateway-connector/package.json
COPY ./packages/gateway-iframe/package.json /build/packages/gateway-iframe/package.json
COPY ./packages/mobile-integration/package.json /build/packages/mobile-integration/package.json
COPY ./packages/objects/package.json /build/packages/objects/package.json
COPY ./packages/test-gateway/package.json /build/packages/test-gateway/package.json
COPY ./packages/test-gateway-connector/package.json /build/packages/test-gateway-connector/package.json
COPY ./packages/user-dashboard/package.json /build/packages/user-dashboard/package.json
COPY ./packages/utils/package.json /build/packages/utils/package.json
COPY ./packages/web-demo/package.json /build/packages/web-demo/package.json
COPY ./packages/web-integration/package.json /build/packages/web-integration/package.json
COPY ./packages/web-ui/package.json /build/packages/web-ui/package.json
RUN yarn config set network-timeout 600000
RUN yarn install

# Configuration for the protocol is baked in at build time
# We create a bunch of ARGs so that we can configure it properly
# for the environment.
ARG BUILD_ENV=development
ENV __BUILD_ENV__ $BUILD_ENV

ARG CORE_IFRAME_SOURCE=http://localhost:5020
ENV __CORE_IFRAME_SOURCE__ $CORE_IFRAME_SOURCE

ARG GOVERNANCE_CHAIN_ID=1337
ENV __GOVERNANCE_CHAIN_ID__ $GOVERNANCE_CHAIN_ID

# Copy the rest of the stuff and build
COPY . /build
RUN cd packages/user-dashboard && yarn build

FROM nginx:latest AS server

# Copy over the dist files
COPY --from=builder /build/packages/user-dashboard/dist/bundle /usr/share/nginx/html
COPY --from=builder /build/packages/user-dashboard/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /build/packages/user-dashboard/default.conf /etc/nginx/conf.d/default.conf

