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
                "link": item.get("link")
            })
        time.sleep(delay)
    return collected

if __name__ == "__main__":
    print("📚 NAVER BOOK API 테스트 실행 중...")
    test_keyword = "간호사"
    books = collect_books(test_keyword, total=100)
    save_json(books, f"data/raw_books/books_{test_keyword}_test.json")
    print(f"✅ 테스트용 수집 완료: {len(books)}권 저장됨")