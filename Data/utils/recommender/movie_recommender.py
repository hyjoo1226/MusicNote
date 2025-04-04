# movie_recommender.py
from typing import Dict, List

from modelschemas.request_response import BigFiveScore, MovieList
from utils.pick_user import user as pick_user_by_personality
from utils.get_movie import user_genre
from utils.api_request import recommend

class MovieRecommender:
    def __init__(self):
        pass

