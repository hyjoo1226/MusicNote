import pandas as pd

def load_data(personality_path, movies_path):
    """데이터 파일들을 로드하는 함수"""
    # personality 데이터 로드
    df = pd.read_csv(personality_path)
    df.columns = df.columns.str.strip()
    
    # movies 데이터 로드
    movies_df = pd.read_csv(movies_path)
    
    return df, movies_df

def melt_personality_data(df):
    """personality 데이터를 재구성하는 함수"""
    # movie 데이터 재구성
    melted_df = pd.melt(
        df,
        id_vars=['userid', 'openness', 'agreeableness', 'emotional_stability', 
                 'conscientiousness', 'extraversion', 'assigned metric',
                 'assigned condition', 'is_personalized', 'enjoy_watching'],
        value_vars=[f'movie_{i}' for i in range(1, 13)],
        var_name='movie_number',
        value_name='movieId'
    )
    
    # rating 데이터 재구성
    ratings_melted_df = pd.melt(
        df,
        id_vars=['userid'],
        value_vars=[f'predicted_rating_{i}' for i in range(1, 13)],
        var_name='rating_number',
        value_name='predicted_rating'
    )
    
    ratings_melted_df['movie_number'] = 'movie_' + ratings_melted_df['rating_number'].str.extract('(\d+)')[0]
    
    return melted_df, ratings_melted_df