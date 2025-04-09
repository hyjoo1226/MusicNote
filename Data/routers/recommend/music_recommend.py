# routers/recommend/music_recommend.py

from fastapi import APIRouter
from modelschemas.request_response import MusicList, BigFiveScore, Music
from utils.recommender.music_recommender import MusicRecommender

router = APIRouter()
music_recommender = MusicRecommender()

@router.post("/music", response_model=MusicList)
def recommend_music(data: BigFiveScore):
    if not isinstance(data, BigFiveScore):
        data = BigFiveScore(**data)  # dict → BigFiveScore
    musics = music_recommender.recommend_musics_from_bigfive(bigfive=data)
    music_objs = [Music(**m) if isinstance(m, dict) else m for m in musics]
    return MusicList(musics=music_objs)
