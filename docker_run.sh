#!/bin/bash

docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD $DOCKER_REGISTRY

docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD $DOCKER_REGISTRY
docker-compose -f patron/docker-compose.yaml pull

docker-compose -f patron/docker-compose.yaml down --remove-orphans
docker-compose -f patron/docker-compose.yaml up -d
docker system prune --volumes -fa

