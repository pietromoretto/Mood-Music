from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from .emotion_recognition import emotion_recognition
from .tracks_info import get_tracks_info
from django.conf import settings
import os

# Global variable to solve problems with value due to multiple renderings
emotion = ""
tracks_info = []


def index(request):
    return render(request, 'mood_music/index.html')


@csrf_exempt
def result(request):
    global emotion, tracks_info
    if request.method == 'POST' and request.FILES['snapshot']:
        snapshot = request.FILES['snapshot']
        fs = FileSystemStorage()

        # Save file with hours, minutes, seconds, milliseconds (first 3 digits)
        filename = fs.save('snap-' + datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')[:-3], snapshot)
        filepath = os.path.join(settings.BASE_DIR, 'media', filename)

        emotion = emotion_recognition(filepath)

        if os.path.exists(filepath):
            os.remove(filepath)

        tracks_info = get_tracks_info(emotion)

    context = {
        'emotion': emotion,
        'tracks_info': tracks_info
    }
    return render(request, 'mood_music/result.html', context)
