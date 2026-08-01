import { experienceData } from "../data/experience-data.js";

export function initExperienceTimeline() {
  const timeline = document.querySelector("#experience-timeline");
  if (!timeline) return;

  const rail = timeline.querySelector("#experience-rail");
  const focusCard = timeline.querySelector("#experience-focus");

  if (!rail || !focusCard) return;

  // Render Left Rails
  rail.innerHTML = experienceData
    .map((exp, index) => {
      const roleTitle = exp.roles[0]?.title || "Engineer";
      return `
        <button class="rail-item ${index === 0 ? "is-active" : ""}" type="button" data-exp="${exp.key}" aria-current="${index === 0 ? "true" : "false"}">
          <img src="${exp.logo || './images/jpmorgan.png'}" alt="${exp.company} logo" class="company-logo" width="32" height="32" />
          <span class="rail-text">
            <strong>${exp.company}</strong>
            <span>${exp.period}</span>
          </span>
        </button>
      `;
    })
    .join("");

  // Render Card Details for Selected Job
  function renderJobDetails(expKey) {
    const exp = experienceData.find((item) => item.key === expKey);
    if (!exp) return;

    // Build roles lists
    const rolesHTML = exp.roles
      .map((role) => `<li>${role.title} (${role.date})</li>`)
      .join("");

    // Build accomplishments list
    const highlightsHTML = exp.highlights
      .map((hl) => `<li>${hl}</li>`)
      .join("");

    // Build tech tag list
    const techHTML = exp.techStack
      .map((tech) => `<span class="tech-tag">${tech}</span>`)
      .join("");

    focusCard.innerHTML = `
      <div class="card highlight-blue">
        <header class="exp-header">
          <div class="exp-brand">
            <img src="${exp.logo}" alt="${exp.company} logo" class="company-logo" width="36" height="36" />
            <h3>${exp.company}</h3>
          </div>
          <span class="meta">${exp.location}</span>
        </header>

        <ul class="role-list">
          ${rolesHTML}
        </ul>

        <div class="scope-grid">
          <div class="scope-item">
            <span class="label">Devs Influenced</span>
            <span class="value">${exp.scope.engineers}</span>
          </div>
          <div class="scope-item">
            <span class="label">Core Metrics</span>
            <span class="value">${exp.scope.impact}</span>
          </div>
          <div class="scope-item">
            <span class="label">Scope / Focus</span>
            <span class="value">${exp.scope.focus}</span>
          </div>
        </div>

        <ul class="detail-list">
          ${highlightsHTML}
        </ul>

        <div class="tech-tag-list">
          ${techHTML}
        </div>
      </div>
    `;
  }

  // Setup click listeners on rails
  const railItems = Array.from(rail.querySelectorAll(".rail-item"));
  railItems.forEach((item) => {
    item.addEventListener("click", () => {
      const expKey = item.dataset.exp;
      if (!expKey) return;

      // Update active state in rail
      railItems.forEach((railBtn) => {
        const isActive = railBtn.dataset.exp === expKey;
        railBtn.classList.toggle("is-active", isActive);
        railBtn.setAttribute("aria-current", isActive ? "true" : "false");
      });

      renderJobDetails(expKey);
    });
  });

  // Render initial first item
  if (experienceData.length > 0) {
    renderJobDetails(experienceData[0].key);
  }
}
