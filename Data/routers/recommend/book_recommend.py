# routers/recommend/book_recommend.py

from fastapi import APIRouter
from modelschemas.request_response import BookList, BigFiveScore
from utils.recommender.book_recommender import BookRecommender

router = APIRouter()
book_recommender = BookRecommender()

@router.post("/book", response_model=BookList)
def recommend_books(data: BigFiveScore):
    books = book_recommender.recommend_books_from_bigfive(data)
    return {"books": books}
