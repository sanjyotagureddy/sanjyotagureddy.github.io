const storageKey = "portfolio-theme";

function resolveInitialTheme() {
  const saved = localStorage.getItem(storageKey);
  if (saved === "light" || saved === "dark") {
    return saved;
  }
  return "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function updateToggleLabel(button, theme) {
  const icon = button.querySelector(".theme-toggle-icon");
  const isDark = theme === "dark";

  if (icon) {
    icon.textContent = isDark ? "☀" : "☾";
  }

  button.setAttribute("aria-pressed", String(isDark));
  button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  button.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
}

export function initTheme() {
  const button = document.querySelector("#theme-toggle");
  if (!button) return;

  let currentTheme = resolveInitialTheme();
  applyTheme(currentTheme);
  updateToggleLabel(button, currentTheme);

  button.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(currentTheme);
    updateToggleLabel(button, currentTheme);
    localStorage.setItem(storageKey, currentTheme);
  });
}
