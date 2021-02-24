#!/bin/bash

## Run this file from the root of the project

NODE_BASE=modules/server-node
ROUTER_BASE=modules/router
AUTH_BASE=modules/auth
ETH_BASE=modules/contracts

ROOT=$(pwd)
mkdir -p build; cd build;
git clone --branch v0.1.15 --single-branch --depth 1 https://github.com/connext/vector
cd vector;
make server-node-bundle router-bundle auth-bundle contracts-js messaging-proxy

# Copy config files to the base of build dir
cp $ROOT/vector-container/* ./

echo """
**/node_modules/**
**/tsconfig.tsbuildinfo
*.docker-compose.yml
docker-compose.yml
modules/*/package-lock.json
config-prod.json

**/.cache
**/.node-gyp
**/.npm
""" > .dockerignore

echo """
# Generated dockerfile. Do not modify this file directly. Please use original script to generate this.

FROM node:12 as base_builder
WORKDIR /root
ENV HOME /root
RUN apt update && apt install -y bash curl g++ gcc git jq make python
RUN npm install -g npm@6.14.7
RUN npm i -g @prisma/cli@v2.16.1

FROM base_builder as node_builder
WORKDIR /root/node
COPY $NODE_BASE/ops ops
COPY $NODE_BASE/ops/package.json package.json
RUN npm install
COPY $NODE_BASE/prisma-postgres prisma-postgres
COPY $NODE_BASE/prisma-sqlite prisma-sqlite
COPY $NODE_BASE/dist dist
COPY $NODE_BASE/dist/generated/db-client /root/node/.prisma/client
# Copy linux musl as debian openssl because musl is selected during my build and the runtime requires openssl one
COPY $NODE_BASE/dist/generated/db-client/query-engine-linux-musl /root/node/dist/query-engine-debian-openssl-1.1.x

FROM base_builder as auth_builder
WORKDIR /root/auth
COPY $AUTH_BASE/ops/package.json package.json
RUN npm install
COPY $AUTH_BASE/ops ops
COPY $AUTH_BASE/dist dist

FROM base_builder as eth_builder
WORKDIR /root/eth
COPY $ETH_BASE/package.json package.json
RUN npm install
COPY $ETH_BASE/tsconfig.json tsconfig.json
COPY $ETH_BASE/hardhat.config.ts hardhat.config.ts
COPY $ETH_BASE/ops/entry.sh entry.sh
COPY $ETH_BASE/deploy deploy
COPY $ETH_BASE/src.sol src.sol
COPY $ETH_BASE/src.ts src.ts
COPY $ETH_BASE/artifacts artifacts
COPY $ETH_BASE/dist dist
COPY $ETH_BASE/typechain typechain
RUN find dist -type f -name '*.ts'  -exec rm {} \;
RUN find dist -type f -name '*.map' -exec rm {} \;

FROM base_builder as router_builder
WORKDIR /root/router
COPY $ROUTER_BASE/ops/package.json package.json
RUN npm install
COPY $ROUTER_BASE/ops ops
COPY $ROUTER_BASE/prisma-postgres prisma-postgres
COPY $ROUTER_BASE/prisma-sqlite prisma-sqlite
COPY $ROUTER_BASE/dist dist
RUN ln -s dist/prisma-sqlite prisma
COPY $ROUTER_BASE/dist/generated/db-client /root/router/prisma/client

