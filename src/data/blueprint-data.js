export const blueprintData = {
  waf: {
    name: "AWS WAF",
    subtitle: "Web Application Firewall",
    description: "First line of defense for all inbound traffic. Evaluates every request against managed rule groups — blocking SQL injection, XSS, and known malicious IP ranges before traffic enters the VPC.",
    architectRole: "Configured custom WAF rule groups with rate-based rules to throttle credential-stuffing attacks. Integrated with AWS Firewall Manager to push rule updates across multiple AWS accounts simultaneously.",
    tradeoff: "Accepted marginal per-request evaluation latency (~1–2ms) to achieve a stateful layer of protection that prevents downstream abuse and reduces Auth Service load by pre-filtering invalid requests.",
    metrics: "Blocked Requests: ~12,000/day avg | Rule Evaluation Latency: < 2ms"
  },
  cdn: {
    name: "AWS CloudFront",
    subtitle: "Global CDN & Edge Cache",
    description: "Distributes static assets (JS bundles, API schema docs, image assets) from 400+ edge PoPs globally. Also handles TLS termination, HTTP/2 multiplexing, and compressed response delivery.",
    architectRole: "Configured CloudFront cache behaviors with fine-grained TTL policies per path pattern. Integrated origin shield to reduce RDS read replica query load during traffic spikes.",
    tradeoff: "Leveraged stale-while-revalidate for non-financial content to trade off stale reads for significantly lower origin round-trip times.",
    metrics: "Cache Hit Rate: 91% | Global Edge Latency: < 18ms P99"
  },
  gateway: {
    name: "AWS API Gateway",
    subtitle: "Ingress & Edge Routing",
    description: "Unified entry point for all authenticated API traffic, post-WAF and CDN. Handles HTTPS termination, JWT validation at edge, adaptive rate-limiting, and routes to downstream VPC microservices.",
    architectRole: "Implemented JWT validation at the edge and configured adaptive rate-limiting policies to shield downstream services from burst traffic. Set up VPC Link integration to privately route requests to ECS services without public endpoints.",
    tradeoff: "Decoupled auth verification from downstream services to minimize service load, accepting a slight latency overhead at the edge (~4ms) in exchange for significantly reduced Auth Service CPU utilization.",
    metrics: "Throughput: 15,000 req/sec | Edge Latency: < 5ms P99"
  },
  auth: {
    name: "Auth Service",
    subtitle: "JWT / AWS Cognito",
    description: "Validates bearer tokens, manages session claims, and enforces RBAC policies for all service-to-service and user-initiated requests. Integrates with AWS Cognito for identity federation.",
    architectRole: "Designed a stateless JWT validation pipeline using JWKS endpoint caching to avoid round-trips to Cognito per request. Integrated token revocation via a Redis deny-list for immediate session invalidation on security events.",
    tradeoff: "Chose stateless JWT over opaque tokens to enable edge-side validation without Auth Service lookups, accepting a short token revocation delay window (TTL-based) for non-critical user actions.",
    metrics: "Token Validation Latency: < 2ms (cached) | Revocation Coverage: 100%"
  },
  core: {
    name: "Core Order Service",
    subtitle: ".NET 8 Microservice on AWS ECS",
    description: "The core domain processor. Validates business constraints, processes order states, persists records using the Transactional Outbox pattern, and publishes domain events to Kafka.",
    architectRole: "Engineered the core domain model using Clean Architecture. Implemented the Transactional Outbox pattern to write order updates and event messages to DB in a single ACID transaction, eliminating dual-write inconsistencies.",
    tradeoff: "Favored asynchronous event publishing via Outbox tables over synchronous Kafka calls to prevent data loss during broker unavailability, trading off immediate downstream notification for guaranteed eventual consistency.",
    metrics: "Memory Footprint: < 256MB | P99 Internal Processing: < 12ms"
  },
  notification: {
    name: "Notification Service",
    subtitle: "AWS SNS / SES",
    description: "Fanout service that consumes order lifecycle events (Created, Fulfilled, Failed) and delivers real-time notifications to end users via email (SES) and push channels (SNS mobile push).",
    architectRole: "Designed the notification topology using SNS topic filters to route only relevant events to each subscriber type. Implemented exponential backoff retry with a fallback to SQS for guaranteed delivery on transient SES failures.",
    tradeoff: "Chose SNS fan-out over direct Kafka consumer to decouple notification delivery logic from core domain workers, accepting slightly higher message serialization overhead.",
    metrics: "Delivery Rate: 99.94% | P99 Notification Latency: < 800ms"
  },
  cache: {
    name: "Redis Cache Cluster",
    subtitle: "AWS ElastiCache",
    description: "In-memory store serving cached configuration, client rate limit counters, JWT deny-lists, and session tokens. Protects RDS from redundant reads and accelerates high-frequency lookups.",
    architectRole: "Defined cache-aside read patterns and strict TTL eviction rules. Used Redis Sorted Sets for sliding window rate limiting. Implemented write-through for critical deny-list entries to prevent stale security state.",
    tradeoff: "Used memory-efficient hashes to minimize cost, accepting transient stale reads for non-critical config parameters while enforcing strict consistency for security-sensitive deny-list and rate-limit data.",
    metrics: "Hit Rate: 94.2% | Cache Read Latency: < 0.8ms"
  },
  database: {
    name: "RDS PostgreSQL",
    subtitle: "Primary / Read Replica — Multi-AZ",
    description: "Transactional datastore for all order records, outbox event tables, and audit logs. Configured with Multi-AZ standby and read replicas. CDC-enabled via Debezium for Outbox event capture.",
    architectRole: "Defined table indexes and partition criteria for high-cardinality order lookups. Configured Debezium CDC on Outbox tables to capture writes and stream them to Kafka without blocking application threads — zero polling overhead.",
    tradeoff: "Chose PostgreSQL over NoSQL to maintain strict ACID guarantees required for financial compliance and audit trail integrity, using read replicas to horizontally scale query throughput.",
    metrics: "Connection Pool: 98% efficiency | Query Latency: < 2ms index lookup"
  },
  security: {
    name: "AWS Secrets Manager + Lambda",
    subtitle: "Automated Credential Lifecycle",
    description: "Securely stores database passwords, AWS IAM role ARNs, and third-party API keys. Lambda-triggered rotation every 30 days with zero-downtime active/pending dual-credential handoff.",
    architectRole: "Designed zero-downtime double-password rotation. Lambda generates a secondary password, updates Secrets Manager, hot-reloads ECS task credentials via environment injection, and revokes the legacy credential once connection shift is confirmed.",
    tradeoff: "Added minor initial setup complexity to achieve complete elimination of manual credential operations and zero developer exposure to production secrets.",
    metrics: "Manual Credential Operations: 0 | Rotation Downtime: 0ms"
  },
  broker: {
    name: "Confluent Kafka",
    subtitle: "Enterprise Event Streaming Platform",
    description: "Confluent Platform (built on Apache Kafka) serves as the high-throughput message backbone. Streams order lifecycle events (Created, Cancelled, Validated, Fulfilled) across consumer groups with enterprise-grade Schema Registry, RBAC, and Confluent Control Center monitoring.",
    architectRole: "Designed topic layout with OrderId-hashed partitions for in-order per-order event delivery. Leveraged Confluent Schema Registry to enforce Avro schema contracts between producers and consumers, preventing breaking schema changes from reaching downstream services. Configured delayed retry topics to prevent partition head-of-line blocking.",
    tradeoff: "Chose Confluent Platform over open-source Kafka to get Schema Registry and RBAC out-of-the-box — critical for enforcing data contracts at scale. Replication factor of 3 with min.insync.replicas=2 guarantees zero data loss, accepting a slight write latency increase (~3ms).",
    metrics: "Consumer Lag: < 50 messages | Avg Pub-Sub Latency: < 8ms | Schema Violations: 0"
  },
  worker: {
    name: "Fulfillment & Billing Workers",
    subtitle: "Event-Driven .NET 8 Consumers on ECS",
    description: "Background container processes consuming domain events from Kafka partitions. Executes credit card processing, warehouse dispatch, and ledger reconciliation operations.",
    architectRole: "Built reusable C# consumer templates using Polly for resilience. Implemented automatic retry with exponential backoff and routing to Dead Letter Queue (SQS DLQ) after 3 consecutive failures. Added idempotency keys at DB level for safe duplicate reprocessing.",
    tradeoff: "Used concurrent consumer groups to maximize throughput, incorporating idempotency filters at DB level to safely handle duplicate event delivery without double-charging.",
    metrics: "CPU Utilization: 42% under load | Error Recovery: 100% automated"
  },
  dlq: {
    name: "Dead Letter Queue",
    subtitle: "AWS SQS DLQ",
    description: "Captures failed Kafka consumer messages after maximum retry attempts. Enables operational review, manual reprocessing, and alerting on recurring failure patterns without data loss.",
    architectRole: "Wired DLQ alerts to CloudWatch with automated PagerDuty escalations on DLQ depth exceeding threshold. Built a lightweight admin replay endpoint in the Worker service to re-enqueue DLQ messages after root-cause fixes.",
    tradeoff: "Accepted the operational overhead of DLQ monitoring to guarantee zero silent data loss on consumer failures — critical for financial transaction integrity.",
    metrics: "DLQ Depth SLA: < 10 messages | Reprocessing Success Rate: 98.7%"
  },
  s3: {
    name: "S3 Bucket",
    subtitle: "Archive & Cold Storage",
    description: "Stores long-term processed order records, compliance audit exports, and Kafka offset snapshots. Versioned and lifecycle-managed to transition old records to Glacier after 90 days.",
    architectRole: "Configured S3 lifecycle policies for tiered storage and enabled S3 Object Lock for immutable compliance records. Workers stream fulfilled order payloads to S3 as a cold archive after DB writes complete.",
    tradeoff: "Used S3 as a cost-efficient cold archive rather than keeping all historical data in RDS, accepting async write lag for archival in exchange for dramatically lower storage cost at scale.",
    metrics: "Storage Cost vs RDS: ~85% reduction | Archive Write Latency: < 200ms"
  },
  observability: {
    name: "OpenTelemetry Collector",
    subtitle: "Distributed Trace Pipeline",
    description: "Central trace and metric aggregation pipeline. Collects OTLP spans from all ECS services, Kafka consumers, and the API Gateway, then routes to ELK Stack for APM analysis and dashboards.",
    architectRole: "Standardized OpenTelemetry trace propagation headers (traceparent / W3C format) across all C# microservices. Deployed the OTel Collector as a sidecar on each ECS task to minimize network hops in trace reporting.",
    tradeoff: "Accepted ~3% CPU overhead per service for trace instrumentation to gain complete end-to-end distributed request tracing across all service boundaries.",
    metrics: "Trace Coverage: 100% of services | P99 Incident Isolation: < 3 mins"
  },
  elk: {
    name: "ELK Stack",
    subtitle: "Elasticsearch, Logstash & Kibana",
    description: "Central log aggregation, search, and visualization platform. Receives structured log streams from all ECS services and Kafka consumers via Logstash pipelines, then indexes them in Elasticsearch for real-time Kibana dashboards.",
    architectRole: "Defined Logstash filter pipelines to parse and normalize log formats across all services. Built Kibana dashboards tracking P99 latency, error rates, Kafka consumer lag, and SLO burn-rate metrics against defined business thresholds.",
    tradeoff: "Chose to self-host ELK alongside managed OpenTelemetry rather than a fully managed SaaS (e.g. Datadog) to retain full data sovereignty for financial audit log compliance, accepting higher platform ops overhead.",
    metrics: "Log Indexing Latency: < 5s | Dashboard Refresh: Near real-time (10s)"
  }
};
