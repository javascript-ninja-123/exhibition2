let singleton = (function() {
    //Singleton starter
    var instance;

    //Array that stores recorded songs from kids
    var songArray = [];


    //JS Builder
    class RecrodBuilder {
        constructor(song) {
            this.song = song;
        }
        record(song) {
            songArray.push(this.song);
        }
    }
    class DeleteBuilder {
        constructor(song) {
            this.song = song;
        }
        deleteSong() {
            songArray.shift();
        }
    }

    function init() {
        function startRecording(song) {
            let result = new RecrodBuilder(song);
            console.log(songArray);
            console.log(songArray.length)
            return result.record(song);

        }

        function startDelete(song) {
            let result = new DeleteBuilder();
            return result.deleteSong();
        }

        function ArrayCheck() {
            return songArray;
        }

        return {
            startRecording: startRecording,
            startDelete: startDelete,
            ArrayCheck: ArrayCheck
        }
    }
    return {
        getInstance: function() {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    }
})();


const Record = document.querySelector('#record');
const Forward = document.querySelector('#fast-forward');
const DeleteSong = document.querySelector('#delete');
const Stop = document.querySelector('#stop');


let run = singleton.getInstance();

Record.addEventListener('click', function(e) {
    e.preventDefault();
    run.startRecording('Record testing')
})

DeleteSong.addEventListener('click', function(e) {
    e.preventDefault();
    run.startDelete();
    console.log(run.ArrayCheck());
})