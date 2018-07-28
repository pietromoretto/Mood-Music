// References to all the element we will need.
var video = document.querySelector('#camera-stream'),
    image = document.querySelector('#snap'),
    start_camera = document.querySelector('#start-camera'),
    controls = document.querySelector('#controls'),
    take_photo_btn = document.querySelector('#take-photo'),
    delete_photo_btn = document.querySelector('#delete-photo'),
    upload_photo_btn = document.querySelector('#upload-photo'),
    error_message = document.querySelector('#error-message');


// Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}


// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function(constraints) {

    // First get ahold of the legacy getUserMedia, if present
    var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // Some browsers just don't implement it - return a rejected promise with an error
    // to keep a consistent interface
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }

    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise(function(resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
}


navigator.mediaDevices.getUserMedia({ video: true })
.then(function(stream) {
  // Older browsers may not have srcObject
  if ("srcObject" in video) {
    video.srcObject = stream;
  } else {
    // Avoid using this in new browsers, as it is going away.
    video.src = window.URL.createObjectURL(stream);
  }
  video.onloadedmetadata = function(e) {
    video.play();
    video.onplay = function() {
      showVideo();
    };
  };
})
.catch(function(err) {
  displayErrorMessage("There was an error with accessing the camera stream: " + err.name, err);
  //console.log(err.name + ": " + err.message);
});


// Mobile browsers cannot play video without user input,
// so here we're using a button to start it manually.
start_camera.addEventListener("click", function(e){
  e.preventDefault();

  start_camera.classList.add("hide");
  video.classList.remove("show-on-large");
  // Start video playback manually.
  video.play();
  showVideo();

});


take_photo_btn.addEventListener("click", function(e){
  e.preventDefault();

  var snap = takeSnapshot();

  // Show image.
  image.setAttribute('src', snap);
  //image.classList.remove("hide");

  // Enable delete and save buttons
  delete_photo_btn.classList.remove("disabled");
  upload_photo_btn.classList.remove("disabled");

  // Set the href attribute of the download button to the snap url.
  //upload_photo_btn.href = snap;

  // Pause video playback of stream.
  video.pause();

});


delete_photo_btn.addEventListener("click", function(e){
  e.preventDefault();

  // Hide image.
  image.setAttribute('src', "");
  image.classList.add("hide");

  // Disable delete and save buttons
  delete_photo_btn.classList.add("disabled");
  upload_photo_btn.classList.add("disabled");

  // Resume playback of stream.
  video.play();

});


upload_photo_btn.addEventListener("click", function(e){
  e.preventDefault();

  var url = "/result"
  var base64Src = snap.getAttribute("src");
  var base64ImageContent = base64Src.replace(/^data:image\/(png|jpg);base64,/, "");
  var blob = base64ToBlob(base64ImageContent, 'image/png');
  var formData = new FormData();
  formData.append('snapshot', blob);

  $.ajax({
    url: url,
    type: "POST",
    cache: false,
    contentType: false,
    processData: false,
    enctype: 'multipart/form-data',
    data: formData
  }).done(function(e){
      console.log('done!');
      document.location.href = url;
  });
});


function showVideo(){
  // Display the video stream and the controls.
  hideUI();
  video.classList.remove("show-on-large");
  video.classList.remove("hide");
  controls.classList.remove("hide");
}


function takeSnapshot(){
  // Here we're using a trick that involves a hidden canvas element.
  var hidden_canvas = document.querySelector('canvas'),
      context = hidden_canvas.getContext('2d');

  var width = video.videoWidth,
      height = video.videoHeight;

  if (width && height) {

    // Setup a canvas with the same dimensions as the video.
    hidden_canvas.width = width;
    hidden_canvas.height = height;

    // Make a copy of the current frame in the video on the canvas.
    context.drawImage(video, 0, 0, width, height);

    // Turn the canvas image into a dataURL that can be used as a src for our photo.
    return hidden_canvas.toDataURL('image/png');
  }
}


function displayErrorMessage(error_msg, error){
  error = error || "";
  if(error){
    console.log(error);
  }

  error_message.innerText = error_msg;

  hideUI();
  error_message.classList.remove("hide");
}


function hideUI(){
  // Helper function for clearing the app UI.
  controls.classList.add("hide");
  start_camera.classList.add("hide");
  video.classList.add("hide");
  snap.classList.add("hide");
  error_message.classList.add("hide");
}


function base64ToBlob(base64, mime){
    // Helper function to convert a base64 image to Blob
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        var slice = byteChars.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: mime});
}
