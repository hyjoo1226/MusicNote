import requests
import json  # json 모듈 추가
import base64
import random

'''
1. lastfm 곡 제목으로 api요청해서 -> 키워드로 노래 검색
2. response[0]의 "name"과 "artist".get("name")을 spotify로
3. spotify api 정보를 국회로
'''
class Spotify:
    # API 엔드포인트 및 키 (필요시 수정)
    def __init__(self, client, secret):
        self.client = client
        self.secret = secret

    def get_access_token(self):
        client_id = self.client
        client_secret = self.secret

        # Step 1: 토큰 받기
        auth_str = f"{client_id}:{client_secret}"
        b64_auth_str = base64.b64encode(auth_str.encode()).decode()

        headers = {
            "Authorization": f"Basic {b64_auth_str}",
            "Content-Type": "application/x-www-form-urlencoded"
        }

        data = {
            "grant_type": "client_credentials"
        }

        response = requests.post("https://accounts.spotify.com/api/token", headers=headers, data=data)
        access_token = response.json()["access_token"]
        return access_token



    # 곡 제목과 아티스트트 이름으로 search
    def search(self, name, artist):
        access_token = self.get_access_token()
        # search 엔드포인트
        url = "https://api.spotify.com/v1/search"
        headers = {"Authorization": f"Bearer {access_token}"}
        params = {
            "q" : f"{name} {artist}",
            "type" : "track",
            "market" : "KR"
        }

        # API 요청 보내기
        response = requests.get(url, headers=headers, params=params)
        data = response.json()  # JSON 데이터 변환

        # 응답 데이터 처리
        # if response.status_code == 200:
        #     print(json.dumps(data, indent=4, ensure_ascii=False, sort_keys=True))
        # else:
        #     print(f"Search Error {response.status_code}: {response.text}")  # 오류 메시지 출력

        return data

    # 곡 제목이 없을때 임의 앨범 써치치
    def searchNone(self):
        offset = random.randint(1,100)
        access_token = self.get_access_token()
        # search 엔드포인트
        url = "https://api.spotify.com/v1/search"
        headers = {"Authorization": f"Bearer {access_token}"}
        params = {
            "q" : "tag:new",
            "type" : "album",
            "market" : "KR",
            'offset' : offset
        }

        # API 요청 보내기
        response = requests.get(url, headers=headers, params=params)
        data = response.json()  # JSON 데이터 변환

        # if response.status_code == 200:
        #     # 이쁘게 출력하기
        #     print(json.dumps(data, indent=4, ensure_ascii=False, sort_keys=True))
        # else:
        #     print(f"SearchNone Error {response.status_code}: {response.text}")  # 오류 메시지 출력
        
        return data
    
    # 앨범 수록곡 써치
    def get_album_tracks(self, album_id):
        access_token = self.get_access_token()
        # search 엔드포인트
        url = f"https://api.spotify.com/v1/albums/{album_id}/tracks"
        headers = {"Authorization": f"Bearer {access_token}"}
        params = {"market" : "KR"}

        # API 요청 보내기
        response = requests.get(url, headers=headers, params=params)
        data = response.json()  # JSON 데이터 변환

        # if response.status_code == 200:
        #     # 이쁘게 출력하기
        #     print(json.dumps(data, indent=4, ensure_ascii=False, sort_keys=True))
        # else:
        #     print(f"get_album_tracks Error {response.status_code}: {response.text}")  # 오류 메시지 출력
        
        return data
