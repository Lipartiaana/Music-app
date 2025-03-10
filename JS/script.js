const JAMENDO_API_KEY = "bb6ab2bc";
let audio = null;
let isPlaying = false;
let currentTrack = null;

let currentTrackName = document.getElementById("currentTrackName");
let currentTrackArtist = document.getElementById("currentTrackArtist");
let playButton = document.querySelector(".play-button");
let playImg = document.getElementById("playImg");
let onOff = document.getElementById("onOff");

playButton.addEventListener("click", () => {
  if (!isPlaying) {
    playTrack();
    onOff.innerText = "ON";
  } else {
    togglePlayback();
  }
});

function playTrack() {
  if (audio) {
    audio.play();
    isPlaying = true;
    onOff.innerText = "ON";
    playImg.src = "./Assets/pause-btn.png";
    return;
  }

  fetch(
    `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_API_KEY}&format=json&limit=100`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        currentTrack = data.results[randomIndex];
        // check audio
        console.log(
          "Playing:",
          currentTrack.name,
          "by",
          currentTrack.artist_name
        );

        audio = new Audio(currentTrack.audio);
        audio.play();
        isPlaying = true;

        currentTrackName.innerText = currentTrack.name;
        currentTrackArtist.innerText = currentTrack.artist_name;
        playImg.src = "./Assets/pause-btn.png";
        onOff.innerText = "ON";

        audio.addEventListener("ended", () => {
          isPlaying = false;
          playImg.src = "./Assets/play-btn.png";
          onOff.innerText = "OFF";
        });
      }
    })
    .catch((error) => console.error("Error:", error));
}

function togglePlayback() {
  if (!audio) return;

  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    onOff.innerText = "OFF";
    playImg.src = "./Assets/play-btn.png";
  } else {
    audio.play();
    isPlaying = true;
    onOff.innerText = "ON";
    playImg.src = "./Assets/pause-btn.png";
  }
}
