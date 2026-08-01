export const blueprintData = {
  gateway: {
    name: "AWS API Gateway",
    subtitle: "Ingress & Edge Routing",
    description: "Acts as the unified entry point for external client requests. Handles HTTPS termination, rate limiting, and forwards traffic to internal VPC services.",
    architectRole: "Implemented JWT validation at the edge and configured adaptive rate-limiting policies to shield downstream services from denial-of-service attempts.",
    tradeoff: "Decoupled auth verification from downstream services to minimize service load, accepting slight latency overhead at the edge (approx. 4ms).",
    metrics: "Throughput: 15,000 req/sec | Edge Latency: < 5ms P99"
  },
  core: {
    name: "Core Order Service",
    subtitle: ".NET 8 Microservice on AWS ECS",
    description: "The core domain processor written in C#/.NET 8. Validates business constraints, processes order states, and persists records using the Outbox pattern.",
    architectRole: "Engineered the core domain model using Clean Architecture. Implemented the Transactional Outbox pattern to write order updates and event messages to DB in a single ACID transaction.",
    tradeoff: "Favored asynchronous event publishing via Outbox tables to prevent dual-write inconsistencies, trading off immediate downstream notification for eventual consistency.",
    metrics: "Memory Footprint: < 256MB | P99 Internal Processing: < 12ms"
  },
  broker: {
    name: "Apache Kafka Cluster",
    subtitle: "Distributed Event Streaming",
    description: "The high-throughput message backbone. Streams order events (Created, Cancelled, Validated) to decouple core processing from heavy analytics and external sync operations.",
    architectRole: "Designed the topic layout. Hashed partitions on 'OrderId' to guarantee in-order delivery of state changes. Redirected transient failures to non-blocking delayed retry topics (order-retry-x) to prevent partition head-of-line blocking.",
    tradeoff: "Chosen replication factor of 3 and min.insync.replicas of 2 to guarantee zero data loss, accepting a minor write latency increase.",
    metrics: "Lag Monitor: < 50 messages | Average Pub-Sub Latency: < 8ms"
  },
  worker: {
    name: "Fulfillment & Billing Workers",
    subtitle: "Event-Driven .NET 8 Consumers",
    description: "Background container processes consuming order events from Kafka. Executes heavy downstream operations like credit card processing and warehouse notifications.",
    architectRole: "Created reusable C# consumer templates utilizing Polly. Built automatic retry pipelines with exponential backoff and routing to Dead Letter Queues (DLQ) after 3 attempts.",
    tradeoff: "Used concurrent consumer groups to optimize processing speed, incorporating idempotency filters at the database level to handle duplicate event delivery.",
    metrics: "CPU Utilization: 42% under load | Error Recovery: 100% automated"
  },
  database: {
    name: "RDS PostgreSQL (Primary/Replica)",
    subtitle: "Transactional Database",
    description: "Stores relational order tables, transaction logs, and outbox records. Built with multi-AZ failover and read replicas.",
    architectRole: "Defined table indexes and partition criteria. Configured Debezium / CDC connector on Outbox tables to capture event writes and stream them to Kafka without blocking application threads.",
    tradeoff: "Relied on PostgreSQL for ACID guarantees instead of NoSQL to ensure strict financial reporting compliance, utilizing read replicas to offload query load.",
    metrics: "Connection Pool: 98% efficiency | Query Latency: < 2ms index lookup"
  },
  cache: {
    name: "Redis Cache Cluster",
    subtitle: "In-Memory Data Store",
    description: "Serves cached configuration, client parameters, and session tokens to speed up lookups and protect RDS from redundant queries.",
    architectRole: "Defined cache-aside patterns and strict TTL (Time-To-Live) eviction rules to prevent cache invalidation issues.",
    tradeoff: "Used memory-efficient hashes to minimize cost, accepting transient stale reads for non-critical config parameters.",
    metrics: "Hit Rate: 94.2% | Cache Read Latency: < 0.8ms"
  },
  security: {
    name: "AWS Secrets Manager & Lambda",
    subtitle: "Automated Credential Lifecycle",
    description: "Securely stores database passwords, AWS IAM roles, and third-party API keys. Lambda triggers automated rotation every 30 days.",
    architectRole: "Designed zero-downtime double-password active/pending rotation. Lambda generates a secondary password, updates Secrets Manager, hot-reloads ECS tasks, and revokes the legacy credential once active connections shift.",
    tradeoff: "Added minor initial setup complexity to ensure zero developer exposure to production passwords.",
    metrics: "Manual Credential Operations: 0 | Rotation Downtime: 0ms"
  },
  observability: {
    name: "OpenTelemetry & Sumo Logic",
    subtitle: "Distributed Observability",
    description: "Collects system metrics, trace spans (tracing requests across Gateway, ECS, Kafka, and Database), and logs.",
    architectRole: "Standardized Sumo Logic logging schemas and OpenTelemetry trace propagation headers across all C# microservices to enable automated end-to-end tracing.",
    tradeoff: "Accepted 3% network overhead for trace headers to gain complete diagnostic visibility.",
    metrics: "P99 Incident Isolation: < 3 mins | Observability Coverage: 100%"
  }
};
