var vid = document.getElementById('camera-stream'),
  take_photo_btn = document.getElementById('take-photo'),
  start_camera = document.getElementById('start-camera'),
  error_message = document.getElementById('error-message');


function gumSuccess(stream) {
  // add camera stream if getUserMedia succeeded
  if("srcObject" in vid) {
    vid.srcObject = stream;
  } else {
    vid.src = (window.URL && window.URL.createObjectURL(stream));
  }
  vid.onloadedmetadata = function() {
    showVideo();
  }
}

function gumFail(err) {
  displayErrorMessage("There was an error with accessing the camera stream: " + err.name, err);
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

// check for camerasupport
if(navigator.mediaDevices) {
  navigator.mediaDevices.getUserMedia({video : true}).then(gumSuccess).catch(gumFail);
} else if(navigator.getUserMedia) {
  navigator.getUserMedia({video : true}, gumSuccess, gumFail);
} else {
  displayErrorMessage("This demo depends on getUserMedia, which your browser does not seem to support.");
}


function showVideo() {
  // Display the video stream and the controls.
  hideUI();

  vid.classList.remove("show-on-large");
  vid.classList.remove("hide");
  take_photo_btn.classList.remove("hide");

  startTracking();
}


function displayErrorMessage(error_msg, error) {
  error = error || "";
  if(error){
    console.log(error);
  }

  error_message.innerHTML = error_msg;

  hideUI();
  error_message.classList.remove("hide");
}


function hideUI(){
  // Helper function for clearing the app UI.
  take_photo_btn.classList.add("hide");
  start_camera.classList.add("hide");
  vid.classList.add("hide");
  error_message.classList.add("hide");
}


// Mobile browsers cannot play video without user input,
// so here we're using a button to start it manually.
start_camera.addEventListener("click", function(e) {
  e.preventDefault();

  start_camera.classList.add("hide");
  vid.classList.remove("show-on-large");

  showVideo();
});


take_photo_btn.addEventListener("click", function(e) {
  e.preventDefault();

  ctrack.stop();
  vid.pause();
  take_photo_btn.classList.add('hide');
  document.getElementById('index').classList.add('hide');
  document.getElementById('result').classList.remove('hide');
  getTracksInfo();
});
