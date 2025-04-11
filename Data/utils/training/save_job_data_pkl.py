# save_job_data_pkl.py

import pandas as pd
import joblib
from utils.file_utils import load_csv

# 업로드한 CSV 파일 경로
csv_path = "data/processed_data/onet_bigfive_mapped.csv"
pkl_path = "models/onet_bigfive_mapped.pkl"

# 1. CSV 불러오기 및 전처리
data = load_csv(csv_path)
df = pd.DataFrame(data)
numeric_cols = ["openness", "conscientiousness", "extraversion", "agreeableness", "stability"]
df[numeric_cols] = df[numeric_cols].astype(float)

# 2. .pkl로 저장
joblib.dump(df, pkl_path)
print(f"✅ .pkl 저장 완료: {pkl_path}")
