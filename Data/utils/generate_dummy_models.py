# analysis_server/utils/generate_dummy_models.py
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

# 디렉토리 생성
os.makedirs("models", exist_ok=True)

# 1. Dummy 사용자 데이터 생성 (MUSIC 5차원 + Big Five)
n_samples = 100
np.random.seed(42)

music_features = np.random.rand(n_samples, 5)
big_five = np.zeros((n_samples, 5))

# 단순한 상관 기반 dummy 성격값 생성
big_five[:, 0] = music_features[:, 2] * 0.7 + music_features[:, 3] * 0.3  # Openness
big_five[:, 1] = music_features[:, 1] * 0.8                              # Conscientiousness
big_five[:, 2] = music_features[:, 4] * 0.7 + music_features[:, 1] * 0.3  # Extraversion
big_five[:, 3] = music_features[:, 0] * 0.6 + music_features[:, 1] * 0.4  # Agreeableness
big_five[:, 4] = music_features[:, 3] * 0.9                              # Neuroticism

# 2. KMeans 클러스터 모델 생성
kmeans = KMeans(n_clusters=3, random_state=42)
cluster_labels = kmeans.fit_predict(music_features)
joblib.dump(kmeans, "models/cluster_model.pkl")

# 3. Cluster별 Personality 모델 생성 (RandomForest)
for cluster_id in range(3):
    X = music_features[cluster_labels == cluster_id]
    y = big_five[cluster_labels == cluster_id]
    model = RandomForestRegressor()
    model.fit(X, y)
    joblib.dump(model, f"models/personality_model_{cluster_id}.pkl")

print("✔ 더미 모델 생성 완료: cluster_model.pkl, personality_model_X.pkl")
