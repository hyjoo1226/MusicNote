import pandas as pd
import os
import joblib

# ==== 설정 ====
RAW_INPUT_PATH = "datasets/2025-03-25.csv"
SCALER_PATH = "models/scaler.pkl"
MODEL_DIR = "models"
REPORT_PATH = "reports/daily/report_predicted.csv"

# ==== 정규화 적용 함수 ====
def apply_scaler(df, scaler_path=SCALER_PATH):
    scaler = joblib.load(scaler_path)
    feature_cols = scaler.feature_names_in_.tolist()  # 학습 시 feature 순서 그대로
    scaled = scaler.transform(df[feature_cols])
    scaled_df = pd.DataFrame(scaled, columns=[f"{col}_scaled" for col in feature_cols])
    return pd.concat([df.reset_index(drop=True), scaled_df], axis=1)

# ==== MUSIC 스타일 매핑 함수 (리포트용 참고) ====
def music_mapping(df):
    df['Mellow'] = df[['valence_scaled', 'acousticness_scaled', 'instrumentalness_scaled']].mean(axis=1)
    df['Unpretentious'] = df[['acousticness_scaled', 'speechiness_scaled', 'liveness_scaled']].mean(axis=1)
    df['Sophisticated'] = df[['tempo_scaled', 'instrumentalness_scaled']].mean(axis=1)
    df['Intense'] = df[['energy_scaled', 'loudness_scaled', 'tempo_scaled']].mean(axis=1)
    df['Contemporary'] = df[['danceability_scaled', 'speechiness_scaled', 'energy_scaled']].mean(axis=1)
    return df

# ==== 성격 예측 함수 (raw feature 기반) ====
def predict_personality(df, model_dir=MODEL_DIR):
    predictions = {}
    X = df[['valence_scaled', 'acousticness_scaled', 'instrumentalness_scaled',
            'speechiness_scaled', 'liveness_scaled', 'tempo_scaled',
            'energy_scaled', 'loudness_scaled', 'danceability_scaled']]
    for trait in ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']:
        model_path = os.path.join(model_dir, f"personality_model_{trait}.pkl")
        model = joblib.load(model_path)
        predictions[trait] = model.predict(X)
    return pd.DataFrame(predictions)

# ==== 파이프라인 실행 ====
if __name__ == "__main__":
    df_raw = pd.read_csv(RAW_INPUT_PATH)
    df_scaled = apply_scaler(df_raw)
    df_music = music_mapping(df_scaled)  # (선택사항: 리포트 참고용)
    df_personality = predict_personality(df_scaled)  # 🎯 예측은 raw feature 기반
    df_final = pd.concat([df_raw, df_music, df_personality], axis=1)
    os.makedirs(os.path.dirname(REPORT_PATH), exist_ok=True)
    df_final.to_csv(REPORT_PATH, index=False)
    print(f"✅ 예측 리포트 저장 완료 → {REPORT_PATH}")
