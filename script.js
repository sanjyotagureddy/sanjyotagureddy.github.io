// Dark/Light Mode Toggle
const themeToggleButton = document.getElementById("theme-toggle");
const body = document.body;

// Toggle the theme between dark and light
function toggleTheme() {
  body.classList.toggle("dark");
  updateThemeIcon();
  // Save the theme in localStorage
  localStorage.setItem(
    "theme",
    body.classList.contains("dark") ? "dark" : "light"
  );
}

// Update theme icon based on the current theme
function updateThemeIcon() {
  if (body.classList.contains("dark")) {
    themeToggleButton.textContent = "☀️"; // Sun icon for light mode
    themeToggleButton.setAttribute("data-tooltip", "Switch to Light Mode"); // Tooltip text for dark mode
  } else {
    themeToggleButton.textContent = "🌙"; // Moon icon for dark mode
    themeToggleButton.setAttribute("data-tooltip", "Switch to Dark Mode"); // Tooltip text for light mode
  }
}

// Set the initial theme based on localStorage
function setInitialTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark"); // Apply dark mode
  } else {
    body.classList.remove("dark"); // Apply light mode
  }
  updateThemeIcon(); // Update the button icon and tooltip text
}

// Initially set the correct theme and icon on page load
setInitialTheme();

// Listen for the toggle button click event to switch themes
themeToggleButton.addEventListener("click", toggleTheme);