FROM ubuntu:latest
WORKDIR /root
# 80 AND 443 for proxy. 4222 for Nats. Other ports: 5040 - auth providor, 80 messaging, 8545 eth providor, 5432 database, 8000 router/node
EXPOSE 80
EXPOSE 443
EXPOSE 4222
ENV DEBIAN_FRONTEND=noninteractive
ENV VECTOR_PROD true
ENV VECTOR_ENV production
ENV VECTOR_JWT_SIGNER_PRIVATE_KEY -----BEGIN RSA PRIVATE KEY-----MIIEowIBAAKCAQEAqU/GXp8MqmugQyRk5FUFBvlJt1/h7L3Crzlzejz/OxriZdq/lBNQW9S1kzGc7qjXprZ1Kg3zP6irr6wmvP0WYBGltWs2cWUAmxh0PSxuKdT/OyL9w+rjKLh4yo3ex6DX3Ij0iP01Ej2POe5WrPDS8j6LT0s4HZ1FprL5h7RUQWV3cO4pF+1kl6HlBpNzEQzocW9ig4DNdSeUENARHWoCixE1gFYo9RXm7acqgqCk3ihdJRIbO4e/m1aZq2mvAFK+yHTIWBL0p5PF0Fe8zcWdNeEATYB+eRdNJ3jjS8447YrcbQcBQmhFjk8hbCnc3Rv3HvAapk8xDFhImdVF1ffDFwIDAQABAoIBAGZIs2ZmX5h0/JSTYAAw/KCB6W7Glg4XdY21/3VRdD+Ytj0iMaqbIGjZz/fkeRIVHnKwt4d4dgN3OoEeVyjFHMdc4eb/phxLEFqiI1bxiHvtGWP4d6XsON9Y0mBL5NJk8QNiGZjIn08tsWEmA2bm9gkyj6aPoo8BfBqA9Q5uepgmYIPT2NtEXvTbd2dedAEJDJspHKHqBfcuNBVoVhUixVSgehWGGP4GX+FvAEHbawDrwULkMvgblH+X8nBtzikp29LNpOZSRRbqF/Da0AkluFvuDUUIzitjZs5koSEAteaulkZO08BMxtovQjh/ZPtVZKZ27POCNOgRsbm/lVIXRMECgYEA2TQQ2Xy6eO5XfbiT4ZD1Z1xe9B6Ti7J2fC0ZNNSXs4DzdYVcHNIuZqfK6fGqmByvSnFut7n5Po0z2FdXc7xcKFJdBZdFP3GLXbN9vpRPIk9b6n+0df471uTYwVocmAGXez++y73j5XzHQQW4WmmC5SlKjQUWCGkuzISVjRDtlZ0CgYEAx43KPrJxSijjE2+VWYjNFVuv6KilnWoA8I2cZ7TtPi4h//r5vyOUst0egR3lJ7rBof74VttQPvqAk3GN697IrE/bSwefwG2lM1Ta0KB3jn6b/iT4ckmaOB+v6aDHq/GPW6l/sxD0RIEelRYZlsNLepRgKhcQckhjnWzQuGWSl0MCgYBYJQ0BdeCm2vKejp1U2OL+Qzo1j4MJGi+DTToBepTlv9sNQkWTXKh/+HAcaHp2qI1qhIYOAWbov5zemvNegH5Vzrb5Yd40VPvd1s2c3csPfW0ryQ+PItFd8BkWvl8EQQEcf04KmNE3fF/QP2YFKvR30z3x5LKAT08yqEuYp9oC8QKBgQCfc9XqGU3bEya3Lg8ptt0gtt2ty6xiRwSvMoiKeZCkgdpbH6EWMQktjvBD/a5Q+7KjjgfD54SMfj/lEPR1R9QTk8/HeTUWXsaFaMVbtQ0zSEm/Xq1DLTrUo8U9qmJCK0gA10SZwe9dGctlF36k8DJMpWjd2QYkO2GVthBld4wV3wKBgC7S4q0wmcrQIjyDIFmISQNdOAJhR0pJXG8mK2jECbEXxbKkAJnLj73DJ+1OVBlx4HXx54PiEkV3M3iTinf5tBSi8nA2D3s829F65XKFli1RC4rJv+2ygH8PnXX9rQKhK/v6/jeelKquH8zy894hLZe7feSsWV9GMgb5l9p+UzWB-----END RSA PRIVATE KEY-----
ENV VECTOR_JWT_SIGNER_PUBLIC_KEY -----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqU/GXp8MqmugQyRk5FUFBvlJt1/h7L3Crzlzejz/OxriZdq/lBNQW9S1kzGc7qjXprZ1Kg3zP6irr6wmvP0WYBGltWs2cWUAmxh0PSxuKdT/OyL9w+rjKLh4yo3ex6DX3Ij0iP01Ej2POe5WrPDS8j6LT0s4HZ1FprL5h7RUQWV3cO4pF+1kl6HlBpNzEQzocW9ig4DNdSeUENARHWoCixE1gFYo9RXm7acqgqCk3ihdJRIbO4e/m1aZq2mvAFK+yHTIWBL0p5PF0Fe8zcWdNeEATYB+eRdNJ3jjS8447YrcbQcBQmhFjk8hbCnc3Rv3HvAapk8xDFhImdVF1ffDFwIDAQAB-----END PUBLIC KEY-----
ENV VECTOR_MNEMONIC \"candy maple cake sugar pudding cream honey rich smooth crumble sweet treat\"
ENV VECTOR_NATS_URL nats://localhost:4222
ENV VECTOR_ADMIN_TOKEN cxt1234
ENV VECTOR_PORT 5040
RUN apt update && apt upgrade -y && apt install -y software-properties-common
RUN add-apt-repository ppa:vbernat/haproxy-2.1 --yes && apt update
RUN apt install -y supervisor bash openssl curl postgresql ca-certificates sudo mariadb-server certbot net-tools netcat haproxy nodejs unzip npm
RUN curl -L https://github.com/nats-io/nats-server/releases/download/v2.0.0/nats-server-v2.0.0-linux-amd64.zip -o nats-server.zip && unzip nats-server.zip && cp nats-server-v2.0.0-linux-amd64/nats-server /usr/bin
RUN curl https://raw.githubusercontent.com/vishnubob/wait-for-it/ed77b63706ea721766a62ff22d3a251d8b4a6a30/wait-for-it.sh > /bin/wait-for && chmod +x /bin/wait-for
RUN npm i -g npm
RUN npm i -g @prisma/cli@v2.16.1 nodemon pino-pretty ts-node typescript @types/node npm
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY --from=node_builder /root/node node
COPY --from=router_builder /root/router router
COPY --from=auth_builder /root/auth auth
COPY --from=eth_builder /root/eth eth
COPY ops/proxy /root/proxy

