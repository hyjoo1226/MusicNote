# 09_evaluate_clustering_quality.py (v2: tqdm + 시작 로그 출력 추가)
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans, MiniBatchKMeans, AgglomerativeClustering, DBSCAN, SpectralClustering
from sklearn.mixture import GaussianMixture
from sklearn.metrics import silhouette_score, calinski_harabasz_score, davies_bouldin_score
from tqdm import tqdm

# ==== 데이터 로딩 ====
data = pd.read_csv("datasets/training_data.csv")
X = data[[
    'valence', 'acousticness', 'instrumentalness',
    'speechiness', 'liveness', 'tempo',
    'energy', 'loudness', 'danceability']]

# ==== 클러스터링 알고리즘 목록 ====
algorithms = {
    "KMeans": KMeans(n_clusters=5, random_state=42, n_init=10),
    "MiniBatchKMeans": MiniBatchKMeans(n_clusters=5, random_state=42, n_init=10),
    "Agglomerative": AgglomerativeClustering(n_clusters=5),
    "DBSCAN": DBSCAN(eps=0.5, min_samples=5),
    "Spectral": SpectralClustering(n_clusters=5, random_state=42, affinity='nearest_neighbors'),
    "GMM": GaussianMixture(n_components=5, random_state=42)
}

# ==== 품질 평가 지표 계산 ====
results = []
print("\n📊 클러스터링 품질 평가 진행 중...")

for name, model in tqdm(algorithms.items(), desc="Evaluating Algorithms", ncols=80):
    print(f"▶ 시작: {name}")
    try:
        if name == "GMM":
            labels = model.fit(X).predict(X)
        else:
            labels = model.fit_predict(X)

        if len(set(labels)) > 1 and -1 not in set(labels):
            sil = silhouette_score(X, labels)
            ch = calinski_harabasz_score(X, labels)
            db = davies_bouldin_score(X, labels)
        else:
            sil = ch = db = -1  # 평가 불가 상황 처리

        results.append({
            "Algorithm": name,
            "Silhouette Score": sil,
            "Calinski-Harabasz": ch,
            "Davies-Bouldin": db
        })
    except Exception as e:
        print(f"⚠ {name} 오류 발생: {e}")
        results.append({
            "Algorithm": name,
            "Silhouette Score": -1,
            "Calinski-Harabasz": -1,
            "Davies-Bouldin": -1
        })

# ==== 결과 출력 ====
result_df = pd.DataFrame(results)
print("\n📊 클러스터링 품질 평가 결과 (Silhouette Score 기준 정렬):")
print(result_df.sort_values(by="Silhouette Score", ascending=False).reset_index(drop=True))