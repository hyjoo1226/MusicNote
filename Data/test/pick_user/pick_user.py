import pickle
import numpy as np
import pandas as pd
import os

'''
1. 파일 읽어
2. df에 k=5로 big-five별 클러스터 생성
3. big-five 인풋받아 해당된 클러스터 뽑기
4. 클러스터 내에서 랜덤유저id 픽픽
''' 


def load_dataset():
    current_dir = os.path.dirname(__file__)
    path = "../../data/user_bigfive.csv" # path 수정해야함!!!
    file = os.path.join(current_dir, path)
    return pd.read_csv(file)

def load_kmeans_model():
    current_dir = os.path.dirname(__file__)
    kmeans_path = "../../models/kmeans_model.pkl" # path 수정해야함!!!!
    file = os.path.join(current_dir, kmeans_path)

    with open(file, "rb") as f:
        return pickle.load(f)

# 데이터셋에 clustering하고 'cluster' 칼럼 추가
def clustering():

    # bigfive 데이터셋, kmeans모델 로드
    df = load_dataset()
    kmeans_model = load_kmeans_model()

    # 유저 각각에 해당되는 'cluster' 칼럼 추가
    bf_columns = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism']
    X = df[bf_columns]
    df['cluster'] = kmeans_model.fit_predict(X)

    return df

# 입력받은 bigfive 점수에 해당하는 cluster 반환
def return_cluster(bf_score):
    
    kmeans_model = load_kmeans_model()
    # fastapi로 입력받은 빅파이브 점수 2차원 리스트로 변환
    bigfive_dict = dict(bf_score)
    bigfive_list = [list(bigfive_dict.values())]

    # bigfive 점수로 cluster 반환
    perdicted_cluster = kmeans_model.predict(bigfive_list)[0]
    
    return perdicted_cluster

# cluster 내의 랜덤유저의 userid 반환환
def user(bigfive_input):
    df = clustering()

    # cluster에 해당하는 유저들 선택
    cluster = return_cluster(bigfive_input)
    clustered_users = df[df['cluster'] == cluster]

    # 유저별 선택될 가중치 계산
    weights = clustered_users['probability']
    p_choice = weights / weights.sum()

    # 확률에 따른 랜덤 선택
    selected_index = np.random.choice(clustered_users.index, p=p_choice)
    selected_user = clustered_users.loc[selected_index]

    return selected_user.get('userid')



