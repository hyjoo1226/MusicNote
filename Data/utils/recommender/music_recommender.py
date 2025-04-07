import os
import sys
from dotenv import load_dotenv
from modelschemas.request_response import BigFiveScore
from utils.music.lastfm_request import bf_to_track
from utils.music.spotify_search import Spotify
from utils.music.get_tracks import get_random_track, search_track


class MusicRecommender:
    def __init__(self):
        pass

    def recommend_musics_from_bigfive(self, bigfive: BigFiveScore):
        load_dotenv()
        user_score = [
            bigfive.openness,
            bigfive.conscientiousness,
            bigfive.extraversion,
            bigfive.agreeableness,
            1 - bigfive.neuroticism  # stability로 변환
        ]
        lastfm_key = os.getenv("LASTFM_API_KEY")
        tracks = bf_to_track(lastfm_key, user_score)
        print(1)
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
                song = search_track(spotify, name=track["name"], artist=track["artist"])
                print(type(song.get("release_date")))
                results.append(song)
            else: # track 추천결과가 없을때 임의추천
                song = get_random_track(spotify, cnt=cnt)
                results.append(song)

            cnt += 1
        # print(results)
        return(results)
    

if __name__ == "__main__":
    recommender = MusicRecommender()
    bf_score = BigFiveScore(
    openness=0.2,
    conscientiousness=0.4,
    extraversion=0.5,
    agreeableness=0.7,
    neuroticism=0.2
)
    results = recommender.recommend_musics_from_bigfive(bf_score)
    print(results)
    print(len(results))
