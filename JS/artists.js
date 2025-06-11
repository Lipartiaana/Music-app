const artistsContainer = document.querySelector(".artists");
const artistsContainerGrid = document.querySelector(".cards-container-grid");
const swiperWrapper = document.querySelector(".swiper-wrapper");
const swiperContainer = document.querySelector(".swiper-container");

let swiperInstance = null;

function isMobile() {
  return window.innerWidth <= 992;
}

async function fetchPopularArtists() {
  try {
    const response = await fetch(
      `https://api.jamendo.com/v3.0/artists/?client_id=${JAMENDO_API_KEY}&format=json&limit=50&order=popularity_total&hasimage=true`
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
  artistsContainerGrid.innerHTML = "";
  swiperWrapper.innerHTML = "";

  const cutoffDate = new Date("2024-09-01");

  let artistsCount = 0;

  artists.forEach((artist) => {
    if (artistsCount >= 9) {
      return;
    }
    const artistJoinDate = new Date(artist.joindate);

    if (artistJoinDate < cutoffDate || !artist.image) {
      return;
    }
    // Grid card
    const artistCardGrid = document.createElement("div");
    artistCardGrid.className = "artist-card";

    const imgElementGrid = document.createElement("img");
    imgElementGrid.src = artist.image || "../Assets/alt-song.jpg";
    imgElementGrid.alt = artist.name;

    artistCardGrid.appendChild(imgElementGrid);
    artistCardGrid.innerHTML += `<p>${artist.name}</p>`;
    artistsContainerGrid.appendChild(artistCardGrid);
    artistCardGrid.addEventListener("click", () => showPortfolio(artist));

    // Swiper card
    const artistCardSwiper = document.createElement("div");
    artistCardSwiper.className = "artist-card swiper-slide";

    const imgElementSwiper = document.createElement("img");
    imgElementSwiper.src = artist.image || "../Assets/alt-song.jpg";
    imgElementSwiper.alt = artist.name;

    artistCardSwiper.appendChild(imgElementSwiper);
    artistCardSwiper.innerHTML += `<p>${artist.name}</p>`;
    swiperWrapper.appendChild(artistCardSwiper);
    artistCardSwiper.addEventListener("click", () => showPortfolio(artist));

    artistsCount++;
  });

  handleLayoutSwitch();
}

function handleLayoutSwitch() {
  const artistPortfolio = document.querySelector(".artist-portfolio");

  if (artistPortfolio && artistPortfolio.style.display === "flex") {
    return;
  }

  if (isMobile()) {
    artistsContainerGrid.style.display = "none";
    swiperContainer.style.display = "block";

    if (!swiperInstance) {
      swiperInstance = new Swiper(".swiper-container", {
        slidesPerView: 1,
        spaceBetween: 10,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          700: {
            slidesPerView: 3,
          },
          500: {
            slidesPerView: 2,
          },
        },
      });
    }
  } else {
    artistsContainerGrid.style.display = "grid";
    swiperContainer.style.display = "none";

    if (swiperInstance) {
      swiperInstance.destroy(true, true);
      swiperInstance = null;
    }
  }
}

// Initial fetch
fetchPopularArtists();

// Handle resize
window.addEventListener("resize", handleLayoutSwitch);
