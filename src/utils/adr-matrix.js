import { adrMatrixData } from "../data/adr-data.js";

export function initADRMatrix() {
  const tabsContainer = document.querySelector("#adr-tabs");
  const displayCard = document.querySelector("#adr-display-card");

  if (!tabsContainer || !displayCard) return;

  // Render Tabs
  tabsContainer.innerHTML = adrMatrixData
    .map(
      (item, idx) => `
      <button class="adr-tab-btn ${idx === 0 ? "is-active" : ""}" data-adr-id="${item.id}" type="button">
        <span class="adr-tab-domain">${item.domain}</span>
        <span class="adr-tab-title">${item.title}</span>
      </button>
    `
    )
    .join("");

  function renderADR(id) {
    const data = adrMatrixData.find((item) => item.id === id);
    if (!data) return;

    // Update active tab style
    const tabBtns = tabsContainer.querySelectorAll(".adr-tab-btn");
    tabBtns.forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-adr-id") === id);
    });

    displayCard.innerHTML = `
      <header class="adr-card-header">
        <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 6px;">
          <span class="tech-tag" style="background: rgba(56, 189, 248, 0.15); color: var(--accent-blue); border-color: rgba(56, 189, 248, 0.3); font-size: 0.68rem;">OFFICIAL ADR</span>
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">${data.domain}</span>
        </div>
        <h3 style="font-size: 1.35rem; margin-bottom: var(--space-2);">${data.title}</h3>
        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 0;">
          <strong style="color: var(--text);">Context &amp; Challenge:</strong> ${data.problem}
        </p>
      </header>

      <div class="adr-comparison-grid">
        <!-- Option A Card -->
        <div class="adr-option-card option-a">
          <div class="option-header">
            <span class="option-badge">ALTERNATIVE EVALUATED</span>
            <h4>${data.optionA.name}</h4>
          </div>
          <ul class="option-specs">
            <li><strong>Avg Latency:</strong> ${data.optionA.latency}</li>
            <li><strong>Consistency Guarantee:</strong> ${data.optionA.consistency}</li>
            <li><strong>Operational Complexity:</strong> ${data.optionA.complexity}</li>
            <li><strong>Failure Mode:</strong> ${data.optionA.failureMode}</li>
          </ul>
        </div>

        <!-- Option B Card (Chosen) -->
        <div class="adr-option-card option-b is-chosen">
          <div class="option-header">
            <span class="option-badge chosen-badge">SELECTED ARCHITECTURE</span>
            <h4>${data.optionB.name}</h4>
          </div>
          <ul class="option-specs">
            <li><strong>Avg Latency:</strong> ${data.optionB.latency}</li>
            <li><strong>Consistency Guarantee:</strong> ${data.optionB.consistency}</li>
            <li><strong>Operational Complexity:</strong> ${data.optionB.complexity}</li>
            <li><strong>Failure Mode:</strong> ${data.optionB.failureMode}</li>
          </ul>
        </div>
      </div>

      <div class="adr-decision-rationale">
        <div class="rationale-title">Architect's Final Rationale &amp; Trade-off Verdict</div>
        <p>${data.architectDecision}</p>
      </div>
    `;
  }

  tabsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".adr-tab-btn");
    if (!btn) return;
    const id = btn.getAttribute("data-adr-id");
    renderADR(id);
  });

  // Initial load
  if (adrMatrixData.length > 0) {
    renderADR(adrMatrixData[0].id);
  }
}
