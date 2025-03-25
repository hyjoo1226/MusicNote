# 02_train_personality_model.py
import pandas as pd
import os
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

INPUT_PATH = "data/datasets/training_data.csv"
MODEL_DIR = "models"
os.makedirs(MODEL_DIR, exist_ok=True)

data = pd.read_csv(INPUT_PATH)
features = ['valence', 'acousticness', 'instrumentalness',
            'speechiness', 'liveness', 'tempo',
            'energy', 'loudness', 'danceability']
X = data[features]

targets = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']
print("\n🚀 [성격 예측 모델 학습 시작]")

for trait in targets:
    print(f"\n▶ [{trait}] 모델 학습 중...")
    y = data[trait]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestRegressor(n_estimators=30, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    r2 = r2_score(y_test, preds)

    print(f"✔ [{trait}] 완료 → MAE: {mae:.4f}, R²: {r2:.4f}")
    model_path = f"{MODEL_DIR}/personality_model_{trait}.pkl"
    joblib.dump(model, model_path)
    print(f"📁 저장: {model_path}")

print("\n✅ 모든 성격 예측 모델 학습 완료")