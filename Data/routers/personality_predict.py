# analysis_server/routers/personality_predict.py

from fastapi import APIRouter
from pydantic import BaseModel
from services.personality_model import predict_personality

router = APIRouter(prefix="/personality", tags=["Personality Prediction"])

class MusicScore(BaseModel):
    mellow: float
    unpretentious: float
    sophisticated: float
    intense: float
    contemporary: float
    cluster_id: int

@router.post("/")
def predict(music_score: MusicScore):
    """
    MUSIC score + cluster_id → Big Five 성격 예측
    """
    result = predict_personality(music_score.dict())
    return result