## Setup for postgres

# RUN cd / && sudo -u postgres psql --command \"CREATE USER docker WITH SUPERUSER PASSWORD 'docker';\" && createdb -O docker docker
# Adjust PostgreSQL configuration so that remote connections to the
# database are possible.
# RUN echo 'host all  all    0.0.0.0/0  md5' >> /etc/postgresql/9.6/main/pg_hba.conf
# RUN echo \"listen_addresses='*'\" >> /etc/postgresql/9.6/main/postgresql.conf

# Set the default command to run when starting the container
# CMD /usr/lib/postgresql/9.6/bin/postgres -D /var/lib/postgresql/9.6/main -c config_file=/etc/postgresql/9.6/main/postgresql.conf

RUN chmod +x /root/node/ops/entry.sh && chmod +x /root/router/ops/entry.sh && chmod +x /root/auth/ops/entry.sh && chmod +x /root/eth/entry.sh && chmod +x /root/proxy/entry.sh
COPY vector-config.json .
COPY $ROUTER_BASE/dist/prisma-sqlite/schema.prisma /root/router/dist/schema.prisma
CMD supervisord --nodaemon
""" > Dockerfile

docker build -t vector-unit:latest .
echo "Successfully built vector-unit:latest"

### vector-container/build.sh && docker run -it -v `pwd`/vector-container/supervisord.conf:/etc/supervisor/conf.d/supervisord.conf vector-unit:latest
# docker run -it -p 8000:8000 vector-unit:latest
