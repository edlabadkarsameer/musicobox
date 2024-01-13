// Initialize Firebase (replace with your own Firebase config)
const firebaseConfig = {
    
        apiKey: "AIzaSyBAZUPh8IjMSP2CR7A_6EkstBLM-6XKy-g",
        authDomain: "musicbox-107e6.firebaseapp.com",
        databaseURL: "https://musicbox-107e6-default-rtdb.firebaseio.com",
        projectId: "musicbox-107e6",
        storageBucket: "musicbox-107e6.appspot.com",
        messagingSenderId: "694209992316",
        appId: "1:694209992316:web:29068a8b8f5e55ace5dbf9",
        measurementId: "G-7DQWT14PER"
      
    
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const fileInput = document.getElementById('fileInput');
const songList = document.getElementById('songList');
const audioPlayer = document.getElementById('audioPlayer');

// Function to upload a song
function uploadSong() {
    const file = fileInput.files[0];
    if (file) {
        const storageRef = firebase.storage().ref(`songs/${file.name}`);
        const task = storageRef.put(file);

        task.on('state_changed', 
            null,
            null,
            () => {
                // Song uploaded successfully, add it to the database
                storageRef.getDownloadURL().then(url => {
                    const songName = file.name.replace('.mp3', '');
                    database.ref('songs').push({
                        name: songName,
                        url: url
                    });
                });
            }
        );
    }
}

// Function to load and play a song
function loadSong(url) {
    audioPlayer.src = url;
    audioPlayer.play();
}

// Listen for changes in the songs list and update the UI
database.ref('songs').on('value', snapshot => {
    songList.innerHTML = '';
    snapshot.forEach(childSnapshot => {
        const song = childSnapshot.val();
        const listItem = document.createElement('li');
        listItem.textContent = song.name;
        listItem.addEventListener('click', () => loadSong(song.url));
        songList.appendChild(listItem);
    });
});
