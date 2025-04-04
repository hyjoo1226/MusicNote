# routers/report.py

from fastapi import APIRouter
from modelschemas.request_response import BigFiveScore, Report, WeeklyReport
from utils.generator.report_generator_v2 import ReportGenerator
from typing import List

router = APIRouter()

generator = ReportGenerator(use_korean=True)  # 또는 False

@router.post("/daily", response_model=Report)
def generate_daily_report(data: BigFiveScore):
    return generator.generate_daily_report(data)


@router.post("/weekly", response_model=WeeklyReport)
def generate_weekly_report(scores: List[BigFiveScore]):
    return generator.generate_weekly_report(scores)
