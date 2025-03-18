# analysis_server/utils/db_connector.py
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# 환경변수 로드
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "music_personality")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

# 예시 함수: 사용자 성격 예측 결과 저장
def save_personality_result(user_id: str, personality: dict):
    db.personality_scores.insert_one({
        "user_id": user_id,
        **personality
    })

# 예시 함수: 추천 결과 저장
def save_recommendation(user_id: str, content_list: list):
    db.recommendations.insert_one({
        "user_id": user_id,
        "recommended_items": content_list
    })
