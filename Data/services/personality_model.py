# services/personality_model.py
import joblib
import numpy as np
from modelschemas.request_response import MusicScoreWithCluster, PersonalityScore

# 모델 로딩
try:
    models = {
        0: joblib.load("models/personality_model_0.pkl"),
        1: joblib.load("models/personality_model_1.pkl"),
        2: joblib.load("models/personality_model_2.pkl")
    }
except Exception as e:
    models = {}
    print(f"[ERROR] Personality model loading failed: {e}")

def predict_personality(score_data: MusicScoreWithCluster) -> PersonalityScore:
    """
    MUSIC + cluster_id 기반 Big Five 성격 예측
    """
    cluster_id = score_data.cluster_id
    model = models.get(cluster_id)
    if model is None:
        return {"error": f"Model for cluster {cluster_id} not found."}

    input_vector = np.array([
        score_data.mellow,
        score_data.unpretentious,
        score_data.sophisticated,
        score_data.intense,
        score_data.contemporary
    ]).reshape(1, -1)

    prediction = model.predict(input_vector)[0]

    return PersonalityScore(
        openness = round(prediction[0], 4),
        conscientiousness = round(prediction[1], 4),
        extraversion = round(prediction[2], 4),
        agreeableness = round(prediction[3], 4),
        neuroticism = round(prediction[4], 4)
    )