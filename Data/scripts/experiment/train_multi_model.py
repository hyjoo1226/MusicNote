import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.multioutput import MultiOutputRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor

# 설정
DATA_PATH = "data/datasets/training_data.csv"
MODEL_DIR = "models"
os.makedirs(MODEL_DIR, exist_ok=True)

# 데이터 로드
data = pd.read_csv(DATA_PATH)
features = ['valence', 'acousticness', 'instrumentalness',
            'speechiness', 'liveness', 'tempo',
            'energy', 'loudness', 'danceability']
X = data[features]
Y = data[['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism']]

X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

# 공통 모델 파라미터
N_ESTIMATORS = 30
MAX_DEPTH = 10
MIN_SAMPLES_LEAF = 5  # only for RandomForest


def evaluate_and_save(model, name):
    model.fit(X_train, y_train)
    preds = model.predict(X_test)

    mae = mean_absolute_error(y_test, preds)
    r2 = r2_score(y_test, preds)

    model_path = os.path.join(MODEL_DIR, f"{name}.pkl")
    joblib.dump(model, model_path, compress=3)
    file_size = os.path.getsize(model_path) / (1024 ** 2)

    print(f"\n✅ [{name}] 저장 완료")
    print(f"   ➤ MAE: {mae:.4f}")
    print(f"   ➤ R²: {r2:.4f}")
    print(f"   ➤ 파일 크기: {file_size:.2f} MB")


# ✅ 1. RandomForest
rf_base = RandomForestRegressor(
    n_estimators=N_ESTIMATORS,
    max_depth=MAX_DEPTH,
    min_samples_leaf=MIN_SAMPLES_LEAF,
    n_jobs=-1,
    random_state=42
)
rf_model = MultiOutputRegressor(rf_base)
evaluate_and_save(rf_model, "personality_model_rf_multi")

# ✅ 2. XGBoost
xgb_base = XGBRegressor(
    n_estimators=N_ESTIMATORS,
    max_depth=MAX_DEPTH,
    learning_rate=0.1,
    verbosity=0,
    n_jobs=-1,
    random_state=42
)
xgb_model = MultiOutputRegressor(xgb_base)
evaluate_and_save(xgb_model, "personality_model_xgb_multi")
