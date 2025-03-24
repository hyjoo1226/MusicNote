# 11_generate_labels_from_best_model.py (선택된 Best 클러스터링 모델로 라벨 생성)
import pandas as pd
import numpy as np
import joblib
import os

# ==== 설정 ====
INPUT_PATH = "datasets/training_data.csv"
OUTPUT_PATH = "datasets/best_cluster_labeled_data.csv"
MODEL_DIR = "models"

# ==== 데이터 로딩 ====
data = pd.read_csv(INPUT_PATH)
X = data[[
    'valence', 'acousticness', 'instrumentalness',
    'speechiness', 'liveness', 'tempo',
    'energy', 'loudness', 'danceability']]

# ==== Best 모델 자동 탐색 ====
best_model_file = None
for file in os.listdir(MODEL_DIR):
    if file.startswith("best_cluster_model_") and file.endswith(".pkl"):
        best_model_file = os.path.join(MODEL_DIR, file)
        break

if not best_model_file:
    raise FileNotFoundError("최적 클러스터링 모델이 존재하지 않습니다. 먼저 '10_select_best_clustering_model.py' 실행하세요.")

print(f"📂 Best 모델 로딩: {os.path.basename(best_model_file)}")
best_model = joblib.load(best_model_file)

# ==== 클러스터 예측 ====
if hasattr(best_model, 'predict'):
    cluster_labels = best_model.predict(X)
else:
    cluster_labels = best_model.fit_predict(X)

# ==== 클러스터 기반 평균 성격 프로파일 생성 ====
data['Cluster'] = cluster_labels
cluster_personality = data.groupby('Cluster')[['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']].mean()
data_with_softlabels = data.merge(cluster_personality, on='Cluster', suffixes=('', '_cluster_label'))
data_with_softlabels.to_csv(OUTPUT_PATH, index=False)

print(f"✅ 최적 모델 기반 cluster 라벨링 완료 → {OUTPUT_PATH} 저장")
