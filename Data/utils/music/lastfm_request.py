import sys
import os
# import random
import requests, json
from dotenv import load_dotenv
# Jobrecommender import하기 위해 상위 폴더 경로를 sys.path애 추가가
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from utils.recommender.job_recommender import JobRecommender

# bf 점수로 키워드 생성성
def keyword_extractor(bf_score):
    keywordmaker = JobRecommender()
    return  keywordmaker.get_keywords_from_bigfive(bf_score)

# 테스트용 랜덤 키워드 생성기
# def random_keyword():
#     scores = [[random.uniform(0, 1) for _ in range(5)] for _ in range(5)]
#     keywords = []
#     for score in scores:
#         keyword = keyword_extractor(score)
#         keywords.append(keyword)    
#     return keywords

# lastfm api 요청 코드드
def lastfm_request(tag, api_key, limit=50, page=1):
    url = "http://ws.audioscrobbler.com/2.0/"

    params = {
        'method' : 'tag.gettoptracks',
        'tag' : tag,
        'limit' : limit,
        'page' : page,
        'api_key' : api_key,
        'format' : 'json'
    }

    response = requests.get(url, params=params)
    return response.json()

# 요청 받은 정보에서 곡, 아티스트 이름 추출출
def extract_track_info(results, response):
    try:
        idx = 0
        result = response.get("tracks", {}).get("track", {})[idx]
        # 중복방지
        target_key = "name"
        target_value = result.get("name")

        # 각 딕셔너리에서 특정 키-값 쌍이 존재하는지 확인
        for d in results:
            if d.get(target_key) == target_value:
                idx += 1
                result = response.get("tracks", {}).get("track", {})[idx]

        try:
            name = result["name"]
            artist = result["artist"]["name"]
        except KeyError:
            print("키워드에 해당하는 곡이 없습니다!")
            name = None
            artist = None
        track_info = {"name" : name, "artist" : artist}
    except:
        track_info = {"tag" : "new"}
    return track_info

# bf -> 곡 전환하는 최종 함수수
def bf_to_track(api_key, bf_score):
    # tag_list = random_keyword()
    bf_tags = keyword_extractor(bf_score)
    print(bf_tags)
    results = []
    for tag in bf_tags:
        response = lastfm_request(tag, api_key=api_key)
        track_info = extract_track_info(results, response)
        results.append(track_info)

    # current_dir = os.path.dirname(__file__)
    # filename = os.path.join(current_dir, "resulits.json")
    # with open(filename, "w", encoding='utf-8') as f:
    #     json.dump(results, f, ensure_ascii=False)
    return results


if __name__ == "__main__":
    load_dotenv()
    bf_score = [0.26, 0.41, 0.68, 0.42, 0.18]
    api_key = os.getenv("LASTFM_API_KEY")
    results = bf_to_track(api_key, bf_score)
    print(results)
    print(len(results))
