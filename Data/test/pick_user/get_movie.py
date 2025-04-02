import json
import os


def user_genre(selected_user, target_size=20):
    userid = selected_user

    current_dir = os.path.dirname(__file__)
    file_name = os.path.join(current_dir, "../dataset/user_genre_counts.json")
    
    with open(file_name, 'r') as f:
        genre_data = json.load(f)
    genre_counts  = genre_data.get(userid)
    total = sum(genre_counts.values())

    # 각 장르의 비율을 계산하여 목표 크기에 맞게 스케일링
    scaled_counts = {genre: round(count/total * target_size) for genre, count in genre_counts.items()}
    
    # 합계 확인
    current_sum = sum(scaled_counts.values())

    # 합계가 목표 크기와 다를 경우 조정
    if current_sum != target_size:
        diff = target_size - current_sum
        # 가장 수가 큰 장르부터 정렬렬
        sorted_genres = sorted(scaled_counts.items(), key=lambda x: x[1], reverse=(diff < 0))
        
        for i in range(abs(diff)):
            genre = sorted_genres[i % len(sorted_genres)][0]
            # 차이가 0보다 크면(20개 이하면) 장르 추가
            if diff > 0:
                scaled_counts[genre] += 1
            else:
                # 차이가 0보다 작으면(20개 이상이면) 줄여줌
                if scaled_counts[genre] > 1:
                    scaled_counts[genre] -= 1
    
    return scaled_counts
