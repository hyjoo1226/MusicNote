# routers/movie_recommend.py

from fastapi import APIRouter
from modelschemas.request_response import BigFiveScore, MovieList

router = APIRouter()

@router.post("/recommend/movie", response_model=MovieList)
def recommend_movie(data: BigFiveScore):
    return {"movies": [
            {
                'adult': False,
                'backdrop_path': '/8eifdha9GQeZAkexgtD45546XKx.jpg',
                'genre_ids': [28, 53, 878],
                'id': 822119,
                'original_language': 'en',
                'original_title': 'Captain America: Brave New World',
                'overview': '대통령이 된 새디우스 로스와 재회 후, 국제적인 사건의 중심에 서게 된 샘이 전 세계를 붉게 장악하려는 사악한 음모 뒤에 숨겨진 존재와 이유를 파헤쳐 나가는 액션 블록버스터',
                'popularity': 433.031,
                'poster_path': '/2MQdtfioyYSqgwkK07PSrBidOBC.jpg',
                'release_date': '2025-02-12',
                'title': '캡틴 아메리카: 브레이브 뉴 월드',
                'video': False,
                'vote_average': 6.1,
                'vote_count': 1118
            },
            {
                'adult': False,
                'backdrop_path': '/8eifdha9GQeZAkexgtD45546XKx.jpg',
                'genre_ids': [28, 53, 878],
                'id': 822119,
                'original_language': 'en',
                'original_title': 'Captain America: Brave New World',
                'overview': '대통령이 된 새디우스 로스와 재회 후, 국제적인 사건의 중심에 서게 된 샘이 전 세계를 붉게 장악하려는 사악한 음모 뒤에 숨겨진 존재와 이유를 파헤쳐 나가는 액션 블록버스터',
                'popularity': 433.031,
                'poster_path': '/2MQdtfioyYSqgwkK07PSrBidOBC.jpg',
                'release_date': '2025-02-12',
                'title': '캡틴 아메리카: 브레이브 뉴 월드',
                'video': False,
                'vote_average': 6.1,
                'vote_count': 1118
            }
        ]
    }
