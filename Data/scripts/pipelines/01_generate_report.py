# 01_generate_report.py - 새로운 Raw 데이터로 리포트 생성 파이프라인
import sys, os
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
sys.path.append(BASE_DIR)
import datetime
import pandas as pd
import joblib
from utils.preprocessing import normalize_features, calculate_music_styles
from utils.model_utils import load_models
from utils.report_utils import generate_report, save_report

# ====== 설정 ======
RAW_DATA_PATH = 'datasets/new_raw_audio_data.csv'
SCALER_PATH = 'models/scaler.pkl'
MODEL_DIR = 'models'
REPORT_DIR = 'reports/daily'

# ====== 로딩 ======
print("Loading raw input data...")
df = pd.read_csv(RAW_DATA_PATH)
scaler = joblib.load(SCALER_PATH)
models = load_models(MODEL_DIR)

# ====== 정규화 + MUSIC 스타일 매핑 ======
df_scaled = normalize_features(df, scaler)
df_music = calculate_music_styles(df_scaled)

# ====== 성격/MUSIC 리포트 생성 ======
print("Generating personality and music style report...")
report_df = generate_report(df_scaled, df_music, models)
today = datetime.date.today().strftime("%Y-%m-%d")
report_df.insert(0, "ReportDate", today)

# ====== 리포트 저장 ======
os.makedirs(REPORT_DIR, exist_ok=True)
output_path = os.path.join(REPORT_DIR, f"daily_personality_report_{today}.csv")
save_report(report_df, output_path)

print(f"Report saved to: {output_path}")