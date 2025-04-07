import datetime

from modelschemas.request_response import BigFiveScore, Music, MusicList


class MusicRecommender:
    def __init__(self):
        pass

    def recommend_musics_from_bigfive(self, bigfive: BigFiveScore):
        music_list = list()
        music_list.append(Music(id=10597,
                     track_name="기운이가 고칠거에요",
                     artist_name="남기운",
                     albumcover_path="https://i.am.namgiun/image/giunbabo",
                     release_date=datetime.date(year=2025, month=5, day=1),
                     popularity=99))
        music_list.append(Music(id=10597,
                     track_name="기운이한테 문의하세요",
                     artist_name="남기운기운기운",
                     albumcover_path="https://i.am.namgiun/image/giunbabo",
                     release_date=datetime.date(year=2510, month=5, day=1),
                     popularity=99))
        return MusicList(musics=music_list)