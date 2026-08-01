export function initModernizationPlaybook() {
  const slider = document.querySelector("#modernization-slider");
  const diagramPanel = document.querySelector("#playbook-diagram");
  const stepTitle = document.querySelector("#playbook-title");
  const stepDesc = document.querySelector("#playbook-desc");
  const stepDetails = document.querySelector("#playbook-details");
  const labels = Array.from(document.querySelectorAll(".slider-label-item"));

  if (!slider || !diagramPanel || !stepTitle || !stepDesc || !stepDetails) return;

  const playbookSteps = {
    1: {
      title: "Step 1: The Legacy Monolith",
      description: "Core billing, catalog, shipping, and user databases exist within a single monolithic boundaries. High coupling creates deployment barriers, making scaling single features impossible.",
      details: [
        "Synchronous client queries lock application threads.",
        "Shared SQL Server database handles transactional flows + heavy reports.",
        "Deployment blocks: a change in shipping delays inventory releases."
      ],
      markup: `
        <div class="mod-block-container">
          <div class="mod-box monolith">
            <h3>LOGISTICS MONOLITH</h3>
            <p>UI, Core Billing, Inventory, DB Access (Synchronous)</p>
          </div>
        </div>
      `
    },
    2: {
      title: "Step 2: Strangler Fig Gateway",
      description: "Introduce AWS API Gateway at the ingress layer. Standardize endpoints and prepare to intercept client calls, routing them dynamically without updating client applications.",
      details: [
        "Injected API Gateway handles authentication and edge logs.",
        "Direct routing maps match existing legacy API structures.",
        "Client remains decoupled from internal architectural transitions."
      ],
      markup: `
        <div class="mod-block-container">
          <div class="mod-box microservice" style="background: var(--accent-blue-glow); border-color: var(--accent-blue); box-shadow: var(--shadow-neon-blue)">
            <h3>API GATEWAY</h3>
            <p>Edge Router & Auth</p>
          </div>
          <div class="mod-arrow active">➔</div>
          <div class="mod-box monolith">
            <h3>LOGISTICS MONOLITH</h3>
            <p>Legacy processing (Ingress decoupled)</p>
          </div>
        </div>
      `
    },
    3: {
      title: "Step 3: Event Extraction & CDC Sync",
      description: "Carve out the Orders module into a .NET Core microservice. Stream changes from the legacy database using Debezium CDC (Change Data Capture) and Confluent Kafka to maintain data parity.",
      details: [
        "Used Change Data Capture (CDC) on the monolith DB to stream updates to the new microservice DB.",
        "Both systems ran in parallel, validating data integrity before switching write traffic.",
        "Eliminated risky big-bang cutovers through parallel replication and verification."
      ],
      markup: `
        <div class="mod-block-container" style="flex-wrap: wrap; max-width: 440px;">
          <div class="mod-box microservice" style="grid-column: 1 / span 2; width: 100%; margin-bottom: 8px;">
            <h3>API GATEWAY</h3>
          </div>
          <div style="display: flex; gap: 12px; width: 100%; justify-content: center; align-items: center;">
            <div class="mod-box microservice">
              <h4>ORDER MS</h4>
              <p>.NET Core</p>
            </div>
            <div class="mod-arrow active">⇆</div>
            <div class="mod-box monolith legacy-shrink">
              <h4>MONOLITH</h4>
              <p>Legacy core</p>
            </div>
          </div>
          <div style="font-family: var(--font-mono); font-size: 9px; color: var(--accent-purple); border: 1px dashed var(--accent-purple); padding: 4px; border-radius: 4px; width: 100%; text-align: center; margin-top: 6px;">
            ✦ KAFKA EVENT CDC SYNC BUS (ACTIVE)
          </div>
        </div>
      `
    },
    4: {
      title: "Step 4: Fully Decoupled & Distributed",
      description: "The legacy monolith is retired. All modules operate as autonomous microservices talking asynchronously over Kafka, deployed to AWS ECS Fargate, scaling independently.",
      details: [
        "Autonomous Microservices scale up/down dynamically on AWS Fargate.",
        "Eventual consistency handled via Event-Driven pub/sub patterns.",
        "Zero monolith dependencies remaining, enabling 20% faster deliveries."
      ],
      markup: `
        <div class="mod-block-container">
          <div class="mod-box microservice" style="background: var(--accent-blue-glow); border-color: var(--accent-blue); box-shadow: var(--shadow-neon-blue)">
            <h4>API GATEWAY</h4>
          </div>
          <div class="mod-arrow active">➔</div>
          <div class="mod-box microservice">
            <h4>ORDER MS</h4>
            <p>.NET 8 ECS</p>
          </div>
          <div class="mod-arrow active">➔</div>
          <div class="mod-box microservice" style="background: var(--accent-purple-glow); border-color: var(--accent-purple); box-shadow: var(--shadow-neon-purple)">
            <h4>KAFKA</h4>
            <p>Event Broker</p>
          </div>
        </div>
      `
    }
  };

  function updatePlaybookStep(step) {
    const data = playbookSteps[step];
    if (!data) return;

    // Update active label styling
    labels.forEach((label) => {
      const active = parseInt(label.getAttribute("data-step")) === step;
      label.classList.toggle("active", active);
    });

    // Update text content
    stepTitle.textContent = data.title;
    stepDesc.textContent = data.description;
    
    // Update bullet list
    stepDetails.innerHTML = data.details
      .map((detail) => `<li>${detail}</li>`)
      .join("");

    // Update visual diagram
    diagramPanel.innerHTML = data.markup;
  }

  // Slider change listener
  slider.addEventListener("input", (e) => {
    const step = parseInt(e.target.value);
    updatePlaybookStep(step);
  });

  // Label click listeners
  labels.forEach((label) => {
    label.addEventListener("click", () => {
      const step = parseInt(label.getAttribute("data-step"));
      slider.value = step;
      updatePlaybookStep(step);
    });
  });

  // Init Step 1
  updatePlaybookStep(1);
}
export default initModernizationPlaybook;
