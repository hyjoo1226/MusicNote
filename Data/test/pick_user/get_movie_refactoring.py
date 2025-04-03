import json
import os

'''
userid 받아서 20개 장르 리스트
0. 유저별 장르 개수 json 로드
1. userid로 장르 개수 받음
2. 장르 개수 20개에 맞춰서 반환환
'''

# 유저별 장르 개수 데이터
# ex:{action:8, comedy:4, ...}
def load_json():
    currend_dir = os.path.dirname(__file__)
    path = "../dataset/user_genre_counts.json" # path 수정해야함!!!!
    file = os.path.join(currend_dir, path)
    with open(file, 'r') as f:
        return json.load(f)

def scaling_genre(user_genre, target_size=20):

    total = sum(user_genre.values()) # 해당 유저의 장르 총계계
    scaled_counts = {genre: round(count/total * target_size) for genre, count in user_genre.items()}
    scaled_sum = sum(scaled_counts.values()) # scaling 뒤의 총계계 (20개 내외)

    # 합계가 목표 크기와 다를 경우 조정
    if scaled_sum != target_size:
        diff = scaled_sum - target_size
        
        # 차가 크면 작은 것부터 정렬
        sorted_genres = sorted(scaled_counts.items(), key=lambda x: x[1], reverse=(diff > 0))
        
        for i in range(abs(diff)):
            genre = sorted_genres[i % len(sorted_genres)][0]
            # 차이가 0보다 작으면(20개 이하면) 장르 추가
            if diff < 0:
                scaled_counts[genre] += 1
            else:
                # 차이가 0보다 작으면(20개 이상이면) 줄여줌
                if scaled_counts[genre] > 1:    # 1개인 애는 제외하고 줄임임
                    scaled_counts[genre] -= 1
    
    return scaled_counts



# 장르 개수 20개로 스케일링
def user_genre(selected_user):

    # 선택된 유저의 장르 정보
    users_genre_data = load_json()
    user_genre = users_genre_data.get(selected_user)

    return scaling_genre(user_genre)
