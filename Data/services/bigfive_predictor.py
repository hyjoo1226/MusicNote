# services/bigfive_predictor.py

import os
import pandas as pd
import joblib
import numpy as np
from modelschemas.request_response import AudioFeatures, BigFiveScore

MODEL_PATH = "models/personality_model_rf_multi.pkl"
FEATURE_SCALER_PATH = "models/feature_scaler.pkl"
MUSIC_SCALER_PATH = "models/music_score_scaler.pkl"

FEATURES = ['valence', 'acousticness', 'instrumentalness',
            'speechiness', 'liveness', 'tempo',
            'energy', 'loudness', 'danceability']

MUSIC_COLS = ['Mellow', 'Unpretentious', 'Sophisticated', 'Intense', 'Contemporary']

TRAIT_NAMES = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']

def predict_bigfive_average(input_data: list[AudioFeatures]) -> BigFiveScore:
    # 1. DataFrame 변환 및 정규화
    df = pd.DataFrame([track.dict() for track in input_data])[FEATURES]
    scaler = joblib.load(FEATURE_SCALER_PATH)
    X_scaled = scaler.transform(df)
    X_scaled_df = pd.DataFrame(X_scaled, columns=FEATURES)

    # 2. MUSIC 점수 계산
    X_scaled_df['Mellow'] = X_scaled_df[['valence', 'acousticness', 'instrumentalness']].mean(axis=1)
    X_scaled_df['Unpretentious'] = X_scaled_df[['acousticness', 'speechiness', 'liveness']].mean(axis=1)
    X_scaled_df['Sophisticated'] = X_scaled_df[['tempo', 'instrumentalness']].mean(axis=1)
    X_scaled_df['Intense'] = X_scaled_df[['energy', 'loudness', 'tempo']].mean(axis=1)
    X_scaled_df['Contemporary'] = X_scaled_df[['danceability', 'speechiness', 'energy']].mean(axis=1)

    # 3. MUSIC 정규화
    music_scaler = joblib.load(MUSIC_SCALER_PATH)
    X_scaled_df[MUSIC_COLS] = music_scaler.transform(X_scaled_df[MUSIC_COLS])

    # 4. Big Five 예측
    model = joblib.load(MODEL_PATH)
    preds = model.predict(X_scaled_df[FEATURES])  # (n_samples, 5)

    # 5. 평균값 → BigFiveScore 응답
    mean_scores = np.mean(preds, axis=0)
    return BigFiveScore(**{trait: round(score, 6) for trait, score in zip(TRAIT_NAMES, mean_scores)})
