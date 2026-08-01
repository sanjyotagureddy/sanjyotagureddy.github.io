export function initNavigation() {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector("#nav-toggle");
  const primaryNav = document.querySelector("#primary-nav");
  const navLinks = document.querySelectorAll(".nav-list a");

  if (!navToggle || !primaryNav) return;

  function toggleMenu(open) {
    const isExpanded = open !== undefined ? open : navToggle.getAttribute("aria-expanded") !== "true";
    navToggle.setAttribute("aria-expanded", isExpanded);
    primaryNav.classList.toggle("is-open", isExpanded);
    if (header) header.classList.toggle("nav-open", isExpanded);
  }

  navToggle.addEventListener("click", () => {
    toggleMenu();
  });

  // Close menu when clicking any navigation link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      toggleMenu(false);
    });
  });

  // Close menu when clicking outside header
  document.addEventListener("click", (e) => {
    if (header && !header.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Close menu on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      toggleMenu(false);
    }
  });
}
