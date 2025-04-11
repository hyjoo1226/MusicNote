import json
import csv
import os

def save_json(data, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_csv(data, path):
    """
    data: List[Dict] 형태의 데이터를 CSV로 저장
    """
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if not data:
        raise ValueError("CSV로 저장할 데이터가 비어 있습니다.")

    with open(path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=data[0].keys())
        writer.writeheader()
        writer.writerows(data)


def load_csv(path):
    """
    CSV 파일을 읽어 List[Dict] 형태로 반환
    """
    with open(path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return [row for row in reader]
