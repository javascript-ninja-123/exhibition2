// fork getUserMedia for multiple browser versions, for the future
// when more browsers support MediaRecorder

navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

// set up basic variables for app

const record = document.querySelector('.record');
const stop = document.querySelector('.stop');
const play = document.querySelector('.play');
const save = document.querySelector('.save');
const soundClips = document.querySelector('.sound-clips');
var file;
var time;
var storageRef;

// disable stop button while not recording

stop.disabled = true;
play.disabled = true;


// visualiser setup - create web audio api context and canvas

var audioCtx = new(window.AudioContext || webkitAudioContext)();


//main block for doing the audio recording

if (navigator.getUserMedia) {


    var constraints = { audio: true };
    var chunks = [];

    var onSuccess = function(stream) {
        var mediaRecorder = new MediaRecorder(stream);


        record.onclick = function() {
            record.style.animationName = 'spin';
            record.style.animationDuration = 3000 + 's';
            record.style.animationIterationCount = 'infinite'
            record.style.WebkitAnimationIterationCount = 'infinite'
            record.style.WebkitAnimationIterationCount = 'infinite'
            record.style.WebkitAnimationName = 'spin';
            mediaRecorder.start();


            stop.disabled = false;
            record.disabled = true;

        }

        stop.onclick = function() {
            mediaRecorder.stop();

            stop.disabled = true;
            record.disabled = false;
        }

        play.onclick = () => {
            soundClips.firstChild.play();

        }

        mediaRecorder.onstop = function(e) {
            let soundClipArray = Array.from(soundClips.children);
            if (soundClipArray.length > 0) {
                let firstChildEle = soundClips.firstChild;
                firstChildEle.parentNode.removeChild(firstChildEle)

            }
            var blob = new Blob(chunks, { 'type': 'audio/wav; codecs=opus' });
            chunks = [];
            var audioURL = window.URL.createObjectURL(blob);
            let audioFile = `<audio controls src='${audioURL}' class="audio"></audio>`
            soundClips.insertAdjacentHTML('afterbegin', audioFile)
            play.disabled = false;


        }

        mediaRecorder.ondataavailable = function(e) {
                chunks.push(e.data);
                var d = new Date();
                var year = d.getFullYear();
                var month = d.getMonth();
                var day = d.getDate();
                var hour = d.getHours();
                var min = d.getMinutes();
                var sec = d.getSeconds();
                time = `${year}-${month}-${day}-${hour}h-${min}m-${sec}sec`;
                file = new File([e.data], `${time}.wav`, {
                    lastModified: new Date(0),
                    type: "overide/mimetype"
                });
                storageRef = firebase.storage().ref('/sound/' + file.name);
            }
            //push it to the firebase
        save.onclick = () => {
            storageRef.put(file);
            saveitToDatabase(`${time}.wav`);
        }


        function saveitToDatabase(n) {
            let firebaseRef = firebase.database().ref();
            let data = {
                name: `${n}`
            }
            firebaseRef.push(data);
        }
    }

    var onError = function(err) {
        console.log('The following error occured: ' + err);
    }

    navigator.getUserMedia(constraints, onSuccess, onError);
} else {
    console.log('getUserMedia not supported on your browser!');
}