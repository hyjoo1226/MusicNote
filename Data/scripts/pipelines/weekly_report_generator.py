# weekly_report_generator.py - 일일 리포트 집계 기반 주간/월간 리포트 생성기 (경로 보정 + 조건완화)
import os
import pandas as pd
import datetime
from glob import glob

# ====== 절대경로 보정 ======
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
daily_report_dir = os.path.join(BASE_DIR, "reports/daily")
weekly_report_dir = os.path.join(BASE_DIR, "reports/weekly")
monthly_report_dir = os.path.join(BASE_DIR, "reports/monthly")
os.makedirs(weekly_report_dir, exist_ok=True)
os.makedirs(monthly_report_dir, exist_ok=True)

# 오늘 날짜 기준
today = datetime.date.today()

# 📦 리포트 집계 함수
def aggregate_reports(report_files):
    df_list = [pd.read_csv(f) for f in report_files]
    df_concat = pd.concat(df_list, ignore_index=True)
    report_avg = df_concat.drop(columns=['ReportDate']).mean().to_dict()
    return report_avg

# 📆 날짜 필터링 함수
def filter_files_by_date(folder_path, start_date, end_date):
    files = glob(os.path.join(folder_path, "daily_personality_report_*.csv"))
    filtered = []
    for f in files:
        basename = os.path.basename(f)
        try:
            file_date = datetime.datetime.strptime(basename.split('_')[-1].replace('.csv', ''), "%Y-%m-%d").date()
            if start_date <= file_date <= end_date:
                filtered.append(f)
        except:
            continue
    return filtered

# ✅ 주간 리포트 생성
start_week = today - datetime.timedelta(days=6)
weekly_files = filter_files_by_date(daily_report_dir, start_week, today)
weekly_avg = aggregate_reports(weekly_files) if weekly_files else {}
df_weekly = pd.DataFrame([{"StartDate": start_week, "EndDate": today, **weekly_avg}])
weekly_path = os.path.join(weekly_report_dir, f"weekly_report_{today}.csv")
df_weekly.to_csv(weekly_path, index=False)
print(f"Weekly report saved to: {weekly_path}")

# ✅ 월간 리포트 생성
start_month = today.replace(day=1)
monthly_files = filter_files_by_date(daily_report_dir, start_month, today)
monthly_avg = aggregate_reports(monthly_files) if monthly_files else {}
df_monthly = pd.DataFrame([{"StartDate": start_month, "EndDate": today, **monthly_avg}])
monthly_path = os.path.join(monthly_report_dir, f"monthly_report_{today}.csv")
df_monthly.to_csv(monthly_path, index=False)
print(f"Monthly report saved to: {monthly_path}")