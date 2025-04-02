import os
import math
import nltk
from transformers import pipeline, AutoTokenizer
from utils.file_utils import load_json, save_json

# 📂 경로 설정
INPUT_PATH = "data/cleaned_books/cleaned_books_심리학.json"
OUTPUT_PATH = "data/processed_books/books_with_emotions.json"

# 🤖 모델 및 토크나이저 로드
model_name = "j-hartmann/emotion-english-distilroberta-base"
emotion_classifier = pipeline("text-classification", model=model_name, top_k=None)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# 🔤 문장 분리기
nltk.download("punkt")

# 📊 감정 평균 계산
def average_emotions(emotion_list):
    sum_dict = {}
    for emo in emotion_list:
        for item in emo:
            sum_dict[item["label"]] = sum_dict.get(item["label"], 0) + item["score"]
    return {label: round(score / len(emotion_list), 4) for label, score in sum_dict.items()}

# 📌 고정 500 토큰 기준으로 텍스트 조각내기
def split_text_by_token_limit(text, max_tokens=500):
    tokens = tokenizer.tokenize(text)
    total_tokens = len(tokens)

    if total_tokens <= max_tokens:
        return [text]

    n_chunks = math.ceil(total_tokens / max_tokens)
    chunk_size = math.ceil(total_tokens / n_chunks)

    chunks = []
    for i in range(n_chunks):
        chunk_tokens = tokens[i * chunk_size:(i + 1) * chunk_size]
        chunk_ids = tokenizer.convert_tokens_to_ids(chunk_tokens)
        chunk_text = tokenizer.decode(chunk_ids, skip_special_tokens=True)
        chunks.append(chunk_text)

    return chunks

# 📘 데이터 로딩
books = load_json(INPUT_PATH)
results = []

for book in books:
    desc = book["description"]

    try:
        text_chunks = split_text_by_token_limit(desc, max_tokens=500)
        emotions_per_chunk = []

        for chunk in text_chunks:
            try:
                result = emotion_classifier(chunk)[0]
                emotions_per_chunk.append(result)
            except:
                continue

        if emotions_per_chunk:
            avg_emotions = average_emotions(emotions_per_chunk)
            dominant = max(avg_emotions, key=avg_emotions.get)
        else:
            avg_emotions = {}
            dominant = "ERROR"

    except Exception as e:
        avg_emotions = {}
        dominant = "ERROR"

    results.append({
        "title": book["title"],
        "description": desc,
        "dominant_emotion": dominant,
        "emotions": avg_emotions
    })

# 📤 결과 저장
save_json(results, OUTPUT_PATH)
print(f"✅ 감정 분석 완료: {len(results)}권 저장됨 → {OUTPUT_PATH}")
