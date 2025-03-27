# routers/write_report.py

from fastapi import APIRouter
from modelschemas.request_response import BigFiveReport, AudioFeatures, BigFiveScore
from utils.report_generator import daily_report

router = APIRouter()

@router.post("/write/report", response_model=BigFiveReport)
def write_report(data: BigFiveScore):
        return daily_report(data)