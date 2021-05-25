# First step is to build everything
FROM node:14 AS builder

WORKDIR /build

# Copy the repo into the image
COPY . /build

RUN yarn
RUN cd packages/merchant-iframe && yarn build

FROM nginx:latest AS server

# Copy over the dist files
COPY --from=builder /build/packages/merchant-iframe/dist/bundle /usr/share/nginx/html

