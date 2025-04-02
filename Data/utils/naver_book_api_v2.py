import requests
import time
import os
from dotenv import load_dotenv
from utils.file_utils import save_json

# ✅ .env 파일에서 API 키 로딩
load_dotenv()

CLIENT_ID = os.getenv("NAVER_CLIENT_ID")
CLIENT_SECRET = os.getenv("NAVER_CLIENT_SECRET")

HEADERS = {
    "X-Naver-Client-Id": CLIENT_ID,
    "X-Naver-Client-Secret": CLIENT_SECRET
}

def fetch_books(query, display=100, start=1):
    url = "https://openapi.naver.com/v1/search/book.json"
    params = {
        "query": query,
        "display": display,
        "start": start,
        "sort": "sim"
    }
    res = requests.get(url, headers=HEADERS, params=params)
    return res.json()

def collect_books(query, total=200, delay=0.5):
    collected = []
    for start in range(1, total + 1, 100):
        data = fetch_books(query, start=start)
        for item in data.get("items", []):
            collected.append({
                "title": item.get("title"),
                "author": item.get("author"),
                "description": item.get("description"),
                "isbn": item.get("isbn"),
                "link": item.get("link"),
                "keyword": query  # 추가된 부분
            })
        time.sleep(delay)
    return collected

# ✅ 추천 키워드 리스트 기반 다중 검색 수집 함수
def collect_books_from_keywords(keywords, total_per_keyword=30, delay=0.5):
    all_results = []
    for keyword in keywords:
        print(f"🔍 '{keyword}' 키워드로 책 검색 중...")
        books = collect_books(keyword, total=total_per_keyword, delay=delay)
        all_results.extend(books)
        print(f"✅ {len(books)}권 수집 완료 for keyword: {keyword}")
    return all_results

if __name__ == "__main__":
    print("📚 NAVER BOOK API 추천 키워드 기반 테스트 실행 중...")

    # Big Five 성격 기반 추천 키워드 (예시)
    recommended_keywords = [
        "감정", "내면", "불안", "명상", "위로",
        "예술", "상상", "창의성", "모험", "철학",
        "소통", "사교", "유머", "공감", "치유"
    ]

    # 추천 키워드 기반 다중 수집 실행
    books = collect_books_from_keywords(recommended_keywords, total_per_keyword=20)
    save_json(books, f"data/raw_books/books_personality_based.json")

    print(f"📦 전체 수집 완료: 총 {len(books)}권 저장됨")
