# services/clustering.py
import joblib
import numpy as np
import os

from modelschemas.request_response import MusicScore

# 모델 경로
MODEL_PATH = "models/cluster_model.pkl"

# 클러스터링 모델 로드 (KMeans 등)
if os.path.exists(MODEL_PATH):
    cluster_model = joblib.load(MODEL_PATH)
else:
    cluster_model = None  # 예외 처리용

def predict_cluster(music_score: MusicScore) -> int:
    """
    MUSIC score dict를 받아 클러스터 ID 예측
    """
    if cluster_model is None:
        return -1  # 모델이 없다면 에러값 반환
    
    vector = np.array([
        music_score.get("mellow", 0),
        music_score.get("unpretentious", 0),
        music_score.get("sophisticated", 0),
        music_score.get("intense", 0),
        music_score.get("contemporary", 0)
    ]).reshape(1, -1)

    return int(cluster_model.predict(vector)[0])
