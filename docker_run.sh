#!/bin/bash

docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD $DOCKER_REGISTRY

docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD $DOCKER_REGISTRY
docker-compose pull

docker-compose down --remove-orphans
docker-compose -d
docker system prune --volumes -fa

