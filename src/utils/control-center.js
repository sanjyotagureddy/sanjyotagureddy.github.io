export function initControlCenter() {
  const trigger = document.querySelector("#control-center-trigger");
  const panel = document.querySelector("#control-center-panel");
  const closeBtn = document.querySelector("#control-panel-close");
  const dossierBtn = document.querySelector("#cc-btn-dossier");
  const themeBtn = document.querySelector("#cc-btn-theme");

  if (!trigger || !panel) return;

  function togglePanel(open) {
    const isExpanded = open !== undefined ? open : !panel.classList.contains("is-open");
    panel.classList.toggle("is-open", isExpanded);
    panel.setAttribute("aria-hidden", (!isExpanded).toString());
    trigger.classList.toggle("is-active", isExpanded);
  }

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    togglePanel();
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => togglePanel(false));
  }

  // Close when clicking outside panel
  document.addEventListener("click", (e) => {
    if (panel.classList.contains("is-open") && !panel.contains(e.target) && !trigger.contains(e.target)) {
      togglePanel(false);
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("is-open")) {
      togglePanel(false);
    }
  });

  // Trigger Executive Dossier Modal from Control Center
  if (dossierBtn) {
    dossierBtn.addEventListener("click", () => {
      togglePanel(false);
      const openDossierBtn = document.querySelector("#open-dossier-btn");
      if (openDossierBtn) {
        openDossierBtn.click();
      }
    });
  }

  // Theme Toggle inside Control Center
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const themeToggleBtn = document.querySelector("#theme-toggle");
      if (themeToggleBtn) {
        themeToggleBtn.click();
      }
    });
  }

  // Close panel on navigating via quick links
  const links = panel.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", () => togglePanel(false));
  });
}
