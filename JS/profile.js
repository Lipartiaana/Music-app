const profileIcon = document.querySelector(".profile-icon");
const dropdownMenu = document.querySelector(".dropdown-menu");
const logInLink = document.getElementById("logInLink");
const registerLink = document.getElementById("registerLink");
const logInModal = document.getElementById("logInModal");
const registerModal = document.getElementById("registerModal");
const logInForm = document.getElementById("logInForm");
const registerForm = document.getElementById("registerForm");

profileIcon.addEventListener("click", () => {
  dropdownMenu.style.display =
    dropdownMenu.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".profile-dropdown")) {
    dropdownMenu.style.display = "none";
  }
});

logInLink.addEventListener("click", () => {
  logInModal.style.display = "flex";
  registerModal.style.display = "none";
  dropdownMenu.style.display = "none";
});

registerLink.addEventListener("click", () => {
  registerModal.style.display = "flex";
  logInModal.style.display = "none";
  dropdownMenu.style.display = "none";
});

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
