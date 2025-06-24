const goBackArtistsBtn = document.querySelector(".go-back-arrow");
const artistPortfolio = document.querySelector(".artist-portfolio");
const cardsContainerGrid = document.querySelector(".cards-container-grid");
const artistPageTitle = document.querySelector(".artist-heading");
const artistPotfolioImg = document.querySelector(".artist-portfolio-img");
const tableContainer = document.querySelector(".artist-songs-wrapper");
const artistNextBtn = document.getElementById("artistNextBtn");
const artistPrevBtn = document.getElementById("artistPrevBtn");

artistNextBtn.addEventListener("click", playNextArtistSong);
artistPrevBtn.addEventListener("click", playPrevArtistSong);

if (goBackArtistsBtn) {
  goBackArtistsBtn.addEventListener("click", goBackToArtists);
}

function goBackToArtists() {
  artistPortfolio.style.display = "none";
  if (isMobile()) {
    swiperContainer.style.display = "block";
  } else {
    cardsContainerGrid.style.display = "grid";
  }
  goBackArtistsBtn.style.display = "none";
  artistPageTitle.textContent = "TOP ARTISTS";
}

function showPortfolio(artist) {
  artistPortfolio.style.display = "flex";
  if (cardsContainerGrid) {
    cardsContainerGrid.style.display = "none";
  }
  if (swiperContainer) {
    swiperContainer.style.display = "none";
  }
  if (tableContainer) {
    tableContainer.scrollTop = 0;
  }
  goBackArtistsBtn.style.display = "block";
  artistPageTitle.textContent = artist.name;
  artistPotfolioImg.src = artist.image;

  fetchSongsByArtist(artist);
}

async function fetchSongsByArtist(artist) {
  try {
    const response = await fetch(
      `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_API_KEY}&format=json&limit=20&artist_name=${encodeURIComponent(
        artist.name
      )}&include=musicinfo`
    );
    const data = await response.json();

    if (data.results.length > 0) {
      populateArtistSongsTable(data.results, artist.name);
    } else {
      console.log("No songs found for", artist);
    }
  } catch (error) {
    console.error("Error fetching artist songs:", error);
  }
}

function populateArtistSongsTable(songs, artist) {
  const table = document.querySelector(".artist-songs-list");
  table.innerHTML = "";

  currentPlaylist = songs.map((song, index) => ({
    url: song.audio,
    name: song.name,
    artist: artist,
    duration: song.duration,
    img: song.album_image || "../Assets/alt-song.jpg",
    index: index,
  }));

  currentPlaylistTrackIndex = -1;

  const loggedInUser = localStorage.getItem("loggedInUser");
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.username === loggedInUser);
  const likedSongs = user?.playlists?.["Liked Songs"] || [];

  const getTrackIdFromUrl = (url) => {
    const match = url.match(/trackid=(\d+)/);
    return match ? match[1] : null;
  };

  currentPlaylist.forEach((track, index) => {
    const trackId = getTrackIdFromUrl(track.url);
    const isLiked = likedSongs.some(
      (likedUrl) => getTrackIdFromUrl(likedUrl) === trackId
    );

    const row = document.createElement("tr");
    row.classList.add("artist-song-row");
    row.dataset.index = index;
    row.dataset.url = track.url;
    row.dataset.name = track.name;
    row.dataset.duration = track.duration;
    row.dataset.artistName = track.artist;

    row.innerHTML = `
      <td class="artist-song-play-btn">
        <img src="../Assets/play-btn.png" alt="Play" />
      </td>
      <td class="artist-song-number">${index + 1}</td>
      <td class="artist-song-img">
        <img src="${track.img}" alt="Album Cover" />
      </td>
      <td class="artist-song-name">${track.name}</td>
      <td class="playlist-dropdown-wrapper">
        <i class="fa-heart ${isLiked ? "fa-solid liked" : "fa-regular"}"
           data-songid="${track.url}" data-index="${index}"></i>
        <div class="playlist-dropdown" style="display: none;"></div>
      </td>
      <td class="artist-song-duration">${formatDuration(track.duration)}</td>
    `;

    table.appendChild(row);
  });
}

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

document
  .querySelector(".artist-songs-list")
  .addEventListener("click", (event) => {
    const row = event.target.closest(".artist-song-row");
    if (!row) return;

    currentPlaylistTrackIndex = parseInt(row.dataset.index, 10);
    const selectedTrack = currentPlaylist[currentPlaylistTrackIndex];
    playTrack(selectedTrack);
  });

function playPortfolioTrack() {
  if (tableContainer) {
    tableContainer.addEventListener("click", (event) => {
      const playBtn = event.target.closest(".artist-song-play-btn");
      const row = event.target.closest(".artist-song-row");

      if (playBtn && row) {
        const track = {
          audio: row.dataset.url,
          name: row.dataset.name,
          duration: row.dataset.duration,
          artist_name: row.dataset.artistName,
        };

        playTrack(track);
      }
    });
  }
}

function playNextArtistSong() {
  if (currentPlaylistTrackIndex < currentPlaylist.length - 1) {
    currentPlaylistTrackIndex++;
    playTrack(currentPlaylist[currentPlaylistTrackIndex]);
  }
}

function playPrevArtistSong() {
  if (currentPlaylistTrackIndex > 0) {
    currentPlaylistTrackIndex--;
    playTrack(currentPlaylist[currentPlaylistTrackIndex]);
  }
}

playPortfolioTrack();
