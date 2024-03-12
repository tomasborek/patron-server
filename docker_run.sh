#!/bin/bash


export DOCKER_USERNAME=$1
export DOCKER_PASSWORD=$2
export DOCKER_REGISTRY=$3

docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD $DOCKER_REGISTRY

docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD $DOCKER_REGISTRY
docker-compose -f ./docker-compose.yaml pull

docker-compose -f ./docker-compose.yaml down --remove-orphans
docker-compose -f ./docker-compose.yaml up -d
docker system prune --volumes -fa

