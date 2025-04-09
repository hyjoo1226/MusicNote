from tmdbv3api import TMDb, Discover, Movie
import json
import os
from dotenv import load_dotenv
import random
'''
1. 장르 리스트의 장르를 id로 전환
2. 장르 id로 tmdb 응답 받아서 해당 장르의 value만큼 영화 추가 - 얘가 최종종
3. runtime과 credits 추가를 위해 영화 id로 추가 호출
4. 결과의 장르id를 str로 재전환환
'''

class Converter:
    def __init__(self):
        pass
    genre_list = {
            "Action" : 28,
            "Adventure" : 12,
            "Animation" : 16,
            "Comedy" : 35,
            "Crime" : 80,
            "Documentary" : 99,
            "Drama" : 18,
            "Family" : 10751,
            "Fantasy" : 14,
            "History" : 36,
            "Horror" : 27,
            "Music" : 10402,
            "Mystery" : 9648,
            "Romance" : 10749,
            "Science Fiction" : 878,
            "TV Movie": 10770,
            "Thriller" : 53,
            "War" : 10752,
            "Western" : 37,
    }
    genre_kr = {
        28: "액션",
        12: "모험",
        16: "애니메이션",
        35: "코미디",
        80: "범죄",
        99: "다큐멘터리",
        18: "드라마",
        10751: "가족",
        14: "판타지",
        36: "역사",
        27: "공포",
        10402: "음악",
        9648: "미스터리",
        10749: "로맨스",
        878: "SF",
        10770: "TV 영화",
        53: "스릴러",
        10752: "전쟁",
        37: "서부"
    }
    
    ## api 요청을 위해 장르를 id로 변환
    @classmethod
    def convert_genre_to_id(cls, user_dict): # user_dict = {'action' : 10, ....}
        # tmdb 장르목록에 해당되지 않는것들을 변환환
        user_dict = Converter.genre_transformation(user_dict)
        converter = cls.genre_list
        user_converted = dict()
        #장르 -> id로 변환환
        for genre, count in user_dict.items():
            new_key = converter.get(genre, genre)
            user_converted[new_key] = count
        return user_converted
    
    @classmethod
    def convert_id_to_genre(cls, movie_info):
        converter = cls.genre_kr # {'action' : 28, ...}
        genre_ids = movie_info.get("genre_ids") # [28, 14, ...]
        # 장르 한글로 변환환
        genres = [v for k, v in converter.items() if k in genre_ids] # ['action', 'thriller', ...]
        movie_info.update({"genres" : genres})

        return movie_info
    
    @staticmethod
    def genre_transformation(user_dict):
        user_transformed = {}
        genre_rename_map = {
            "Children": "Family",
            "Film-Noir": "Crime",
            "Sci-Fi": "Science Fiction",
            "Musical": "Music"
        }
        for genre, count in user_dict.items():
        # 바꾸는 값이 있으면 바꾸고, 없으면 그대로
                new_key = genre_rename_map.get(genre, genre)
                user_transformed[new_key] = user_transformed.get(new_key, 0) + count
        return user_transformed
        # 바꾸는 값이 있으면 바꾸고, 없으면 그대로


class TMDBClient:
    def __init__(self, lang='ko'):
        load_dotenv()
        self.tmdb = TMDb()
        self.tmdb.api_key = os.getenv("TMDB_API_KEY")
        self.tmdb.language = lang
        self.tmdb.debug = False

        self.discover = Discover()
        self.movie = Movie()

    def get_discover(self):
        return self.discover

    def get_movie(self):
        return self.movie


def response_model():
    model = {
        'adult': None,
        'backdrop_path': None,
        'genres': None,
        'id': None,
        'original_language': None,
        'original_title': None,
        'overview': None,
        'popularity': None,
        'poster_path': None,
        'release_date': None,
        'title': None,
        'vote_average': None,
        'runtime': None,
        'credits': None
    }
    return model





