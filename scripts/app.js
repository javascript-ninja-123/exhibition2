// fork getUserMedia for multiple browser versions, for the future
// when more browsers support MediaRecorder

navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

// set up basic variables for app
const record = document.getElementById('record');
const stop = document.getElementById('stop');
const play = document.getElementById('play');
const save = document.getElementById('save');
const soundClips = document.querySelector('.sound-clips');
var file;
var time;
var storageRef;
var blob;
var url;

// disable stop button while not recording
stop.disabled = true;
play.disabled = true;

// visualiser setup - create web audio api context and canvas
var audioCtx = new(window.AudioContext || webkitAudioContext)();

// DOM animation
const recordWrapper = document.getElementById('recordWrapper')
const stopWrapper = document.getElementById('stopWrapper')
const playWrapper = document.getElementById('playWrapper')
const saveWrapper = document.getElementById('saveWrapper')
var tl = new TimelineLite();

let addSpin = (ele) => {
    ele.style.animationName = 'spin';
    ele.style.animationDuration = 3000 + 'ms';
    ele.style.animationIterationCount = 'infinite'
};


//Firebase variables
var storageDatabase = firebase.database().ref();
var soundRef = storageDatabase.child('sound')
var songRef = soundRef.child('songs')
var switchRef = soundRef.child('switch');
var temporaryFB = soundRef.child('temporary');

//main block for doing the audio recording

if (navigator.getUserMedia) {


    var constraints = { audio: true };
    var chunks = [];
    var onSuccess = function(stream) {
        var mediaRecorder = new MediaRecorder(stream);
        record.onclick = function() {
            mediaRecorder.start();
            addSpin(record)
            tl
                .to(recordWrapper, 2, { x: 200, autoAlpha: 0, ease: Power1.easeOut })
                .to(stopWrapper, 1, { opacity: 1 })
            stop.disabled = false;
            record.disabled = true;
            stopWrapper.style.display = 'block'

            if (localStorage.length >= 1) {
                let data = localStorage.getItem('data');
                let newData = JSON.parse(data)
                switchRef.limitToFirst(1).on('child_added', snap => {
                    let snapshot = snap.val();
                    if (snapshot.switch === false) {
                        songRef.push(newData)
                        console.log('we pushed')
                    }
                })

            }
        }

        stop.onclick = function() {
            mediaRecorder.stop();
            addSpin(stop)
            tl
                .to(stopWrapper, 2, { x: 300, autoAlpha: 0, ease: Power1.easeOut })
                .to(playWrapper, 1, { opacity: 1 })
            stop.disabled = true;
            record.disabled = false;
            playWrapper.style.display = 'block'
        }

        play.onclick = () => {
            soundClips.firstChild.play();
            saveWrapper.style.display = 'block'
            addSpin(play)
            tl
                .to(playWrapper, 2, { x: 300, autoAlpha: 0, ease: Power1.easeOut })
                .to(saveWrapper, 1, { opacity: 1 })


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
                blob = e.data;
                url = URL.createObjectURL(blob);

                file = new File([blob], `${time}.wav`, {
                    lastModified: new Date(0),
                    type: "overide/mimetype"
                });
                console.log(file)
                storageRef = firebase.storage().ref('/sound/' + file.name);
            }
            //push it to the firebase
        save.onclick = () => {
            saveitToDatabase(time, url, 'sound/songs')
            addSpin(save)
            tl
                .to(saveWrapper, 2, { x: 300, autoAlpha: 0, ease: Power1.easeOut })
            setTimeout(() => {
                location.reload();
            }, 3000)
        }


        function saveitToDatabase(n, b, place) {
            // switchRef.limitToFirst(1).on('child_added', snap => {
            //     let snapshot = snap.val();
            //     if (snapshot.switch === true) {
            //         let data = {
            //             time: `${n}`,
            //             blob: `${b}`,
            //         }
            //         localStorage.setItem('data', JSON.stringify(data))
            //     }
            // })
            let firebaseRef = firebase.database().ref(place);
            let data = {
                time: `${n}`,
                blob: `${b}`,
            }
            firebaseRef.push(data)

        }
    }

    var onError = function(err) {
        console.log('The following error occured: ' + err);
    }

    navigator.getUserMedia(constraints, onSuccess, onError);
} else {
    console.log('getUserMedia not supported on your browser!');
}