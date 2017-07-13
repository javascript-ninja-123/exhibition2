var mediaConstraints = {
    audio: true
};

let newArray = [];
var mediaRecorder;
navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);

function onMediaSuccess(stream) {
    mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.mimeType = 'audio/wav';
    mediaRecorder.ondataavailable = function(blob) {
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
    };

}

function onMediaError(e) {
    console.error('media error', e);
}



function startRecording(button) {
    mediaRecorder.start();
}

function stopRecording(button) {
    mediaRecorder.pause();
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