import pandas as pd
from sklearn.preprocessing import MultiLabelBinarizer

def merge_dataframes(melted_df, ratings_melted_df, movies_df):
    """데이터프레임들을 병합하는 함수"""
    # melted_df와 ratings_melted_df 병합
    merged_df = melted_df.merge(
        ratings_melted_df[['userid', 'movie_number', 'predicted_rating']], 
        on=['userid', 'movie_number']
    )
    
    # movies 데이터와 병합
    final_df = merged_df.merge(movies_df, on='movieId', how='left')
    return final_df.sort_values(['userid', 'movie_number'])

def process_genres(final_df_clean, movies_df, threshold_percent=0.01):
    """장르 데이터를 처리하는 함수"""
    # 장르 빈도 계산
    genre_counts = {}
    for genres in movies_df['genres'].str.split('|'):
        if isinstance(genres, list):
            for genre in genres:
                genre_counts[genre] = genre_counts.get(genre, 0) + 1
    
    # 희귀 장르 처리
    threshold = len(movies_df) * threshold_percent
    rare_genres = [genre for genre, count in genre_counts.items() if count < threshold]
    
    # 장르 수정
    final_df_clean = final_df_clean.copy()
    final_df_clean['genres_modified'] = final_df_clean['genres'].apply(
        lambda x: '|'.join(list(dict.fromkeys(['Other' if g in rare_genres else g for g in x.split('|')]))) if pd.notna(x) else x
    )
    
    # 장르 인코딩
    mlb = MultiLabelBinarizer()
    genres_encoded = mlb.fit_transform(final_df_clean['genres_modified'].str.split('|'))
    genre_columns = [f'genre_{genre}' for genre in mlb.classes_]
    genres_df = pd.DataFrame(genres_encoded, columns=genre_columns, index=final_df_clean.index)
    
    return pd.concat([final_df_clean.drop(['genres', 'genres_modified'], axis=1), genres_df], axis=1)
