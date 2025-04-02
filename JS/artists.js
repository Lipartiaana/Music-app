const artistsContainer = document.querySelector(".artists");

async function fetchPopularArtists() {
  try {
    const response = await fetch(
      `https://api.jamendo.com/v3.0/artists/?client_id=${JAMENDO_API_KEY}&format=json&limit=9&order=popularity_total&limit=9&hasimage=true`
    );
    const data = await response.json();

    if (data.results.length > 0) {
      displayArtists(data.results);
    } else {
      console.log("No artists found.");
    }
  } catch (error) {
    console.error("Error fetching artists:", error);
  }
}

function displayArtists(artists) {
  artistsContainer.innerHTML = "";
  artists.forEach((artist) => {
    const artistCard = document.createElement("div");
    artistCard.className = "artist-card";

    const imgElement = document.createElement("img");
    imgElement.src = artist.image || "../Assets/alt-song.jpg";
    imgElement.alt = artist.name;

    artistCard.appendChild(imgElement);
    artistCard.innerHTML += `<p>${artist.name}</p>`;
    artistsContainer.appendChild(artistCard);
  });
}

fetchPopularArtists();
