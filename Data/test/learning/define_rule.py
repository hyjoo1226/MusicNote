import pandas as pd

def classify_personality(df):
    """성격 특성에 따라 사용자를 분류하는 함수"""
    big_five_columns = ['openness', 'agreeableness', 'emotional_stability', 
                       'conscientiousness', 'extraversion']
    
    df['dominant_trait'] = df[big_five_columns].apply(lambda row: row.idxmax(), axis=1)
    return df

def calculate_genre_preferences(df, weights={1: -0.5, 2: -0.3, 3: 0.1, 4: 0.3, 5: 0.5}):
    """장르 선호도를 계산하는 함수"""
    # 가중치 점수 계산
    df['personalized_score'] = df['is_personalized'].map(weights)
    df['enjoy_score'] = df['enjoy_watching'].map(weights)
    df['total_score'] = df['personalized_score'] + df['enjoy_score']
    
    # 장르 컬럼 선택
    genre_columns = [col for col in df.columns if col.startswith('genre_')]
    
    # 각 군집별 선호도 계산
    cluster_preferences = {}
    for trait in df['dominant_trait'].unique():
        trait_data = df[df['dominant_trait'] == trait]
        genre_scores = {}
        
        for genre in genre_columns:
            genre_movies = trait_data[trait_data[genre] == 1]
            if len(genre_movies) > 0:
                avg_score = genre_movies['total_score'].mean()
                genre_scores[genre.replace('genre_', '')] = avg_score
        
        cluster_preferences[trait] = sorted(
            genre_scores.items(), 
            key=lambda x: x[1], 
            reverse=True
        )[:3]
    
    return cluster_preferences 