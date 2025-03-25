# generate_report.py
import os

import pandas as pd
from datetime import date

# 설정
INPUT_PATH = f"data/outputs/{date.today()}_scores.csv"
REPORT_PATH = f"data/reports/daily/daily_report_{date.today()}.csv"
os.makedirs("data/reports/daily", exist_ok=True)
os.makedirs("data/reports/weekly", exist_ok=True)
os.makedirs("data/reports/monthly", exist_ok=True)

# 데이터 로드
df = pd.read_csv(INPUT_PATH)

# 🎯 여기서 MUSIC, BIG FIVE 평균/상관관계 등 2차 가공
report = df.describe().loc[['mean']]  # 예시: 평균값만 추출

# 리포트 저장
report.to_csv(REPORT_PATH)
print(f"📊 리포트 저장 완료 → {REPORT_PATH}")
