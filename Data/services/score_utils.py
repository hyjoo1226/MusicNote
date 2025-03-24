# analysis_server/services/score_utils.py
from modelschemas.request_response import AudioFeatures, MusicScore


def calculate_music_score(features: AudioFeatures) -> MusicScore:
    """
    Spotify Audio Features → MUSIC 모델 5차원 점수 변환 함수
    :param features: valence, acousticness, instrumentalness, etc.
    :return: MUSIC 5차원 점수 (dict)
    """
    mellow = 0.4 * features.get('valence', 0) + \
             0.3 * features.get('acousticness', 0) + \
             0.3 * features.get('instrumentalness', 0)

    unpretentious = 0.4 * features.get('acousticness', 0) + \
                    0.3 * features.get('speechiness', 0) + \
                    0.3 * features.get('liveness', 0)

    sophisticated = 0.4 * features.get('tempo', 0) + \
                    0.3 * features.get('instrumentalness', 0) + \
                    0.3 * features.get('time_signature', 0)

    intense = 0.5 * features.get('energy', 0) + \
              0.3 * features.get('loudness', 0) + \
              0.2 * features.get('tempo', 0)

    contemporary = 0.4 * features.get('danceability', 0) + \
                   0.3 * features.get('speechiness', 0) + \
                   0.3 * features.get('energy', 0)

    return MusicScore(mellow = round(mellow, 4),
                      unpretentious = round(unpretentious, 4),
                      sophisticated = round(sophisticated, 4),
                      intense = round(intense, 4),
                      contemporary = round(contemporary, 4))
