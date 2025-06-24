const JAMENDO_API_KEY = "bb6ab2bc";
let audio = null;
let isPlaying = false;
let isFetching = false;
let currentTrack = null;

let trackHistory = [];
let currentTrackIndex = -1;

let songsList = [];
let songsListIndex = -1;

let currentPlaylist = [];
let currentplylistTrackIndex = -1;

let currentTrackName = document.getElementById("currentTrackName");
let currentTrackArtist = document.getElementById("currentTrackArtist");
let playButton = document.querySelector(".play-button");
let playImg = document.getElementById("playImg");
let onOff = document.getElementById("onOff");
let loadingSpinner = document.getElementById("loadingSpinner");

const pinkSide = document.querySelector(".pink-side");

const nextTrackBtn = document.getElementById("nextTrackBtn");
const prevTrackBtn = document.getElementById("prevTrackBtn");

if (nextTrackBtn) {
  nextTrackBtn.addEventListener("click", playNext);
}

if (prevTrackBtn) {
  prevTrackBtn.addEventListener("click", playPrev);
}

if (playButton) {
  playButton.addEventListener("click", () => {
    if (!audio) {
      if (songsList && songsList.length > 0) {
        songsListIndex = 0;
        playTrack(songsList[0]);
      } else {
        playTrack(); // fallback to random if no song list
      }
      if (onOff) {
        onOff.innerText = "ON";
        pinkSide.classList.remove("dark");
      }
    } else {
      togglePlayback();
    }
  });
}

function playTrack(track = null) {
  if (isFetching) return;
  if (audio) {
    audio.pause();
  }

  isFetching = true;
  if (nextTrackBtn) {
    nextTrackBtn.disabled = true;
  }
  loadingSpinner.style.display = "block";
  playButton.style.display = "none";
  currentTrackName.innerText = "🎵 Loading ...";
  currentTrackArtist.innerText = "Please wait";

  // Potfolio
  if (track && currentPlaylist.length > 0) {
    currentTrack = track;
    startPlayback();
    isFetching = false;
    if (nextTrackBtn) nextTrackBtn.disabled = false;
    loadingSpinner.style.display = "none";
    playButton.style.display = "block";
    return;
  }

  // Songlist
  if (!track && songsList && songsList.length > 0) {
    currentTrackIndex = 0;
    currentTrack = songsList[0];
    startPlayback();
    isFetching = false;
    loadingSpinner.style.display = "none";
    playButton.style.display = "block";
    return;
  }

  // Same
  if (track) {
    currentTrack = track;
    startPlayback();
    isFetching = false;
    if (nextTrackBtn) {
      nextTrackBtn.disabled = false;
    }
    loadingSpinner.style.display = "none";
    playButton.style.display = "block";
    return;
  }

  // Random
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
      loadingSpinner.style.display = "none";
      playButton.style.display = "block";
    });
}

function startPlayback() {
  if (!currentTrack) return;
  // check audio
  const artistName =
    currentTrack.artist || currentTrack.artist_name || "Unknown";

  console.log("Playing:", currentTrack.name, "by", artistName);

  audio = new Audio(currentTrack.audio || currentTrack.url);

  if (currentTrack?.url) {
    updatePlayerHeartIcon(currentTrack.url);
  }

  audio.play();
  isPlaying = true;

  currentTrackName.innerText = currentTrack.name;
  currentTrackArtist.innerText = artistName;
  playImg.src = getPauseButtonImage();
  if (onOff) {
    onOff.innerText = "ON";
    pinkSide.classList.remove("dark");
  }

  audio.addEventListener("ended", () => {
    isPlaying = false;
    playImg.src = getPlayButtonImage();
    if (onOff) {
      onOff.innerText = "OFF";
      pinkSide.classList.add("dark");
    }
  });
}

function togglePlayback() {
  if (!audio) return;

  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    if (onOff) {
      onOff.innerText = "OFF";
      pinkSide.classList.add("dark");
    }
    playImg.src = getPlayButtonImage();
  } else {
    audio.play();
    isPlaying = true;
    if (onOff) {
      onOff.innerText = "ON";
      pinkSide.classList.remove("dark");
    }
    playImg.src = getPauseButtonImage();
  }
}

function updatePlayerHeartIcon(songUrl) {
  const heartIcon = document.getElementById("playerHeart");
  if (!heartIcon) return;

  const loggedInUser = localStorage.getItem("loggedInUser");
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.username === loggedInUser);
  const likedSongs = user?.playlists?.["Liked Songs"] || [];

  const getTrackIdFromUrl = (url) => {
    const match = url.match(/trackid=(\d+)/);
    return match ? match[1] : null;
  };

  const currentTrackId = getTrackIdFromUrl(songUrl);
  const isLiked = likedSongs.some(
    (likedUrl) => getTrackIdFromUrl(likedUrl) === currentTrackId
  );

  heartIcon.dataset.songid = songUrl;

  if (isLiked) {
    heartIcon.classList.add("liked", "fa-solid");
    heartIcon.classList.remove("fa-regular");
  } else {
    heartIcon.classList.remove("liked", "fa-solid");
    heartIcon.classList.add("fa-regular");
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

function getPlayButtonImage() {
  const path = window.location.pathname;

  if (path === "/" || path.endsWith("index.html")) {
    return "./Assets/play-btn.png";
  } else {
    return "../Assets/play-btn.png";
  }
}

function getPauseButtonImage() {
  const path = window.location.pathname;

  if (path === "/" || path.endsWith("index.html")) {
    return "./Assets/pause-btn.png";
  } else {
    return "../Assets/pause-btn.png";
  }
}
