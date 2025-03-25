import os

print("초기 세팅 시작")
print("모델 학습 데이터 전처리 및 scaler.pkl생성")
os.system("python scripts/experiment/00_generate_training_data.py")
print("성향별 모델학습 시작")
os.system("python scripts/experiment/02_train_personality_model.py")

print("MUSIC MODEL 점수 및 BIG FIVE 점수 계산 시작")
os.system("python scripts/experiment/03_predict_personality_and_music_model.py")

print("성향 리포트 생성 시작")
os.system("python scripts/experiment/generate_report.py")

print("초기 세팅 파이프라인 실행 완료")