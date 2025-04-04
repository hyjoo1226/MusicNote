# routers/movie_recommend.py

from fastapi import APIRouter
from modelschemas.request_response import BigFiveScore, MovieList
from services.movie_recommender import recommend_movie_genre
from test.pick_user.pick_user import user
from test.pick_user.get_genres import user_genre
from test.pick_user.get_movies import recommend

router = APIRouter()

@router.post("/movie", response_model=MovieList)
def recommend_movie(data: BigFiveScore):

    userid = user(data)
    movie_genre = user_genre(userid)
    movies = recommend(movie_genre)
    response = MovieList(movies=movies)
    return response