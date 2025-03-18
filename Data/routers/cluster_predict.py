# routers/cluster_predict.py
from fastapi import APIRouter
from pydantic import BaseModel
from services.clustering import predict_cluster

router = APIRouter(prefix="/cluster", tags=["Cluster Prediction"])

class MusicScore(BaseModel):
    mellow: float
    unpretentious: float
    sophisticated: float
    intense: float
    contemporary: float

@router.post("/")
def predict_cluster_api(music_score: MusicScore):
    cluster_id = predict_cluster(music_score.dict())
    return {"cluster_id": cluster_id}


# analysis_server/services/clustering.py
import joblib
import numpy as np

# 군집화 모델 로드 (예: KMeans 모델)
cluster_model = joblib.load("models/cluster_model.pkl")

def predict_cluster(music_score: dict) -> int:
    vector = np.array([
        music_score["mellow"],
        music_score["unpretentious"],
        music_score["sophisticated"],
        music_score["intense"],
        music_score["contemporary"]
    ]).reshape(1, -1)
    return int(cluster_model.predict(vector)[0])
