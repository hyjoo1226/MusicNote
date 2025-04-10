import requests
import json  # json 모듈 추가
import base64
import random
import asyncio
import aiohttp
from aiohttp.client_exceptions import ContentTypeError
'''
1. lastfm 곡 제목으로 api요청해서 -> 키워드로 노래 검색
2. response[0]의 "name"과 "artist".get("name")을 spotify request
3. spotify api response를 return
'''
class Spotify:
    # API 엔드포인트 및 키 (필요시 수정)
    def __init__(self, client, secret):
        self.client = client
        self.secret = secret
        self._access_token = None
        self._token_expiry = None

    async def get_access_token(self):
        if self._access_token:
            return self._access_token
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

        async with aiohttp.ClientSession() as session:
            async with session.post("https://accounts.spotify.com/api/token", headers=headers, data=data) as response:
                response_data = await response.json()
                self._access_token = response_data["access_token"]
                return self._access_token
    
    ## 에러처리
    async def request_with_retry(self, method, url, headers=None, params=None):
        async with aiohttp.ClientSession() as session:
            while True:
                async with session.request(method, url, headers=headers, params=params) as response:
                    if response.status == 429:
                        retry_after = int(response.headers.get("Retry-After", 1))
                        print(f"[Rate Limit] Sleeping for {retry_after} seconds")
                        await asyncio.sleep(retry_after)
                        continue  # 재시도

                    if response.status != 200:
                        text = await response.text()
                        print(f"[Error {response.status}] {text}")
                        return None

                    try:
                        return await response.json()
                    except ContentTypeError:
                        text = await response.text()
                        print(f"[ContentTypeError] Non-JSON response: {text}")
                        return None


    # 곡 제목과 아티스트트 이름으로 search
    async def search(self, name, artist):
        access_token = await self.get_access_token()
        # search 엔드포인트
        url = "https://api.spotify.com/v1/search"
        headers = {"Authorization": f"Bearer {access_token}"}
        params = {
            "q" : f"{name} {artist}",
            "type" : "track",
            "market" : "KR"
        }

        # API 요청 보내기
        return await self.request_with_retry("GET", url, headers=headers, params=params)

        # 응답 데이터 처리
        # if response.status_code == 200:
        #     print(json.dumps(data, indent=4, ensure_ascii=False, sort_keys=True))
        # else:
        #     print(f"Search Error {response.status_code}: {response.text}")  # 오류 메시지 출력

        return data

    # 곡 제목이 없을때 임의 앨범 써치치
    async def searchNone(self):
        offset = random.randint(1,100)
        access_token = await self.get_access_token()
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
        return await self.request_with_retry("GET", url, headers=headers, params=params)

        # if response.status_code == 200:
        #     # 이쁘게 출력하기
        #     print(json.dumps(data, indent=4, ensure_ascii=False, sort_keys=True))
        # else:
        #     print(f"SearchNone Error {response.status_code}: {response.text}")  # 오류 메시지 출력
        
        return data
    
    # 앨범 수록곡 써치
    async def get_album_tracks(self, album_id):
        access_token = await self.get_access_token()
        # search 엔드포인트
        url = f"https://api.spotify.com/v1/albums/{album_id}/tracks"
        headers = {"Authorization": f"Bearer {access_token}"}
        params = {"market" : "KR"}

        # API 요청 보내기
        return await self.request_with_retry("GET", url, headers=headers, params=params)

    
