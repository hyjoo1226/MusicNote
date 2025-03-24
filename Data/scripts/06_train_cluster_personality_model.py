# 06_train_cluster_personality_model.py (방법 B: cluster 기반 soft label 학습)
import pandas as pd
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

INPUT_PATH = "datasets/cluster_labeled_data.csv"
MODEL_DIR = "models"
os.makedirs(MODEL_DIR, exist_ok=True)

# ==== 1. Load Data with cluster-based labels ====
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

# ==== 2. Train Model per Trait (using cluster soft label) ====
for trait in targets:
    print(f"\n▶ [{trait}] 모델 학습 시작...")
    y = data[trait]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)

    # ==== 3. Evaluation ====
    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    r2 = r2_score(y_test, preds)

    print(f"✔ [{trait}] 학습 완료 → MAE: {mae:.4f} | R²: {r2:.4f}")

    # ==== 4. Save model ====
    model_name = trait.replace('_cluster_label', '_cluster_model')
    joblib.dump(model, f"{MODEL_DIR}/{model_name}.pkl")

print("\n✅ Cluster 기반 성격 예측 모델 학습 및 저장 완료!")
