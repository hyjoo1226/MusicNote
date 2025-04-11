# utils/recommender/book_recommender.py

import os
import time
import random
import html
import requests
from datetime import datetime
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

        exclude_title_keywords = [
            "주소록", "CD", "DVD", "지도", "자료집", "정보집", "연감", "실적",
            "보고서", "수록", "전화번호부", "명부", "매뉴얼", "데이터북"
        ]
        if any(word in title for word in exclude_title_keywords):
            return False

        exclude_keywords = ["자격증", "기출", "요약", "매거진", "정리", "시험대비", "시험 대비"]
        if any(word in title for word in exclude_keywords) or any(word in description for word in exclude_keywords):
            return False

        blocked_words = ["개새끼", "자살", "자해", "폭력", "혐오", "증오", "계엄령"]
        if any(bad_word in description for bad_word in blocked_words):
            return False

        exclude_publishers = ["에듀윌", "공단기", "시대고시기획", "월간", "한국콘텐츠미디어", "법학사"]
        if publisher in exclude_publishers:
            return False

        try:
            year = int(pubdate[:4])
            if year < 2008 or year > 2025:
                return False
        except:
            pass

        return True

    def recommend_books_from_bigfive(
        self,
        bigfive: BigFiveScore,
        top_n_jobs: int = 15,
        top_k_keywords: int = 15,
        total_per_keyword: int = 1
    ) -> list[BookItem]:
        """
        Big Five 성격 점수를 기반으로 키워드를 추출하고,
        그 키워드로 책을 추천합니다.
        결과는 동일한 점수라도 날짜에 따라 다양하게 바뀝니다.
        """
        user_scores = [
            bigfive.openness,
            bigfive.conscientiousness,
            bigfive.extraversion,
            bigfive.agreeableness,
            1 - bigfive.neuroticism  # Emotional Stability
        ]

        # 🎲 seed 고정: 매일 다르게 섞이게
        seed_key = str(user_scores) + datetime.now().strftime('%Y%m%d')
        random.seed(seed_key)

        raw_keywords = self.job_recommender.get_keywords_from_bigfive(user_scores, top_n_jobs, top_k_keywords * 2)
        random.shuffle(raw_keywords)
        sampled_keywords = raw_keywords[:top_k_keywords]

        kr_keywords = self.keyword_tool.translate_and_save_keywords(sampled_keywords)

        return self.collect_from_keywords(kr_keywords, total_per_keyword=total_per_keyword)

    def fetch_books(self, query: str, display: int = 100, start: int = 1) -> dict:
        params = {
            "query": query,
            "display": display,
            "start": start,
            "sort": "sim"
        }
        response = requests.get(self.base_url, headers=self.headers, params=params)
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

                author = str(html.unescape(item.get("author", "").replace("^", ", ") or "저자 미상")).strip()
                publisher = str(html.unescape(item.get("publisher", "") or "출판사 미상")).strip()
                description = str(html.unescape(item.get("description", "") or "설명 없음")).strip()

                results.append(BookItem(
                    title=item.get("title"),
                    image=item.get("image"),
                    author=author,
                    publisher=publisher,
                    description=description,
                    isbn=item.get("isbn"),
                    pubdate=convert_pubdate(item.get("pubdate"))
                ))

                if len(results) >= total:
                    return results
            time.sleep(delay)
        return results

    def collect_from_keywords(self, keywords: list[str], total_per_keyword: int = 1, delay: float = 0.5) -> list[BookItem]:
        all_results = []
        for keyword in keywords:
            print(f"🔍 '{keyword}' 키워드로 책 검색 중...")
            print("version : 1.0.0")
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
