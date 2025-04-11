import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.stem import PorterStemmer
from utils.file_utils import load_csv


# ----- 키워드 추출 + 정제 함수 -----
def extract_clean_keywords_from_descriptions(descriptions, top_k=10):
    vectorizer = TfidfVectorizer(stop_words="english", max_features=1000)
    tfidf_matrix = vectorizer.fit_transform(descriptions)

    scores = tfidf_matrix.sum(axis=0).A1
    feature_names = vectorizer.get_feature_names_out()
    sorted_features = sorted(zip(feature_names, scores), key=lambda x: x[1], reverse=True)

    top_keywords = [word for word, _ in sorted_features[:top_k * 2]]

    ps = PorterStemmer()
    stem_map = {}
    for word in top_keywords:
        root = ps.stem(word)
        if root not in stem_map:
            stem_map[root] = word

    return list(stem_map.values())[:top_k]


# ----- 통합 함수 -----
def get_keywords_from_bigfive(user_scores, top_n_jobs=5, top_k_keywords=10,
                              data_path="data/processed_data/onet_bigfive_mapped.csv"):
    """
    사용자 Big Five 점수를 입력받아 추천 직업 기반 키워드 리스트를 반환합니다.

    Returns:
        keywords (List[str])
    """
    # 1. 데이터 불러오기
    data = load_csv(data_path)
    df = pd.DataFrame(data)

    # 2. 수치형 컬럼 변환
    numeric_cols = ["openness", "conscientiousness", "extraversion", "agreeableness", "stability"]
    df[numeric_cols] = df[numeric_cols].astype(float)

    # 3. 유사도 계산
    job_vectors = df[numeric_cols].values
    similarities = cosine_similarity([user_scores], job_vectors)[0]
    df["similarity"] = similarities

    # 4. 상위 N개 직업 선택
    top_jobs = df.sort_values("similarity", ascending=False).head(top_n_jobs)

    # 5. 설명에서 키워드 추출
    descriptions = top_jobs["Description"].tolist()
    keywords = extract_clean_keywords_from_descriptions(descriptions, top_k=top_k_keywords)

    return keywords

if __name__ == "__main__":
    user_bigfive = [0.65, 0.70, 0.45, 0.55, 0.60]
    keywords = get_keywords_from_bigfive(user_bigfive)
    print("추천 키워드:", keywords)
