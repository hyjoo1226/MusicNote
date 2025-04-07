import json
import os
from lastfm_request import bf_to_track
from dotenv import load_dotenv
from spotify_search import Spotify

'''
1. lastfm으로 받아온 트략에서
2. 트랙이 있을때 검색
3. 트랙이 없을때는 tag:new로 앨범 검색후 검색
4. 앨범 검색후 검색하는걸 함수로 만들어야겠다
'''

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

def get_random_track(cnt):
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
    # 발매일
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

def search_track(name, artist):
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

    model["id"] = result.get("id")
    model["track_name"] = result.get("name")
    model["artist_name"] = artist_name
    model["duration_ms"] = result.get("duration_ms")
    model["release_date"] = album.get("release_date")
    model["albumcover_path"] = images[0].get("url")

    return model



if __name__ == "__main__":
    load_dotenv()
    lastfm_key = os.getenv("LASTFM_API_KEY")
    print("lastfm_key : ", lastfm_key)
    tracks = bf_to_track(lastfm_key, [0.2, 0.4, 0.5, 0.7, 0.2])
    print(tracks)
    # tracks = [{'name': 'Rock For Sustainable Capitalism', 'artist': 'Propagandhi'},
    #     {'tag': 'new'},
    #     {'name': 'Abteilungsleiter der Liebe', 'artist': 'K.I.Z.'},
    #     {'name': 'Like Real People Do', 'artist': 'Hozier'},
    #     {'name': 'To Catch a Predator', 'artist': 'Insane Clown Posse'}]
    
    client = os.getenv("SPOTIFY_CLIENT")
    secret = os.getenv("SPOTIFY_SECRET")
    spotify = Spotify(client, secret)
    results = []
    cnt = 0

    for track in tracks:
        if len(track) == 2:
            song = search_track(track["name"], track["artist"])
            results.append(song)
        else: # track 추천결과가 없을때 임의추천
            song = get_random_track(cnt=cnt)
            results.append(song)

        cnt += 1

    print(results, len(results))

    # current_dir = os.path.dirname(__file__)
    # filename = os.path.join(current_dir, "spotify_tracks.json")
    # with open(filename, "w", encoding='utf-8') as f:
    #     json.dump(results, f, ensure_ascii=False)
        