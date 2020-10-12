#!/bin/bash

if [[ -d "modules/test-runner" ]]
then cd modules/test-runner
fi

cmd="${1:-test}"
stack="${2:-node}"

# Set defaults in src/util/env instead of here
export VECTOR_ADMIN_TOKEN="$VECTOR_ADMIN_TOKEN"
export VECTOR_CHAIN_ADDRESSES="$VECTOR_CHAIN_ADDRESSES"
export VECTOR_CHAIN_PROVIDERS="$VECTOR_CHAIN_PROVIDERS"
export VECTOR_CLIENT_LOG_LEVEL="$VECTOR_CLIENT_LOG_LEVEL"
export VECTOR_LOG_LEVEL="$VECTOR_LOG_LEVEL"
export VECTOR_NATS_URL="$VECTOR_NATS_URL"
export VECTOR_NODE_URL="$VECTOR_NODE_URL"

export VECTOR_ENV="${VECTOR_ENV:-dev}"

########################################
# Wait for dependencies to wake up

function wait_for {
  name=$1
  target=$2
  tmp=${target#*://} # remove protocol
  host=${tmp%%/*} # remove path if present
  if [[ ! "$host" =~ .*:[0-9]{1,5} ]] # no port provided
  then
    echo "$host has no port, trying to add one.."
    if [[ "${target%://*}" == "http" ]]
    then host="$host:80"
    elif [[ "${target%://*}" == "https" ]]
    then host="$host:443"
    else echo "Error: missing port for host $host derived from target $target" && exit 1
    fi
  fi
  echo "Waiting for $name at $target ($host) to wake up..."
  wait-for -t 60 $host 2> /dev/null
}

if [[ "$stack" == "global" ]]
then
  wait_for "auth" "$VECTOR_AUTH_URL"

elif [[ "$stack" == "node" ]]
then
  wait_for "node" "$VECTOR_NODE_URL"

elif [[ "$stack" == "duet" ]]
then
  wait_for "alice" "$VECTOR_ALICE_URL"
  wait_for "bob" "$VECTOR_BOB_URL"

elif [[ "$stack" == "trio" ]]
then
  wait_for "carol" "$VECTOR_CAROL_URL"
  wait_for "dave" "$VECTOR_DAVE_URL"
  wait_for "roger" "$VECTOR_ROGER_URL"
  wait_for "router" "$VECTOR_ROUTER_URL"
fi

########################################
# Launch tests

if [[ "$VECTOR_ENV" == "prod" ]]
then opts="--forbid-only"
else opts="--bail"
fi

if [[ "$cmd" == "watch" ]]
then
  echo "Starting test-watcher"
  target=src/$stack/index.ts

  prev_checksum=""
  while true
  do
    checksum="`find src -type f -not -name "*.swp" -exec sha256sum {} \; | sha256sum`"
    if [[ "$checksum" != "$prev_checksum" ]]
    then
      echo
      echo "Changes detected!"

      mocha_pids="`ps | grep [m]ocha | awk '{print $1}'`"
      if [[ -n "$mocha_pids" ]]
      then
        echo "Stopping previous test run.."
        for pid in $mocha_pids
        do kill $pid 2> /dev/null
        done
      fi

      echo "Re-running tests..."

      prev_checksum="`find src -type f -not -name "*.swp" -exec sha256sum {} \; | sha256sum`"
      if [[ -n "`which pino-pretty`" ]]
      then (ts-mocha $opts --slow 1000 --timeout 180000 --check-leaks --exit $target | pino-pretty --colorize &)
      else (ts-mocha $opts --slow 1000 --timeout 180000 --check-leaks --exit $target &)
      fi

    # If no changes, do nothing
    else sleep 2
    fi
  done

else
  echo "Starting test-runner"
  target=dist/$stack.bundle.js

  if [[ ! -f "$target" ]]
  then webpack --config ops/webpack.config.js
  fi

  set -o pipefail
  if [[ -n "`which pino-pretty`" ]]
  then mocha $opts --slow 1000 --timeout 180000 --check-leaks --exit $target | pino-pretty --colorize
  else mocha $opts --slow 1000 --timeout 180000 --check-leaks --exit $target
  fi

fi
