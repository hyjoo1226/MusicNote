# main.py
import sys
import os
from fastapi import FastAPI
from routers import music_score, cluster_predict, personality_predict, recommend

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = FastAPI(title="Music Personality Analysis Server")

# 라우터 등록
app.include_router(music_score.router)
app.include_router(cluster_predict.router)
app.include_router(personality_predict.router)
app.include_router(recommend.router)

@app.get("/")
def health_check():
    return {"status": "Analysis server is running!"}
