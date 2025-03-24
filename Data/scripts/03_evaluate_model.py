# 03_evaluate_model.py (tqdm 진행률 시각화 추가)
import pandas as pd
import joblib
import os
from sklearn.metrics import mean_absolute_error, r2_score
from tqdm import tqdm

INPUT_PATH = "datasets/training_data_scaled.csv"
MODEL_DIR = "models"

data = pd.read_csv(INPUT_PATH)
X = data[[
    'valence', 'acousticness', 'instrumentalness',
    'speechiness', 'liveness', 'tempo',
    'energy', 'loudness', 'danceability']]

targets = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']

# ==== 성능 재평가 ====
print("\n📊 [모델 성능 평가 결과]")

for trait in tqdm(targets, desc="Evaluating Traits", ncols=80):
    model_path = f"{MODEL_DIR}/personality_model_{trait}.pkl"
    if not os.path.exists(model_path):
        print(f"❌ {trait} 모델이 존재하지 않습니다. 먼저 학습을 실행하세요.")
        continue

    model = joblib.load(model_path)
    y_true = data[trait]
    y_pred = model.predict(X)

    mae = mean_absolute_error(y_true, y_pred)
    r2 = r2_score(y_true, y_pred)
    print(f"[{trait}] MAE: {mae:.4f} | R²: {r2:.4f}")
