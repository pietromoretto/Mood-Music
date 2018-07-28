import urllib.request
import json
import collections
from random import randrange as rr

valence_arousal_dict = {
    'ANGRY': [rr(600000, 900000), rr(700000, 950000)],
    'DISGUST': [rr(100000, 300000), rr(300000, 500000)],
    'FEAR': [rr(400000, 600000), rr(700000, 900000)],
    'HAPPY': [rr(850000, 1000000), rr(700000, 1000000)],
    'SAD': [rr(50000, 200000), rr(50000, 300000)],
    'SURPRISE': [rr(500000, 800000), rr(800000, 1000000)],
    'NEUTRAL': [rr(300000, 700000), rr(400000, 700000)]
}


def get_tracks_info(emotion):
    # Make request to Musicovery with custom values of valence and arousal
    req = 'http://musicovery.com/api/V5/playlist.php?&fct=getfrommood&popularitymax=100&popularitymin=0&trackvalence={}&trackarousal={}&resultsnumber=15&format=json'.format(valence_arousal_dict[emotion][0], valence_arousal_dict[emotion][1])
    tracks_info = []

    with urllib.request.urlopen(req) as url:
        # Throw away first 190 characters to read correctly the JSON file
        data = json.loads(url.read()[190:].decode())

        tracks = data['root']['tracks']['track']
        for track in tracks:
            info = collections.OrderedDict()
            info['Title'] = track['title']
            info['Artist'] = track['artist']['name']
            info['Genre'] = track['genre']
            info['Release date'] = track['releasedate']
            tracks_info.append(info)

    return tracks_info
