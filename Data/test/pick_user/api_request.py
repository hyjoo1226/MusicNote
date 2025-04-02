from tmdbv3api import TMDb, Discover, Movie

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
	user_converted = dict()
	for genre, count in user_dict.items():
	# 바꾸는 값이 있으면 바꾸고, 없으면 그대로
		new_key = genre_list.get(genre, genre)
		user_converted[new_key] = count
	return user_converted

## 장르 횟수만큼 영화 받아오기기
def recommend(user_dict):
	user_dict = convert_genre_to_id(user_dict)
	recommendation = []
	discover, movie = init_tmdb()
	for id, cnt in user_dict.items():
		sort_by = ['popularity.desc', 'revenue.desc', 'vote_average.desc', 'vote_count.desc']
		page = None
		response = discover.discover_movies({'with_genres' : f'{id}', 'sort_by' : 'popularity.desc', 'page' : 1})
		results = response['results']
		# print(results)
		for i in range(cnt):
			recommendation.append(list(results)[i])
	
	return recommendation
