import json
import pandas as pd
import os


# personality와 movies 불러오기
current_dir = os.getcwd() # current work directory?
file_path = "../dataset/personality-data.csv"
movie_path = "../dataset/movies.csv"

file = os.path.join(current_dir, file_path)
movie_file = os.path.join(current_dir, movie_path)

df = pd.read_csv(file)
movies = pd.read_csv(movie_file)

# 전처리
df.columns = df.columns.str.strip()
movies.columns = movies.columns.str.strip()

# enjoy_watching 1, 2 제거
df = df[~df['enjoy_watching'].isin([1, 2])]

# 1. user-movie 테이블 만들기
movie_cols = [f'movie_{i}' for i in range(1, 13)]
user_movie = df[['userid'] + movie_cols].copy()
user_movie['all_movies'] = user_movie[movie_cols].values.tolist()
user_movie = user_movie[['userid', 'all_movies']]

# 3. user별로 영화 ID 펼치기
user_movie = user_movie.explode('all_movies')
user_movie.rename(columns={'all_movies': 'movieId'}, inplace=True)
# print(user_movie.head(12))

# 4. 영화 ID를 기준으로 genres 조인
merged = pd.merge(user_movie, movies[['movieId', 'genres']], on='movieId', how='left')
merged = merged.dropna()
merged = merged[merged['genres'] != '(no genres listed)']
# print(merged)
# print(merged.isnull().sum())

# 5. genres를 split('|')해서 펼치고 → 유저별 Counter 생성
merged['genres'] = merged['genres'].str.split('|')
# print(merged['genres'].head())
# print(merged)

# Counter 대신 사용자, 장르 및 개수 열이 있는 새 DataFrame 생성
genre_df = merged.explode('genres')
user_genre_counts = genre_df.groupby(['userid', 'genres']).size().reset_index(name='count')

# 딕셔너리 형식으로 변환
user_genre_dict = {}
for userid, group in user_genre_counts.groupby('userid'):
    user_genre_dict[str(userid)] = {row['genres']: int(row['count']) for _, row in group.iterrows()}
print(user_genre_dict)

# JSON으로 저장
with open("user_genre_counts.json", "w") as f:
    json.dump(user_genre_dict, f)



# print(user_genre_counts)
# user_genre_counts 딕셔너리를 JSON 파일로 저장
# with open("user_genre_counts.json", "w") as f:
#     json.dump(user_genre_counts, f)
