#!/bin/bash

cd "$(dirname "$0")"

export DOCKER_USERNAME=$1
export DOCKER_PASSWORD=$2
export DOCKER_IMAGE=$3
export DOCKER_REGISTRY=$4
export COMMIT_SHA=$5

docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD $DOCKER_REGISTRY

docker pull $DOCKER_IMAGE:$COMMIT_SHA
docker compose down --remove-orphans
docker compose up -d
docker system prune --volumes -fa

