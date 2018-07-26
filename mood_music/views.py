from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime


def index(request):
    return render(request, 'mood_music/index.html')


@csrf_exempt
def result(request):
    if request.method == 'POST' and request.FILES['snapshot']:
        snapshot = request.FILES['snapshot']
        fs = FileSystemStorage()
        filename = fs.save('snap-'+datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')[:-3], snapshot)
        print(filename)
    return render(request, 'mood_music/result.html')
