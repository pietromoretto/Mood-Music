var valence_arousal_dict = {
    'ANGRY': [getRandRange(600000, 900000), getRandRange(700000, 950000)],
    'DISGUST': [getRandRange(100000, 300000), getRandRange(300000, 500000)],
    'FEAR': [getRandRange(400000, 600000), getRandRange(700000, 900000)],
    'HAPPY': [getRandRange(850000, 1000000), getRandRange(700000, 1000000)],
    'SAD': [getRandRange(50000, 200000), getRandRange(50000, 300000)],
    'SURPRISE': [getRandRange(500000, 800000), getRandRange(800000, 1000000)],
    'NEUTRAL': [getRandRange(300000, 700000), getRandRange(400000, 700000)]
};
var result = document.getElementById('result');


function getTracksInfo() {
  // Make request to Musicovery with custom values of valence and arousal
  var req = 'https://cors.io/?http://musicovery.com/api/V5/playlist.php?&fct=getfrommood&popularitymax=100&popularitymin=0&trackvalence=' + valence_arousal_dict[emotion][0] + '&trackarousal=' + valence_arousal_dict[emotion][1] + '&resultsnumber=15&format=json';
  //var ur='https://cors.io/?http://musicovery.com/api/V5/playlist.php?&fct=getfrommood&popularitymax=100&popularitymin=50&starttrackid=&date70=true&trackvalence=900000&trackarousal=100000&resultsnumber=15&listenercountry=es&format=json';

  httpGetAsync(req, function(data){
      // Throw away first 190 characters to read correctly the JSON file
      var data = JSON.parse(data.substring(190));

      var tracks = data.root.tracks.track;
      tracks.forEach(function(track) {
        result.innerHTML += '<div class="divider"></div>';
        var section = document.createElement('div');
        section.classList.add('section');
        section.innerHTML = '<a><b>' + track.title + '</b> - ' + track.artist.name + '</a>';
        result.appendChild(section);
        //console.log(track.title + ' ' + track.artist.name);
      });
  });
}

function httpGetAsync(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
          document.getElementById('loader').classList.add('hide');
          callback(xmlHttp.responseText);
        }
    };
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send();
}


function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
}
