import json
import os
from datetime import datetime
from utils.music.lastfm_request import bf_to_track
from dotenv import load_dotenv
from utils.music.spotify_search import Spotify

def init_model():
    model = {
        "id": None,
        "track_name": None,
        "artist_name": None,
        "albumcover_path": None,
        "release_date": None,
        "duration_ms" : None
    }
    return model

def get_random_track(spotify, cnt):
    '''
    bf 키워드에 매칭되는 트랙이 없을 경우
    파라미터에 tag:new를 적용해서 새로 발매한 앨범에서 곡 추출
    cnt를 통해 중복 방지
    '''
    # return할 모델 생성
    model = init_model()
    
    # 추천할 노래가 포함될 앨범 선정
    albums = spotify.searchNone(cnt)
    album = albums.get("albums", {}).get("items", {})[0]

    ## 앨범정보에서 발매일, 이미지 추출
    # 발매일 정보 입력
    
    model["release_date"] = album.get("release_date")
    # 이미지 640*640
    images = album.get("images")
    albumcover_path = images[0].get("url")
    model["albumcover_path"] = albumcover_path

    ## 모델의 나머지 정보 입력
    # 앨범 아이디로 앨범 수록곡 request
    album_id = album.get("id")
    # print(album_id)
    album_response = spotify.get_album_tracks(album_id=album_id)
    # print(album_response)
    result = album_response.get("items")[0]

    # 아티스트 정보 가공공
    artist_list = []
    artists = result.get("artists")
    for artist in artists:
        artist_list.append(artist.get("name"))
    artist_name = ", ".join(artist_list)
    # print(artist_name)
    # 모델에 정보 입력
    model["artist_name"] = artist_name
    model["duration_ms"] = result.get("duration_ms")
    model["id"] = result.get("id")
    model["track_name"] = result.get("name")

    return model

def search_track(spotify, name, artist):
    # 모델 생성
    model = init_model()
    # 쿼리를 통해 나온 제일 처음 노래 선정
    results = spotify.search(name=name, artist=artist)
    result = results.get("tracks", {}).get("items", {})[0]

    # 모델 각 속성에 값 채워넣기
    # 아티스트 이름생성
    artist_list = []
    artists = result.get("artists")
    for artist in artists:
        artist_list.append(artist.get("name"))
    artist_name = ", ".join(artist_list)

    # 앨범에서 발매일, 앨범커버
    album = result.get("album")
    images = album.get("images", {"url":None})

    # 발매일 자료형 date로 변환
    
    model["release_date"] = album.get("release_date") # yyyy-mm-dd

    # 나머지 정보 입력력
    model["id"] = result.get("id")
    model["track_name"] = result.get("name")
    model["artist_name"] = artist_name
    model["duration_ms"] = result.get("duration_ms")
    model["albumcover_path"] = images[0].get("url")

    return model