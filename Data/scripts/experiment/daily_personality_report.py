# daily_personality_report.py (정규화된 데이터 기반 리포트 생성 - 최종 리팩토링 버전)
import numpy as np
import pandas as pd
import datetime
import os
import joblib

# ====== 모델 로딩 ======
MODEL_DIR = "models"
traits = ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']
models = {t: joblib.load(f"{MODEL_DIR}/personality_model_{t}.pkl") for t in traits}

# ====== 정규화용 Scaler 로딩 ======
scaler = joblib.load("models/scaler.pkl")  # 경로 필요시 수정

# === MUSIC 스타일 계산 함수 ===
def calculate_music_styles(features):
    return {
        "Mellow": 0.4 * features["valence"] + 0.3 * features["acousticness"] + 0.3 * features["instrumentalness"],
        "Unpretentious": 0.4 * features["acousticness"] + 0.3 * features["speechiness"] + 0.3 * features["liveness"],
        "Sophisticated": 0.6 * features["instrumentalness"] + 0.4 * features["tempo"],  # time_signature 제거
        "Intense": 0.4 * features["energy"] + 0.3 * features["loudness"] + 0.3 * features["tempo"],
        "Contemporary": 0.4 * features["danceability"] + 0.3 * features["speechiness"] + 0.3 * features["energy"]
    }


# ====== 예측 함수 ======
def predict_daily_personality(song_feature_list):
    # === 예측 함수 내부 features_order ===
    features_order = list(scaler.feature_names_in_)

    df = pd.DataFrame(song_feature_list)
    scaled_features = scaler.transform(df[features_order])
    df_scaled = pd.DataFrame(scaled_features, columns=features_order)

    # MUSIC 스타일 계산
    music_styles = df_scaled.apply(calculate_music_styles, axis=1)
    music_styles_df = pd.DataFrame(music_styles.tolist())

    # 성격 예측
    trait_scores = {t: [] for t in traits}
    for _, row in df_scaled.iterrows():
        input_vector = row.values
        for t in traits:
            pred = models[t].predict([input_vector])[0]
            trait_scores[t].append(pred)

    personality_avg = {t: np.mean(scores) for t, scores in trait_scores.items()}
    music_style_avg = music_styles_df.mean().to_dict()
    return personality_avg, music_style_avg

# ====== 실행 예시 ======
if __name__ == "__main__":
    # === sample_playlist에서도 time_signature 제거 ===
    sample_playlist = [
        {"valence": 0.424, "acousticness": 0.0192, "instrumentalness": 0.0,
         "speechiness": 0.0598, "liveness": 0.355, "tempo": 135.011,
         "energy": 0.832, "loudness": -3.038, "danceability": 0.694},
        {"valence": 0.587, "acousticness": 0.152, "instrumentalness": 0.0,
         "speechiness": 0.107, "liveness": 0.276, "tempo": 90.026,
         "energy": 0.746, "loudness": -3.143, "danceability": 0.72},
        {"valence": 0.488, "acousticness": 0.404, "instrumentalness": 0.0,
         "speechiness": 0.0937, "liveness": 0.329, "tempo": 89.947,
         "energy": 0.681, "loudness": -4.251, "danceability": 0.648}
    ]
    personality, music_style = predict_daily_personality(sample_playlist)

    print("\nToday's Personality Prediction:")
    for t, v in personality.items():
        print(f"  {t}: {v:.3f}")

    print("\nAverage MUSIC Style Score:")
    for s, v in music_style.items():
        print(f"  {s}: {v:.3f}")

    today = datetime.date.today().strftime("%Y-%m-%d")
    report_df = pd.DataFrame([{**personality, **music_style}])
    report_df.insert(0, "ReportDate", today)

    os.makedirs("reports/daily", exist_ok=True)
    report_df.to_csv(f"reports/daily/daily_personality_report_{today}.csv", index=False)
    print(f"\nSaved to: reports/daily/daily_personality_report_{today}.csv")
