# routers/recommend/__init__.py
from fastapi import APIRouter
from .book_recommend import router as book_router
from .movie_recommend import router as movie_router
from .music_recommend import router as music_router

router = APIRouter()

router.include_router(book_router)
router.include_router(movie_router)
router.include_router(music_router)