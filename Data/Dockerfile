# 1. 베이스 이미지
FROM python:3.10-slim

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 종속성 파일 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. 전체 프로젝트 복사
COPY . .

# 5. 포트 노출
EXPOSE 8000

# 6. 실행 명령
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
