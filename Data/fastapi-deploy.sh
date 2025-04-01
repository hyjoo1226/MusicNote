#!/bin/bash

echo "🚀 fastapi-server 배포 시작"

docker-compose -f ./Data/docker-compose.yml pull
docker-compose -f ./Data/docker-compose.yml down
docker-compose -f ./Data/docker-compose.yml up -d --build

echo "✅ fastapi-server 배포 완료!"
