from sklearn.preprocessing import MinMaxScaler
import joblib
import pandas as pd

# SpotifyFeatures.csv 불러오기
spotify_df = pd.read_csv('datasets/SpotifyFeatures.csv')

# 정규화에 사용할 feature 선택 (time_signature 제외)
audio_features = ['danceability', 'energy', 'valence', 'loudness', 'tempo',
                  'acousticness', 'instrumentalness', 'speechiness', 'liveness']

# MinMaxScaler 학습 및 저장
scaler = MinMaxScaler()
scaler.fit(spotify_df[audio_features])
joblib.dump(scaler, 'scaler.pkl')

# 정규화 적용
scaled_df = pd.DataFrame(scaler.transform(spotify_df[audio_features]),
                         columns=[f'{col}_scaled' for col in audio_features])

# 원본 + 정규화 병합
spotify_scaled = pd.concat([spotify_df.reset_index(drop=True), scaled_df], axis=1)
spotify_scaled.to_csv('datasets/SpotifyFeatures_scaled.csv', index=False)
