export const projectsData = [
  {
    title: "Real-Time Financial Orders Platform",
    category: "Event-Driven Systems",
    problem: "Financial order events (new, update, cancellation) suffered from latency spikes, processing bottlenecks, and lacked standardized downstream retry/dead-letter-queue patterns.",
    solution: "Designed an event-driven integration architecture using Apache Kafka. Hashed partition keys on 'OrderId' to guarantee in-order delivery of state changes, and routed transient failures to non-blocking delayed retry topics (order-retry-x) to prevent queue blocking.",
    impact: "Created standard event patterns used by 10-30 engineers, resulting in zero-loss processing and high-volume stability.",
    stack: ".NET 8 | C# | Apache Kafka | AWS ECS | OpenTelemetry",
    icon: "event",
    breakdown: {
      journey: [
        "Phase 1: Bounded Context Mapping — Identified order transactions as the core domain, separating read and write pathways (CQRS).",
        "Phase 2: Topic Partition Layout — Modeled transaction event schemas and hashed keys on 'OrderId' for correct order serialization.",
        "Phase 3: Consumer Resilience Sidecars — Wrote reusable consumer middleware using Polly for automated exponential backoffs.",
        "Phase 4: OpenTelemetry Tracing — Instrumented Kafka tracing headers to track order events from gateway ingress to database writes."
      ],
      mesh: {
        nodes: [
          { id: "ingress", name: "UI Clients", tech: "Ingress", x: 40, y: 60, role: "happy" },
          { id: "gateway", name: "API Gateway", tech: "AWS Gateway", x: 170, y: 60, role: "happy" },
          { id: "core", name: "Order Service", tech: ".NET 8 / ECS", x: 330, y: 60, role: "happy" },
          { id: "db", name: "RDS Postgres", tech: "Database", x: 330, y: 190, role: "happy" },
          { id: "outbox", name: "Outbox Queue", tech: "SQL Table", x: 170, y: 190, role: "resilient" },
          { id: "broker", name: "Apache Kafka", tech: "Event Stream", x: 500, y: 60, role: "happy" },
          { id: "worker", name: "Fulfillment", tech: "ECS Consumer", x: 670, y: 60, role: "happy" }
        ],
        links: [
          { from: "ingress", to: "gateway", type: "both", label: "HTTPS" },
          { from: "gateway", to: "core", type: "both", label: "Proxy" },
          { from: "core", to: "db", type: "happy", label: "Write" },
          { from: "core", to: "outbox", type: "resilient", label: "Defer Log" },
          { from: "outbox", to: "db", type: "resilient", label: "CDC Sync" },
          { from: "core", to: "broker", type: "both", label: "Produce" },
          { from: "broker", to: "worker", type: "both", label: "Consume" }
        ]
      },
      tradeoffs: [
        "Outbox Pattern vs Dual-Writes: Opted for CDC Outbox tables to prevent split-brain database states, accepting a minor event latency overhead (approx. 10ms).",
        "Broker Choice: Chose Kafka over standard AMQP queues (RabbitMQ) to enable event replayability and absolute partition ordering guarantees."
      ],
      telemetry: "P99 Processing Latency: < 18ms | Zero data loss recorded under stress testing (10k eps)"
    }
  },
  {
    title: "AI-Powered Documentation Engine",
    category: "AI Engineering & Enablement",
    problem: "Engineering teams spent excessive hours manually documenting legacy systems, resulting in stale, unstructured internal documentation and slow developer onboarding.",
    solution: "Architected a generative documentation tool running a script that recursively traversed repository directories, sent complete source files to a high-context LLM, and automatically saved updated markdown files to developer wikis.",
    impact: "Awarded 2nd Runner-Up at the JPMorgan Chase Hackathon 2024; automated directory documentation maps for multiple team codebases.",
    stack: "Python | LLM Workflows | Prompt Engineering | GitHub Copilot",
    icon: "ai",
    breakdown: {
      journey: [
        "Phase 1: Directory Tree Parsing — Wrote recursive file system analyzers in Python to construct code layout graphs.",
        "Phase 2: Prompt Chaining Framework — Designed recursive prompt templates to feed complete codebase segments into context boundaries.",
        "Phase 3: Pull Request Triggers — Deployed diff hooks to detect code updates and document modifications on commits.",
        "Phase 4: Automated Wiki Commits — Integrated Markdown builders that write directly to internal developer portals via APIs."
      ],
      mesh: {
        nodes: [
          { id: "commit", name: "PR Commit", tech: "Git Trigger", x: 50, y: 60, role: "happy" },
          { id: "parser", name: "AST Ingester", tech: "Python Script", x: 210, y: 60, role: "happy" },
          { id: "llm", name: "LLM Pipeline", tech: "Orchestration", x: 370, y: 60, role: "happy" },
          { id: "portal", name: "Wiki Portals", tech: "Commit API", x: 530, y: 60, role: "happy" },
          { id: "eval", name: "Link Validator", tech: "Check Routine", x: 370, y: 190, role: "resilient" },
          { id: "retry", name: "Prompt Loop", tech: "Retry Chain", x: 530, y: 190, role: "resilient" }
        ],
        links: [
          { from: "commit", to: "parser", type: "both", label: "Trigger" },
          { from: "parser", to: "llm", type: "both", label: "AST Map" },
          { from: "llm", to: "portal", type: "happy", label: "Write Doc" },
          { from: "llm", to: "eval", type: "resilient", label: "Verify Links" },
          { from: "eval", to: "retry", type: "resilient", label: "Hallucinate Check" },
          { from: "retry", to: "portal", type: "resilient", label: "Write Fixed" }
        ]
      },
      tradeoffs: [
        "Recursive file traversal vs Vector Chunking: Chose full file ingestion to retain variable scope, managing LLM context usage via intelligent prompts.",
        "Static vs Dynamic Analysis: Relied on AST code mapping rather than runtime reflection to ensure secure execution environments."
      ],
      telemetry: "Execution Time: < 15 seconds per PR commit | 96.4% code mapping accuracy"
    }
  },
  {
    title: "Secrets Lifecycle Automation Platform",
    category: "Cloud Security & Infrastructure",
    problem: "Manual rotation of database and API credentials across multiple server instances introduced human error, credentials exposure, and audit compliance issues.",
    solution: "Built a serverless double-password active/pending rotation flow using AWS Secrets Manager and Lambda. Generated a secondary password, updated Secrets Manager, hot-reloaded ECS tasks, and revoked the legacy password once active connections shifted.",
    impact: "Completely eliminated manual credential interaction, ensuring 100% compliance with financial security guidelines.",
    stack: "AWS Secrets Manager | AWS Lambda | AWS ECS | GitHub Actions",
    icon: "security",
    breakdown: {
      journey: [
        "Phase 1: Double-Password Handoff — Configured PostgreSQL schemas to handle dual active login credentials simultaneously.",
        "Phase 2: Serverless Lambda Rotator — Wrote a rotation Lambda script executing password generations and updates.",
        "Phase 3: Connection Pool Reload — Configured ECS containers to watch the AWS Secrets API and hot-reload connection keys in memory.",
        "Phase 4: Deprecation Sync — Automatically revoked secondary credentials from PostgreSQL once database connection pools shifted."
      ],
      mesh: {
        nodes: [
          { id: "cron", name: "Schedule Cron", tech: "CloudWatch", x: 50, y: 60, role: "happy" },
          { id: "lambda", name: "Rotator Lambda", tech: "AWS Lambda", x: 210, y: 60, role: "happy" },
          { id: "db", name: "PostgreSQL DB", tech: "RDS Primary", x: 380, y: 60, role: "happy" },
          { id: "secrets", name: "Secrets Store", tech: "AWS Secrets Mgr", x: 210, y: 190, role: "both" },
          { id: "ecs", name: "ECS Tasks", tech: "Fargate Tasks", x: 550, y: 60, role: "happy" },
          { id: "db_replica", name: "RDS Replica", tech: "RDS Standby", x: 380, y: 190, role: "resilient" }
        ],
        links: [
          { from: "cron", to: "lambda", type: "both", label: "Trigger" },
          { from: "lambda", to: "db", type: "happy", label: "Rotate Primary" },
          { from: "lambda", to: "secrets", type: "both", label: "Store Key" },
          { from: "secrets", to: "ecs", type: "both", label: "Sync Reload" },
          { from: "lambda", to: "db_replica", type: "resilient", label: "Rotate Backup" },
          { from: "ecs", to: "db", type: "happy", label: "Active Pool" },
          { from: "ecs", to: "db_replica", type: "resilient", label: "Failover Pool" }
        ]
      },
      tradeoffs: [
        "Dynamic Reload vs Service Redeployment: Chose to hot-reload client credentials in application memory over rolling container restarts to keep ECS capacity high.",
        "VPC Isolation: Deployed the Lambda rotator within private secure VPC subnets to isolate credentials from public gateways."
      ],
      telemetry: "Downtime during rotation: 0.0ms | Developer credential visibility: 0.0%"
    }
  },
  {
    title: "Legacy Monolith Modernization Program",
    category: "System Modernization",
    problem: "A legacy Classic ASP / .NET Framework monolith restricted scale, suffered from deployment blockages, and relied on direct database couplings.",
    solution: "Executed an incremental Strangler Fig modernization roadmap. Extracted bounded contexts into independent .NET Core microservices while maintaining real-time sync via Kafka CDC.",
    impact: "Accelerated release frequency and reduced overall system delivery timelines by 20% with zero service disruption.",
    stack: ".NET Core | Microservices | Kafka CDC | REST APIs",
    icon: "modernization",
    breakdown: {
      journey: [
        "Phase 1: Domain Bounding — Audited the legacy monolith to identify cohesive boundaries for separation.",
        "Phase 2: Routing Strangulation — Placed AWS API Gateway at the ingress layer to rewrite paths and intercept endpoints.",
        "Phase 3: Data Replication Sync — Integrated Debezium on SQL databases to mirror transactions to microservices in real time.",
        "Phase 4: Legacy Deprecation — Cut write paths from client gateways over to microservices, decommissioning legacy database syncs."
      ],
      mesh: {
        nodes: [
          { id: "client", name: "API Clients", tech: "HTTP Ingress", x: 40, y: 60, role: "happy" },
          { id: "gateway", name: "Edge Router", tech: "AWS Gateway", x: 190, y: 60, role: "happy" },
          { id: "microservice", name: "Order API", tech: ".NET Core MS", x: 350, y: 60, role: "happy" },
          { id: "cdc", name: "CDC Capture", tech: "Debezium Connect", x: 350, y: 190, role: "both" },
          { id: "legacy_db", name: "Legacy DB", tech: "SQL Server", x: 510, y: 190, role: "both" },
          { id: "monolith", name: "Legacy Monolith", tech: "Monolith App", x: 510, y: 60, role: "resilient" },
          { id: "cache", name: "Offline Cache", tech: "Local SQLite", x: 190, y: 190, role: "resilient" }
        ],
        links: [
          { from: "client", to: "gateway", type: "both", label: "HTTPS" },
          { from: "gateway", to: "microservice", type: "happy", label: "Active Path" },
          { from: "microservice", to: "cdc", type: "both", label: "CDC Logs" },
          { from: "cdc", to: "legacy_db", type: "both", label: "Repl Sync" },
          { from: "gateway", to: "monolith", type: "resilient", label: "Fallback Route" },
          { from: "gateway", to: "cache", type: "resilient", label: "Outbox Queue" }
        ]
      },
      tradeoffs: [
        "Asynchronous vs Synchronous synchronization: Opted for database CDC logs over HTTP synchronization to insulate microservice responsiveness.",
        "Database splitting vs Shared schemas: Enforced independent target database engines, accepting sync latency overhead to support legacy queries."
      ],
      telemetry: "Feature Release Speed: +20% | Cutover System Availability: 100% uptime"
    }
  }
];
