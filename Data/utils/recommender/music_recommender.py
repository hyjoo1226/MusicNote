import os
import sys
import random
import requests
import asyncio
import aiohttp
import time
from dotenv import load_dotenv
from modelschemas.request_response import BigFiveScore
from utils.music.lastfm_request import bf_to_track
from utils.music.spotify_search import Spotify
from utils.music.get_tracks import get_random_track, search_track


class MusicRecommender:
    def __init__(self):
        pass

    async def recommend_musics_from_bigfive(self, bigfive: BigFiveScore):
        load_dotenv()
        user_score = [
            bigfive.openness,
            bigfive.conscientiousness,
            bigfive.extraversion,
            bigfive.agreeableness,
            1 - bigfive.neuroticism  # stability로 변환
        ]
        lastfm_key = os.getenv("LASTFM_API_KEY")
        tracks = await bf_to_track(lastfm_key, user_score)
        
        client = os.getenv("SPOTIFY_CLIENT")
        secret = os.getenv("SPOTIFY_SECRET")
        spotify = Spotify(client, secret)
        
        # 비동기 작업 리스트 생성
        tasks = []
        for track in tracks:
            if len(track) == 2:
                task = search_track(spotify, name=track["name"], artist=track["artist"])
            else:
                task = get_random_track(spotify)
            tasks.append(task)
        
        # 모든 비동기 작업 동시 실행
        results = await asyncio.gather(*tasks)
        print(type(results))
        return results
    

if __name__ == "__main__":
    recommender = MusicRecommender()
    before = time.time()
    url = "http://127.0.0.1:8000/data/api/recommend/music"  # 바꿔줘야 함

    def generate_random_input():
        random_list = [random.uniform(0, 1) for _ in range(5)]
        data = {
            "openness" : random_list[0],
            "conscientiousness" : random_list[1],
            "extraversion" : random_list[2],
            "agreeableness" : random_list[3],
            "neuroticism" : random_list[4]
        }
        return data

    for _ in range(10):  # 원하는 반복 횟수
        data = generate_random_input()
        response = requests.post(url, json=data)
        after = time.time()
        print(after-before)
        print(f"Request: {data}")
        print(f"Response: {response.status_code}, {response.json()}")