# routers/bigfive_predict.py

from fastapi import APIRouter
from modelschemas.request_response import FeatureList, BigFiveScore, DailyReport
from utils.generator.report_generator_v2 import ReportGenerator
from utils.predictor.bigfive_predictor import BigFivePredictor

router = APIRouter()

# ✅ predictor 객체는 1회만 생성하여 재사용
predictor = BigFivePredictor()
generator = ReportGenerator()

@router.post("/bigfive/daily", response_model=DailyReport)
def predict_bigfive(data: FeatureList):
    # 1. Big Five 점수 예측
    bigfive_score: BigFiveScore = predictor.predict_average(data.tracks)

    # 2. 성격 리포트 생성
    report = generator.generate_daily_report(bigfive_score)

    # 3. 응답 생성
    return DailyReport(
        openness=bigfive_score.openness,
        conscientiousness=bigfive_score.conscientiousness,
        extraversion=bigfive_score.extraversion,
        agreeableness=bigfive_score.agreeableness,
        neuroticism=bigfive_score.neuroticism,
        report=report
    )
