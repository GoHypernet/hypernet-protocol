#!/usr/bin/env bash
set -eu

stack="node"

root="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." >/dev/null 2>&1 && pwd )"
project="`cat $root/package.json | grep '"name":' | head -n 1 | cut -d '"' -f 4`"
registry="`cat $root/package.json | grep '"registry":' | head -n 1 | cut -d '"' -f 4`"

# make sure a network for this project has been created
docker swarm init 2> /dev/null || true
docker network create --attachable --driver overlay $project 2> /dev/null || true

if [[ -n "`docker stack ls --format '{{.Name}}' | grep "$stack"`" ]]
then echo "A $stack stack is already running" && exit;
else echo; echo "Preparing to launch $stack stack"
fi

####################
# Load config

node_config="`cat $root/config-node.json`"
prod_config="`cat $root/config-prod.json`"
config="`echo $node_config $prod_config | jq -s '.[0] + .[1]'`"

function getDefault { echo "$node_config" | jq ".$1" | tr -d '"'; }
function getConfig { echo "$config" | jq ".$1" | tr -d '"'; }

admin_token="`getConfig adminToken`"
auth_url="`getConfig authUrl`"
aws_access_id="`getConfig awsAccessId`"
aws_access_key="`getConfig awsAccessKey`"
chain_providers="`getConfig chainProviders`"
domain_name="`getConfig domainName`"
production="`getConfig production`"
public_port="`getConfig port`"
mnemonic="`getConfig mnemonic`"

if [[ "$production" == "true" ]]
then VECTOR_ENV="prod"
else VECTOR_ENV="dev"
fi

####################
# Misc Config

# prod version: if we're on a tagged commit then use the tagged semvar, otherwise use the hash
if [[ "$production" == "true" ]]
then
  if [[ -n "`git tag --points-at HEAD | grep "vector-" | head -n 1`" ]]
  then version="`cat package.json | grep '"version":' | head -n 1 | cut -d '"' -f 4`"
  else version="`git rev-parse HEAD | head -c 8`"
  fi
else version="latest"
fi

builder_image="${project}_builder:$version";
bash $root/ops/pull-images.sh $builder_image > /dev/null

common="networks:
      - '$project'
    logging:
      driver: 'json-file'
      options:
          max-size: '10m'"

########################################
# Global services / chain provider config
# If no global service urls provided, spin up local ones & use those

if [[ \
  "$auth_url" == "`getDefault authUrl`" || \
  "$chain_providers" == "`getDefault chainProviders`" \
  ]]
then
  bash $root/ops/start-global.sh
  mnemonic_secret=""
  eth_mnemonic="${mnemonic:-candy maple cake sugar pudding cream honey rich smooth crumble sweet treat}"
  eth_mnemonic_file=""
  chain_addresses="`cat $root/.chaindata/chain-addresses.json`"
  config="`echo "$config" '{"chainAddresses":'$chain_addresses'}' | jq -s '.[0] + .[1]'`"

else
  echo "Connecting to external global services: auth=$auth_url | chain_providers=$chain_providers"
  if [[ -n "$mnemonic" ]]
  then
    mnemonic_secret=""
    eth_mnemonic="$mnemonic"
    eth_mnemonic_file=""
  else
    mnemonic_secret="${project}_${stack}_mnemonic"
    eth_mnemonic=""
    eth_mnemonic_file="/run/secrets/$mnemonic_secret"
    if [[ -z "`docker secret ls --format '{{.Name}}' | grep "$mnemonic_secret"`" ]]
    then bash $root/ops/save-secret.sh $mnemonic_secret
    fi
  fi
fi

redis_image="redis:5-alpine";
bash $root/ops/pull-images.sh $redis_image > /dev/null

# to access from other containers
redis_url="redis://redis:6379"

########################################
## Database config

database_image="${project}_database:$version";
bash $root/ops/pull-images.sh $database_image > /dev/null

# database connection settings
pg_db="$project"
pg_user="$project"
pg_dev_port="5433"

if [[ "$VECTOR_ENV" == "prod" ]]
then
  # Use a secret to store the database password
  db_secret="${project}_${stack}_database"
  if [[ -z "`docker secret ls --format '{{.Name}}' | grep "$db_secret"`" ]]
  then bash $root/ops/save-secret.sh $db_secret "`head -c 32 /dev/urandom | xxd -plain -c 32`"
  fi
  pg_password=""
  pg_password_file="/run/secrets/$db_secret"
  snapshots_dir="$root/.db-snapshots"
  mkdir -p $snapshots_dir
  database_image="image: '$database_image'
    volumes:
      - 'database:/var/lib/postgresql/data'
      - '$snapshots_dir:/root/snapshots'
    secrets:
      - '$db_secret'"

else
  # Pass in a dummy password via env vars
  db_secret=""
  pg_password="$project"
  pg_password_file=""
  database_image="image: '$database_image'
    ports:
      - '$pg_dev_port:5432'"
  echo "$stack.database will be exposed on *:$pg_dev_port"
