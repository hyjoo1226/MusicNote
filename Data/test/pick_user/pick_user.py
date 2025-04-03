import pickle
import numpy as np
import pandas as pd
import os

def user(bigfive_input):
    current_dir = os.path.dirname(__file__)
    file = os.path.join(current_dir, "../dataset/user_bigfive.csv")
    model = os.path.join(current_dir, "../../models/kmeans_model.pkl")
    # print(bigfive_input)


    with open(model, "rb") as f:
        kmeans = pickle.load(f)
    df = pd.read_csv(file)

    # 유저별 클러스터 칼럼 생성
    bigfive_cols = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']
    X = df[bigfive_cols]
    df['cluster'] = kmeans.fit_predict(X)
    bg_dict = dict(bigfive_input)
    bigfive_values = [list(bg_dict.values())]


    predicted_cluster = kmeans.predict(bigfive_values)[0]
    print("예측된 클러스터:", predicted_cluster)

    # 예측된 클러스터에 해당하는 유저들 선택
    cluster_users = df[df['cluster'] == predicted_cluster]

    # 'probability' 칼럼을 사용하여 가중치 계산 (칼럼명이 다르다면 수정하세요)
    weights = cluster_users['probability']
    normalized_weights = weights / weights.sum()

    # 가중치에 따른 랜덤 선택: 클러스터 내 인덱스를 선택
    selected_index = np.random.choice(cluster_users.index, p=normalized_weights)
    selected_user = cluster_users.loc[selected_index]

    # print("선택된 유저 정보:")
    # print(selected_user)
    return selected_user.get('userid')


