#!/bin/bash


export DOCKER_USERNAME=$1
export DOCKER_PASSWORD=$2
export DOCKER_REGISTRY=$3

docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD $DOCKER_REGISTRY

docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD $DOCKER_REGISTRY
docker pull $DOCKER_REGISTRY

docker compose down --remove-orphans
docker compose up -d
docker system prune --volumes -fa

