const songsContainer = document.querySelector(".songs");
const songsContainerGrid = document.querySelector(".cards-container-grid");
const swiperWrapper = document.querySelector(".swiper-wrapper");
const swiperContainer = document.querySelector(".swiper-container");

let swiperInstance = null;

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
  songsContainerGrid.innerHTML = "";
  swiperWrapper.innerHTML = "";

  songs.forEach((song) => {
    // Grid card
    const songCardGrid = document.createElement("div");
    songCardGrid.className = "song-card";

    const imgElementGrid = document.createElement("img");
    imgElementGrid.src = song.image || "../Assets/alt-song.jpg";
    imgElementGrid.alt = song.name;

    songCardGrid.appendChild(imgElementGrid);
    songCardGrid.innerHTML += `<p>${song.name}</p><p class="small-text">${song.artist_name}</p>`;
    songsContainerGrid.appendChild(songCardGrid);

    // Swiper card
    const songCardSwiper = document.createElement("div");
    songCardSwiper.className = "song-card swiper-slide";

    const imgElementSwiper = document.createElement("img");
    imgElementSwiper.src = song.image || "../Assets/alt-song.jpg";
    imgElementSwiper.alt = song.name;

    songCardSwiper.appendChild(imgElementSwiper);
    songCardSwiper.innerHTML += `<p>${song.name}</p><p class="small-text">${song.artist_name}</p>`;
    swiperWrapper.appendChild(songCardSwiper);
  });

  handleLayoutSwitch();
}

function handleLayoutSwitch() {
  const isMobile = window.innerWidth <= 992;

  if (isMobile) {
    songsContainerGrid.style.display = "none";
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
    songsContainerGrid.style.display = "grid";
    swiperContainer.style.display = "none";

    if (swiperInstance) {
      swiperInstance.destroy(true, true);
      swiperInstance = null;
    }
  }
}

// Initial fetch
fetchPopularSongs();

// Handle resize
window.addEventListener("resize", handleLayoutSwitch);
