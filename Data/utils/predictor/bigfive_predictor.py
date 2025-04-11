# utils/predictor/bigfive_predictor.py

import pandas as pd
import numpy as np
import joblib
from modelschemas.request_response import AudioFeatures, BigFiveScore

class BigFivePredictor:
    def __init__(self,
                 model_path: str = "models/personality_model_rf_multi.pkl",
                 feature_scaler_path: str = "models/feature_scaler.pkl"):
        self.model = joblib.load(model_path)
        self.scaler = joblib.load(feature_scaler_path)

        self.feature_names = ['valence', 'acousticness', 'instrumentalness',
                              'speechiness', 'liveness', 'tempo',
                              'energy', 'loudness', 'danceability']
        self.trait_names = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']

    def predict_average(self, input_data: list[AudioFeatures]) -> BigFiveScore:
        """
        입력된 오디오 피처 리스트를 바탕으로 Big Five 성격 점수 평균값 예측
        """
        df = pd.DataFrame([track.dict() for track in input_data])[self.feature_names]

        # 스케일링
        df_scaled = pd.DataFrame(self.scaler.transform(df), columns=self.feature_names)

        # 모델 예측
        preds = self.model.predict(df_scaled)
        mean_scores = np.mean(preds, axis=0)

        return BigFiveScore(**{trait: round(score, 6) for trait, score in zip(self.trait_names, mean_scores)})
