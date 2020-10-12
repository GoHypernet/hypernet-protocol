#!/usr/bin/env bash
set -e

root="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." >/dev/null 2>&1 && pwd )"
project="`cat $root/package.json | grep '"name":' | head -n 1 | cut -d '"' -f 4`"

# make sure a network for this project has been created
docker swarm init 2> /dev/null || true
docker network create --attachable --driver overlay $project 2> /dev/null || true

# If file descriptors 0-2 exist, then we're prob running via interactive shell instead of on CD/CI
if [[ -t 0 && -t 1 && -t 2 ]]
then interactive="--interactive --tty"
else echo "Running in non-interactive mode"
fi

node_config="`cat $root/modules/browser-node-test-ui/config-node.json`"

function getConfig { echo "$node_config" | jq ".$1" | tr -d '"'; }

public_port="`getConfig port`"

docker run \
  $interactive \
  --entrypoint="bash" \
  --env="REACT_APP_VECTOR_CONFIG=$node_config" \
  --env="SKIP_PREFLIGHT_CHECK=true" \
  --name="${project}_browser_node" \
  --publish="$public_port:3000" \
  --network "$project" \
  --rm \
  --tmpfs="/tmp" \
  --volume="$root:/root" \
  ${project}_builder -c "cd ./modules/browser-node-test-ui && npm start"
