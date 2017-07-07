var roofRef = firebase.database().ref();

roofRef.on('value', snap => {
    let key = snap.val();
    let keyArray = Object.keys(key);
    let finalKey = keyArray.slice(-1)
    for (x in key) {
        if (x == finalKey) {
            var finalKeySrc = key[x].src;
        }
    }
    localStorage.setItem('src', finalKeySrc);
    let keyValue = localStorage.getItem('src')
    let li = `<li><audio controls src="${keyValue}" class='audio'></audio></li>`
    document.querySelector('ul').insertAdjacentHTML('beforeend', li)
})