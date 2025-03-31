# routers/bigfive_predict.py

from fastapi import APIRouter
from modelschemas.request_response import FeatureList, BigFiveScore, DailyReport
from services.bigfive_predictor import predict_bigfive_average
from utils.report_generator import daily_report

router = APIRouter()

@router.post("/predict/daily", response_model=DailyReport)
def predict_bigfive(data: FeatureList):
    bigfive_score = predict_bigfive_average(data.tracks)
    return DailyReport(openness=bigfive_score.openness,
                       conscientiousness=bigfive_score.conscientiousness,
                       extraversion=bigfive_score.extraversion,
                       agreeableness=bigfive_score.agreeableness,
                       neuroticism=bigfive_score.neuroticism,
                       report=daily_report(bigfive_score))
