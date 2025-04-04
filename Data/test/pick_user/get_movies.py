from tmdbv3api import TMDb, Discover, Movie
import json
'''
1. 장르 리스트의 장르를 id로 전환
2. 장르 id로 tmdb 응답 받아서 해당 장르의 value만큼 영화 추가 - 얘가 최종종
3. runtime과 credits 추가를 위해 영화 id로 추가 호출
4. 결과의 장르id를 str로 재전환환
'''
def genre_list():
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
	

	return genre_list, genre_kr

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

def init_tmdb(api_key='4feca631dd5c6770c207e60e8f469db0', lang='ko'):
    tmdb = TMDb()
    tmdb.api_key = api_key
    tmdb.language = lang
    tmdb.debug = False
    return Discover(), Movie()


# 원본데이터의 장르를 현재 장르 리스트에 맞게 변환
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

## api 요청을 위해 장르를 id로 변환
def convert_genre_to_id(user_dict):
	user_dict = genre_transformation(user_dict)
	converter, genre_kr = genre_list()

	user_converted = dict()
	for genre, count in user_dict.items():
	# 바꾸는 값이 있으면 바꾸고, 없으면 그대로
		new_key = converter.get(genre, genre)
		user_converted[new_key] = count
	return user_converted

def add_runtime_credits(movie_info):
	discover, movie = init_tmdb()
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
	

def convert_id_to_genre(movie_info):
	genre_dict, converter = genre_list() # {'action' : 28, ...}
	genre_ids = movie_info.get("genre_ids") # [28, 14, ...]
	genres = [v for k, v in converter.items() if k in genre_ids]
	movie_info.update({"genres" : genres})

## 장르 횟수만큼 영화 받아오기기
def recommend(user_genre):
	
	user_genre = convert_genre_to_id(user_genre) # {action : 2} -> {28: 2}
	discover, movie = init_tmdb()
	recommendation = []

	# user_genre를 순회하며 영화 받아오기
	for id, cnt in user_genre.items():
		print(id, cnt)
		sort_by = ['popularity.desc', 'revenue.desc', 'vote_average.desc', 'vote_count.desc']
		page = None

		# tmdb에서 장르로 영화 검색한 결과
		response = discover.discover_movies({'with_genres' : id, 'sort_by' : 'popularity.desc', 'page' : 1})
		results = response['results']
		results = list(results)

		print(len(results))
		# 장르의 cnt만큼 영화 추가
		for i in range(cnt):
			result = results[i]
			movie_model = response_model() # response_model 불러오기

			# result 보완하는 부분
			add_runtime_credits(result)
			convert_id_to_genre(result)

			# result를 순회하며 response_model 작성
			for key in result.keys(): # dict를 순회하면 key 값을 반환한다!
				if key in movie_model:
					movie_model[key] = result[key]
			
			recommendation.append(movie_model)
		print(type(recommendation))
	return recommendation
