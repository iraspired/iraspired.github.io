document.addEventListener("DOMContentLoaded", () => {
  const currentTimeDisplay = document.getElementById("currentTime");
  const navItems = document.querySelectorAll(".nav-item");
  const screens = document.querySelectorAll(".content");
  const appContainer = document.querySelector(".app-container");
  const gradientOptions = document.querySelectorAll(".gradient-option");

  // Function to update the current time
  function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    currentTimeDisplay.textContent = `${hours}:${minutes}`;
  }

  // Update time initially and then every second
  updateTime();
  setInterval(updateTime, 1000);

  // Navigation Logic
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent default link behavior
      const targetScreenId = item.dataset.target;

      // Remove active class from all nav items
      navItems.forEach((nav) => nav.classList.remove("active"));
      // Add active class to the clicked nav item
      item.classList.add("active");

      // Hide all screens
      screens.forEach((screen) => screen.classList.add("hidden"));
      // Show the target screen
      document.getElementById(targetScreenId).classList.remove("hidden");

      // Scroll content to top when switching screens
      appContainer.scrollTop = 0;
    });
  });

  // Theme Selection Logic
  gradientOptions.forEach((option) => {
    option.addEventListener("click", () => {
      // Remove selected class from all options
      gradientOptions.forEach((opt) => opt.classList.remove("selected"));
      // Add selected class to the clicked option
      option.classList.add("selected");

      // Apply the selected gradient to the body
      const gradientValue = option.dataset.gradient;
      document.documentElement.style.setProperty(
        "--primary-bg-gradient",
        gradientValue,
      ); // Update CSS variable
      localStorage.setItem("selectedGradient", gradientValue); // Save preference
    });
  });

  // Load saved theme preference
  const savedGradient = localStorage.getItem("selectedGradient");
  if (savedGradient) {
    document.documentElement.style.setProperty(
      "--primary-bg-gradient",
      savedGradient,
    );
    // Also mark the corresponding gradient option as selected
    gradientOptions.forEach((option) => {
      if (option.dataset.gradient === savedGradient) {
        option.classList.add("selected");
      }
    });
  } else {
    // If no saved gradient, select the first one by default
    if (gradientOptions.length > 0) {
      gradientOptions[0].classList.add("selected");
    }
  }
});
