import os

print("초기 세팅 시작")
print("모델 학습 데이터 전처리 및 scaler.pkl생성")
os.system("python scripts/curent/00_generate_training_data.py")
print("BigFive 모델 지도학습 시작")
os.system("python scripts/curent/01_train_bigfive_model.py")

print("초기 세팅 파이프라인 실행 완료")