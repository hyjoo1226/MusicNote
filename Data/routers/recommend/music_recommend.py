# routers/recommend/music_recommend.py

from fastapi import APIRouter
from modelschemas.request_response import MusicList, BigFiveScore, Music
from utils.recommender.music_recommender import MusicRecommender
import time

router = APIRouter()
music_recommender = MusicRecommender()

@router.post("/music", response_model=MusicList)
async def recommend_music(data: BigFiveScore):
    before = time.time()
    if not isinstance(data, BigFiveScore):
        data = BigFiveScore(**data)  # dict → BigFiveScore
    musics = await music_recommender.recommend_musics_from_bigfive(bigfive=data)
    music_objs = [Music(**m) if isinstance(m, dict) else m for m in musics]
    after = time.time()
    print(f"시간 : {after-before}")
    return MusicList(musics=music_objs)
