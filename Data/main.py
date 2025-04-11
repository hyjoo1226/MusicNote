# main.py

from fastapi import FastAPI
from routers import router as main_router

import nltk

nltk.download('punkt')
nltk.download('stopwords')

app = FastAPI(title="성격 기반 추천 API")

# 통합 라우터 등록
app.include_router(main_router, prefix="/data/api")

@app.get("/")
def root():
    return {"message": "Welcome to the Personality Prediction API based on MUSIC model"}
