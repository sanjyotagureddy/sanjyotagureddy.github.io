import { initTheme } from "./utils/theme.js";
import { initReveal } from "./utils/reveal.js";
import { initExperienceTimeline } from "./utils/experience-timeline.js";
import { initSimulator } from "./utils/simulator.js";
import { initModernizationPlaybook } from "./utils/modernization.js";
import { projectsData } from "./data/projects-data.js";

// Initialize UI controllers
initTheme();
initExperienceTimeline();
initSimulator();
initModernizationPlaybook();

// Dynamically Render Projects Section
const projectsGrid = document.querySelector("#projects-grid");
if (projectsGrid) {
  projectsGrid.innerHTML = projectsData
    .map((p, index) => {
      let cardHighlight = "highlight-blue";
      if (p.icon === "ai") cardHighlight = "highlight-purple";
      if (p.icon === "security") cardHighlight = "highlight-amber";
      if (p.icon === "modernization") cardHighlight = "highlight-teal";

      return `
        <article class="card ${cardHighlight} reveal" data-project-index="${index}" style="cursor: pointer;" title="Click to view interactive system design & resiliency flows">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: var(--space-2);">
            <span class="meta" style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);">${p.category}</span>
            <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--primary);">Interactive Blueprint ➔</span>
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

  // Event Delegation for Project Modals
  projectsGrid.addEventListener("click", (e) => {
    const card = e.target.closest("article.card");
    if (!card) return;

    const index = parseInt(card.getAttribute("data-project-index"));
    const project = projectsData[index];
    if (project) {
      openProjectModal(project);
    }
  });
}

// ==========================================================================
// Interactive Modal SVG Mesh Generator
// ==========================================================================
function generateModalMeshSVG(mesh, mode) {
  const nodesMap = new Map(mesh.nodes.map(n => [n.id, n]));
  const nodeWidth = 110;
  const nodeHeight = 44;

  // Generate connector paths
  const pathsHTML = mesh.links.map((link, idx) => {
    const fromNode = nodesMap.get(link.from);
    const toNode = nodesMap.get(link.to);
    if (!fromNode || !toNode) return '';

    const x1 = fromNode.x;
    const y1 = fromNode.y;
    const x2 = toNode.x;
    const y2 = toNode.y;

    const dx = x2 - x1;
    const dy = y2 - y1;
    let d = '';

    // Route connections cleanly between block edges
    if (Math.abs(dx) >= Math.abs(dy)) {
      if (dx > 0) {
        d = `M ${x1 + nodeWidth} ${y1 + (nodeHeight / 2)} H ${x2}`;
      } else {
        d = `M ${x1} ${y1 + (nodeHeight / 2)} H ${x2 + nodeWidth}`;
      }
    } else {
      if (dy > 0) {
        d = `M ${x1 + (nodeWidth / 2)} ${y1 + nodeHeight} V ${y2}`;
      } else {
        d = `M ${x1 + (nodeWidth / 2)} ${y1} V ${y2 + nodeHeight}`;
      }
    }

    // Determine link styles based on the active path toggle (happy vs resilient)
    let pathClass = 'modal-svg-path';
    let pulseColor = '';

    if (link.type === 'both' || link.type === mode) {
      pathClass += ' pulse';
      pulseColor = mode === 'happy' ? 'var(--accent-teal)' : 'var(--accent-amber)';
    } else {
      pathClass += ' inactive';
    }

    return `
      <g>
        <path id="modal-path-${idx}" class="${pathClass}" style="--pulse-color: ${pulseColor}" d="${d}" marker-end="url(#modal-arrow)" />
        ${link.label ? `
          <text x="${x1 + dx/2 + (dx >= 0 ? 30 : -30)}" y="${y1 + dy/2 + (dy >= 0 ? 12 : -12)}" 
                fill="var(--text-muted)" font-family="var(--font-mono)" font-size="6" text-anchor="middle">
            ${link.label}
          </text>` : ''}
      </g>
    `;
  }).join("");

  // Generate node representations
  const nodesHTML = mesh.nodes.map(node => {
    let nodeClass = 'modal-svg-node';
    let nodeStyle = '';

    // Highlight node if part of the active path selection
    const isActive = node.role === 'both' || node.role === mode;
    if (isActive) {
      nodeClass += ' is-active';
      const activeColor = mode === 'happy' ? 'var(--accent-teal)' : 'var(--accent-amber)';
      nodeStyle = `--active-color: ${activeColor}`;
    } else {
      nodeClass += ' inactive';
    }

    return `
      <g class="${nodeClass}" style="${nodeStyle}" transform="translate(${node.x}, ${node.y})">
        <rect width="${nodeWidth}" height="${nodeHeight}" rx="4" />
        <text x="${nodeWidth / 2}" y="18" text-anchor="middle" font-family="var(--font-heading)" font-size="9" font-weight="700">${node.name}</text>
        <text class="tech-label" x="${nodeWidth / 2}" y="30" text-anchor="middle" font-family="var(--font-mono)" font-size="6.5" font-weight="500">${node.tech}</text>
      </g>
    `;
  }).join("");

  return `
    <svg id="modal-mesh-svg" viewBox="0 0 780 260" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; max-height: 260px; display: block; overflow: visible;">
      <defs>
        <marker id="modal-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--border)" />
        </marker>
      </defs>
      ${pathsHTML}
      ${nodesHTML}
    </svg>
  `;
}

// ==========================================================================
// Project Details Modal System
// ==========================================================================
const modal = document.querySelector("#project-modal");
const modalBody = document.querySelector("#modal-body");
const modalClose = document.querySelector("#modal-close");

function openProjectModal(project) {
  if (!modal || !modalBody) return;

  // Build Journey Checklist
  const journeyHTML = project.breakdown.journey
    .map((step, idx) => {
      const parts = step.split(" — ");
      const title = parts[0] || "";
      const text = parts[1] || "";
      return `
        <div class="journey-step">
          <div class="journey-number">${idx + 1}</div>
          <div class="journey-text">
            <strong>${title}</strong>${text ? " — " + text : ""}
          </div>
        </div>
      `;
    })
    .join("");

  // Build Tradeoffs
  const tradeoffsHTML = project.breakdown.tradeoffs
    .map((item) => {
      const parts = item.split(": ");
      const title = parts[0] || "";
      const text = parts[1] || "";
      return `<li><strong>${title}</strong>${text ? ": " + text : ""}</li>`;
    })
    .join("");

  // Inject content details markup
  modalBody.innerHTML = `
    <header class="modal-project-header">
      <span class="meta" style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--primary);">${project.category}</span>
      <h2 class="modal-project-title" id="modal-title" style="margin-top: 4px;">${project.title}</h2>
      <p style="font-size: 0.95rem; margin-top: var(--space-3); color: var(--text-muted); line-height: 1.6;">${project.problem}</p>
    </header>

    <div class="modal-section">
      <div class="modal-section-title">Architectural Evolution Journey</div>
      <div class="journey-checkpoints" style="margin-top: var(--space-3);">
        ${journeyHTML}
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">System Mesh Topology & Data Flow</div>
      <div class="modal-flow-controller" style="display: flex; gap: var(--space-3); margin-top: var(--space-3); margin-bottom: var(--space-3);">
        <button id="modal-flow-btn-happy" class="simulator-btn simulator-btn-teal is-active" style="padding: 6px 14px; font-size: 0.8rem;" type="button">
          <span>Happy Path Flow</span>
        </button>
        <button id="modal-flow-btn-resilient" class="simulator-btn simulator-btn-amber" style="padding: 6px 14px; font-size: 0.8rem;" type="button">
          <span>Resiliency Failover Flow</span>
        </button>
      </div>
      <div class="blueprint-canvas-wrapper" style="border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-4); overflow: hidden; background-color: #020617; max-height: 280px;" id="modal-mesh-canvas">
        <!-- Dynmically generated SVG mesh canvas -->
      </div>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Technical Trade-offs Evaluated</div>
      <ul class="detail-list" style="margin-top: var(--space-3); padding-left: 0;">
        ${tradeoffsHTML}
      </ul>
    </div>

    <div class="modal-section">
      <div class="modal-section-title">Target SLA & Core Telemetry</div>
      <div class="inspector-metric-box" style="margin-top: var(--space-3); border-color: var(--primary); background: var(--bg-elevated); padding: var(--space-3); border-radius: var(--radius-sm); border: 1px dashed var(--border);">
        <div style="font-family: var(--font-mono); font-size: 0.84rem; color: var(--primary);">${project.breakdown.telemetry}</div>
      </div>
    </div>
  `;

  // Bind active mesh controls inside the modal
  const canvas = modalBody.querySelector("#modal-mesh-canvas");
  const btnHappy = modalBody.querySelector("#modal-flow-btn-happy");
  const btnResilient = modalBody.querySelector("#modal-flow-btn-resilient");

  function drawMesh(mode) {
    if (canvas) {
      canvas.innerHTML = generateModalMeshSVG(project.breakdown.mesh, mode);
    }
  }

  // Draw default: Happy Path
  drawMesh("happy");

  if (btnHappy && btnResilient) {
    btnHappy.addEventListener("click", () => {
      btnHappy.classList.add("is-active");
      btnResilient.classList.remove("is-active");
      drawMesh("happy");
    });

    btnResilient.addEventListener("click", () => {
      btnResilient.classList.add("is-active");
      btnHappy.classList.remove("is-active");
      drawMesh("resilient");
    });
  }

  // Show Modal Overlay
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // Prevent backdrop body scrolling
}

function closeProjectModal() {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.removeProperty("overflow");
}

// Bind modal closing listeners
if (modalClose) {
  modalClose.addEventListener("click", closeProjectModal);
}
if (modal) {
  modal.addEventListener("click", (e) => {
    const container = e.target.closest(".modal-container");
    if (!container) {
      closeProjectModal();
    }
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal && modal.classList.contains("is-open")) {
    closeProjectModal();
  }
});

// Initialize scroll reveal animations now that all dynamic DOM nodes exist
initReveal();
