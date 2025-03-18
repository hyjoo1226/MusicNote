# routers/cluster_predict.py
from fastapi import APIRouter
import joblib

from services.clustering import predict_cluster
from modelschemas.request_response import MusicScore

router = APIRouter(prefix="/cluster", tags=["Cluster Prediction"])

@router.post("/")
def predict_cluster_api(music_score: MusicScore):
    """
    군집화 모델
    """
    cluster_id = predict_cluster(music_score.dict())
    return {"cluster_id": cluster_id}


# analysis_server/services/clustering.py

# 군집화 모델 로드 (예: KMeans 모델)
cluster_model = joblib.load("models/cluster_model.pkl")