# movie_recommender.py
import random
import requests
import os
from dotenv import load_dotenv
from modelschemas.request_response import BigFiveScore, MovieList
from utils.movie.pick_user import user
from utils.movie.get_genres import user_genre
from utils.movie.get_movies_refactoring import recommend

class MovieRecommender:
    def __init__(self):
        pass

    def recommend_movies_from_bigfive(self, bigfive: BigFiveScore):
        load_dotenv()
        bigfive.neuroticism = 1-bigfive.neuroticism
        picked_user = user(bigfive)
        genres = user_genre(picked_user)
        movies = recommend(genres)

        return MovieList(movies=movies)

if __name__ == "__main__":
    recommender = MovieRecommender()

    url = "http://127.0.0.1:8000/data/api/recommend/movie"  # 바꿔줘야 함

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
        print(f"Request: {data}")
        print(f"Response: {response.status_code}, {response.json()}")