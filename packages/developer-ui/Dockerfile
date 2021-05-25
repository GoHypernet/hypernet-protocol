# First step is to build everything
FROM node:14 AS builder

WORKDIR /build

# Copy the repo into the image
COPY . /build

RUN yarn
RUN cd packages/developer-ui && yarn build

FROM nginx:latest AS server

# Copy over the dist files
COPY --from=builder /build/packages/developer-ui/dist/bundle /usr/share/nginx/html

