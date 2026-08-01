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
      title: "Step 1: Bounded Context & Direct Ingress",
      description: "Establish clean bounded contexts on paper. All client queries still enter the legacy monolithic logistics server directly. Code boundaries are coupled and write synchronously to the shared database.",
      details: [
        "Inbound queries lock monolithic IIS/App Server thread pools.",
        "Shared SQL Server database handles transactional workloads + heavy ETL reports.",
        "Deployment blocks: a database schema change in Shipping halts Orders releases."
      ],
      markup: `
        <div class="mod-block-container" style="flex-direction: column; gap: var(--space-4); max-width: 480px; width: 100%;">
          <div style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--text-muted);">CLIENT INGRESS: DIRECT SYNC CONNECTIONS</div>
          <div style="display: flex; align-items: center; gap: var(--space-3); width: 100%; justify-content: center;">
            <div class="mod-arrow active" style="transform: rotate(90deg); margin: 0;">➔</div>
          </div>
          <div class="playbook-monolith-box">
            <div class="playbook-monolith-title">Logistics Monolith (Coupled Core)</div>
            <div class="playbook-module-grid">
              <div class="playbook-module-box">Billing</div>
              <div class="playbook-module-box">Catalog</div>
              <div class="playbook-module-box">Orders</div>
            </div>
            <div style="text-align: center; margin-top: 10px;">
              <div class="playbook-db-box">
                💾 Monolith DB (SQL Server)
              </div>
            </div>
          </div>
        </div>
      `
    },
    2: {
      title: "Step 2: Strangler Fig Gateway Ingress",
      description: "Introduce AWS API Gateway at the client ingress layer. Clients are redirected to Gateway endpoints, which route all traffic to the legacy monolith without updating client applications.",
      details: [
        "AWS API Gateway handles authentication, rate limiting, and edge logs.",
        "Clients decoupled from internal service transitions early in the roadmap.",
        "Gateway rules route 100% of traffic to the monolith, establishing the interception point."
      ],
      markup: `
        <div class="mod-block-container" style="flex-direction: column; gap: var(--space-3); max-width: 480px; width: 100%;">
          <div class="mod-box microservice" style="background: var(--accent-blue-glow); border-color: var(--accent-blue); box-shadow: var(--shadow-neon-blue); width: 85%;">
            <h3>AWS API GATEWAY</h3>
            <p style="font-size: 0.72rem; opacity: 0.8; font-weight: 500;">Interception & Path Routing</p>
          </div>
          <div class="playbook-traffic-split" style="width: 100%;">
            <div class="traffic-split-badge monolith">100% Ingress Routing</div>
            <div class="mod-arrow active" style="transform: rotate(90deg); margin: 0;">➔</div>
          </div>
          <div class="playbook-monolith-box">
            <div class="playbook-monolith-title">Logistics Monolith</div>
            <div class="playbook-module-grid">
              <div class="playbook-module-box">Billing</div>
              <div class="playbook-module-box">Catalog</div>
              <div class="playbook-module-box">Orders</div>
            </div>
            <div style="text-align: center;">
              <div class="playbook-db-box">
                💾 Monolith DB
              </div>
            </div>
          </div>
        </div>
      `
    },
    3: {
      title: "Step 3: Database Event CDC Synchronization",
      description: "Spin up the new Order Microservice shell and its private database. Deploy Debezium Change Data Capture (CDC) to stream commits from the Monolith DB to Kafka, populating PostgreSQL in real-time.",
      details: [
        "Private PostgreSQL database created to hold microservice transaction states.",
        "Debezium CDC connector reads SQL Server transaction logs and publishes updates to Confluent Kafka.",
        "Order Microservice consumes events, populating PostgreSQL to ensure data parity without monolith load."
      ],
      markup: `
        <div class="mod-block-container" style="flex-direction: column; gap: var(--space-2); max-width: 520px; width: 100%;">
          <div style="display: flex; gap: var(--space-4); width: 100%; justify-content: space-between; align-items: stretch;">
            <!-- New Microservice Shell -->
            <div class="mod-box microservice" style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; padding: 10px;">
              <div>
                <h4 style="font-size: 0.8rem; margin: 0 0 4px 0;">Order MS</h4>
                <span class="badge" style="font-size: 0.58rem; background: var(--surface-strong); border-color: var(--accent-teal);">Shell active</span>
              </div>
              <div class="playbook-db-box" style="margin-top: 8px; font-size: 0.65rem; border-color: var(--accent-teal);">
                💾 Private Postgres
              </div>
            </div>

            <!-- Monolith (writes active) -->
            <div class="playbook-monolith-box" style="flex: 1.1; max-width: none; padding: 10px;">
              <div class="playbook-monolith-title" style="margin-bottom: 6px;">Logistics Monolith (Writes active)</div>
              <div class="playbook-module-grid" style="margin-bottom: 6px;">
                <div class="playbook-module-box">Billing</div>
                <div class="playbook-module-box">Catalog</div>
                <div class="playbook-module-box">Orders</div>
              </div>
              <div class="playbook-db-box" style="font-size: 0.65rem;">
                💾 Monolith DB
              </div>
            </div>
          </div>

          <!-- Forward CDC Sync Stream -->
          <div class="playbook-cdc-sync-flow">
            ⚡ FORWARD CDC STREAM (Debezium + Confluent Kafka) ➔
          </div>
        </div>
      `
    },
    4: {
      title: "Step 4: Business Logic & Dual-Write Validation",
      description: "Write C# platform logic in the Order Microservice. Perform parallel validation (dual writes/reads under the hood) and run automated reconciliation engines to check for data drift.",
      details: [
        "Orders logic completely migrated to C# in the Order Microservice.",
        "Reconciliation engine compares transactional records in both SQL Server and PostgreSQL databases.",
        "Identifies and resolves schema discrepancies (e.g. decimal precision, datetime zones) without customer impact."
      ],
      markup: `
        <div class="mod-block-container" style="flex-direction: column; gap: var(--space-2); max-width: 520px; width: 100%;">
          <div class="mod-box microservice" style="background: var(--accent-blue-glow); border-color: var(--accent-blue); box-shadow: var(--shadow-neon-blue); width: 90%; padding: 6px 10px;">
            <h4 style="margin: 0; font-size: 0.82rem;">AWS API GATEWAY (Canary Validation)</h4>
          </div>

          <div style="display: flex; gap: var(--space-4); width: 100%; justify-content: space-between; align-items: stretch; margin-top: 6px;">
            <div class="mod-box microservice" style="flex: 1; padding: 10px;">
              <h4 style="font-size: 0.8rem; margin: 0 0 4px 0;">Order MS</h4>
              <div class="playbook-db-box" style="font-size: 0.65rem; border-color: var(--accent-teal);">
                💾 Private Postgres
              </div>
            </div>
            
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 4px; font-family: var(--font-mono); font-size: 0.58rem; color: var(--accent-rose);">
              <span>🔍 DUAL-WRITE</span>
              <span style="font-size: 0.8rem;">⇆</span>
              <span>RECONCILIATION</span>
            </div>

            <div class="playbook-monolith-box" style="flex: 1.1; max-width: none; padding: 10px;">
              <div class="playbook-monolith-title" style="margin-bottom: 6px;">Logistics Monolith</div>
              <div class="playbook-db-box" style="font-size: 0.65rem;">
                💾 Monolith DB
              </div>
            </div>
          </div>
        </div>
      `
    },
    5: {
      title: "Step 5: Write Cutover & Reverse CDC Safety Net",
      description: "Route a portion (e.g. 10%) of orders write traffic to the new Microservice. Critically, set up reverse CDC sync from Postgres back to SQL Server to establish a zero-data-loss rollback safety net.",
      details: [
        "API Gateway routes canary order writes directly to the new Order Microservice.",
        "Reverse CDC synchronizes Order Microservice database commits back to the legacy database.",
        "Rollback Safe: If a bug occurs, traffic defaults back to the monolith without losing transactions."
      ],
      markup: `
        <div class="mod-block-container" style="flex-direction: column; gap: var(--space-2); max-width: 520px; width: 100%;">
          <!-- API Ingress Router -->
          <div class="mod-box microservice" style="background: var(--accent-blue-glow); border-color: var(--accent-blue); box-shadow: var(--shadow-neon-blue); width: 90%; padding: 8px;">
            <h4 style="margin: 0; font-size: 0.82rem;">AWS API GATEWAY</h4>
          </div>

          <!-- Split routing diagram -->
          <div style="display: flex; justify-content: space-between; width: 100%; padding: 0 40px; margin: 4px 0;">
            <div class="playbook-traffic-split" style="align-items: flex-start;">
              <span class="traffic-split-badge happy">Canary (10% writes)</span>
              <div class="mod-arrow active" style="transform: rotate(120deg); transform-origin: top left;">➔</div>
            </div>
            <div class="playbook-traffic-split" style="align-items: flex-end;">
              <span class="traffic-split-badge monolith">Legacy (90%)</span>
              <div class="mod-arrow active" style="transform: rotate(60deg); transform-origin: top right;">➔</div>
            </div>
          </div>

          <!-- Components Row -->
          <div style="display: flex; gap: var(--space-4); width: 100%; justify-content: space-between; align-items: stretch;">
            <!-- New Microservice (Writes active) -->
            <div class="mod-box microservice" style="flex: 1; padding: 10px;">
              <h4 style="font-size: 0.8rem; margin: 0 0 4px 0;">Order MS</h4>
              <div class="playbook-db-box" style="font-size: 0.65rem; border-color: var(--accent-teal);">
                💾 Private Postgres
              </div>
            </div>

            <!-- Legacy Monolith -->
            <div class="playbook-monolith-box legacy-shrink" style="flex: 1.1; max-width: none; padding: 10px;">
              <div class="playbook-monolith-title" style="margin-bottom: 6px;">Logistics Monolith</div>
              <div class="playbook-module-grid" style="margin-bottom: 6px;">
                <div class="playbook-module-box">Billing</div>
                <div class="playbook-module-box">Catalog</div>
                <div class="playbook-module-box deprecated">Orders</div>
              </div>
              <div class="playbook-db-box" style="font-size: 0.65rem;">
                💾 Monolith DB
              </div>
            </div>
          </div>

          <!-- Reverse CDC Sync -->
          <div class="playbook-cdc-sync-flow" style="border-top-color: var(--accent-rose); color: var(--accent-rose);">
            ⬅ REVERSE CDC SYNC (ROLLBACK SAFETY NET)
          </div>
        </div>
      `
    },
    6: {
      title: "Step 6: Complete Decoupling & Monolith Decommission",
      description: "Shift 100% of read and write traffic to the Order Microservice. Decommission the reverse CDC replication stream, remove the orders code from the monolith, and transition it to decommissioned status.",
      details: [
        "100% of Order traffic routed directly to the autonomous Order Microservice.",
        "Monolithic order tables retired; other services (Billing, Catalog) follow the fig pattern.",
        "Confluent Kafka event backbone handles all asynchronous workflows and inter-service telemetry."
      ],
      markup: `
        <div class="mod-block-container" style="flex-direction: column; gap: var(--space-4); max-width: 500px; width: 100%;">
          <!-- API Ingress Router -->
          <div class="mod-box microservice" style="background: var(--accent-blue-glow); border-color: var(--accent-blue); box-shadow: var(--shadow-neon-blue); width: 90%; padding: 10px;">
            <h4 style="margin: 0; font-size: 0.85rem;">AWS API GATEWAY</h4>
          </div>
          
          <div style="display: flex; gap: var(--space-3); width: 100%; justify-content: center; align-items: stretch;">
            <!-- Order microservice -->
            <div class="mod-box microservice" style="flex: 1; padding: 10px;">
              <h4 style="font-size: 0.8rem; margin: 0 0 4px 0;">Order MS</h4>
              <p style="font-size: 0.65rem; opacity: 0.8; font-weight: 500; margin-bottom: 6px;">.NET 8 ECS</p>
              <div class="playbook-db-box" style="font-size: 0.65rem; border-color: var(--accent-teal);">
                💾 PG DB
              </div>
            </div>

            <!-- Event backbone -->
            <div class="mod-box microservice" style="flex: 1; background: var(--accent-purple-glow); border-color: var(--accent-purple); box-shadow: var(--shadow-neon-purple); display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px;">
              <h4 style="font-size: 0.8rem; margin: 0 0 2px 0;">Confluent</h4>
              <h4 style="font-size: 0.8rem; margin: 0 0 4px 0;">Kafka</h4>
              <span class="badge" style="font-size: 0.58rem; background: var(--surface-strong); border-color: var(--accent-purple);">Event Backbone</span>
            </div>

            <!-- Billing microservice -->
            <div class="mod-box microservice" style="flex: 1; padding: 10px;">
              <h4 style="font-size: 0.8rem; margin: 0 0 4px 0;">Billing MS</h4>
              <p style="font-size: 0.65rem; opacity: 0.8; font-weight: 500; margin-bottom: 6px;">.NET 8 ECS</p>
              <div class="playbook-db-box" style="font-size: 0.65rem; border-color: var(--accent-teal);">
                💾 Billing DB
              </div>
            </div>
          </div>

          <!-- Decommissioned Monolith Faded -->
          <div class="playbook-monolith-box decommissioned" style="padding: 6px;">
            <div class="playbook-monolith-title" style="margin-bottom: 0;">🚫 LOGISTICS MONOLITH (RETIRED & DECOMMISSIONED)</div>
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
