export const qaData = [
  {
    id: "kafka-ordering",
    question: "How do you guarantee in-order message delivery in Kafka under high volume spikes?",
    category: "Event Streaming",
    shortAnswer: "Partition Key Hashing on Entity ID + Non-Blocking Retry Topics",
    codeSnippet: `// Order Event Producer Strategy
var message = new Message<string, OrderEvent> {
    Key = order.OrderId.ToString(), // Hashes to deterministic partition
    Value = orderEvent,
    Headers = { { "traceparent", Activity.Current?.Id } }
};
await _kafkaProducer.ProduceAsync("order-events", message);`,
    fullAnswer: "To guarantee strict message ordering under high throughput without blocking partition processing, I hash partition keys deterministically on the unique Entity ID (e.g., 'OrderId'). This routes all state changes for a specific order to the exact same Kafka partition in sequence. If a consumer encounters a transient downstream exception, rather than blocking the main partition consumer loop, the event is routed to non-blocking delayed retry topics (`order-retry-5m`, `order-retry-15m`) with exponential backoffs before sliding into the Dead Letter Queue (DLQ)."
  },
  {
    id: "strangler-fig",
    question: "What is your approach to legacy monolith data migration with zero downtime?",
    category: "System Modernization",
    shortAnswer: "Strangler Fig Pattern + Debezium CDC + Reverse CDC Safety Net",
    codeSnippet: `/* CDC Pipeline Setup */
Monolith_DB (SQL Server) ➔ Debezium CDC ➔ Confluent Kafka ➔ Microservice_DB (Postgres)
                                                                │
                                   [Reverse CDC Sync Net] ◄─────┘`,
    fullAnswer: "I execute a 6-stage Strangler Fig decomposition. First, AWS API Gateway is introduced to intercept ingress traffic. Next, the new microservice shell is deployed alongside its independent PostgreSQL database. Debezium Change Data Capture (CDC) reads SQL Server transaction logs in real time, streaming commits via Kafka to populate Postgres without loading the monolith application. Dual-write validation runs automated reconciliation jobs. During canary cutover, Reverse CDC runs back to the legacy database—ensuring immediate zero-data-loss rollback capability if anomalies occur."
  },
  {
    id: "governance",
    question: "How do you govern technical standards across 25+ engineers without slowing delivery?",
    category: "Architecture Governance",
    shortAnswer: "Standardized Service Scaffolding + Automated Quality Gates + Mentorship",
    codeSnippet: `// Golden Path Scaffolding CLI
npx @jpmc/bootstrap-microservice --template=event-driven-dotnet8
// Outputs: Serilog structured logging, OpenTelemetry tracing, 
// Polly circuit breakers & Docker container specs out-of-the-box`,
    fullAnswer: "Governance works best when it removes friction rather than adding paperwork. As Solution Architect at JPMorgan Chase, I introduced standardized service scaffolding templates embedded with firm-approved security controls (IAM policies, encryption), structured logging (Serilog/Sumo Logic), and OpenTelemetry tracing. This reduced new microservice bootstrap time from 3 weeks to under 5 days. I pair this with weekly architecture review sessions where engineers evaluate trade-offs together, fostering shared ownership over architectural standards."
  },
  {
    id: "ai-enablement",
    question: "What is your enterprise strategy for AI engineering and LLM adoption?",
    category: "AI & Modern Engineering",
    shortAnswer: "In-Boundary LLM Orchestration + Copilot Standards + AST Documentation Engine",
    codeSnippet: `# AST Code Ingestion Engine (Python)
def parse_repository_ast(repo_path):
    tree = ast.parse(repo_path.read_text())
    doc_prompt = build_context_prompt(tree)
    return internal_llm_client.generate(doc_prompt) # Secure In-VPC Endpoint`,
    fullAnswer: "AI tools must operate strictly within firm security boundaries. At JPMorgan Chase, I led the development of an AI-powered documentation engine (awarded 2nd Runner-Up at the 2024 JPMC Hackathon) that recursively parses repository AST trees and passes codebase graphs to a firm-hosted, VPC-isolated LLM endpoint to generate automated developer documentation. Additionally, I set governance guidelines for GitHub Copilot adoption—focusing on prompt chaining techniques, unit test generation, and automated code review rules."
  }
];
