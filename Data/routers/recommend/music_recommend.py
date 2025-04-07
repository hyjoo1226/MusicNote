# routers/recommend/music_recommend.py

from fastapi import APIRouter
from modelschemas.request_response import MusicList, BigFiveScore
from utils.recommender.music_recommender import MusicRecommender

router = APIRouter()
music_recommender = MusicRecommender()

@router.post("/music", response_model=MusicList)
def recommend_music(data: BigFiveScore):
    musics = music_recommender.recommend_musics_from_bigfive(bigfive=data)
    return musics
