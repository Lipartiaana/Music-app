const goBackArtistsBtn = document.querySelector(".go-back-arrow");
const artistPortfolio = document.querySelector(".artist-portfolio");
const cardsContainerGrid = document.querySelector(".cards-container-grid");
const artistPageTitle = document.querySelector(".artist-heading");
const artistPotfolioImg = document.querySelector(".artist-portfolio-img");
const tableContainer = document.querySelector(".artist-songs-wrapper");

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
      populateArtistSongsTable(data.results);
    } else {
      console.log("No songs found for", artist);
    }
  } catch (error) {
    console.error("Error fetching artist songs:", error);
  }
}

function populateArtistSongsTable(songs) {
  const table = document.querySelector(".artist-songs-list");
  table.innerHTML = "";

  songs.forEach((song, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="artist-song-play-btn">
        <img src="../Assets/play-btn.png" alt="Play" />
      </td>
      <td class="artist-song-number">${index + 1}</td>
      <td class="artist-song-img">
        <img src="${
          song.album_image || "../Assets/alt-song.jpg"
        }" alt="Album Cover" />
      </td>
      <td class="artist-song-name">${song.name}</td>
      <td class="artist-song-duration">${formatDuration(song.duration)}</td>
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
