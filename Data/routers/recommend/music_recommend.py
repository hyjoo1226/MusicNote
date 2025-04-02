# routers/recommend/music_recommend.py

from fastapi import APIRouter
from modelschemas.request_response import MusicList, BigFiveScore
from utils.recommender.music_recommender import MusicRecommender

router = APIRouter()
music_recommender = MusicRecommender

@router.post("/music", response_model=MusicList)
def recommend_books(data: BigFiveScore):
    musics = music_recommender.recommend_books_from_bigfive(data)
    return {"results": musics}
