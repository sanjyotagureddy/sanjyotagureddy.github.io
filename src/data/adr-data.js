export const adrMatrixData = [
  {
    id: "outbox-vs-dualwrite",
    title: "Transactional Outbox Pattern vs. Dual-Writes",
    domain: "Data Consistency in Microservices",
    problem: "When a microservice writes to its local database and publishes an event to Kafka, network failures between the database commit and message broker produce split-brain state discrepancies.",
    optionA: {
      name: "Dual-Writes (Sync Database + Sync Kafka Produce)",
      latency: "~15ms",
      consistency: "Eventually Inconsistent (High Risk)",
      complexity: "Low (No extra infra)",
      failureMode: "If Kafka times out after DB commit, consumer state falls out of sync permanently."
    },
    optionB: {
      name: "Transactional Outbox + Debezium CDC (Chosen)",
      latency: "~22ms (Overhead: ~7ms)",
      consistency: "Strong Eventual Consistency (Guaranteed)",
      complexity: "Medium (Debezium + Kafka Connect)",
      failureMode: "DB transaction logs contain Outbox table commits. Debezium guarantees at-least-once delivery."
    },
    architectDecision: "Chose Option B (Transactional Outbox). In financial order execution, partial failures that result in lost order notifications create costly manual reconciliation work. Accepting a minor ~7ms CDC latency overhead to eliminate split-brain DB states is mandatory for enterprise fintech platforms."
  },
  {
    id: "kafka-vs-rabbitmq",
    title: "Confluent Kafka Event Replay vs. AMQP Message Queues",
    domain: "Event Streaming & Messaging",
    problem: "Financial order processing platforms require processing event bursts while preserving chronological message order and allowing historical re-processing for audits.",
    optionA: {
      name: "RabbitMQ / AMQP Message Queues",
      latency: "~5ms",
      consistency: "Strict Ordering per Queue",
      complexity: "Low",
      failureMode: "Once consumed and acknowledged, messages are deleted; historical event replay requires external archival stores."
    },
    optionB: {
      name: "Confluent Kafka Event Log (Chosen)",
      latency: "~12ms",
      consistency: "Ordered per Partition Key ('OrderId')",
      complexity: "Medium-High",
      failureMode: "Events persist in distributed log topics for defined retention windows, enabling consumer offset resets and replay."
    },
    architectDecision: "Chose Option B (Confluent Kafka). Kafka's immutable commit log enables state reconstruction, event replayability for compliance audits, and multi-consumer topic subscriptions without duplicating queue infrastructures."
  },
  {
    id: "secrets-rotation",
    title: "Active-Pending Serverless Secrets Rotation vs. Container Restarts",
    domain: "Cloud Security & Compliance",
    problem: "Enterprise security standards mandate quarterly database password rotations. Restarting ECS container tasks disrupts active client connections and drops active HTTP worker pools.",
    optionA: {
      name: "Rolling ECS Task Restarts on Credential Rotation",
      latency: "15 - 45s service disruption",
      consistency: "Transient HTTP 503 errors during container termination",
      complexity: "Low",
      failureMode: "High connection pool churn and brief latency spikes during container bootup."
    },
    optionB: {
      name: "Active-Pending Double Password Rotation via Lambda (Chosen)",
      latency: "Sub-second (0.0s downtime)",
      consistency: "Zero HTTP Drops / Zero Task Restarts",
      complexity: "Medium (Dual active DB roles + Lambda rotator)",
      failureMode: "Lambda generates pending password, updates AWS Secrets Manager, hot-reloads ECS connection pools in memory, and revokes legacy keys."
    },
    architectDecision: "Chose Option B (Lambda Serverless Rotator). Hot-reloading connection keys directly in container memory eliminated container restart overhead and consistently passed quarterly SOC2 compliance credential rotation audits with zero production downtime."
  }
];
