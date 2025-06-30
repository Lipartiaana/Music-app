const registerMessage = document.querySelector(".register-message");

if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = registerForm
      .querySelector("input[type='text']")
      .value.trim();
    const password = registerForm
      .querySelectorAll("input[type='text']")[1]
      .value.trim();
    const confirmPassword = registerForm
      .querySelectorAll("input[type='text']")[2]
      .value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find((u) => u.username === username)) {
      dispatchEvent;
      registerMessage.style.display = "block";
      registerMessage.textContent = "Username already exists.";
      registerMessage.style.color = "red";
      return;
    }

    if (password !== confirmPassword) {
      registerMessage.textContent = "Passwords do not match.";
      registerMessage.style.display = "block";
      registerMessage.style.color = "red";
      return;
    }

    users.push({
      username,
      password,
      dateCreated: new Date().toLocaleDateString("en-GB"),
      email: "",
      image: "",
      playlists: {
        "Liked Songs": [],
      },
    });

    localStorage.setItem("users", JSON.stringify(users));

    registerMessage.style.display = "block";
    registerMessage.textContent = "Account created!";
    registerMessage.style.color = "green";

    setTimeout(() => {
      registerMessage.style.display = "none";
      registerForm.reset();
      registerModal.style.display = "none";

      logInModal.style.display = "flex";
    }, 2000);
  });

  const registerInputs = registerForm.querySelectorAll("input");

  registerInputs.forEach((input) => {
    input.addEventListener("input", () => {
      registerMessage.textContent = "";
      registerMessage.style.display = "none";
    });
  });
}
