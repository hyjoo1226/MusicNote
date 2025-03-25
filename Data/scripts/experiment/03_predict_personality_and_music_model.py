# 03_predict_personality_and_music_model.py
import pandas as pd
import joblib
import os
from datetime import date

INPUT_PATH = f"data/inputs/{date.today()}.csv"
MODEL_DIR = "models"
FEATURE_SCALER_PATH = f"{MODEL_DIR}/feature_scaler.pkl"
MUSIC_SCALER_PATH = f"{MODEL_DIR}/music_score_scaler.pkl"
OUTPUT_PATH = f"data/outputs/{date.today()}_scores.csv"
os.makedirs("data/outputs", exist_ok=True)

data = pd.read_csv(INPUT_PATH)
features = ['valence', 'acousticness', 'instrumentalness',
            'speechiness', 'liveness', 'tempo',
            'energy', 'loudness', 'danceability']
X = data[features]

# Feature 정규화
scaler = joblib.load(FEATURE_SCALER_PATH)
X_scaled = scaler.transform(X)
X_scaled_df = pd.DataFrame(X_scaled, columns=features)

# MUSIC 점수 계산
X_scaled_df['Mellow'] = X_scaled_df[['valence', 'acousticness', 'instrumentalness']].mean(axis=1)
X_scaled_df['Unpretentious'] = X_scaled_df[['acousticness', 'speechiness', 'liveness']].mean(axis=1)
X_scaled_df['Sophisticated'] = X_scaled_df[['tempo', 'instrumentalness']].mean(axis=1)
X_scaled_df['Intense'] = X_scaled_df[['energy', 'loudness', 'tempo']].mean(axis=1)
X_scaled_df['Contemporary'] = X_scaled_df[['danceability', 'speechiness', 'energy']].mean(axis=1)

music_cols = ['Mellow', 'Unpretentious', 'Sophisticated', 'Intense', 'Contemporary']
music_scaler = joblib.load(MUSIC_SCALER_PATH)
X_scaled_df[music_cols] = music_scaler.transform(X_scaled_df[music_cols])

# 성격 예측
traits = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']
predictions = pd.DataFrame()
for trait in traits:
    model = joblib.load(f"{MODEL_DIR}/personality_model_{trait}.pkl")
    preds = model.predict(X_scaled_df[features])
    predictions[trait] = preds

# 결과 저장
result = pd.concat([
    data[['track_name', 'artist_name', 'track_id']] if 'track_name' in data.columns else pd.DataFrame(),
    X_scaled_df[music_cols],
    predictions
], axis=1)

result.to_csv(OUTPUT_PATH, index=False)
print(f"✅ 예측 결과 저장 완료 → {OUTPUT_PATH}")
