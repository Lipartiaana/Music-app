const logInMessage = document.querySelector(".log-in-message");

if (logInForm) {
  logInForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = logInForm.querySelector("input[type='text']").value.trim();
    const password = logInForm
      .querySelectorAll("input[type='text']")[1]
      .value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem("loggedInUser", username);
      logInModal.style.display = "none";
      logInForm.reset();

      const currentPage = window.location.pathname;
      console.log(currentPage);
      if (
        currentPage.endsWith("index.html") ||
        currentPage === "/" ||
        currentPage === "/index.html"
      ) {
        window.location.href = "./HTML/profile.html";
      } else {
        window.location.href = "./profile.html";
      }
    } else {
      logInMessage.style.display = "block";
      logInMessage.textContent = "Invalid username or password.";
      logInMessage.style.color = "red";
    }
  });

  const logInInputs = logInForm.querySelectorAll("input");

  logInInputs.forEach((input) => {
    input.addEventListener("input", () => {
      logInMessage.style.display = "none";
      logInMessage.textContent = "";
    });
  });
}

function logOut() {
  localStorage.removeItem("loggedInUser");

  const currentPage = window.location.pathname;

  if (currentPage.includes("profile.html")) {
    window.location.href = "../index.html";
  } else {
    location.reload();
  }
}

function updateDropdown() {
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (loggedInUser) {
    logInLink.style.display = "none";
    registerLink.textContent = "Log Out  ";
    registerLink.innerHTML += `<i class="fa-solid fa-arrow-right-from-bracket"></i>`;
    registerLink.onclick = (e) => {
      e.preventDefault();
      logOut();
    };

    if (!document.querySelector(".profile-btn")) {
      const profileBtn = document.createElement("a");
      profileBtn.className = "profile-btn";
      const isHomePage =
        window.location.pathname.endsWith("index.html") ||
        window.location.pathname === "/" ||
        window.location.pathname === "/index.html";

      profileBtn.href = isHomePage ? "./HTML/profile.html" : "./profile.html";
      profileBtn.textContent = "My Profile";
      dropdownMenu.insertBefore(profileBtn, registerLink);
    }
  } else {
    logInLink.style.display = "block";
    registerLink.textContent = "Register";
    registerLink.onclick = null;

    const profileBtn = document.querySelector(".profile-btn");
    if (profileBtn) {
      profileBtn.remove();
    }
  }
}

updateDropdown();
