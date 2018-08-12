var result = document.getElementById('tracks');
var tracksId = [];
var counter = 0;


function searchAndAddTrack(title, artist, genre, release_date) {
  var request = gapi.client.youtube.search.list({
    q: title + ' ' + artist,
    part: 'snippet',
    type: 'video',
    maxResults: '1'
  });

  request.execute(function(response) {
    var videoId = response.result.items[0].id.videoId;
    var thumbnail_url = response.result.items[0].snippet.thumbnails.default.url;

    if(videoId != undefined){
      // Add track
      result.innerHTML += '<div class="divider"></div>';
      var section = document.createElement('div');
      section.classList.add('section');

      section.innerHTML = '<img src="' + thumbnail_url + '"><br>';
      section.innerHTML += '<a target="_blank" href="' + 'https://www.youtube.com/watch?v=' + videoId + '"><b>' + title + '</b></a><br>';
      section.innerHTML += '<b>Artist: </b>' + artist + '<br><b>Genre: </b>' + genre + '<br><b>Release Date: </b>' + release_date;

      result.appendChild(section);

      tracksId.push(videoId);
    }

    counter += 1;

    // Add playlist at the end of elaboration due to asynchronous
    if(counter == result_number - 1)
      document.getElementById('playlist-container').innerHTML += '<a target="_blank" id="playlist-button" class="waves-effect waves-light red darken-3 btn" href="http://www.youtube.com/watch_videos?video_ids=' + tracksId.toString() + '">Listen to the playlist</a>';
  });
}


function start() {
  // Initialize the JavaScript client library
  gapi.client.init({
    'apiKey': 'AIzaSyDClfsX30RLcf-_0evPWzYwtWy0JBIzvOQ',
    'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
  });
}

function loadClient() {
  gapi.load('client', start);
}
