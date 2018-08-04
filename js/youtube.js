var player;
function loadPlayer() {
  player = new YT.Player('player', {
    height: '480',
    width: '853',
    videoId: '',
    events: {
      'onReady': onPlayerReady,
    }
  });
}

function onPlayerReady(event) {
  event.target.loadPlaylist(tracksId.toString());
}


var tracksId = [];

function setVideoId(index, query) {
  var request = gapi.client.youtube.search.list({
    q: query,
    part: 'snippet',
    type: 'video',
    maxResults: '1',
    videoEmbeddable: 'true'
  });

  request.execute(function(response) {
    var videoId = response.result.items[0].id.videoId;
    tracksId.splice(index, 0, videoId);
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
