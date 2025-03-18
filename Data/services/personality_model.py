# services/personality_model.py
import joblib
import numpy as np

# cluster별 personality 예측 모델 딕셔너리 (군집 수 만큼 로드)
# 예시: cluster 0~2 까지 있다고 가정
models = {
    0: joblib.load("models/personality_model_0.pkl"),
    1: joblib.load("models/personality_model_1.pkl"),
    2: joblib.load("models/personality_model_2.pkl")
}

def predict_personality(score_data: dict) -> dict:
    """
    MUSIC score + cluster_id 입력 받아 해당 군집의 성격예측 모델로 Big Five 추정
    """
    cluster_id = score_data.get("cluster_id")
    input_vector = np.array([
        score_data["mellow"],
        score_data["unpretentious"],
        score_data["sophisticated"],
        score_data["intense"],
        score_data["contemporary"]
    ]).reshape(1, -1)

    model = models.get(cluster_id)
    if model is None:
        return {"error": f"Model for cluster {cluster_id} not found."}

    prediction = model.predict(input_vector)[0]
    return {
        "openness": round(prediction[0], 4),
        "conscientiousness": round(prediction[1], 4),
        "extraversion": round(prediction[2], 4),
        "agreeableness": round(prediction[3], 4),
        "neuroticism": round(prediction[4], 4)
    }
