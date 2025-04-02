from learning.data_loader import load_data, melt_personality_data
from learning.preprocessor import merge_dataframes, process_genres
from learning.define_rule import classify_personality, calculate_genre_preferences


def main():
    # 데이터 로드
    df, movies_df = load_data('personality-isf2018/personality-data.csv', 'ml-32m/movies.csv')
    
    # 데이터 재구성
    melted_df, ratings_melted_df = melt_personality_data(df)
    
    # 데이터프레임 병합
    final_df = merge_dataframes(melted_df, ratings_melted_df, movies_df)
    
    # 결측치 제거
    final_df_clean = final_df.dropna()
    
    # 장르 처리
    final_df_encoded = process_genres(final_df_clean, movies_df)
    
    # 성격 특성 분류
    final_df_encoded = classify_personality(final_df_encoded)
    
    # 장르 선호도 계산
    cluster_preferences = calculate_genre_preferences(final_df_encoded)
    
    # 결과 출력
    print("\n각 성격 특성 군집별 선호 장르 TOP 3:")
    for trait, genres in cluster_preferences.items():
        print(f"\n{trait}:")
        for genre, score in genres:
            print(f"- {genre}: {score:.3f}")
    
    # 결과 저장
    final_df_encoded.to_csv('useful_data.csv')

if __name__ == "__main__":
    main()
