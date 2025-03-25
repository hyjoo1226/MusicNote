# 12_train_best_cluster_model.py (최적 클러스터 기반 성격 예측 모델 학습)
import pandas as pd
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

INPUT_PATH = "datasets/best_cluster_labeled_data.csv"
MODEL_DIR = "models"
os.makedirs(MODEL_DIR, exist_ok=True)

# ==== 데이터 로딩 ====
data = pd.read_csv(INPUT_PATH)
X = data[[
    'valence', 'acousticness', 'instrumentalness',
    'speechiness', 'liveness', 'tempo',
    'energy', 'loudness', 'danceability']]

targets = [
    'Openness_cluster_label',
    'Conscientiousness_cluster_label',
    'Extraversion_cluster_label',
    'Agreeableness_cluster_label',
    'Neuroticism_cluster_label']

# ==== 모델 학습 ====
for trait in targets:
    print(f"\n▶ [{trait}] 모델 학습 시작...")
    y = data[trait]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    r2 = r2_score(y_test, preds)

    print(f"✔ [{trait}] 학습 완료 → MAE: {mae:.4f} | R²: {r2:.4f}")

    model_name = trait.replace('_cluster_label', '_bestcluster_model')
    joblib.dump(model, f"{MODEL_DIR}/{model_name}.pkl")

print("\n✅ 최적 클러스터 기반 성격 예측 모델 학습 및 저장 완료!")
