#!/bin/bash

echo "🚀 fastapi-server 배포 시작"

# 1. 기존 컨테이너 종료 및 제거 (docker-compose 방식)
docker compose -f docker-compose.fastapi.yml down || true

# 2. 최신 이미지 pull
docker pull ysh933/fastapi-server:latest

# 3. docker-compose로 컨테이너 실행
docker compose -f docker-compose.fastapi.yml up -d --remove-orphans

echo "✅ fastapi-server 배포 완료!"
