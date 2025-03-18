# analysis_server/modelschemas/request_response.py
from pydantic import BaseModel
from typing import List

# 공통 요청 모델
class AudioFeatures(BaseModel):
    valence: float
    acousticness: float
    instrumentalness: float
    speechiness: float
    liveness: float
    tempo: float
    energy: float
    loudness: float
    danceability: float
    time_signature: int

class MusicScore(BaseModel):
    mellow: float
    unpretentious: float
    sophisticated: float
    intense: float
    contemporary: float

class MusicScoreWithCluster(MusicScore):
    cluster_id: int

class PersonalityScore(BaseModel):
    openness: float
    conscientiousness: float
    extraversion: float
    agreeableness: float
    neuroticism: float

# 다중 곡 처리용 요청 모델
class MultiTrackRequest(BaseModel):
    tracks: List[AudioFeatures]
