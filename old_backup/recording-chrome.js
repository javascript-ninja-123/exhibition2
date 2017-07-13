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


function saveitToDatabase(n) {
    let firebaseRef = firebase.database().ref();
    let data = {
        name: `${n}`
    }
    firebaseRef.push(data);
}

let newArray = [];

function createBLOB() {
    recorder && recorder.exportWAV(blob => {
        //create a blob and push it to the Firebase
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth();
        var day = d.getDate();
        var hour = d.getHours();
        var min = d.getMinutes();
        var sec = d.getSeconds();
        var time = `${year}-${month}-${day}-${hour}h-${min}m-${sec}sec`;
        var file = new File([blob], `${time}.wav`, {
            lastModified: new Date(0),
            type: "overide/mimetype"
        });

        let storageRef = firebase.storage().ref('/sound/' + file.name);
        //push it to the firebase
        document.querySelector('#local').addEventListener('click', function() {
            storageRef.put(file);
            saveitToDatabase(`${time}.wav`);
            newArray.unshift(time);
        })

        //create a li tag
        var url = URL.createObjectURL(blob);
        let newArray = Array.from(recordingslist.children);
        if (newArray.length > 0) {
            recordingslist.removeChild(recordingslist.firstChild)
        }
        let li = `<li><audio controls src='${url}' class='audio'></audio></li>`;
        recordingslist.insertAdjacentHTML('afterbegin', li);

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