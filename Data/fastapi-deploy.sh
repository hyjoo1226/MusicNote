#!/bin/bash

echo "fastapi-server 배포 시작"

docker compose -f docker-compose.fastapi.yml pull
docker compose -f docker-compose.fastapi.yml down
docker compose -f docker-compose.fastapi.yml up -d --build

echo "fastapi-server 배포 완료!"