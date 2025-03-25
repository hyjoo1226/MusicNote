# 00_generate_training_data.py
import pandas as pd
import os
import joblib
from sklearn.preprocessing import StandardScaler, MinMaxScaler

INPUT_PATH = "data/datasets/SpotifyFeatures.csv"
OUTPUT_PATH = "data/datasets/training_data.csv"
FEATURE_SCALER_PATH = "models/feature_scaler.pkl"
LABEL_SCALER_PATH = "models/label_scaler.pkl"
MUSIC_SCALER_PATH = "models/music_score_scaler.pkl"

os.makedirs("datasets", exist_ok=True)
os.makedirs("models", exist_ok=True)

# 1. Load raw data
df = pd.read_csv(INPUT_PATH)
features = ['valence', 'acousticness', 'instrumentalness',
            'speechiness', 'liveness', 'tempo',
            'energy', 'loudness', 'danceability']
X = df[features]

# 2. Feature 정규화
feature_scaler = StandardScaler()
X_scaled = feature_scaler.fit_transform(X)
X_scaled_df = pd.DataFrame(X_scaled, columns=features)
joblib.dump(feature_scaler, FEATURE_SCALER_PATH)
print(f"✅ Feature Scaler 저장 → {FEATURE_SCALER_PATH}")

# 3. Rule-based 성격 점수 생성
X_scaled_df['Openness'] = X_scaled_df['instrumentalness'] * 0.5 + X_scaled_df['tempo'] * 0.5
X_scaled_df['Conscientiousness'] = X_scaled_df['speechiness'] * -0.3 + X_scaled_df['liveness'] * 0.4
X_scaled_df['Extraversion'] = X_scaled_df['danceability'] * 0.5 + X_scaled_df['energy'] * 0.5
X_scaled_df['Agreeableness'] = X_scaled_df['valence'] * 0.5 + X_scaled_df['acousticness'] * 0.5
X_scaled_df['Neuroticism'] = X_scaled_df['energy'] * 0.5 + X_scaled_df['loudness'] * 0.5

# 4. Label 정규화 (MinMax)
label_cols = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']
label_scaler = MinMaxScaler()
X_scaled_df[label_cols] = label_scaler.fit_transform(X_scaled_df[label_cols])
joblib.dump(label_scaler, LABEL_SCALER_PATH)
print(f"✅ Label Scaler 저장 → {LABEL_SCALER_PATH}")

# 5. MUSIC 점수 계산
X_scaled_df['Mellow'] = X_scaled_df[['valence', 'acousticness', 'instrumentalness']].mean(axis=1)
X_scaled_df['Unpretentious'] = X_scaled_df[['acousticness', 'speechiness', 'liveness']].mean(axis=1)
X_scaled_df['Sophisticated'] = X_scaled_df[['tempo', 'instrumentalness']].mean(axis=1)
X_scaled_df['Intense'] = X_scaled_df[['energy', 'loudness', 'tempo']].mean(axis=1)
X_scaled_df['Contemporary'] = X_scaled_df[['danceability', 'speechiness', 'energy']].mean(axis=1)

music_cols = ['Mellow', 'Unpretentious', 'Sophisticated', 'Intense', 'Contemporary']
music_scaler = MinMaxScaler()
X_scaled_df[music_cols] = music_scaler.fit_transform(X_scaled_df[music_cols])
joblib.dump(music_scaler, MUSIC_SCALER_PATH)
print(f"✅ MUSIC Scaler 저장 → {MUSIC_SCALER_PATH}")

# 6. 저장
X_scaled_df.to_csv(OUTPUT_PATH, index=False)
print(f"✅ training_data.csv 저장 완료 → {OUTPUT_PATH}")
