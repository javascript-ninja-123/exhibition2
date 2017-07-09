// var roofRef = firebase.database().ref();

// roofRef.on('value', snap => {
//     let key = snap.val();
//     let keyArray = Object.keys(key);
//     let finalKey = keyArray.slice(-1)
//     for (x in key) {
//         if (x == finalKey) {
//             var finalKeySrc = key[x].src;
//         }
//     }
//     localStorage.setItem('src', finalKeySrc);
//     let keyValue = localStorage.getItem('src')
//     let li = `<li><audio controls src="${keyValue}" class='audio'></audio></li>`
//     document.querySelector('ul').insertAdjacentHTML('beforeend', li)
// })

var storage = firebase.storage();
var pathReference = storage.ref('sound/2017-07-08T23:16:25.128Z.wav');



// var storage = firebase.storage();
// var gsReference = storage.refFromURL('gs://glenda-174ee.appspot.com/sound/')

storage.ref().child('sound/2017-07-09T00:14:57.239Z.wav').getDownloadURL().then(function(url) {

    let li = `<li><audio controls class='audio'>
          <source src="${url}" type="audio/wav">
    </audio></li>`
    document.querySelector('ul').insertAdjacentHTML('beforeend', li)
    document.querySelector('.audio').play();
}).catch(function(error) {
    console.log(error)
});