# routers/bigfive_predict.py

from fastapi import APIRouter
from modelschemas.request_response import FeatureList, BigFiveScore
from services.bigfive_predictor import predict_bigfive_average

router = APIRouter()

@router.post("/predict/bigfive", response_model=BigFiveScore)
def predict_bigfive(data: FeatureList):
    return predict_bigfive_average(data.tracks)
