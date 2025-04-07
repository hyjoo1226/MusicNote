import requests
import json
import os, sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from .lastfm_request import random_keyword

'''
'''

class LastFM:

    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = "http://ws.audioscrobbler.com/2.0/"

    def get_tag_top_tracks(self, tag, limit=10, page=1):
        params = {
            'method': 'tag.gettoptracks',
            'tag' : tag,
            'api_key': self.api_key,
            'limit': limit,
            'format': 'json'
        }

        response = requests.get(self.base_url, params=params)
        return response.json()
    


def get_track_info():
    songs = LastFM('2a7fc3ba6a9a3fb4e5216e237b40e1b1')
    tag_list = random_keyword()
    results = []
    for tags in tag_list:
        for tag in tags:
            result = songs.get_tag_top_tracks(tag)
            results.append(result)
    current_dir = os.path.dirname(__file__)
    filename = os.path.join(current_dir, "resulits.json")
    with open(filename, "w", encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False)
