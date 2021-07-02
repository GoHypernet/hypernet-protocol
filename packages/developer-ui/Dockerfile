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
RUN yarn install

# Configuration for the protocol is baked in at build time
# We create a bunch of ARGs so that we can configure it properly
# for the environment.
ARG BUILD_ENV=development
ENV __BUILD_ENV__ $BUILD_ENV

ARG CORE_IFRAME_SOURCE=http://localhost:5020
ENV __CORE_IFRAME_SOURCE__ $CORE_IFRAME_SOURCE

# Copy the rest of the stuff and build
COPY . /build
RUN cd packages/developer-ui && yarn build

FROM nginx:latest AS server

# Copy over the dist files
COPY --from=builder /build/packages/developer-ui/dist/bundle /usr/share/nginx/html

