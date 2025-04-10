from deep_translator import GoogleTranslator
import os
import json
import re
from datetime import datetime
from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.stem import PorterStemmer


class KeywordTool:
    def __init__(self, mapping_path="data/keyword_map.json", backup_dir="data/keyword_backups"):
        self.mapping_path = mapping_path
        self.backup_dir = backup_dir
        self.translation_dict = self._load_mapping()

    def _load_mapping(self):
        if os.path.exists(self.mapping_path):
            with open(self.mapping_path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {}

    def _save_mapping(self):
        os.makedirs(self.backup_dir, exist_ok=True)
        now = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = os.path.join(self.backup_dir, f"backup_{now}.json")
        with open(backup_path, "w", encoding="utf-8") as f:
            json.dump(self.translation_dict, f, ensure_ascii=False, indent=2)
        with open(self.mapping_path, "w", encoding="utf-8") as f:
            json.dump(self.translation_dict, f, ensure_ascii=False, indent=2)

    def _clean_translation(self, text: str) -> str:
        """
        Google 번역 결과에서 불필요한 조사나 동사를 제거해 명사형으로 정제한다.
        예: '개발하다' → '개발', '공감하는 것' → '공감'
        """
        # 불필요한 조사나 동사형 표현 제거 패턴들
        patterns = [
            r"(하다|되다|이다)$",
            r"(하는 것|하기|되는 것|된 것|되어 있는 것)$",
            r"(적인 것|스럽다|스러운 것)$",
        ]
        for pattern in patterns:
            text = re.sub(pattern, "", text)

        return text.strip()

    def translate_and_save_keywords(self, keywords: List[str]) -> List[str]:
        new_keywords = [kw for kw in keywords if kw not in self.translation_dict]
        translator = GoogleTranslator(source="en", target="ko")

        for word in new_keywords:
            try:
                translated = translator.translate(word)
                cleaned = self._clean_translation(translated)
                self.translation_dict[word] = cleaned
            except Exception as e:
                print(f"⚠️ 번역 실패: {word} → {e}")
                self.translation_dict[word] = word  # fallback

        if new_keywords:
            self._save_mapping()

        return [self.translation_dict.get(k, k) for k in keywords]

    def extract_tfidf_keywords(self, descriptions: List[str], top_k: int = 10) -> List[str]:
        vectorizer = TfidfVectorizer(stop_words="english", max_features=1000)
        tfidf_matrix = vectorizer.fit_transform(descriptions)
        scores = tfidf_matrix.sum(axis=0).A1
        feature_names = vectorizer.get_feature_names_out()
        sorted_keywords = sorted(zip(feature_names, scores), key=lambda x: x[1], reverse=True)
        return [word for word, _ in sorted_keywords[:top_k * 2]]

    def deduplicate_keywords(self, keywords: List[str], top_k: int = 15) -> List[str]:
        ps = PorterStemmer()
        stem_map = {}
        for word in keywords:
            root = ps.stem(word)
            if root not in stem_map:
                stem_map[root] = word
        return list(stem_map.values())[:top_k]

    def extract_clean_keywords(self, descriptions: List[str], top_k: int = 15) -> List[str]:
        raw_keywords = self.extract_tfidf_keywords(descriptions, top_k)
        return self.deduplicate_keywords(raw_keywords, top_k=15)

if __name__ == "__main__":
    tool = KeywordTool()
    english_keywords = ["develop", "empathy", "science", "wellbeing", "analyze"]
    korean_keywords = tool.translate_and_save_keywords(english_keywords)
    print("🌐 번역 결과:", korean_keywords)
