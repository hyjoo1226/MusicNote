# utils/recommender/book_recommender.py

import os
import time
import requests
from dotenv import load_dotenv

from modelschemas.request_response import BigFiveScore, BookItem
from utils.date_converter import convert_pubdate
from utils.keyword_tools import KeywordTool
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
        self.keyword_tool = KeywordTool()

    def _is_valid_book(self, item: dict) -> bool:
        title = item.get("title", "")
        description = item.get("description", "")
        publisher = item.get("publisher", "")
        pubdate = item.get("pubdate", "0000")
        review_score = item.get("customerReviewRank", 0)  # NAVER API에는 없는 경우도 많음

        # 제외 키워드 필터
        exclude_keywords = ["자격증", "기출", "요약", "매거진", "정리", "시험대비", "시험 대비"]
        if any(word in title for word in exclude_keywords) or any(word in description for word in exclude_keywords):
            return False

        # 출판사 필터
        exclude_publishers = ["에듀윌", "공단기", "시대고시기획", "월간"]
        if publisher in exclude_publishers:
            return False

        # 출판연도 필터
        try:
            year = int(pubdate[:4])
            if year < 2008:
                return False
        except:
            pass

        return True


    def recommend_books_from_bigfive(self, bigfive: BigFiveScore, top_n_jobs: int = 5, top_k_keywords: int = 5, total_per_keyword: int = 2) -> list[BookItem]:
        """
        Big Five 성격 점수를 기반으로 키워드를 추출하고, 해당 키워드로 책을 추천합니다.
        :param bigfive: 사용자 Big Five 점수
        :param top_n_jobs: 상위 N개 직업 선택
        :param top_k_keywords: 최종 추출할 키워드 개수 (예: 5개면 5개 키워드 사용)
        :param total_per_keyword: 각 키워드당 책 수집 수 (예: 2권씩)
        """
        user_scores = [
            bigfive.openness,
            bigfive.conscientiousness,
            bigfive.extraversion,
            bigfive.agreeableness,
            1 - bigfive.neuroticism  # stability로 변환
        ]
        keywords = self.job_recommender.get_keywords_from_bigfive(user_scores, top_n_jobs, top_k_keywords)
        kr_keywords = self.keyword_tool.translate_and_save_keywords(keywords)
        return self.collect_from_keywords(kr_keywords, total_per_keyword=total_per_keyword)

    def fetch_books(self, query: str, display: int = 100, start: int = 1) -> dict:
        """
        단일 키워드에 대해 NAVER BOOK API 호출
        """
        params = {
            "query": query,
            "display": display,
            "start": start,
            "sort": "date"
        }
        response = requests.get(self.base_url, headers=self.headers, params=params)
        # ✅ 추가 로그
        print(f"📡 요청: {query} | 상태코드: {response.status_code}")
        if response.status_code != 200:
            print("❌ 응답 실패:", response.text)
            return {}

        json_data = response.json()
        if not json_data.get("items"):
            print(f"⚠️ '{query}'에 대한 결과 없음")
        return json_data

    def collect_books(self, query: str, total: int = 40, delay: float = 0.8) -> list[BookItem]:
        results = []
        for start in range(1, total + 1, 20):
            data = self.fetch_books(query, display=10, start=start)
            for item in data.get("items", []):

                if not self._is_valid_book(item):
                    continue

                author = item.get("author", "").strip() or "저자 미상"
                publisher = item.get("publisher", "").strip() or "출판사 미상"
                description = item.get("description", "").strip() or "설명 없음"

                results.append(BookItem(
                    title=item.get("title"),
                    image=item.get("image"),
                    author=author,
                    publisher=publisher,
                    description=description,
                    isbn=item.get("isbn"),
                    pubdate=convert_pubdate(item.get("pubdate"))
                ))

                # ✅ 수집 개수 도달 시 중단
                if len(results) >= total:
                    return results
            time.sleep(delay)
        return results

    def collect_from_keywords(self, keywords: list[str], total_per_keyword: int = 2, delay: float = 0.5) -> list[BookItem]:
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
