const profileIcon = document.querySelector(".profile-icon");
const dropdownMenu = document.querySelector(".dropdown-menu");
const logInLink = document.getElementById("logInLink");
const registerLink = document.getElementById("registerLink");
const logInModal = document.getElementById("logInModal");
const registerModal = document.getElementById("registerModal");
const logInForm = document.getElementById("logInForm");
const registerForm = document.getElementById("registerForm");
const profileDropdown = document.querySelector(".profile-dropdown");
const logOutLink = document.querySelector("logOutLink");
const userProfile = document.querySelector(".user-profile");

const users = JSON.parse(localStorage.getItem("users")) || [];
const loggedInUser = localStorage.getItem("loggedInUser");
const user = users.find((u) => u.username === loggedInUser);

if (user) {
  profileIcon.src = user.image || "../Assets/user.png";
}

profileIcon.addEventListener("click", () => {
  dropdownMenu.style.display =
    dropdownMenu.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".profile-dropdown")) {
    dropdownMenu.style.display = "none";
  }
});

if (logInLink) {
  logInLink.addEventListener("click", () => {
    logInModal.style.display = "flex";
    registerModal.style.display = "none";
    dropdownMenu.style.display = "none";
  });
}

if (registerLink) {
  registerLink.addEventListener("click", () => {
    registerModal.style.display = "flex";
    logInModal.style.display = "none";
    dropdownMenu.style.display = "none";
  });
}

if (logInModal) {
  document.addEventListener("click", (e) => {
    if (
      logInModal.style.display === "flex" &&
      !e.target.closest("#logInForm") &&
      !e.target.closest("#logInLink")
    ) {
      logInModal.style.display = "none";
    }

    if (
      registerModal.style.display === "flex" &&
      !e.target.closest("#registerForm") &&
      !e.target.closest("#registerLink")
    ) {
      registerModal.style.display = "none";
    }
  });
}

// Profile view
if (userProfile) {
  document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.username === loggedInUser);

    if (!user) return;

    document.querySelector(".user-name").textContent = user.username;
    document.querySelector(".user-profile-img").src =
      user.image || "../Assets/user.png";
    document.querySelector(".date-created").textContent = `Date created: ${
      user.dateCreated || "Unknown"
    }`;
    document.querySelector(".email").textContent = `Email: ${
      user.email || "Not provided"
    }`;

    const playlists = user.playlists || {};
    const totalPlaylists = Object.keys(playlists).length;
    const likedSongsCount = (playlists["Liked Songs"] || []).length;
    const allSongsCount = Object.values(playlists).reduce(
      (total, list) => total + list.length,
      0
    );

    document
      .querySelectorAll(".user-playlist-info-block")[0]
      .querySelector("span").textContent = totalPlaylists;
    document
      .querySelectorAll(".user-playlist-info-block")[1]
      .querySelector("span").textContent = likedSongsCount;
    document
      .querySelectorAll(".user-playlist-info-block")[2]
      .querySelector("span").textContent = allSongsCount;
  });
}

// Change password
const changePasswordModal = document.getElementById("changePassModal");
const changePasswordForm = document.getElementById("changePassForm");

if (changePasswordForm) {
  document
    .querySelector("a[href='#change-password']")
    .addEventListener("click", () => {
      changePasswordModal.style.display = "flex";
    });

  const message = changePasswordForm.querySelector(".change-password-message");
  changePasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const current = document.getElementById("currentPassword").value.trim();
    const newPass = document.getElementById("newPassword").value.trim();
    const confirm = document.getElementById("confirmNewPassword").value.trim();

    const loggedInUser = localStorage.getItem("loggedInUser");
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.username === loggedInUser);

    if (!user || user.password !== current) {
      showMessage("Current password is incorrect.", "red");
      return;
    }

    if (newPass !== confirm) {
      showMessage("New passwords do not match.", "red");
      return;
    }

    user.password = newPass;
    localStorage.setItem("users", JSON.stringify(users));
    showMessage("Password changed successfully!", "green");

    setTimeout(() => {
      changePasswordForm.reset();
      message.style.display = "none";
      changePasswordModal.style.display = "none";
    }, 2000);
  });
}

