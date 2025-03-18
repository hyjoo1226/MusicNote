# analysis_server/routers/music_score.py
from fastapi import APIRouter
from modelschemas.request_response import AudioFeatures, MultiTrackRequest
from services.score_utils import calculate_music_score

router = APIRouter(prefix="/music-score", tags=["Music Score"])

@router.post("/single")
def music_score_single(features: AudioFeatures):
    """
    단일 곡 오디오 피처 입력 → MUSIC score 반환
    """
    score = calculate_music_score(features.dict())
    return score

@router.post("/multi")
def music_score_multi(request: MultiTrackRequest):
    """
    여러 곡 오디오 피처 리스트 입력 → 곡별 MUSIC score + 평균 score 반환
    평균 말고 다른걸 반환 할 수도 있음
    """
    all_scores = [calculate_music_score(track.dict()) for track in request.tracks]

    # 평균 MUSIC score 계산
    avg_score = {
        key: round(sum(track[key] for track in all_scores) / len(all_scores), 4)
        for key in all_scores[0]
    }

    return {
        "scores": all_scores,
        "user_average_score": avg_score
    }