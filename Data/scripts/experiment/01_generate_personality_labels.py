# 01_generate_personality_labels.py (MinMaxScaler 전체 feature 정규화 반영)
import pandas as pd
import numpy as np
import os
from sklearn.preprocessing import MinMaxScaler

# ==== 1. Load Spotify Features Dataset ====
INPUT_PATH = "datasets/SpotifyFeatures_scaled.csv"
OUTPUT_PATH = "datasets/training_data.csv"

features_required = [
    'valence', 'acousticness', 'instrumentalness',
    'speechiness', 'liveness', 'tempo',
    'energy', 'loudness', 'danceability'
]

if not os.path.exists(INPUT_PATH):
    raise FileNotFoundError(f"'{INPUT_PATH}' 파일이 경로에 없습니다.")

spotify_df = pd.read_csv(INPUT_PATH)
spotify_df = spotify_df.dropna(subset=features_required)
spotify_features = spotify_df[features_required].copy()

# ==== 2. Feature Scaling (MinMaxScaler 전체 feature 정규화) ====
scaler = MinMaxScaler()
scaled_features = scaler.fit_transform(spotify_features)
scaled_df = pd.DataFrame(scaled_features, columns=features_required)

# ==== 3. MUSIC 스타일 점수 계산 (논문 기반 가중치 구조 유지) ====
music_weights = {
    "Mellow":           [0.4, 0.3, 0.3, 0, 0, 0, 0, 0, 0],
    "Unpretentious":    [0, 0.4, 0, 0.3, 0.3, 0, 0, 0, 0],
    "Sophisticated":    [0, 0, 0.4, 0, 0, 0.3, 0, 0, 0],
    "Intense":          [0, 0, 0, 0, 0, 0.3, 0.4, 0.3, 0],
    "Contemporary":     [0, 0, 0, 0.3, 0, 0, 0.3, 0, 0.4],
}

music_scores = pd.DataFrame()
for style, weights in music_weights.items():
    music_scores[style] = scaled_df.values @ np.array(weights)

# ==== 4. Big Five 성격 점수 생성 ====
personality_scores = pd.DataFrame({
    "Openness":           0.5 * music_scores["Sophisticated"] + 0.5 * music_scores["Intense"],
    "Conscientiousness": music_scores["Unpretentious"],
    "Extraversion":       0.5 * music_scores["Contemporary"] + 0.5 * music_scores["Unpretentious"],
    "Agreeableness":      0.5 * music_scores["Mellow"] + 0.5 * music_scores["Unpretentious"],
    "Neuroticism":        music_scores["Intense"]
})

# ==== 5. 최종 학습용 데이터 저장 ====
final_data = pd.concat([scaled_df.reset_index(drop=True), personality_scores], axis=1)
final_data.to_csv(OUTPUT_PATH, index=False)

print(f"✅ '{OUTPUT_PATH}' 파일이 생성되었습니다. (총 {len(final_data)}개 샘플)")