function showMessage(text, color) {
  message.textContent = text;
  message.style.color = color;
  message.style.display = "block";
}

window.addEventListener("click", function (event) {
  const modal = document.getElementById("changePassModal");
  const form = document.getElementById("changePassForm");

  if (event.target === modal) {
    modal.style.display = "none";
    form.reset();
    message.style.display = "none";
  }
});

// Edit profile
const editProfileModal = document.getElementById("editProfileModal");
const editProfileForm = document.getElementById("editProfileForm");

let uploadedImageBase64 = null;

const profileImageInput = document.getElementById("profileImageInput");
const profileImagePreview = document.getElementById("profileImagePreview");

if (editProfileForm) {
  document
    .querySelector("a[href='#edit-profile']")
    .addEventListener("click", (e) => {
      e.preventDefault();

      const loggedInUser = localStorage.getItem("loggedInUser");
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find((u) => u.username === loggedInUser);

      if (!user) return;

      editProfileForm.username.value = user.username;
      editProfileForm.email.value = user.email || "";

      editProfileModal.style.display = "flex";
    });

  profileImageInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      uploadedImageBase64 = e.target.result;
      profileImagePreview.src = uploadedImageBase64;
    };
    reader.readAsDataURL(file);
  });

  const editMessage = editProfileForm.querySelector(".edit-message");

  editProfileForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newUsername = editProfileForm.username.value.trim();
    const newEmail = editProfileForm.email.value.trim();

    const loggedInUser = localStorage.getItem("loggedInUser");
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find((u) => u.username === loggedInUser);

    if (!user) return;

    if (
      newUsername !== loggedInUser &&
      users.some((u) => u.username === newUsername)
    ) {
      editMessage.textContent = "Username already exists.";
      editMessage.style.display = "block";
      editMessage.style.color = "red";
      return;
    }

    user.username = newUsername;
    user.email = newEmail;
    user.image = uploadedImageBase64 || user.image || "../Assets/user.png";

    localStorage.setItem("loggedInUser", newUsername);
    localStorage.setItem("users", JSON.stringify(users));

    editMessage.textContent = "Profile updated successfully!";
    editMessage.style.display = "block";
    editMessage.style.color = "green";

    setTimeout(() => {
      editMessage.style.display = "none";
      editProfileModal.style.display = "none";
      location.reload();
    }, 1500);
  });
}

window.addEventListener("click", function (event) {
  if (event.target === editProfileModal) {
    editProfileModal.style.display = "none";
    editProfileForm.reset();
    editMessage.style.display = "none";
  }
});

const profileImg = document.querySelector(".user-profile-img");
const profileName = document.querySelector(".user-name");
const profileEmail = document.querySelector(".email");

if (user && userProfile) {
  profileImg.src = user.image || "../Assets/user.png";
  profileName.textContent = user.username;
  profileEmail.textContent = `Email: ${user.email || "Not provided"}`;
  profileImagePreview.src = user.image || "../Assets/user.png";
  profileIcon.src = user.image || "../Assets/user.png";
}

// delete profile
const deleteLink = document.querySelector(".delete-profile-link");
const deleteModal = document.getElementById("deleteModal");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelDeleteBtn = document.getElementById("cancelDelete");

if (deleteModal) {
  deleteLink.addEventListener("click", (e) => {
    e.preventDefault();
    deleteModal.style.display = "flex";
  });

  cancelDeleteBtn.addEventListener("click", () => {
    deleteModal.style.display = "none";
  });

  confirmDeleteBtn.addEventListener("click", () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const updatedUsers = users.filter((u) => u.username !== loggedInUser);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.removeItem("loggedInUser");

    window.location.href = "../index.html";
  });

  window.addEventListener("click", (e) => {
    if (e.target === deleteModal) {
      deleteModal.style.display = "none";
    }
  });
}
