export const experienceData = [
  {
    key: "jpmc",
    company: "JPMorgan Chase",
    location: "Pune, India",
    period: "07/2022 - Present",
    logo: "./images/jpmorgan.png",
    roles: [
      { title: "Solution Architect", date: "01/2025 - Present" },
      { title: "Technical Lead", date: "07/2022 - 12/2024" }
    ],
    scope: {
      engineers: "10-30 Engineers",
      impact: "20% Acceleration in Delivery",
      focus: "Modernization & Event Streaming"
    },
    highlights: [
      "Own architecture direction and technical standards for enterprise modernization programs used across multiple engineering teams.",
      "Present technical roadmaps, build-vs-buy decisions, and architecture decisions to VP/Director leadership and architectural review boards.",
      "Defined secure integration, IAM controls, and observability standards (OpenTelemetry, tracing) that shortened incident resolution times.",
      "Led design & delivery of a high-throughput event-driven order processing platform using Apache Kafka, establishing resilient partition-key routing and failover strategies.",
      "Co-built an LLM-driven internal code documentation platform using multi-model orchestration, earning 2nd Runner-Up at the 2024 JPMC Hackathon.",
      "Guided monolith-to-microservices migration, decreasing delivery timelines by 20% through reusable modernization blueprints."
    ],
    techStack: [".NET 8", "C#", "Apache Kafka", "AWS (ECS/Lambda)", "OpenTelemetry", "SQL CDC", "Sumo Logic"]
  },
  {
    key: "nice",
    company: "NICE",
    location: "Pune, India",
    period: "10/2021 - 06/2022",
    roles: [
      { title: "Technical Lead Software Engineer", date: "10/2021 - 06/2022" }
    ],
    scope: {
      engineers: "5 Engineers",
      impact: "0 Manual Credential Touches",
      focus: "Security & Microservice Resilience"
    },
    highlights: [
      "Designed reusable enterprise-wide platform frameworks covering resilience (Polly retry/circuit-breakers), unified exceptions, and observability.",
      "Architected and deployed an automated secrets rotation lifecycle using AWS Secrets Manager and Lambda, eradicating manual credential handling.",
      "Established strict CI/CD quality gates, led sprint execution, and conducted architecture/design reviews to mentor junior engineers."
    ],
    techStack: [".NET Core", "AWS Secrets Manager", "AWS Lambda", "CI/CD Pipelines", "Polly Resilience"]
  },
  {
    key: "pitney",
    company: "Pitney Bowes",
    location: "Pune, India",
    period: "04/2020 - 10/2021",
    roles: [
      { title: "Senior Software Engineer", date: "04/2020 - 10/2021" }
    ],
    scope: {
      engineers: "Sole Owner of Core Sync",
      impact: "Monolith Decoupled Successfully",
      focus: "Monolith Migration & CDC"
    },
    highlights: [
      "Owned Kafka synchronization module end-to-end, replacing a legacy Classic ASP monolith with a real-time event-driven sync pipeline.",
      "Implemented CDC (Change Data Capture) and integration patterns to stream data smoothly between legacy systems and modern microservices.",
      "Drove incremental modernization of logistics and shipping platforms to .NET Core, ensuring zero live traffic disruptions."
    ],
    techStack: [".NET Core", "Apache Kafka", "SQL Server", "CDC", "Microservices", "APIs"]
  },
  {
    key: "fis",
    company: "FIS",
    location: "Pune & Bangkok",
    period: "02/2019 - 04/2020",
    roles: [
      { title: "Technical Consultant", date: "02/2019 - 04/2020" }
    ],
    scope: {
      engineers: "Onsite/Offshore Alignment",
      impact: "Global Bank Client Customization",
      focus: "Risk Workflows & Data Aggregation"
    },
    highlights: [
      "Built risk-assessment backend pipelines in .NET and Python to aggregate financial records across multiple upstream services.",
      "Supported and customized configurable risk evaluation algorithms for global financial institutions.",
      "Integrated Serilog and Sumo Logic, enhancing production log observability and shortening diagnosis workflows by onsite teams in Bangkok."
    ],
    techStack: [".NET Framework", "Python", "SQL Server", "Serilog", "Sumo Logic", "Risk Analytics"]
  },
  {
    key: "zensar",
    company: "Zensar Technologies",
    location: "Pune, India",
    period: "08/2015 - 02/2019",
    roles: [
      { title: "Software Engineer", date: "08/2015 - 02/2019" }
    ],
    scope: {
      engineers: "Core Dev Team",
      impact: "30% Production Uptime Increase",
      focus: "Monitoring & Server Automation"
    },
    highlights: [
      "Created server health automation dashboards and alerts, improving overall system availability by 30% and cutting response times.",
      "Shipped backend capabilities and workflow automations for retail/manufacturing .NET applications.",
      "Collaborated with QA, planning teams, and business owners in an Agile environment."
    ],
    techStack: [".NET Framework", "C#", "SQL Server", "ASP.NET", "Agile Automation"]
  }
];
