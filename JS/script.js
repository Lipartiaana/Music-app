const JAMENDO_API_KEY = "bb6ab2bc";
let audio = null;
let isPlaying = false;
let isFetching = false;
let currentTrack = null;

let trackHistory = [];
let currentTrackIndex = -1;

let currentTrackName = document.getElementById("currentTrackName");
let currentTrackArtist = document.getElementById("currentTrackArtist");
let playButton = document.querySelector(".play-button");
let playImg = document.getElementById("playImg");
let onOff = document.getElementById("onOff");

const nextTrackBtn = document.getElementById("nextTrackBtn");
const prevTrackBtn = document.getElementById("prevTrackBtn");

nextTrackBtn.addEventListener("click", playNext);
prevTrackBtn.addEventListener("click", playPrev);

playButton.addEventListener("click", () => {
  if (!audio) {
    playTrack();
    onOff.innerText = "ON";
  } else {
    togglePlayback();
  }
});

function playTrack(track = null) {
  if (isFetching) return;
  if (audio) {
    audio.pause();
  }

  isFetching = true;
  nextTrackBtn.disabled = true;

  if (track) {
    currentTrack = track;
    startPlayback();
    isFetching = false;
    nextTrackBtn.disabled = false;
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

        trackHistory.push(currentTrack);
        currentTrackIndex = trackHistory.length - 1;
        prevTrackBtn.disabled = trackHistory.length <= 1 ? true : false;
        startPlayback();
      }
    })
    .catch((error) => console.error("Error:", error))
    .finally(() => {
      nextTrackBtn.disabled = false;
      isFetching = false;
    });
}

function startPlayback() {
  if (!currentTrack) return;
  // check audio
  console.log("Playing:", currentTrack.name, "by", currentTrack.artist_name);

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

function playNext() {
  console.log("clicked");
  if (currentTrackIndex < trackHistory.length - 1) {
    currentTrackIndex++;
    playTrack(trackHistory[currentTrackIndex]);
  } else {
    playTrack();
  }
}

function playPrev() {
  console.log("clicked");
  if (currentTrackIndex > 0) {
    currentTrackIndex--;
    const previousTrack = trackHistory[currentTrackIndex];

    if (audio) {
      audio.pause();
    }

    playTrack(previousTrack);

    prevTrackBtn.disabled = currentTrackIndex === 0;
  }
}
