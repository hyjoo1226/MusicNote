# utils/model_utils.py - 모델 학습/저장/불러오기 함수 (RandomForest 버전)
import os
import joblib
from sklearn.ensemble import RandomForestRegressor

TRAITS = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']

def train_personality_models(X_scaled, y_df):
    models = {}
    for trait in TRAITS:
        model = RandomForestRegressor(n_estimators=100, max_depth=None, random_state=42, n_jobs=-1)
        model.fit(X_scaled, y_df[trait])
        models[trait] = model
    return models

def save_models(models, save_dir):
    os.makedirs(save_dir, exist_ok=True)
    for trait, model in models.items():
        joblib.dump(model, os.path.join(save_dir, f"personality_model_{trait}.pkl"))

def load_models(model_dir):
    models = {}
    for trait in TRAITS:
        models[trait] = joblib.load(os.path.join(model_dir, f"personality_model_{trait}.pkl"))
    return models