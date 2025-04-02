# modelschemas/request_response.py
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

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

class Music(BaseModel):
    id: int
    track_name: str
    artist_name: str
    albumcover_path: str
    release_date: date
    popularity: int

class MusicScore(BaseModel):
    mellow: float
    unpretentious: float
    sophisticated: float
    intense: float
    contemporary: float

class BigFiveScore(BaseModel):
    openness: float
    conscientiousness: float
    extraversion: float
    agreeableness: float
    neuroticism: float

class Report(BaseModel):
    top_score: str
    top_text: str
    low_score: str
    low_text: str
    summary: str

class Movie(BaseModel):
    adult: bool
    backdrop_path: str
    genres: List[str] = Field(default_factory=list)
    id: int
    original_language: str
    original_title: str
    overview: str
    popularity: float
    poster_path: str
    release_date: date
    title: str
    video: bool
    vote_average: float
    vote_count: int

class MusicList(BaseModel):
    musics: List[Music]

class MovieList(BaseModel):
    movies: List[Movie]

# 다중 곡 처리용 요청 모델
class FeatureList(BaseModel):
    tracks: List[AudioFeatures]

# BigFive 점수와 Report 같이 반환
class DailyReport(BaseModel):
    openness: float
    conscientiousness: float
    extraversion: float
    agreeableness: float
    neuroticism: float
    report: Report

class KeywordList(BaseModel):
    keywords: List[str]

class BookItem(BaseModel):
    title: str
    author: str
    description: Optional[str]
    isbn: Optional[str]
    link: str
    keyword: str

class BookList(BaseModel):
    results: List[BookItem]