# routers/recommend.py
from fastapi import APIRouter
from services.recommend_engine import recommend_content
from modelschemas.request_response import PersonalityScore

router = APIRouter(prefix="/recommend", tags=["Recommendation"])

@router.post("/")
def recommend(personality: PersonalityScore):
    """
    추천 API
    아직 미구현
    """
    recommendations = recommend_content(personality.dict())
    return {"recommended_items": recommendations}
