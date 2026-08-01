import { blueprintData } from "../data/blueprint-data.js";

export function initSimulator() {
  const svg = document.querySelector("#blueprint-svg");
  const inspector = document.querySelector("#node-inspector");
  const consoleScreen = document.querySelector("#console-screen");
  const scenarioBtns = Array.from(document.querySelectorAll(".simulator-btn"));

  if (!svg || !inspector || !consoleScreen) return;

  const svgNodes = Array.from(svg.querySelectorAll(".svg-node"));
  const svgPaths = Array.from(svg.querySelectorAll(".svg-path"));

  // ==========================================================================
  // Inspector Node Explorer Logic
  // ==========================================================================
  
  function inspectNode(nodeKey) {
    const data = blueprintData[nodeKey];
    if (!data) return;

    // Set active class on visual SVG nodes
    svgNodes.forEach((node) => {
      const isActive = node.getAttribute("data-node") === nodeKey;
      node.classList.toggle("is-active", isActive);
    });

    // Determine Accent Color based on node type
    let accentColor = "var(--primary)";
    if (nodeKey === "gateway" || nodeKey === "observability") accentColor = "var(--accent-blue)";
    if (nodeKey === "broker") accentColor = "var(--accent-purple)";
    if (nodeKey === "core" || nodeKey === "worker") accentColor = "var(--accent-teal)";
    if (nodeKey === "database" || nodeKey === "cache") accentColor = "var(--accent-amber)";
    if (nodeKey === "security") accentColor = "var(--accent-purple)";

    // Update inspector contents
    inspector.innerHTML = `
      <div class="inspector-content" style="--node-accent: ${accentColor}">
        <header class="inspector-header">
          <h3>${data.name}</h3>
          <div class="inspector-subtitle">${data.subtitle}</div>
        </header>
        <div class="inspector-block">
          <div class="inspector-block-title">Component Role</div>
          <p>${data.description}</p>
        </div>
        <div class="inspector-block">
          <div class="inspector-block-title">Architect's Contribution</div>
          <p>${data.architectRole}</p>
        </div>
        <div class="inspector-block">
          <div class="inspector-block-title">Trade-offs Evaluated</div>
          <p>${data.tradeoff}</p>
        </div>
        <div class="inspector-metric-box">
          <div class="inspector-block-title">Target SLA / Telemetry</div>
          <div>${data.metrics}</div>
        </div>
      </div>
    `;
  }

  // Click listeners on SVG nodes
  svgNodes.forEach((node) => {
    node.addEventListener("click", (e) => {
      e.stopPropagation();
      const nodeKey = node.getAttribute("data-node");
      inspectNode(nodeKey);
    });
  });

  // Reset node highlights if clicking empty space in canvas
  svg.addEventListener("click", () => {
    svgNodes.forEach((node) => node.classList.remove("is-active"));
    resetInspector();
  });

  function resetInspector() {
    inspector.innerHTML = `
      <div class="inspector-empty">
        <div class="inspector-empty-icon">⎔</div>
        <h3>Architect Inspector</h3>
        <p>Select any node in the system design diagram to analyze decisions, architectural trade-offs, and metric thresholds.</p>
      </div>
    `;
  }

  // ==========================================================================
  // Console Logging Terminal Simulator Logic
  // ==========================================================================
  
  let printInterval = null;

  function writeLinesToConsole(lines) {
    // Clear any active typing sequence
    if (printInterval) clearInterval(printInterval);
    consoleScreen.innerHTML = "";

    let lineIndex = 0;
    
    function printNextLine() {
      if (lineIndex >= lines.length) {
        clearInterval(printInterval);
        return;
      }
      
      const lineData = lines[lineIndex];
      const div = document.createElement("div");
      div.className = `console-line ${lineData.type || "info"}`;
      
      // Prefix prompt for command commands
      const prefixHTML = lineData.type === "system" ? '<span class="prefix">&gt;</span>' : "";
      
      div.innerHTML = `${prefixHTML}${lineData.text}`;
      consoleScreen.appendChild(div);
      consoleScreen.scrollTop = consoleScreen.scrollHeight;
      
      lineIndex++;
    }

    printNextLine();
    printInterval = setInterval(printNextLine, 500); // Print a line every 500ms
  }

  // Scenarios Configurations
  const scenarios = {
    spike: {
      btnClass: "simulator-btn-blue",
      nodes: ["gateway", "core", "broker", "worker"],
      activePaths: ["path-gw-core", "path-core-broker", "path-broker-worker"],
      lines: [
        { type: "system", text: "exec simulate-load-spike --target=ecs-core --tps=10000" },
        { type: "info", text: "[00:01] Loading simulator metrics pipeline..." },
        { type: "warning", text: "[00:03] WARNING: Gateway ingress exceeding threshold. 10.4k req/sec detected." },
        { type: "info", text: "[00:04] ECS Autoscaling Group triggered. Launching 8 additional Fargate tasks..." },
        { type: "info", text: "[00:06] Partition load balanced. Offloading queue backlog to Kafka partitions [0-11]." },
        { type: "success", text: "[00:09] ECS instances stabilized. 10 active nodes. Lag dropped to 14 messages." },
        { type: "success", text: "[00:10] SIMULATION RESOLVED: Throughput capacity operating at 100% SLA." }
      ]
    },
    failover: {
      btnClass: "simulator-btn-rose",
      nodes: ["core", "database"],
      activePaths: ["path-core-db"],
      lines: [
        { type: "system", text: "exec trigger-failover --db=rds-postgresql-primary" },
        { type: "info", text: "[00:01] Injecting connection partition fault on PostgreSQL Master port 5432..." },
        { type: "warning", text: "[00:03] EXCEPTION: Timeout connecting to Host rds-pg-primary.amazonaws.com." },
        { type: "warning", text: "[00:04] CIRCUIT BREAKER: PostgreSQL client pool disconnected. Activating Outbox flow." },
        { type: "info", text: "[00:05] OUTBOX PATTERN: Diverting 182 transaction records to local sqlite cache queue." },
        { type: "info", text: "[00:07] Multi-AZ Failover active. Promoting Read Replica rds-pg-replica-01 to master..." },
        { type: "success", text: "[00:09] Database connectivity restored on promoted master. Syncing schemas..." },
        { type: "info", text: "[00:10] Flush outbox pipeline triggered. Publishing 182 cached transactions..." },
        { type: "success", text: "[00:12] SIMULATION RESOLVED: All outbox messages flushed. 0 records lost. Uptime intact." }
      ]
    },
    secrets: {
      btnClass: "simulator-btn-purple",
      nodes: ["security", "core", "database"],
      activePaths: ["path-sec-core", "path-sec-db"],
      lines: [
        { type: "system", text: "exec cron-rotate-credentials --vault=aws-secrets-manager --days=30" },
        { type: "info", text: "[00:01] Triggering scheduled credential rotation for PostgreSQL database..." },
        { type: "info", text: "[00:03] AWS Lambda rotater function initialized." },
        { type: "info", text: "[00:04] Generating fresh cryptographic password token. Injecting into database." },
        { type: "success", text: "[00:06] PostgreSQL master credentials updated in credentials-store." },
        { type: "info", text: "[00:08] Push notification broadcast sent to ECS Fargate order instances." },
        { type: "info", text: "[00:09] Fargate hosts hot-reloading configurations from environment parameters..." },
        { type: "success", text: "[00:11] SIMULATION RESOLVED: Credentials successfully rotated. 0 service downtime." }
      ]
    },
    breaker: {
      btnClass: "simulator-btn-amber",
      nodes: ["core", "worker"],
      activePaths: ["path-core-broker"],
      lines: [
        { type: "system", text: "exec inject-latency --target=downstream-billing-worker --latency=3500ms" },
        { type: "info", text: "[00:01] Simulating network latency jitter on downstream billing gateway API..." },
        { type: "warning", text: "[00:03] EXCEPTION: Billing gateway timeout. Execution time 3502ms exceeding budget (500ms)." },
        { type: "warning", text: "[00:05] Polly circuit breaker triggered: State transitions to [OPEN]." },
        { type: "info", text: "[00:06] Returning cached degradation response (Graceful Fallback)." },
        { type: "info", text: "[00:08] Auto-retry loop active. Testing downstream health with minor canary requests..." },
        { type: "success", text: "[00:10] Downstream latency recovered (120ms). Circuit breaker closed [CLOSED]." },
        { type: "success", text: "[00:11] SIMULATION RESOLVED: Resiliency sidecar shielded core threads from starvation." }
      ]
    }
  };

  // Run a scenario
  function runScenario(key) {
    const sc = scenarios[key];
    if (!sc) return;

    // Toggle button state
    scenarioBtns.forEach((btn) => {
      const active = btn.getAttribute("data-scenario") === key;
      btn.classList.toggle("is-active", active);
    });

    // Reset visual connections and nodes
    svgNodes.forEach((node) => {
      node.classList.remove("is-active");
      node.style.removeProperty("--active-color");
    });
    svgPaths.forEach((path) => {
      path.classList.remove("pulse");
      path.style.removeProperty("--pulse-color");
    });

    // Color code nodes involved in the scenario
    let scColor = "var(--primary)";
    if (key === "spike") scColor = "var(--accent-blue)";
    if (key === "failover") scColor = "var(--accent-rose)";
    if (key === "secrets") scColor = "var(--accent-purple)";
    if (key === "breaker") scColor = "var(--accent-amber)";

    // Activate SVGs
    sc.nodes.forEach((nId) => {
      const el = svg.querySelector(`.svg-node[data-node="${nId}"]`);
      if (el) {
        el.classList.add("is-active");
        el.style.setProperty("--active-color", scColor);
      }
    });

    sc.activePaths.forEach((pId) => {
      const el = svg.querySelector(`#${pId}`);
      if (el) {
        el.classList.add("pulse");
        el.style.setProperty("--pulse-color", scColor);
      }
    });

    // Print logs
    writeLinesToConsole(sc.lines);
  }

  // Click listeners on buttons
  scenarioBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-scenario");
      runScenario(key);
    });
  });

  // Print initial greeting inside terminal console
  writeLinesToConsole([
    { type: "info", text: "Initializing Architect Console v1.0.4..." },
    { type: "info", text: "[bootstrap] Postgres relational driver: CONNECTED." },
    { type: "info", text: "[bootstrap] ElastiCache Redis replication: READY." },
    { type: "info", text: "[bootstrap] Apache Kafka topic partitions mapping: ONLINE." },
    { type: "info", text: "[bootstrap] AWS Secrets Manager rotation pipeline: SECURE." },
    { type: "success", text: "[system] System design topology parsed. Status: HEALTHY." },
    { type: "success", text: "[system] Console online. Select any simulation trigger to run stressing parameters." }
  ]);
  
  resetInspector();
}
