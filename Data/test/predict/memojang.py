import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import time
from sklearn.cluster import KMeans

current_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(current_dir, "preprocessed_data.csv")
data = pd.read_csv(file_path)

# 📈 1. Elbow Method 진행
inertias = []  # 각 클러스터 수에 따른 관성값 저장
k_range = range(1, 10)
X = data[['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'emotional_stability']].to_numpy()

for k in k_range:
    model = KMeans(n_clusters=k, random_state=42, n_init=15)
    model.fit(X)
    inertias.append(model.inertia_)  # inertia_ = 군집 내 거리 제곱합

# 🎨 2. Elbow 시각화
plt.figure(1)
plt.plot(k_range, inertias, marker='o')
plt.title("Elbow Method")
plt.xlabel("Number of Clusters (k)")
plt.ylabel("Inertia")
plt.grid(True)
plt.show(block=False)


# 📌 3. 적절한 k 선택 후 클러스터링 (예: k=4)
k = 4
kmeans = KMeans(n_clusters=k, random_state=42, n_init=15)
kmeans.fit(X)
labels = kmeans.labels_
centroids = kmeans.cluster_centers_
print(1)
# 🎨 4. 클러스터링 결과 시각화
plt.figure(2)
plt.scatter(X[:, 0], X[:, 1], c=labels, s=50)
plt.scatter(centroids[:, 0], centroids[:, 1], c='red', marker='X', s=200)
plt.title(f"KMeans Clustering Result (k={k})")
plt.show()
