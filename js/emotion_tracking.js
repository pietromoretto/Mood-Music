// Setup of emotion detection

// set eigenvector 9 and 11 to not be regularized. This is to better detect motion of the eyebrows
pModel.shapeModel.nonRegularizedVectors.push(9);
pModel.shapeModel.nonRegularizedVectors.push(11);

var emotions = ['ANGRY', 'SAD', 'SURPRISED', 'HAPPY'];
var emotion = 'NEUTRAL';

var ctrack = new clm.tracker({useWebGL : true});
ctrack.init(pModel);

function startTracking() {
  // start video
  vid.play();
  // start tracking
  ctrack.start(vid);
  // start loop to detect emotion
  trackLoop();
}

function trackLoop() {
  requestAnimFrame(trackLoop);

  var cp = ctrack.getCurrentParameters();
  var er = ec.meanPredict(cp);

  if (er) {
    var max_er = -1;
    var max_index = -1;
    for (var i = 0; i < er.length;i++) {
      if(er[i].value > max_er){
        max_er = er[i].value;
        max_index = i;
      }
    }
    if(max_er > 0.43){
      emotion = emotions[max_index];
    } else {
      emotion = 'NEUTRAL';
    }
  }

  document.getElementById('real_emotion').innerHTML = emotion;
}

// exclude these two emotions
delete emotionModel['disgusted'];
delete emotionModel['fear'];

var ec = new emotionClassifier();
ec.init(emotionModel);
var emotionData = ec.getBlank();
