# utils/training/train_bigfive_model.py

import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.multioutput import MultiOutputRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from utils.file_utils import save_json, load_csv

DATA_PATH = "data/datasets/training_data.csv"
MODEL_PATH = "models/personality_model_rf_multi.pkl"

# 데이터 로드
data = load_csv(DATA_PATH)
df = pd.DataFrame(data)
features = ['valence', 'acousticness', 'instrumentalness',
            'speechiness', 'liveness', 'tempo',
            'energy', 'loudness', 'danceability']
labels = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']

X = df[features]
Y = df[labels]

X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

# 모델 정의
rf_base = RandomForestRegressor(
    n_estimators=30,
    max_depth=10,
    min_samples_leaf=5,
    n_jobs=-1,
    random_state=42
)
model = MultiOutputRegressor(rf_base)

# 학습 및 평가
model.fit(X_train, y_train)
preds = model.predict(X_test)

mae = mean_absolute_error(y_test, preds)
r2 = r2_score(y_test, preds)
print(f"✅ 모델 평가 완료 | MAE: {mae:.4f} | R²: {r2:.4f}")

# 모델 저장
joblib.dump(model, MODEL_PATH, compress=3)
print(f"✅ 모델 저장 완료 → {MODEL_PATH}")
