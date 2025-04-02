# routers/bigfive_predict.py

from fastapi import APIRouter

router = APIRouter()

@router.get("/test-fastapi")
def test():
    return "테스트입니다."