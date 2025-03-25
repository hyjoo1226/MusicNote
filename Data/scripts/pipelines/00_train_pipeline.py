# 00_train_pipeline.py - 최초 실행용 파이프라인 (scaler + 모델 학습)
import sys, os
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
sys.path.append(BASE_DIR)
import pandas as pd
import joblib
from sklearn.preprocessing import StandardScaler
from utils.model_utils import train_personality_models, save_models

# ====== 설정 ======
DATA_PATH = 'datasets/training_data.csv'
SCALER_PATH = 'models/scaler.pkl'
MODEL_DIR = 'models'
FEATURES = ['valence', 'acousticness', 'instrumentalness', 'speechiness',
            'liveness', 'tempo', 'energy', 'loudness', 'danceability']
TRAITS = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']

# ====== 데이터 로드 ======
print("Loading training data...")
df = pd.read_csv(DATA_PATH)
X = df[FEATURES]

# ====== 정규화 ======
print("Training and saving scaler...")
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
joblib.dump(scaler, SCALER_PATH)

# ====== 모델 학습 ======
print("Training personality trait models...")
models = train_personality_models(X_scaled, df[TRAITS])
save_models(models, MODEL_DIR)

print("Training pipeline complete!")