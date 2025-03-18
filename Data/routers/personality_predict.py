# routers/personality_predict.py
from fastapi import APIRouter
from modelschemas.request_response import MusicScoreWithCluster, PersonalityScore
from services.personality_model import predict_personality

router = APIRouter(prefix="/personality", tags=["Personality Prediction"])

@router.post("/", response_model=PersonalityScore)
def personality_prediction_api(score_data: MusicScoreWithCluster):
    """
    MUSIC Score + cluster_id 기반 성격 예측 API
    """
    result = predict_personality(score_data)

    # 예외처리: 모델이 없을 경우
    if "error" in result:
        return PersonalityScore(
            openness = 0,
            conscientiousness = 0,
            extraversion = 0,
            agreeableness = 0,
            neuroticism = 0,
        )

    return result
