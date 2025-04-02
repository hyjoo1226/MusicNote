# utils/keyword_tools.py

from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.stem import PorterStemmer
from typing import List


def extract_tfidf_keywords(descriptions: List[str], top_k: int = 10) -> List[str]:
    """
    TF-IDF 기반 키워드 추출 함수
    :param descriptions: 텍스트 리스트
    :param top_k: 추출할 키워드 수
    :return: 키워드 리스트
    """
    vectorizer = TfidfVectorizer(stop_words="english", max_features=1000)
    tfidf_matrix = vectorizer.fit_transform(descriptions)

    scores = tfidf_matrix.sum(axis=0).A1
    feature_names = vectorizer.get_feature_names_out()

    sorted_keywords = sorted(zip(feature_names, scores), key=lambda x: x[1], reverse=True)
    return [word for word, _ in sorted_keywords[:top_k * 2]]  # 여유 있게 추출


def deduplicate_keywords(keywords: List[str], top_k: int = 10) -> List[str]:
    """
    Stemming 기반으로 유사 키워드 정제
    :param keywords: 키워드 리스트
    :param top_k: 최종 추출할 키워드 수
    :return: 정제된 키워드 리스트
    """
    ps = PorterStemmer()
    stem_map = {}
    for word in keywords:
        root = ps.stem(word)
        if root not in stem_map:
            stem_map[root] = word  # 먼저 나온 단어 유지
    return list(stem_map.values())[:top_k]


def extract_clean_keywords(descriptions: List[str], top_k: int = 10) -> List[str]:
    """
    TF-IDF + Stemming 기반 정제된 키워드 추출 함수
    :param descriptions: 텍스트 리스트
    :param top_k: 최종 추출할 키워드 수
    :return: 키워드 리스트
    """
    raw_keywords = extract_tfidf_keywords(descriptions, top_k)
    return deduplicate_keywords(raw_keywords, top_k)
