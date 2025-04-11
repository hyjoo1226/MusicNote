import pandas as pd
import numpy as np
from modelschemas.request_response import AudioFeatures, BigFiveScore
import joblib

MODEL_PATH = "models/personality_model_rf_multi.pkl"
FEATURE_SCALER_PATH = "models/feature_scaler.pkl"
MUSIC_SCALER_PATH = "models/music_score_scaler.pkl"

FEATURES = ['valence', 'acousticness', 'instrumentalness',
            'speechiness', 'liveness', 'tempo',
            'energy', 'loudness', 'danceability']

TRAIT_NAMES = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']

def predict_bigfive_average(input_data: list[AudioFeatures]) -> BigFiveScore:
    df = pd.DataFrame([track.dict() for track in input_data])[FEATURES]

    # 1. feature 스케일링
    scaler = joblib.load(FEATURE_SCALER_PATH)
    df_scaled = pd.DataFrame(scaler.transform(df), columns=FEATURES)

    # 3. Big Five 예측
    model = joblib.load(MODEL_PATH)
    preds = model.predict(df_scaled)
    mean_scores = np.mean(preds, axis=0)

    return BigFiveScore(**{trait: round(score, 6) for trait, score in zip(TRAIT_NAMES, mean_scores)})
