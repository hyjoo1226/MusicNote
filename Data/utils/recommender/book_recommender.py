# utils/recommender/book_recommender.py

import os
import time
import requests
from dotenv import load_dotenv

from modelschemas.request_response import BigFiveScore
from utils.recommender.job_recommender import JobRecommender

load_dotenv()

class BookRecommender:
    def __init__(self):
        self.client_id = os.getenv("NAVER_CLIENT_ID")
        self.client_secret = os.getenv("NAVER_CLIENT_SECRET")
        self.headers = {
            "X-Naver-Client-Id": self.client_id,
            "X-Naver-Client-Secret": self.client_secret
        }
        self.base_url = "https://openapi.naver.com/v1/search/book.json"
        self.job_recommender = JobRecommender()

    def recommend_books_from_bigfive(self, bigfive: BigFiveScore, top_n_jobs: int = 5, top_k_keywords: int = 10, total_per_keyword: int = 20) -> list[dict]:
        """
        Big Five 성격 점수를 기반으로 키워드를 추출하고, 해당 키워드로 책을 추천합니다.
        """
        user_scores = [
            bigfive.openness,
            bigfive.conscientiousness,
            bigfive.extraversion,
            bigfive.agreeableness,
            1 - bigfive.neuroticism  # stability로 변환
        ]
        keywords = self.job_recommender.get_keywords_from_bigfive(user_scores, top_n_jobs, top_k_keywords)
        return self.collect_from_keywords(keywords, total_per_keyword=total_per_keyword)

    def fetch_books(self, query: str, display: int = 100, start: int = 1) -> dict:
        """
        단일 키워드에 대해 NAVER BOOK API 호출
        """
        params = {
            "query": query,
            "display": display,
            "start": start,
            "sort": "sim"
        }
        response = requests.get(self.base_url, headers=self.headers, params=params)
        return response.json()

    def collect_books(self, query: str, total: int = 40, delay: float = 0.8) -> list[dict]:
        """
        단일 키워드에 대해 여러 페이지의 책 정보 수집
        """
        results = []
        for start in range(1, total + 1, 20):
            data = self.fetch_books(query, display=20, start=start)
            for item in data.get("items", []):
                results.append({
                    "title": item.get("title"),
                    "author": item.get("author"),
                    "description": item.get("description"),
                    "isbn": item.get("isbn"),
                    "link": item.get("link"),
                    "keyword": query
                })
            time.sleep(delay)
        return results

    def collect_from_keywords(self, keywords: list[str], total_per_keyword: int = 30, delay: float = 0.5) -> list[dict]:
        """
        여러 키워드를 기반으로 책 정보 수집
        """
        all_results = []
        for keyword in keywords:
            print(f"🔍 '{keyword}' 키워드로 책 검색 중...")
            books = self.collect_books(keyword, total=total_per_keyword, delay=delay)
            all_results.extend(books)
            print(f"✅ {len(books)}권 수집 완료 for keyword: {keyword}")
        return all_results


if __name__ == "__main__":
    recommender = BookRecommender()
    keywords = ["감정", "공감", "명상", "디자인", "심리"]
    results = recommender.collect_from_keywords(keywords, total_per_keyword=20)
    for book in results[:3]:
        print(book)
