# routers/predict/__init__.py
from fastapi import APIRouter
from .bigfive_predict import router as bigfive_router

router = APIRouter()

router.include_router(bigfive_router)
