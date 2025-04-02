import pickle
import pandas as pd
from sklearn.cluster import KMeans
import os

# CSV 파일 읽기
current_dir = os.getcwd()
file = os.path.join(current_dir, '../dataset/user_bigfive.csv')
df = pd.read_csv(file)

# 빅파이브 수치 칼럼
bigfive_cols = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']
X = df[bigfive_cols]

# KMeans 모델 학습
kmeans = KMeans(n_clusters=5, random_state=42)
kmeans.fit(X)

# 모델 저장
with open("kmeans_model.pkl", "wb") as f:
    pickle.dump(kmeans, f)
