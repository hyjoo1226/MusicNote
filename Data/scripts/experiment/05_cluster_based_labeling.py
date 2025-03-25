# 05_cluster_based_labeling.py (방법 B: 군집 기반 성격 라벨 생성)
import pandas as pd
import numpy as np
import joblib
import os
from sklearn.cluster import KMeans

# ==== 설정 ====
INPUT_PATH = "datasets/training_data.csv"  # 기존 MUSIC Feature 기반 데이터
OUTPUT_PATH = "datasets/cluster_labeled_data.csv"
MODEL_PATH = "models/cluster_model.pkl"
N_CLUSTERS = 5  # Big Five와 일치시켜 임의 설정

# ==== 데이터 불러오기 ====
data = pd.read_csv(INPUT_PATH)
X = data[[
    'valence', 'acousticness', 'instrumentalness',
    'speechiness', 'liveness', 'tempo',
    'energy', 'loudness', 'danceability']]

# ==== KMeans 군집 모델 학습 또는 로드 ====
if os.path.exists(MODEL_PATH):
    print("📂 기존 군집 모델 로드 중...")
    kmeans = joblib.load(MODEL_PATH)
else:
    print("🚀 새로운 군집 모델 학습 중...")
    kmeans = KMeans(n_clusters=N_CLUSTERS, random_state=42)
    kmeans.fit(X)
    joblib.dump(kmeans, MODEL_PATH)
    print("✅ 군집 모델 저장 완료!")

# ==== 클러스터 예측 및 라벨 부여 ====
data['Cluster'] = kmeans.predict(X)

# ==== 각 클러스터별 성격 평균값 매핑 ====
# 기존 rule-based Big Five 평균값을 클러스터별로 묶어서 라벨로 사용
cluster_personality = data.groupby('Cluster')[['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']].mean()

# 각 row에 cluster의 평균 성격값을 할당 (soft label 방식)
data_with_softlabels = data.merge(cluster_personality, on='Cluster', suffixes=('', '_cluster_label'))
data_with_softlabels.to_csv(OUTPUT_PATH, index=False)

print(f"📄 cluster 기반 라벨링 완료 → '{OUTPUT_PATH}' 저장")
print("📌 soft label은 '_cluster_label' suffix로 포함되어 있습니다.")
