import pandas as pd


# CSV 파일 읽기
df = pd.read_csv('personality-isf2018/personality-data.csv')
df.columns = df.columns.str.strip()
print(df.columns)
# 조건에 맞는 데이터 필터링
filtered_df = df[
    (df['is_personalized'].isin([4, 5])) & 
    (df['enjoy_watching'].isin([4, 5]))
]

# 결과 출력
print(f"필터링된 행의 수: {len(filtered_df)}")

# movies.csv 읽기
movies_df = pd.read_csv('ml-32m/movies.csv')

# personality 데이터와 movies 데이터를 join하기 위해
# movie_1 ~ movie_12 컬럼을 하나의 컬럼으로 변환
melted_df = pd.melt(
    filtered_df,
    id_vars=['userid', 'openness', 'agreeableness', 'emotional_stability', 
             'conscientiousness', 'extraversion', 'assigned metric',
             'assigned condition', 'is_personalized', 'enjoy_watching'],
    value_vars=['movie_1', 'movie_2', 'movie_3', 'movie_4', 'movie_5', 'movie_6',
                'movie_7', 'movie_8', 'movie_9', 'movie_10', 'movie_11', 'movie_12'],
    var_name='movie_number',
    value_name='movieId'
)

# predicted_rating 컬럼들도 같은 방식으로 변환
ratings_melted_df = pd.melt(
    filtered_df,
    id_vars=['userid'],
    value_vars=['predicted_rating_1', 'predicted_rating_2', 'predicted_rating_3', 
                'predicted_rating_4', 'predicted_rating_5', 'predicted_rating_6',
                'predicted_rating_7', 'predicted_rating_8', 'predicted_rating_9', 
                'predicted_rating_10', 'predicted_rating_11', 'predicted_rating_12'],
    var_name='rating_number',
    value_name='predicted_rating'
)

# rating_number에서 숫자만 추출하여 movie_number와 매칭할 수 있게 변환
ratings_melted_df['movie_number'] = 'movie_' + ratings_melted_df['rating_number'].str.extract('(\d+)')[0]

# melted_df와 ratings_melted_df를 병합
merged_df = melted_df.merge(ratings_melted_df[['userid', 'movie_number', 'predicted_rating']], 
                          on=['userid', 'movie_number'])

# movies 데이터와 join
final_df = merged_df.merge(movies_df, on='movieId', how='left')

# userid 순으로 정렬하고, 같은 userid 내에서는 movie_number 순으로 정렬
final_df_sorted = final_df.sort_values(['userid', 'movie_number'])

# 결과 확인
print("최종 데이터셋 크기:", final_df_sorted.shape)

# 결측치 제거하는 부분분
# 각 컬럼별 빈 값 개수 확인
print("컬럼별 빈 값 개수:")
print(final_df_sorted.isnull().sum())

# 전체 행 개수 확인
print("\n전체 행 개수:", len(final_df_sorted))

# 빈 값이 있는 행 제거
final_df_clean = final_df_sorted.dropna()

# 제거 후 행 개수 확인
print("\n빈 값 제거 후 행 개수:", len(final_df_clean))


from sklearn.preprocessing import MultiLabelBinarizer

# 장르를 리스트로 변환
genres_list = final_df_clean['genres'].str.split('|') # 개별 장르가 pandas Series로 변환됨

# MultiLabelBinarizer 적용
mlb = MultiLabelBinarizer()
genres_encoded = mlb.fit_transform(genres_list) # 알아서 변환됨?

# 결과를 데이터프레임으로 변환하여 원본에 추가
# 컬럼명에 'genre_' 접두어 추가
genre_columns = [f'genre_{genre}' for genre in mlb.classes_]
genres_df = pd.DataFrame(genres_encoded, columns=genre_columns, index=final_df_clean.index) # genres_df_clean과 index 일치
print(genres_df.head(), final_df_clean.head())

# 원본 데이터와 합치기
final_df_encoded = pd.concat([final_df_clean.drop('genres', axis=1), genres_df], axis=1)

# 결과 확인
print("\n전체 장르 개수:", len(genre_columns))
print("\n장르 목록:", genre_columns)
print("\n데이터 크기:", final_df_encoded.shape)

# 전체 장르의 출현 빈도 계산
genre_counts = {}
for genres in movies_df['genres'].str.split('|'):
    if isinstance(genres, list):  # None 체크
        for genre in genres:
            genre_counts[genre] = genre_counts.get(genre, 0) + 1

# 빈도수를 데이터프레임으로 변환하여 확인
genre_freq_df = pd.DataFrame.from_dict(genre_counts, orient='index', columns=['count'])
genre_freq_df = genre_freq_df.sort_values('count', ascending=False)

# 빈도수 출력
print("장르별 출현 빈도:")
print(genre_freq_df)

# 임계값 설정 (예: 전체 영화의 1%미만으로 등장하는 장르를 Other로 묶기)
threshold = len(movies_df) * 0.01  # 1% 임계값
rare_genres = genre_freq_df[genre_freq_df['count'] < threshold].index.tolist()
print(f"\n{threshold}회 미만 출현하는 장르들 (Other로 묶일 장르들):")
print(rare_genres)

# genres 컬럼의 데이터를 수정하는 함수
def combine_rare_genres(genres_str):
    if pd.isna(genres_str):
        return genres_str
    genres = genres_str.split('|')
    # 빈도가 낮은 장르는 'Other'로 변경
    genres = ['Other' if g in rare_genres else g for g in genres]
    # 중복 제거 (여러 개의 rare genre가 하나의 Other로 변경되었을 수 있으므로)
    genres = list(dict.fromkeys(genres))
    return '|'.join(genres)

# 데이터에 적용
final_df_clean = final_df_clean.copy()
final_df_clean['genres_modified'] = final_df_clean['genres'].apply(combine_rare_genres)

# MultiLabelBinarizer 적용
genres_list_modified = final_df_clean['genres_modified'].str.split('|')
mlb = MultiLabelBinarizer()
genres_encoded = mlb.fit_transform(genres_list_modified)

# 결과를 데이터프레임으로 변환
genre_columns = [f'genre_{genre}' for genre in mlb.classes_]
genres_df = pd.DataFrame(genres_encoded, columns=genre_columns, index=final_df_clean.index) # 밑에 합칠 final_df_clean과 인덱스 일치치  

# 원본 데이터와 합치기
final_df_encoded = pd.concat([final_df_clean.drop(['genres', 'genres_modified'], axis=1), genres_df], axis=1)

# 결과 확인
print("\n변환 후 장르 개수:", len(genre_columns))
print("\n최종 장르 목록:", genre_columns)
print("\n데이터 크기:", final_df_encoded.shape)

final_df_encoded.to_csv('useful_data.csv')