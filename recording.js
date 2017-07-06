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
      createDownloadLink();
      recorder.clear();
  }

  function playRecording(button) {
      let item = document.querySelector('#recordingslist');
      let itemArray = Array.from(item.children);
      if (itemArray.length < 2) {
          item.firstChild.querySelector('.audio').play();
      } else if (itemArray.length >= 2) {
          item.lastChild.querySelector('.audio').play();
      }
  }

  function saveittoLocalDataBase(button) {
      let item = document.querySelector('#recordingslist');
      let itemArray = Array.from(item.children);
      let firebaseRef = firebase.database().ref();
      if (itemArray.length < 2) {
          let data = {
              name: 'sound',
              src: item.firstChild.querySelector('.audio').getAttribute('src')
          }
          firebaseRef.push(data);
      } else if (itemArray.length >= 2) {
          let data = {
              name: 'sound',
              src: item.lastChild.querySelector('.audio').getAttribute('src')
          }
          firebaseRef.push(data);
      }
      fetchDataformFireBase();
  }

  function firstorLast(ele) {
      let item = document.querySelector('#recordingslist');
      let itemArray = Array.from(item.children);
      let file = item[ele].querySelector('.audio');
      let filename = item[ele].querySelector('.audio').name;

      let storageRef = firebase.storage().ref(`/sound/${filename}`);
      let uploadTask = storageRef.put(file)
  }

  function saveitToFirebaseStorage() {
      let item = document.querySelector('#recordingslist');
      let itemArray = Array.from(item.children);
      if (itemArray.length < 2) {
          firstorLast('firstChild')
      } else if (itemArray.length >= 2) {
          firstorLast('lastChild')
      }
      uploadTask.on('state_changed', function(snapshot) {

      }, function(error) {

      }, function() {
          var downloadURL = uploadTask.snapshot.downloadURL;
          console.log(downloadURL)
      });
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

  function createDownloadLink() {
      recorder && recorder.exportWAV(function(blob) {
          var url = URL.createObjectURL(blob);
          var li = document.createElement('li');
          var au = document.createElement('audio');
          var hf = document.createElement('a');
          au.controls = true;
          au.src = url;
          au.classList.add('audio');
          hf.href = url;
          hf.download = new Date().toISOString() + '.wav';
          hf.innerHTML = hf.download;
          li.appendChild(au);
          li.appendChild(hf);
          recordingslist.appendChild(li);
      });
  }

  //   var audioArray = [];

  //   function saveAudiofileintoLocalStorage(audio) {
  //       audioArray.unshift(audio)
  //       localStorage.setItem('Audiodata', JSON.stringify(audioArray));
  //   }

  //   function getAudiofilefromLocalStorage() {
  //       let data = JSON.parse(localStorage.getItem('Audiodata'));
  //       console.log(data)
  //   }


  //   var wholeArray = [];

  //   function saveLocalStoragetoArray() {
  //       let Audiodata = JSON.parse(localStorage['Audiodata']);
  //       console.log(Array.isArray(Audiodata))
  //       Audiodata.forEach(value => {
  //           wholeArray.unshift(value);
  //       })
  //       console.log(wholeArray.length);
  //   }

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