fi

########################################
## Node config

node_internal_port="8000"
node_dev_port="8001"
if [[ $VECTOR_ENV == "prod" ]]
then
  node_image_name="${project}_node"
  bash $root/ops/pull-images.sh $version $node_image_name > /dev/null
  node_image="image: '$node_image_name:$version'"
else
  node_image="image: '${project}_builder'
    entrypoint: 'bash modules/server-node/ops/entry.sh'
    volumes:
      - '$root:/root'
    ports:
      - '$node_dev_port:$node_internal_port'"
  echo "$stack.node configured to be exposed on *:$node_dev_port"
fi

# Add whichever secrets we're using to the node's service config
if [[ -n "$db_secret" || -n "$mnemonic_secret" ]]
then
  node_image="$node_image
    secrets:"
  if [[ -n "$db_secret" ]]
  then node_image="$node_image
      - '$db_secret'"
  fi
  if [[ -n "$mnemonic_secret" ]]
  then node_image="$node_image
      - '$mnemonic_secret'"
  fi
fi

####################
# Proxy config

proxy_image="${project}_node_proxy:$version";
bash $root/ops/pull-images.sh $proxy_image > /dev/null

if [[ -z "$domain_name" && -n "$public_port" ]]
then
  public_url="http://127.0.0.1:$public_port"
  proxy_ports="ports:
      - '$public_port:80'"
  echo "$stack.proxy will be exposed on *:$public_port"
elif [[ -n "$domain_name" && -z "$public_port" ]]
then
  public_url="https://127.0.0.1:443"
  proxy_ports="ports:
      - '80:80'
      - '443:443'"
  echo "$stack.proxy will be exposed on *:80 and *:443"
else
  echo "Either a domain name or a public port must be provided but not both."
  echo " - If a public port is provided then the stack will use http on the given port"
  echo " - If a domain name is provided then https is activated on port *:443"
  exit 1
fi

####################
# Launch stack

# Add secrets to the stack config
stack_secrets=""
if [[ -n "$db_secret" || -n "$mnemonic_secret" ]]
then
  stack_secrets="secrets:"
  if [[ -n "$db_secret" ]]
  then stack_secrets="$stack_secrets
  $db_secret:
    external: true"
  fi
  if [[ -n "$mnemonic_secret" ]]
  then stack_secrets="$stack_secrets
  $mnemonic_secret:
    external: true"
  fi
fi

docker_compose=$root/.$stack.docker-compose.yml
rm -f $docker_compose
cat - > $docker_compose <<EOF
version: '3.4'

networks:
  $project:
    external: true

$stack_secrets

volumes:
  certs:
  database:

services:

  proxy:
    $common
    image: '$proxy_image'
    $proxy_ports
    environment:
      VECTOR_DOMAINNAME: '$domain_name'
      VECTOR_NODE_URL: 'node:$node_internal_port'
    volumes:
      - 'certs:/etc/letsencrypt'

  node:
    $common
    $node_image
    environment:
      VECTOR_CONFIG: '`echo $config | tr -d '\n\r'`'
      VECTOR_ENV: '$VECTOR_ENV'
      VECTOR_MNEMONIC: '$eth_mnemonic'
      VECTOR_MNEMONIC_FILE: '$eth_mnemonic_file'
      VECTOR_PG_DATABASE: '$pg_db'
      VECTOR_PG_HOST: 'database'
      VECTOR_PG_PASSWORD: '$pg_password'
      VECTOR_PG_PASSWORD_FILE: '$pg_password_file'
      VECTOR_PG_PORT: '5432'
      VECTOR_PG_USERNAME: '$pg_user'

  database:
    $common
    $database_image
    environment:
      AWS_ACCESS_KEY_ID: '$aws_access_id'
      AWS_SECRET_ACCESS_KEY: '$aws_access_key'
      POSTGRES_DB: '$pg_db'
      POSTGRES_PASSWORD: '$pg_password'
      POSTGRES_PASSWORD_FILE: '$pg_password_file'
      POSTGRES_USER: '$pg_user'
      VECTOR_ADMIN_TOKEN: '$admin_token'
      VECTOR_ENV: '$VECTOR_ENV'

  redis:
    $common
    image: '$redis_image'

EOF

docker stack deploy -c $docker_compose $stack

echo "The $stack stack has been deployed, waiting for the $public_url to start responding.."
timeout=$(expr `date +%s` + 60)
while true
do
  res="`curl -k -m 5 -s $public_url || true`"
  if [[ -z "$res" || "$res" == "Waiting for proxy to wake up" ]]
  then
    if [[ "`date +%s`" -gt "$timeout" ]]
    then echo "Timed out waiting for $public_url to respond.." && exit
    else sleep 2
    fi
  else echo "Good Morning!" && exit;
  fi
done