def add_runtime_credits(movie_info):
    tmdb = TMDBClient()
    movie = tmdb.get_movie()
    movie_id = movie_info.get("id")

    # 추가 정보 위해 tmdb movie_detail호출
    detail = movie.details(movie_id, append_to_response='credits')
    runtime = detail.get('runtime')
    credits = detail.get("credits")

    # 추가 정보
    new_credits = [
        {
        "role" : "actor1",
        "name" : ""
        },
        {
        "role" : "actor2",
        "name" : ""
        },
        {
        "role" : "director",
        "name" : ""
        }]
    
    for member in credits.get("cast"):
        name = member.get("name")
        order = member.get("order")
        if order == 0:
            new_credits[0].update({"name": name})
        elif order == 1:
            new_credits[1].update({"name" : name})
            break

    for crew in credits.get("crew"):
        name = crew.get("name")
        if crew.get("known_for_department") == "Directing" and crew.get("job") == "Director":
            new_credits[2].update({"name" : name})
            break
        
    movie_info.update({'runtime' : runtime, 'credits' : new_credits})
    

# 장르 아이디로 tmdb에서 영화정보 받아오기기
def search_movies(id, sort_by, page):
    tmdb = TMDBClient()
    discover = tmdb.get_discover()
    # tmdb에서 장르로 영화 검색한 결과
    response = discover.discover_movies({'with_genres':id, 'sort_by':sort_by, 'page':page, 'language':'ko-KR'})
    results = response['results']
    #  혹시 몰라서 list한번 해줌
    results = list(results)
    return results

# 조건에 맞는 애만 선별별
def get_filtered_movies(cnt, id, sort_by, page):
    
    
    result_list = []
    c = 0
    idx = 0

    movies_info = search_movies(id=id, sort_by=sort_by, page=page)
    while c < cnt:
    ## 한페이지 20개를 전부 다 순회해도 모자랄때 
        if idx >= len(movies_info):
            idx = 0
            page = random.randint(1, 5)
            ## 다음 페이지에서 찾기기
            movies_info = search_movies(id=id, sort_by=sort_by, page=page)
        
        # 영화 정보에서 필터링할 속성들 추출
        movie_info = movies_info[idx]
        original_language = movie_info.get("original_language")
        vote_average = movie_info.get("vote_average")
        popularity = movie_info.get("popularity")

        result = None
        if  original_language == 'en' and vote_average >= 7.0 and popularity >= 10.0 :
            result = movie_info
        elif original_language == 'kr' and vote_average >= 7.0 and popularity >= 1.0 :
            result = movie_info
            
        # 선택된 영화가 있으면
        if result:
            # 데이터 보완
            add_runtime_credits(result)
            Converter.convert_id_to_genre(result)
            movie_model = response_model() # response_model 불러오기
            # result를 순회하며 response_model 작성
            for key in result.keys(): # dict를 순회하면 key 값을 반환한다!
                if key in movie_model:
                    movie_model[key] = result[key]
            result_list.append(movie_model)
            c += 1
        idx += 1
            
    return result_list


## 장르 횟수만큼 영화 받아오기기
def recommend(user_genre):
    user_genre = Converter.convert_genre_to_id(user_genre) # {action : 2} -> {28: 2}
    recommendation = []
    # 중복방지 위한 검색 파라미터들들
    sort_by_filter = ['popularity.desc', 'revenue.desc' 'vote_count.desc']
    page = None
    # user_genre를 순회하며 장르별 영화 받아오기
    for id, cnt in user_genre.items():
        '''
        검색 파라미터 랜덤하게 넣기
        세가지 정렬방식 페이지 범위는 10
        한 페이지에 20개 나옴
        없을시엔 재탐색
        '''
        ## 랜덤 파라미터 생성
        idx = random.randrange(len(sort_by_filter))
        sort_by = sort_by_filter[idx]
        page = random.randint(1, 11)
        # tmdb에서 장르로 영화 검색한 결과
        result = get_filtered_movies(cnt=cnt, id=id, sort_by=sort_by, page=page)
        recommendation.extend(result)
    return recommendation

