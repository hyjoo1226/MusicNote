# 🎵 MUSIC to Personality Analysis API

FastAPI 기반 음악 오디오 특성 분석 API입니다.  
Spotify Audio Feature를 입력 받아 MUSIC 모델 벡터 및 Big Five 성격 특성을 추정합니다.

## 📁 프로젝트 구조

```
analysis-api/
├── app/
│   ├── main.py                      👈 FastAPI 앱 진입점
│   ├── routes/
│   │   └── analysis.py             👈 API 엔드포인트 정의
│   ├── funtions/
│   │   └── personality.py          👈 계산 로직 분리
│   └── models/
│       └── schema.py               👈 요청/응답 모델 정의

```
