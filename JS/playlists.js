document.addEventListener("click", (e) => {
  const heartIcon = e.target.closest(".fa-heart");

  if (heartIcon) {
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
      const registerModal = document.getElementById("registerModal");
      if (registerModal) {
        registerModal.style.display = "flex";
      }
      return;
    }

    const dropdown =
      heartIcon.parentElement.querySelector(".playlist-dropdown");
    const isVisible = dropdown.style.display === "block";

    document
      .querySelectorAll(".playlist-dropdown")
      .forEach((d) => (d.style.display = "none"));

    if (!isVisible) {
      const songId = heartIcon.dataset.songid;
      populateDropdown(dropdown, songId);
      dropdown.style.display = "block";
    }

    return;
  }

  const clickedPlaylistItem = e.target.closest(".playlist-dropdown p");
  if (clickedPlaylistItem) {
    const selectedPlaylist = clickedPlaylistItem.textContent;
    const songId = clickedPlaylistItem.dataset.songid;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const loggedInUser = localStorage.getItem("loggedInUser");
    const user = users.find((u) => u.username === loggedInUser);

    if (!user || !songId) return;

    if (!user.playlists) user.playlists = {};

    if (!user.playlists[selectedPlaylist]) {
      user.playlists[selectedPlaylist] = [];
    }

    if (!user.playlists[selectedPlaylist].includes(songId)) {
      user.playlists[selectedPlaylist].push(songId);

      if (selectedPlaylist === "Liked Songs") {
        document
          .querySelectorAll(`.fa-heart[data-songid="${songId}"]`)
          .forEach((icon) => {
            icon.classList.add("liked", "fa-solid");
            icon.classList.remove("fa-regular");
          });

        const playerHeart = document.getElementById("playerHeart");
        if (playerHeart?.dataset.songid === songId) {
          playerHeart.classList.add("liked", "fa-solid");
          playerHeart.classList.remove("fa-regular");
        }
      }
    }

    localStorage.setItem("users", JSON.stringify(users));

    document
      .querySelectorAll(".playlist-dropdown")
      .forEach((d) => (d.style.display = "none"));

    return;
  }

  document
    .querySelectorAll(".playlist-dropdown")
    .forEach((d) => (d.style.display = "none"));
});

function populateDropdown(container, songId) {
  container.innerHTML = "";

  const loggedInUser = localStorage.getItem("loggedInUser");
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.username === loggedInUser);

  if (!user) return;

  if (!user.playlists) user.playlists = {};

  if (!user.playlists["Liked Songs"]) {
    user.playlists["Liked Songs"] = [];
    localStorage.setItem("users", JSON.stringify(users));
  }

  const playlists = Object.keys(user.playlists);

  if (playlists.length === 0) {
    container.innerHTML = "<p>No playlists yet</p>";
    return;
  }

  playlists.forEach((playlist) => {
    const item = document.createElement("p");
    item.textContent = playlist;
    item.dataset.songid = songId;
    container.appendChild(item);
  });
}
