# main.py
import sys
import os
from fastapi import FastAPI
from routers import bigfive_predict, movie_recommend

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = FastAPI(
    title="MUSIC 기반 성격 분석 API",
    description="MUSIC 모델 기반 음악 청취 데이터를 통해 성격을 예측하는 분석 API입니다.",
    version="1.0.0"
)

# 라우터 등록
app.include_router(bigfive_predict.router)
app.include_router(movie_recommend.router)

@app.get("/")
def root():
    return {"message": "Welcome to the Personality Prediction API based on MUSIC model"}
