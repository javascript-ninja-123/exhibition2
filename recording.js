  function __log(e, data) {
      log.innerHTML += "\n" + e + " " + (data || '');
  }

  var audio_context;
  var recorder;

  function startUserMedia(stream) {
      var input = audio_context.createMediaStreamSource(stream);
      __log('Media stream created.');

      // Uncomment if you want the audio to feedback directly
      //input.connect(audio_context.destination);
      //__log('Input connected to audio context destination.');

      recorder = new Recorder(input);
      __log('Recorder initialised.');
  }

  function startRecording(button) {
      recorder && recorder.record();
      button.disabled = true;
      button.nextElementSibling.disabled = false;
      __log('Recording...');
      //   saveLocalStoragetoArray();
  }

  function stopRecording(button) {
      recorder && recorder.stop();
      button.disabled = true;
      button.previousElementSibling.disabled = false;
      __log('Stopped recording.');
      createHTML();
      recorder.clear();
  }

  function playRecording(button) {
      let item = document.querySelector('#recordingslist');
      item.firstChild.querySelector('.audio').play();
  }



  function saveitToFireBase(button) {
      let item = document.querySelector('#recordingslist');
      let firebaseRef = firebase.database().ref();
      let data = {
          name: 'sound',
          src: item.firstChild.querySelector('.audio').getAttribute('src')
      }
      firebaseRef.push(data);
      fetchDataformFireBase();
  }

  function saveitToFireBaseStorage() {
      let file = e.target.files[0];
      let storageRef = firebase.storage().ref('/sound/' + file.name);
      storageRef.put(file);
      console.log(file)

  }




  function fetchDataformFireBase() {
      let ref = firebase.database().ref();
      ref.on('value', data => {
          let newSound = data.val();
          let keys = Object.keys(newSound);
          //   console.log(`src is ${newSound.src}`);
          var result = keys.filter(value => {
              return (value === keys[keys.length - 1])
          })
          for (var sound in newSound) {
              if (sound == result) {
                  console.log(`The most recent sound src is ${newSound[sound].src}`);
              }
          }
      })
  }

  function createHTML() {
      recorder && recorder.exportWAV(function(blob) {
          var url = URL.createObjectURL(blob);
          let li = `<li><audio controls src='${url}' class='audio'></audio></li>`;
          recordingslist.insertAdjacentHTML('afterbegin', li)
      });
  }


  window.onload = function init() {
      try {
          // webkit shim
          window.AudioContext = window.AudioContext || window.webkitAudioContext;
          navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
          window.URL = window.URL || window.webkitURL;

          audio_context = new AudioContext;
          __log('Audio context set up.');
          __log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
      } catch (e) {
          alert('No web audio support in this browser!');
      }

      navigator.getUserMedia({ audio: true }, startUserMedia, function(e) {
          __log('No live audio input: ' + e);
      });
  };