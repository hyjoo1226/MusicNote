# 08_experiment_clustering_algorithms.py (개선 버전 - 메모리 이슈 대응 + 진행 시각화 추가)
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans, MiniBatchKMeans, AgglomerativeClustering, DBSCAN, SpectralClustering
from sklearn.mixture import GaussianMixture
from sklearn.decomposition import PCA
from tqdm import tqdm

# ==== 데이터 로딩 및 축소 (메모리 절약용) ====
data = pd.read_csv("datasets/training_data.csv")
X_full = data[[
    'valence', 'acousticness', 'instrumentalness',
    'speechiness', 'liveness', 'tempo',
    'energy', 'loudness', 'danceability']]

# 많은 알고리즘에 부담을 줄이기 위해 샘플링 (필요시 전체 사용 가능)
SAMPLE_SIZE = min(5000, len(X_full))
X = X_full.sample(n=SAMPLE_SIZE, random_state=42).reset_index(drop=True)

# ==== PCA로 2D 시각화 변환 ====
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)

# ==== 클러스터링 알고리즘 정의 ====
algorithms = {
    "KMeans": KMeans(n_clusters=5, random_state=42, n_init=10),
    "MiniBatchKMeans": MiniBatchKMeans(n_clusters=5, random_state=42, n_init=10),
    "Agglomerative": AgglomerativeClustering(n_clusters=5),
    "DBSCAN": DBSCAN(eps=0.5, min_samples=5),
    "Spectral": SpectralClustering(n_clusters=5, random_state=42, affinity='nearest_neighbors'),
    "GMM": GaussianMixture(n_components=5, random_state=42)
}

# ==== 클러스터링 실행 및 시각화 ====
plt.figure(figsize=(18, 12))

for i, (name, model) in enumerate(tqdm(algorithms.items(), desc="Clustering Algorithms", ncols=80), 1):
    try:
        if name == "GMM":
            cluster_labels = model.fit(X).predict(X)
        else:
            cluster_labels = model.fit_predict(X)
    except Exception as e:
        print(f"⚠ {name} 실행 중 오류 발생: {e}")
        cluster_labels = np.zeros(X.shape[0])

    plt.subplot(3, 2, i)
    scatter = plt.scatter(X_pca[:, 0], X_pca[:, 1], c=cluster_labels, cmap='tab10', s=10)
    plt.title(f"{name} Clustering")
    plt.xlabel("PCA1")
    plt.ylabel("PCA2")

plt.tight_layout()
plt.show()

print("✅ 모든 클러스터링 알고리즘 시각화 완료")
