let fileButton = document.querySelector('#fileButton');

fileButton.addEventListener('change', function(e) {
    let file = e.target.files[0];
    let storageRef = firebase.storage().ref('/sound/' + file.name);
    storageRef.put(file);
    console.log(file)

})