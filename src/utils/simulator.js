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

    svgNodes.forEach((node) => {
      const isActive = node.getAttribute("data-node") === nodeKey;
      node.classList.toggle("is-active", isActive);
    });

    let accentColor = "var(--primary)";
    if (["gateway", "observability", "cdn", "auth", "elk"].includes(nodeKey)) accentColor = "var(--accent-blue)";
    if (["broker"].includes(nodeKey)) accentColor = "var(--accent-purple)";
    if (["core", "worker", "database"].includes(nodeKey)) accentColor = "var(--accent-teal)";
    if (["cache", "notification", "s3"].includes(nodeKey)) accentColor = "var(--accent-amber)";
    if (["security"].includes(nodeKey)) accentColor = "var(--accent-purple)";
    if (["waf", "dlq"].includes(nodeKey)) accentColor = "var(--accent-rose)";

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

  svgNodes.forEach((node) => {
    node.addEventListener("click", (e) => {
      e.stopPropagation();
      inspectNode(node.getAttribute("data-node"));
    });
  });

  svg.addEventListener("click", () => {
    svgNodes.forEach((node) => node.classList.remove("is-active"));
    resetInspector();
  });

  function resetInspector() {
    inspector.innerHTML = `
      <div class="inspector-empty">
        <div class="radar-wrap">
          <svg class="radar-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(45,212,191,0.12)" stroke-width="1"/>
            <circle cx="60" cy="60" r="36" fill="none" stroke="rgba(45,212,191,0.1)" stroke-width="1"/>
            <circle cx="60" cy="60" r="20" fill="none" stroke="rgba(45,212,191,0.1)" stroke-width="1"/>
            <line x1="60" y1="8" x2="60" y2="112" stroke="rgba(45,212,191,0.08)" stroke-width="1"/>
            <line x1="8" y1="60" x2="112" y2="60" stroke="rgba(45,212,191,0.08)" stroke-width="1"/>
            <g class="radar-beam" style="transform-origin:60px 60px">
              <path d="M60,60 L60,8 A52,52 0 0,1 112,60 Z" fill="url(#sweepGrad)" opacity="0.55"/>
              <defs>
                <radialGradient id="sweepGrad" cx="0%" cy="0%" r="100%">
                  <stop offset="0%" stop-color="rgba(45,212,191,0.0)"/>
                  <stop offset="100%" stop-color="rgba(45,212,191,0.35)"/>
                </radialGradient>
              </defs>
            </g>
            <circle cx="60" cy="60" r="3" fill="var(--accent-teal)" opacity="0.9"/>
          </svg>
        </div>
        <div class="inspector-terminal">
          <span class="iterm-line"><span class="iterm-prefix">SYS &gt;</span> Awaiting node selection&hellip;</span>
          <span class="iterm-line"><span class="iterm-prefix">SYS &gt;</span> Click any architecture node</span>
          <span class="iterm-line"><span class="iterm-prefix">SYS &gt;</span> Trade-off analysis ready<span class="iterm-cursor"></span></span>
        </div>
        <p class="inspector-hint">Select any node to inspect architectural decisions &amp; metrics</p>
      </div>
    `;
  }

  // ==========================================================================
  // Console Logging Terminal Simulator Logic
  // ==========================================================================

  let printInterval = null;

  function writeLinesToConsole(lines) {
    if (printInterval) clearInterval(printInterval);
    consoleScreen.innerHTML = "";
    let lineIndex = 0;

    function printNextLine() {
      if (lineIndex >= lines.length) { clearInterval(printInterval); return; }
      const lineData = lines[lineIndex];
      const div = document.createElement("div");
      div.className = `console-line ${lineData.type || "info"}`;
      const prefixHTML = lineData.type === "system" ? '<span class="prefix">&gt;</span>' : "";
      div.innerHTML = `${prefixHTML}${lineData.text}`;
      consoleScreen.appendChild(div);
      consoleScreen.scrollTop = consoleScreen.scrollHeight;
      lineIndex++;
    }

    printNextLine();
    printInterval = setInterval(printNextLine, 500);
  }

  // ==========================================================================
  // Scenario Definitions — nodes + path IDs must match SVG id attributes
  // ==========================================================================
  const scenarios = {
    spike: {
      color: "var(--accent-blue)",
      nodes: ["waf", "cdn", "gateway", "auth", "core", "broker", "worker", "observability", "elk", "s3", "notification"],
      activePaths: [
        "path-clt-waf", "path-waf-cdn", "path-cdn-gw", "path-gw-auth", "path-gw-core", 
        "path-auth-core", "path-core-kafka", "path-kafka-worker", "path-worker-s3", 
        "path-core-notify", "path-gw-otel", "path-core-otel", "path-kafka-otel", 
        "path-worker-otel", "path-otel-elk"
      ],
      lines: [
        { type: "system",  text: "exec simulate-load-spike --target=ecs-core --tps=10000" },
        { type: "info",    text: "[00:01] Loading simulator metrics pipeline..." },
        { type: "warning", text: "[00:03] WARNING: Gateway ingress exceeding threshold. 10.4k req/sec detected." },
        { type: "info",    text: "[00:04] ECS Autoscaling Group triggered. Launching 8 additional Fargate tasks..." },
        { type: "info",    text: "[00:06] Partition load balanced. Offloading queue backlog to Kafka partitions [0-11]." },
        { type: "success", text: "[00:09] ECS instances stabilized. 10 active nodes. Lag dropped to 14 messages." },
        { type: "success", text: "[00:10] SIMULATION RESOLVED: Throughput capacity operating at 100% SLA." }
      ]
    },
    failover: {
      color: "var(--accent-rose)",
      nodes: ["core", "database", "security", "observability", "elk"],
      activePaths: ["path-core-db", "path-db-sec", "path-db-otel", "path-otel-elk"],
      lines: [
        { type: "system",  text: "exec trigger-failover --db=rds-postgresql-primary" },
        { type: "info",    text: "[00:01] Injecting connection partition fault on PostgreSQL Master port 5432..." },
        { type: "warning", text: "[00:03] EXCEPTION: Timeout connecting to Host rds-pg-primary.amazonaws.com." },
        { type: "warning", text: "[00:04] CIRCUIT BREAKER: PostgreSQL client pool disconnected. Activating Outbox flow." },
        { type: "info",    text: "[00:05] OUTBOX PATTERN: Diverting 182 transaction records to local sqlite cache queue." },
        { type: "info",    text: "[00:07] Multi-AZ Failover active. Promoting Read Replica rds-pg-replica-01 to master..." },
        { type: "success", text: "[00:09] Database connectivity restored on promoted master. Syncing schemas..." },
        { type: "info",    text: "[00:10] Flush outbox pipeline triggered. Publishing 182 cached transactions..." },
        { type: "success", text: "[00:12] SIMULATION RESOLVED: All outbox messages flushed. 0 records lost. Uptime intact." }
      ]
    },
    secrets: {
      color: "var(--accent-purple)",
      nodes: ["security", "auth", "core", "database", "observability", "elk"],
      activePaths: ["path-db-sec", "path-sec-auth", "path-auth-core", "path-db-otel", "path-otel-elk"],
      lines: [
        { type: "system",  text: "exec cron-rotate-credentials --vault=aws-secrets-manager --days=30" },
        { type: "info",    text: "[00:01] Triggering scheduled credential rotation for PostgreSQL database..." },
        { type: "info",    text: "[00:03] AWS Lambda rotater function initialized." },
        { type: "info",    text: "[00:04] Generating fresh cryptographic password token. Injecting into database." },
        { type: "success", text: "[00:06] PostgreSQL master credentials updated in credentials-store." },
        { type: "info",    text: "[00:08] Push notification broadcast sent to ECS Fargate order instances." },
        { type: "info",    text: "[00:09] Fargate hosts hot-reloading configurations from environment parameters..." },
        { type: "success", text: "[00:11] SIMULATION RESOLVED: Credentials successfully rotated. 0 service downtime." }
      ]
    },
    breaker: {
      color: "var(--accent-amber)",
      nodes: ["core", "broker", "worker", "observability", "elk"],
      activePaths: ["path-core-kafka", "path-kafka-worker", "path-worker-otel", "path-otel-elk"],
      lines: [
        { type: "system",  text: "exec inject-latency --target=downstream-billing-worker --latency=3500ms" },
        { type: "info",    text: "[00:01] Simulating network latency jitter on downstream billing gateway API..." },
        { type: "warning", text: "[00:03] EXCEPTION: Billing gateway timeout. Execution time 3502ms exceeding budget (500ms)." },
        { type: "warning", text: "[00:05] Polly circuit breaker triggered: State transitions to [OPEN]." },
        { type: "info",    text: "[00:06] Returning cached degradation response (Graceful Fallback)." },
        { type: "info",    text: "[00:08] Auto-retry loop active. Testing downstream health with minor canary requests..." },
        { type: "success", text: "[00:10] Downstream latency recovered (120ms). Circuit breaker closed [CLOSED]." },
        { type: "success", text: "[00:11] SIMULATION RESOLVED: Resiliency sidecar shielded core threads from starvation." }
      ]
    },
    kafka_lag: {
      color: "var(--accent-teal)",
      nodes: ["broker", "worker", "dlq", "observability", "elk", "s3"],
      activePaths: ["path-core-kafka", "path-kafka-worker", "path-kafka-dlq", "path-worker-otel", "path-otel-elk", "path-worker-s3"],
      lines: [
        { type: "system",  text: "exec monitor-consumer-lag --topic=order-events --group=fulfillment-consumers" },
        { type: "info",    text: "[00:01] Polling Confluent Control Center for consumer group metrics..." },
        { type: "warning", text: "[00:02] ALERT: Consumer lag breached SLA threshold. Current lag: 8,412 messages." },
        { type: "warning", text: "[00:03] Fulfillment-consumer-01 stalled. Max poll interval exceeded (300s)." },
        { type: "info",    text: "[00:04] Triggering horizontal scale-out: Launching 4 additional ECS consumer tasks..." },
        { type: "info",    text: "[00:05] Kafka partition rebalance initiated. Distributing 12 partitions across 6 consumers." },
        { type: "warning", text: "[00:06] 34 messages exceeded max retry (3). Routing to SQS Dead Letter Queue." },
        { type: "info",    text: "[00:07] DLQ alert fired → CloudWatch alarm → PagerDuty on-call escalation sent." },
        { type: "success", text: "[00:09] Consumer lag recovering. Lag: 8412 → 2104 → 341 → 12 messages." },
        { type: "success", text: "[00:11] SIMULATION RESOLVED: Lag SLA restored. DLQ replay scheduled for 34 records." }
      ]
    },
    schema_conflict: {
      color: "var(--accent-purple)",
      nodes: ["broker", "core", "worker", "observability", "elk"],
      activePaths: ["path-core-kafka", "path-kafka-worker", "path-kafka-otel", "path-otel-elk"],
      lines: [
        { type: "system",  text: "exec deploy-schema --subject=order-events-value --compatibility=BACKWARD" },
        { type: "info",    text: "[00:01] Connecting to Confluent Schema Registry at registry.internal:8081..." },
        { type: "info",    text: "[00:02] Validating Avro schema diff for subject: order-events-value v12 → v13..." },
        { type: "warning", text: "[00:03] SCHEMA CONFLICT: Field 'paymentMethod' removed. Breaks BACKWARD compatibility." },
        { type: "warning", text: "[00:04] REJECTED: Schema Registry blocked registration. Deployment pipeline halted." },
        { type: "info",    text: "[00:05] CI/CD gate triggered. Notifying engineering team via Slack #schema-alerts..." },
        { type: "info",    text: "[00:06] Recommended fix: Mark 'paymentMethod' as OPTIONAL with default null value." },
        { type: "success", text: "[00:08] Schema v13 revised. Re-submitting with OPTIONAL field annotation..." },
        { type: "success", text: "[00:09] Schema Registry accepted v13. Compatibility check: PASS." },
        { type: "success", text: "[00:10] SIMULATION RESOLVED: Breaking change prevented. 0 consumers impacted." }
      ]
    },
    ddos: {
      color: "var(--accent-rose)",
      nodes: ["waf", "cdn", "gateway", "observability", "elk"],
      activePaths: ["path-clt-waf", "path-waf-cdn", "path-cdn-gw", "path-gw-otel", "path-otel-elk"],
      lines: [
        { type: "system",  text: "exec simulate-ddos --attack=syn-flood --rps=240000 --source=botnet-cluster" },
        { type: "info",    text: "[00:01] Ingress anomaly detected. CloudFront reporting 240k req/sec from 4,200 IPs." },
        { type: "warning", text: "[00:02] THREAT: SYN-flood pattern identified. AWS WAF rule group activated." },
        { type: "warning", text: "[00:03] Rate-based rule triggered: Blocking IPs exceeding 2,000 req/5min threshold." },
        { type: "info",    text: "[00:04] AWS Shield Advanced engaged. Scrubbing traffic at CloudFront edge PoPs..." },
        { type: "info",    text: "[00:05] Geographic restriction applied. 38 high-risk ASNs blocked at WAF layer." },
        { type: "info",    text: "[00:06] Legitimate traffic ratio recovering. Valid req/sec: 240k → 82k → 15k." },
        { type: "success", text: "[00:08] Attack mitigated. 99.7% of malicious IPs blocked. API Gateway unaffected." },
        { type: "success", text: "[00:09] SIMULATION RESOLVED: Zero backend exposure. WAF absorbed full DDoS vector." }
      ]
    },
    cache_eviction: {
      color: "var(--accent-amber)",
      nodes: ["cache", "database", "core", "observability", "elk"],
      activePaths: ["path-core-cache", "path-core-db", "path-db-otel", "path-otel-elk"],
      lines: [
        { type: "system",  text: "exec simulate-cache-pressure --target=elasticache-redis --eviction-policy=allkeys-lru" },
        { type: "info",    text: "[00:01] Redis memory utilization: 94.2% → 97.8% → 99.1%. Eviction pressure critical." },
        { type: "warning", text: "[00:02] ALERT: allkeys-lru eviction triggered. Ejecting 12,400 key entries." },
        { type: "warning", text: "[00:03] Cache miss rate spiking: 5.8% → 34.1% → 61.7%. RDS query load surging." },
        { type: "warning", text: "[00:04] RDS connection pool saturation: 87% → 98%. Read replica lag increasing." },
        { type: "info",    text: "[00:05] Auto-remediation: Scaling Redis cluster. Adding 2 additional read replicas..." },
        { type: "info",    text: "[00:06] Warm-up job triggered. Pre-loading 8,000 hot keys from RDS into Redis..." },
        { type: "info",    text: "[00:07] TTL adjustment applied. Extended config TTL: 300s → 900s to reduce churn." },
        { type: "success", text: "[00:09] Redis memory: 99.1% → 71.4%. Cache hit rate recovering: 61.7% → 91.3%." },
        { type: "success", text: "[00:10] SIMULATION RESOLVED: Cache storm contained. RDS query load normalized." }
      ]
    }
  };

  // ==========================================================================
  // Run a Scenario
  // ==========================================================================
  function runScenario(key) {
    const sc = scenarios[key];
    if (!sc) return;

    scenarioBtns.forEach((btn) => {
      btn.classList.toggle("is-active", btn.getAttribute("data-scenario") === key);
    });

    // Reset all nodes and paths
    svgNodes.forEach((node) => {
      node.classList.remove("is-active");
      node.style.removeProperty("--active-color");
    });
    svgPaths.forEach((path) => {
      path.classList.remove("pulse");
      path.style.removeProperty("--pulse-color");
    });

    const scColor = sc.color || "var(--primary)";

    // Activate scenario nodes
    sc.nodes.forEach((nId) => {
      const el = svg.querySelector(`.svg-node[data-node="${nId}"]`);
      if (el) {
        el.classList.add("is-active");
        el.style.setProperty("--active-color", scColor);
      }
    });

    // Activate scenario paths (by id)
    sc.activePaths.forEach((pId) => {
      const el = svg.querySelector(`#${pId}`);
      if (el) {
        el.classList.add("pulse");
        el.style.setProperty("--pulse-color", scColor);
      }
    });

    writeLinesToConsole(sc.lines);
  }

  scenarioBtns.forEach((btn) => {
    btn.addEventListener("click", () => runScenario(btn.getAttribute("data-scenario")));
  });

  // Boot greeting
  writeLinesToConsole([
    { type: "info",    text: "Initializing Architect Console v2.0.0..." },
    { type: "info",    text: "[bootstrap] Postgres relational driver: CONNECTED." },
    { type: "info",    text: "[bootstrap] ElastiCache Redis replication: READY." },
    { type: "info",    text: "[bootstrap] Confluent Kafka topic partitions mapping: ONLINE." },
    { type: "info",    text: "[bootstrap] Confluent Schema Registry: HEALTHY (12 subjects registered)." },
    { type: "info",    text: "[bootstrap] AWS WAF rule groups: ACTIVE (4 managed rule groups)." },
    { type: "info",    text: "[bootstrap] AWS Secrets Manager rotation pipeline: SECURE." },
    { type: "success", text: "[system] System design topology parsed. 14 nodes online. Status: HEALTHY." },
    { type: "success", text: "[system] Console ready. Select any simulation trigger to run stress scenarios." }
  ]);

  resetInspector();
}
