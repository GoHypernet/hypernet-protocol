FROM node:14
LABEL Author Charlie Sibbach <charlie@hypernetlabs.io>

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install all the yarn stuff
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
COPY ./packages/objects/package.json ./packages/objects/package.json
COPY ./packages/utils/package.json ./packages/utils/package.json
COPY ./packages/test-gateway/package.json ./packages/test-gateway/package.json
RUN yarn install

# Now build the code
COPY . .
WORKDIR /usr/src/app/packages/test-gateway

EXPOSE 5010

# Run it
CMD [ "yarn", "start" ]
