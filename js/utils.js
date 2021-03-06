// Dictionary to keep values of valence and arousal for the Musicovery request
var valence_arousal_dict = {
      'ANGRY': [getRandRange(600000, 900000), getRandRange(700000, 950000)],
      'DISGUST': [getRandRange(100000, 300000), getRandRange(300000, 500000)],
      'FEAR': [getRandRange(400000, 600000), getRandRange(700000, 900000)],
      'HAPPY': [getRandRange(850000, 1000000), getRandRange(700000, 1000000)],
      'SAD': [getRandRange(50000, 200000), getRandRange(50000, 300000)],
      'SURPRISE': [getRandRange(500000, 800000), getRandRange(800000, 1000000)],
      'NEUTRAL': [getRandRange(300000, 700000), getRandRange(400000, 700000)]
};


// helper functions

/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           return window.setTimeout(callback, 1000/60);
         };
})();

/**
 * Provides cancelRequestAnimationFrame in a cross browser way.
 */
window.cancelRequestAnimFrame = (function() {
  return window.cancelAnimationFrame ||
         window.webkitCancelRequestAnimationFrame ||
         window.mozCancelRequestAnimationFrame ||
         window.oCancelRequestAnimationFrame ||
         window.msCancelRequestAnimationFrame ||
         window.clearTimeout;
})();

// video support utility functions
function supports_video() {
  return !!document.createElement('video').canPlayType;
}

function supports_h264_baseline_video() {
  if (!supports_video()) { return false; }
  var v = document.createElement("video");
  return v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
}

function supports_webm_video() {
  if (!supports_video()) { return false; }
  var v = document.createElement("video");
  return v.canPlayType('video/webm; codecs="vp8"');
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
