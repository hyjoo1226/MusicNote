# routers/movie_recommend.py
from fastapi import APIRouter
from modelschemas.request_response import BigFiveScore, MovieList
from utils.recommender.movie_recommender import MovieRecommender
router = APIRouter()

@router.post("/movie", response_model=MovieList)
def recommend_movie(data: BigFiveScore):

    response = MovieRecommender()
    results = response.recommend_movies_from_bigfive(data)
    return results
