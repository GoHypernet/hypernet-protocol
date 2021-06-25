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
COPY ./packages/merchant-connector/package.json /build/packages/merchant-connector/package.json
COPY ./packages/merchant-iframe/package.json /build/packages/merchant-iframe/package.json
COPY ./packages/mobile-integration/package.json /build/packages/mobile-integration/package.json
COPY ./packages/objects/package.json /build/packages/objects/package.json
COPY ./packages/test-merchant-connector/package.json /build/packages/test-merchant-connector/package.json
COPY ./packages/user-dashboard/package.json /build/packages/user-dashboard/package.json
COPY ./packages/utils/package.json /build/packages/utils/package.json
COPY ./packages/web-demo/package.json /build/packages/web-demo/package.json
COPY ./packages/web-integration/package.json /build/packages/web-integration/package.json
COPY ./packages/web-ui/package.json /build/packages/web-ui/package.json
RUN yarn install

# Copy the rest of the stuff and build
COPY . /build
RUN cd packages/merchant-iframe && yarn build

FROM nginx:latest AS server

# Copy over the dist files
COPY --from=builder /build/packages/merchant-iframe/dist/bundle /usr/share/nginx/html

