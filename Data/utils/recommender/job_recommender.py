import joblib
from sklearn.metrics.pairwise import cosine_similarity
from utils.keyword_tools import KeywordTool


class JobRecommender:
    def __init__(self, pkl_path="models/onet_bigfive_mapped.pkl"):
        """
        사전 전처리된 .pkl 파일을 로드하여 추천 시스템 초기화
        """
        self.df = joblib.load(pkl_path)
        self.numeric_cols = ["openness", "conscientiousness", "extraversion", "agreeableness", "stability"]
        self.keyword_tool = KeywordTool()  # ✅ 키워드 유틸 통합 사용

    def recommend_jobs(self, user_scores, top_n=5):
        """
        사용자 Big Five 점수를 기반으로 직업 추천
        :param user_scores: [O, C, E, A, S] 형태의 리스트
        :param top_n: 추천할 직업 수
        :return: 추천된 상위 직업 DataFrame
        """
        job_vectors = self.df[self.numeric_cols].values
        similarities = cosine_similarity([user_scores], job_vectors)[0]
        self.df["similarity"] = similarities
        return self.df.sort_values("similarity", ascending=False).head(top_n)

    def get_keywords_from_bigfive(self, user_scores, top_n_jobs=5, top_k_keywords=10):
        """
        사용자 Big Five 점수를 기반으로 추천 직업 설명에서 키워드 추출
        :return: 키워드 리스트
        """
        top_jobs = self.recommend_jobs(user_scores, top_n=top_n_jobs)
        descriptions = top_jobs["Description"].tolist()
        return self.keyword_tool.extract_clean_keywords(descriptions, top_k=top_k_keywords)


# if __name__ == "__main__":
#     recommender = JobRecommender()
#     user_bigfive = [0.68, 0.58, 0.42, 0.53, 0.60]
#     keywords = recommender.get_keywords_from_bigfive(user_bigfive)
#     print("추천 키워드:", keywords)
