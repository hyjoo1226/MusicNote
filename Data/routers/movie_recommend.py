# routers/movie_recommend.py

from fastapi import APIRouter
from modelschemas.request_response import BigFiveScore

router = APIRouter()

@router.post("/recommend/movie")
def recommend_movie(data: BigFiveScore):
    return {"text": "준비 중 입니다.",
            "data": data}