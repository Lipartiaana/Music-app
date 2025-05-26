const goBackArtistsBtn = document.querySelector(".go-back-arrow");
const artistPortfolio = document.querySelector(".artist-portfolio");
const cardsContainerGrid = document.querySelector(".cards-container-grid");
const artistPageTitle = document.querySelector(".artist-heading");

if (goBackArtistsBtn) {
  goBackArtistsBtn.addEventListener("click", goBackToArtists);
}

cardsContainerGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".artist-card");
  if (card) {
    showPortfolio();
  }
});

swiperContainer.addEventListener("click", (event) => {
  const card = event.target.closest(".artist-card");
  if (card) {
    showPortfolio();
  }
});

function goBackToArtists() {
  artistPortfolio.style.display = "none";
  if (isMobile()) {
    swiperContainer.style.display = "block";
  } else {
    cardsContainerGrid.style.display = "grid";
  }
  goBackArtistsBtn.style.display = "none";
  artistPageTitle.textContent = "Artist Name";
}

function showPortfolio() {
  artistPortfolio.style.display = "flex";
  if (cardsContainerGrid) {
    cardsContainerGrid.style.display = "none";
  }
  if (swiperContainer) {
    swiperContainer.style.display = "none";
  }
  goBackArtistsBtn.style.display = "block";
  artistPageTitle.textContent = "Artist Name";
}
