#!/bin/bash

echo "🚀 fastapi-server 배포 시작"

# 1. 기존 이미지 삭제
docker rmi -f ysh933/fastapi-server:latest || true

# 2. 최신 이미지 pull
docker pull ysh933/fastapi-server:latest

# 3. 기존 컨테이너 종료 및 제거
docker stop fastapi-server || true
docker rm fastapi-server || true

# 4. 새 컨테이너 실행
docker run -d \
  --name fastapi-server \
  -p 8100:8100 \
  ysh933/fastapi-server:latest

echo "✅ fastapi-server 배포 완료!"
