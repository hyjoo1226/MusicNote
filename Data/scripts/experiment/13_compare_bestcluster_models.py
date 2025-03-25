# 13_compare_bestcluster_models.py (방법 A vs B vs B' 성능 비교)
import pandas as pd
import joblib
import os
from sklearn.metrics import mean_absolute_error, r2_score

TRAINING_PATH = "datasets/training_data.csv"
CLUSTER_PATH = "datasets/cluster_labeled_data.csv"
BESTCLUSTER_PATH = "datasets/best_cluster_labeled_data.csv"
MODEL_DIR = "models"

# ==== 데이터 로딩 ====
data_A = pd.read_csv(TRAINING_PATH)
data_B = pd.read_csv(CLUSTER_PATH)
data_Bp = pd.read_csv(BESTCLUSTER_PATH)

X = data_A[[
    'valence', 'acousticness', 'instrumentalness',
    'speechiness', 'liveness', 'tempo',
    'energy', 'loudness', 'danceability']]

traits = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']

print("\n📊 방법 A vs B vs B' 성능 비교 결과")

for trait in traits:
    print(f"\n▶ [{trait}]")

    # 경로 정의
    model_A_path = f"{MODEL_DIR}/personality_model_{trait}.pkl"
    model_B_path = f"{MODEL_DIR}/{trait}_cluster_model.pkl"
    model_Bp_path = f"{MODEL_DIR}/{trait}_bestcluster_model.pkl"

    # 모델 존재 확인
    if not (os.path.exists(model_A_path) and os.path.exists(model_B_path) and os.path.exists(model_Bp_path)):
        print("❌ 일부 모델이 존재하지 않습니다. 학습을 완료하세요.")
        continue

    # 모델 로드
    model_A = joblib.load(model_A_path)
    model_B = joblib.load(model_B_path)
    model_Bp = joblib.load(model_Bp_path)

    # 실제값 설정
    y_true_A = data_A[trait]
    y_true_B = data_B[f"{trait}_cluster_label"]
    y_true_Bp = data_Bp[f"{trait}_cluster_label"]

    # 예측값
    pred_A = model_A.predict(X)
    pred_B = model_B.predict(X)
    pred_Bp = model_Bp.predict(X)

    # 평가
    mae_A = mean_absolute_error(y_true_A, pred_A)
    r2_A = r2_score(y_true_A, pred_A)
    mae_B = mean_absolute_error(y_true_B, pred_B)
    r2_B = r2_score(y_true_B, pred_B)
    mae_Bp = mean_absolute_error(y_true_Bp, pred_Bp)
    r2_Bp = r2_score(y_true_Bp, pred_Bp)

    # 출력
    print(f"  방법 A → MAE: {mae_A:.4f}, R²: {r2_A:.4f}")
    print(f"  방법 B → MAE: {mae_B:.4f}, R²: {r2_B:.4f}")
    print(f"  방법 B' → MAE: {mae_Bp:.4f}, R²: {r2_Bp:.4f}")
