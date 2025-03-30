import json

userid = '022bd2b0584bbf5e4c2d85ed60b3fa16'

file_name = "user_genre_counts.json"
with open(file_name, 'r') as f:
    user_genre_counts = json.load(f)


# 유저의 장르 정보를 확률로 반환
# def user_genre(portion):
#     how_many_genre = dict()
#     total = sum(portion.values())
#     for genre, genre_cnt in portion.items():
#         count = round(genre_cnt/total*20)
#         how_many_genre[genre] = count
#     return how_many_genre

def user_genre(genre_counts, target_size=20):
    total = sum(genre_counts.values())
    # 각 장르의 비율을 계산하여 목표 크기에 맞게 스케일링
    scaled_counts = {genre: round(count/total * target_size) for genre, count in genre_counts.items()}
    
    # 합계 확인
    current_sum = sum(scaled_counts.values())
    
    # 합계가 목표 크기와 다를 경우 조정
    if current_sum != target_size:
        diff = target_size - current_sum
        # 가장 적은은 장르부터 조정
        sorted_genres = sorted(scaled_counts.items(), key=lambda x: x[1], reverse=(diff > 0))
        
        for i in range(abs(diff)):
            genre = sorted_genres[i % len(sorted_genres)][0]
            if diff > 0:
                scaled_counts[genre] += 1
            else:
                # 0보다 작아지지 않도록 주의
                if scaled_counts[genre] > 0:
                    scaled_counts[genre] -= 1
    
    return scaled_counts

genre_portion = user_genre_counts.get(userid)
print(genre_portion)

result = user_genre(genre_portion)
print(result)