# 10_select_best_clustering_model.py (최고 품질 클러스터링 자동 선택 및 저장)
import pandas as pd
import numpy as np
import joblib
import os
from sklearn.cluster import KMeans, MiniBatchKMeans, AgglomerativeClustering, DBSCAN, SpectralClustering
from sklearn.mixture import GaussianMixture
from sklearn.metrics import silhouette_score

INPUT_PATH = "datasets/training_data.csv"
MODEL_DIR = "models"
os.makedirs(MODEL_DIR, exist_ok=True)

# ==== 데이터 로딩 ====
data = pd.read_csv(INPUT_PATH)
X = data[[
    'valence', 'acousticness', 'instrumentalness',
    'speechiness', 'liveness', 'tempo',
    'energy', 'loudness', 'danceability']]

# ==== 알고리즘 정의 ====
algorithms = {
    "KMeans": KMeans(n_clusters=5, random_state=42),
    "MiniBatchKMeans": MiniBatchKMeans(n_clusters=5, random_state=42),
    "Agglomerative": AgglomerativeClustering(n_clusters=5),
    "Spectral": SpectralClustering(n_clusters=5, random_state=42, affinity='nearest_neighbors'),
    "GMM": GaussianMixture(n_components=5, random_state=42)
}

best_model = None
best_score = -1
best_name = ""

print("\n📊 클러스터링 모델 선택 중...")

for name, model in algorithms.items():
    try:
        labels = model.fit_predict(X) if name != "GMM" else model.fit(X).predict(X)

        if len(set(labels)) > 1 and -1 not in set(labels):
            score = silhouette_score(X, labels)
            print(f"{name} → Silhouette Score: {score:.4f}")
            if score > best_score:
                best_score = score
                best_model = model
                best_name = name
        else:
            print(f"{name} → 클러스터 수 부족 또는 이상치 포함")
    except Exception as e:
        print(f"⚠ {name} 실패: {e}")

# ==== 최고 모델 저장 ====
if best_model:
    joblib.dump(best_model, f"{MODEL_DIR}/best_cluster_model_{best_name}.pkl")
    print(f"\n✅ 최적 클러스터링 모델 저장 완료 → {best_name} (Silhouette Score: {best_score:.4f})")
else:
    print("❌ 적절한 클러스터링 모델을 찾지 못했습니다.")
