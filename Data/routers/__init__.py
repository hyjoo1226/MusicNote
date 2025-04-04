from fastapi import APIRouter
from .predict import router as predict_router
from .recommend import router as recommend_router
from .generate import router as generate_router

router = APIRouter()

router.include_router(predict_router, prefix="/predict", tags=["Predict"])
router.include_router(recommend_router, prefix="/recommend", tags=["Recommend"])
router.include_router(generate_router, prefix="/generate", tags=["Generate"])