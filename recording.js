var audio_context;
var recorder;

function startUserMedia(stream) {
    var input = audio_context.createMediaStreamSource(stream);
    recorder = new Recorder(input);
}

function startRecording(button) {
    recorder && recorder.record();
    button.disabled = true;
    button.nextElementSibling.disabled = false;
}

function stopRecording(button) {
    recorder && recorder.stop();
    button.disabled = true;
    button.previousElementSibling.disabled = false;
    createBLOB();
    recorder.clear();
}

function playRecording(button) {
    let item = document.querySelector('#recordingslist');
    item.firstChild.querySelector('.audio').play();
}



function createBLOB() {
    recorder && recorder.exportWAV(blob => {
        //create a blob and push it to the Firebase
        var d = new Date();
        var n = d.toISOString();
        var file = new File([blob], `${n}.wav`, {
            lastModified: new Date(0),
            type: "overide/mimetype"
        });
        let storageRef = firebase.storage().ref('/sound/' + file.name);
        document.querySelector('#local').addEventListener('click', function() {
            storageRef.put(file);
            saveitToDatabase();
        })

        //create a li tag
        var url = URL.createObjectURL(blob);
        let newArray = Array.from(recordingslist.children);
        if (newArray.length > 0) {
            recordingslist.removeChild(recordingslist.firstChild)
        }
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

    } catch (e) {
        alert('No web audio support in this browser!');
    }

    navigator.getUserMedia({ audio: true }, startUserMedia, function(e) {

    });
};



//save it to database
// function saveitToDatabase(button) {
//     let item = document.querySelector('#recordingslist');
//     let firebaseRef = firebase.database().ref();
//     let data = {
//         name: 'sound',
//         src: item.firstChild.querySelector('.audio').getAttribute('src')
//     }
//     firebaseRef.push(data);
//     fetchDataformFireBase();
// }


// function fetchDataformFireBase() {
//     let ref = firebase.database().ref();
//     ref.on('value', data => {
//         let newSound = data.val();
//         let keys = Object.keys(newSound);
//         //   console.log(`src is ${newSound.src}`);
//         var result = keys.filter(value => {
//             return (value === keys[keys.length - 1])
//         })
//         for (var sound in newSound) {
//             if (sound == result) {
//                 console.log(`The most recent sound src is ${newSound[sound].src}`);
//             }
//         }
//     })
// }