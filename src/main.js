import { initTheme } from "./utils/theme.js";
import { initReveal } from "./utils/reveal.js";
import { initExperienceTimeline } from "./utils/experience-timeline.js";
import { initSimulator } from "./utils/simulator.js";
import { initModernizationPlaybook } from "./utils/modernization.js";
import { projectsData } from "./data/projects-data.js";

// Initialize UI controllers
initTheme();
initReveal();
initExperienceTimeline();
initSimulator();
initModernizationPlaybook();

// Dynamically Render Projects
const projectsGrid = document.querySelector("#projects-grid");
if (projectsGrid) {
  projectsGrid.innerHTML = projectsData
    .map((p) => {
      let cardHighlight = "highlight-blue";
      if (p.icon === "ai") cardHighlight = "highlight-purple";
      if (p.icon === "security") cardHighlight = "highlight-amber";
      if (p.icon === "modernization") cardHighlight = "highlight-teal";

      return `
        <article class="card ${cardHighlight} reveal">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: var(--space-2);">
            <span class="meta" style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);">${p.category}</span>
          </div>
          <h3 style="margin-bottom: var(--space-3); font-size: 1.25rem;">${p.title}</h3>
          <p style="margin-bottom: var(--space-2); font-size: 0.88rem; line-height: 1.5;">
            <strong style="color: var(--text);">Problem:</strong> ${p.problem}
          </p>
          <p style="margin-bottom: var(--space-2); font-size: 0.88rem; line-height: 1.5;">
            <strong style="color: var(--text);">Solution:</strong> ${p.solution}
          </p>
          <p style="margin-bottom: var(--space-4); font-size: 0.88rem; line-height: 1.5;">
            <strong style="color: var(--text);">Impact:</strong> ${p.impact}
          </p>
          <p class="stack" style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--primary); background: var(--bg-elevated); padding: 4px 8px; border-radius: 4px; display: inline-block; border: 1px solid var(--border);">${p.stack}</p>
        </article>
      `;
    })
    .join("");
}
