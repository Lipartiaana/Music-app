const songsContainer = document.querySelector(".songs");

async function fetchPopularSongs() {
  try {
    const response = await fetch(
      `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_API_KEY}&format=json&limit=9&order=popularity_total&hasimage=true`
    );
    const data = await response.json();

    if (data.results.length > 0) {
      displaySongs(data.results);
    } else {
      console.log("No songs found.");
    }
  } catch (error) {
    console.error("Error fetching songs:", error);
  }
}

function displaySongs(songs) {
  songsContainer.innerHTML = "";
  songs.forEach((song) => {
    const songCard = document.createElement("div");
    songCard.className = "song-card";

    const imgElement = document.createElement("img");
    imgElement.src = song.image || "../Assets/alt-song.jpg";
    imgElement.alt = song.name;

    songCard.appendChild(imgElement);
    songCard.innerHTML += `<p>${song.name}</p><p class="small-text">${song.artist_name}</p> `;
    songsContainer.appendChild(songCard);
  });
}

fetchPopularSongs();
