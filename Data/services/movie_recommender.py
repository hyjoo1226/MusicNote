# services/movie_recommender.py
from modelschemas.request_response import BigFiveScore, MovieList, Movie
from datetime import datetime


def recommend_movie_genre(input_data: BigFiveScore) -> MovieList:
    return MovieList(
            movies= [
                Movie(
                    adult= False,
                    backdrop_path= '/8eifdha9GQeZAkexgtD45546XKx.jpg',
                    genres= ['로맨스', '다큐', '호러'],
                    id= 822119,
                    original_language= 'en',
                    original_title= 'Captain America: Brave New World',
                    overview= '대통령이 된 새디우스 로스와 재회 후, 국제적인 사건의 중심에 서게 된 샘이 전 세계를 붉게 장악하려는 사악한 음모 뒤에 숨겨진 존재와 이유를 파헤쳐 나가는 액션 블록버스터',
                    popularity= 433.031,
                    poster_path= '/2MQdtfioyYSqgwkK07PSrBidOBC.jpg',
                    release_date= datetime.strptime('2025-02-12','%Y-%m-%d').date(),
                    title= '캡틴 아메리카: 브레이브 뉴 월드',
                    video= False,
                    vote_average= 6.1,
                    vote_count= 1118),
                Movie(
                    adult=True,
                    backdrop_path='/8eifdha9GQeZAkexgtD45546XKx.jpg',
                    genres=['판타지', '액션', '스릴러'],
                    id=822119,
                    original_language='en',
                    original_title='Captain America: Brave New World',
                    overview='대통령이 된 새디우스 로스와 재회 후, 국제적인 사건의 중심에 서게 된 샘이 전 세계를 붉게 장악하려는 사악한 음모 뒤에 숨겨진 존재와 이유를 파헤쳐 나가는 액션 블록버스터',
                    popularity=433.031,
                    poster_path='/2MQdtfioyYSqgwkK07PSrBidOBC.jpg',
                    release_date=datetime.strptime('2025-02-12', '%Y-%m-%d').date(),
                    title='캡틴 아메리카: 브레이브 올드 월드',
                    video=False,
                    vote_average=6.1,
                    vote_count=1118)
                ]
            )