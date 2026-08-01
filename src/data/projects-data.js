export const projectsData = [
  {
    title: "Real-Time Financial Orders Platform",
    category: "Event-Driven Systems",
    problem: "Financial order events (new, update, cancellation) suffered from latency spikes, processing bottlenecks, and lacked standardized downstream retry/dead-letter-queue patterns.",
    solution: "Designed an event-driven integration architecture using Apache Kafka for pub/sub stream partitioning. Established strict partition-key strategies for in-order delivery and created reusable .NET resilience sidecars for error isolation.",
    impact: "Created standard event patterns used by 10-30 engineers, resulting in zero-loss processing and high-volume stability.",
    stack: ".NET 8 | C# | Apache Kafka | AWS ECS | OpenTelemetry",
    icon: "event"
  },
  {
    title: "AI-Powered Documentation Engine",
    category: "AI Engineering & Enablement",
    problem: "Engineering teams spent excessive hours manually documenting legacy systems, resulting in stale, unstructured internal documentation and slow developer onboarding.",
    solution: "Architected an automated multi-model LLM orchestration pipeline that reads repository structures, parses AST schemas, and outputs styled markdown docs pushed to developer hubs.",
    impact: "Awarded 2nd Runner-Up at the JPMorgan Chase Hackathon 2024; automated repository mapping for multiple team repos.",
    stack: "Python | LLM Workflows | Prompt Engineering | GitHub Copilot",
    icon: "ai"
  },
  {
    title: "Secrets Lifecycle Automation Platform",
    category: "Cloud Security & Infrastructure",
    problem: "Manual rotation of database and API credentials across multiple server instances introduced human error, credentials exposure, and audit compliance issues.",
    solution: "Built a serverless, zero-trust rotation flow using AWS Secrets Manager and Lambda. Programmatically injected rotating keys into running ECS tasks without service downtime.",
    impact: "Completely eliminated manual credential interaction, ensuring 100% compliance with financial security guidelines.",
    stack: "AWS Secrets Manager | AWS Lambda | AWS ECS | GitHub Actions",
    icon: "security"
  },
  {
    title: "Legacy Monolith Modernization Program",
    category: "System Modernization",
    problem: "A legacy Classic ASP / .NET Framework monolith restricted scale, suffered from deployment blockages, and relied on direct database couplings.",
    solution: "Executed an incremental Strangler Fig modernization roadmap. Extracted bounded contexts into independent .NET Core microservices while maintaining real-time sync via Kafka CDC.",
    impact: "Accelerated release frequency and reduced overall system delivery timelines by 20% with zero service disruption.",
    stack: ".NET Core | Microservices | Kafka CDC | REST APIs",
    icon: "modernization"
  }
];
