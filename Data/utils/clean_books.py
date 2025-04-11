import os
from utils.file_utils import load_json, save_json

# === 경로 설정 ===
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

input_path = os.path.join(BASE_DIR, 'data', 'raw_books', 'books_심리학_test.json')
output_path = os.path.join(BASE_DIR, 'data', 'cleaned_books', 'cleaned_books_심리학.json')

# === 데이터 로드 ===
data = load_json(input_path)

# === 데이터 처리 예시 ===
titles = [{"title": book['title'], "description": book['description']} for book in data if 'title' in book]

# === 저장 ===
save_json(titles, output_path)

print(f"저장 완료: {output_path}")
