# routers/report.py

from fastapi import APIRouter
from modelschemas.request_response import BigFiveScore, Report, WeeklyReport
from utils.generator.report_generator_v3 import ReportGenerator
from typing import List

router = APIRouter()

generator = ReportGenerator(use_korean=True)  # 또는 False

@router.post("/daily/quote")
def generate_daily_quote(data: BigFiveScore):
    return {
    "quote" : generator.generate_today_quote(data)
    }


@router.post("/weekly", response_model=WeeklyReport)
def generate_weekly_report(scores: List[BigFiveScore]):
    return generator.generate_weekly_report(scores)
