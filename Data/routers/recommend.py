# routers/recommend.py
from fastapi import APIRouter
from pydantic import BaseModel
from services.recommend_engine import recommend_content

router = APIRouter(prefix="/recommend", tags=["Recommendation"])

class PersonalityScore(BaseModel):
    openness: float
    conscientiousness: float
    extraversion: float
    agreeableness: float
    neuroticism: float

@router.post("/")
def recommend(personality: PersonalityScore):
    recommendations = recommend_content(personality.dict())
    return {"recommended_items": recommendations}
