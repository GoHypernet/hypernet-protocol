FROM node:14

WORKDIR /usr/src/app

# Move over the package.json to install dependencies
COPY ../package.json .

RUN yarn install

# Bundle app source
COPY server /usr/src/app
COPY dist/connector-bundle /usr/src/app/connector

RUN npm run tsc

EXPOSE 5010
