# routers/predict/__init__.py
from fastapi import APIRouter
from .report_generate import router as report_router

router = APIRouter()

router.include_router(report_router,prefix="/report")