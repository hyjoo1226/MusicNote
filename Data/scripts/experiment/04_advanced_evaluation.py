# 04_advanced_evaluation.py (교차검증 + Feature Importance 분석)
import pandas as pd
import joblib
import os
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import cross_val_score, KFold
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import Ridge

INPUT_PATH = "datasets/training_data.csv"
MODEL_DIR = "models"

data = pd.read_csv(INPUT_PATH)
X = data[[
    'valence', 'acousticness', 'instrumentalness',
    'speechiness', 'liveness', 'tempo',
    'energy', 'loudness', 'danceability']]

targets = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']

kf = KFold(n_splits=5, shuffle=True, random_state=42)

print("\n📊 [교차검증 및 Feature Importance 분석 시작]")
feature_importance_dict = {}

for trait in targets:
    model_path = f"{MODEL_DIR}/personality_model_{trait}.pkl"
    if not os.path.exists(model_path):
        print(f"❌ {trait} 모델이 존재하지 않습니다. 먼저 학습을 실행하세요.")
        continue

    model = joblib.load(model_path)
    y_true = data[trait]
    y_pred = model.predict(X)

    # 기본 평가
    mae = mean_absolute_error(y_true, y_pred)
    r2 = r2_score(y_true, y_pred)
    print(f"[{trait}] MAE: {mae:.4f} | R²: {r2:.4f}")

    # K-Fold 교차검증 (RandomForest vs Ridge 비교)
    ridge = Ridge()
    rf_scores = cross_val_score(model, X, y_true, cv=kf, scoring='r2')
    ridge_scores = cross_val_score(ridge, X, y_true, cv=kf, scoring='r2')

    print(f"   🔹 RF R² (5-Fold Mean): {rf_scores.mean():.4f}")
    print(f"   🔹 Ridge R² (5-Fold Mean): {ridge_scores.mean():.4f}")

    # Feature Importance 저장
    if hasattr(model, 'feature_importances_'):
        feature_importance_dict[trait] = model.feature_importances_

# Feature Importance 시각화
plt.figure(figsize=(12, 6))
for i, trait in enumerate(feature_importance_dict.keys()):
    plt.subplot(1, 5, i + 1)
    plt.barh(X.columns, feature_importance_dict[trait])
    plt.xlabel("Importance")
    plt.title(trait)
plt.tight_layout()
plt.show()

print("✅ 교차검증 및 Feature Importance 분석 완료!")