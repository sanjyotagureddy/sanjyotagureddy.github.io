export const experienceData = [
  {
    key: "jpmc",
    company: "JPMorgan Chase",
    location: "Pune, India",
    period: "07/2022 - Present",
    logo: "./images/jpmorgan.png",
    logoBg: "#ffffff",
    roles: [
      { title: "Solution Architect", date: "01/2025 - Present" },
      { title: "Technical Lead", date: "07/2022 - 12/2024" }
    ],
    scope: {
      engineers: "25 Engineers (4 Teams)",
      impact: "3 Weeks to <5 Days Bootstrap",
      focus: "Modernization & Event Streaming"
    },
    highlights: [
      "Set the architectural direction and technical roadmap for cloud modernization programs, defining development standards adopted by 25 engineers across 4 feature teams.",
      "Present architectural designs, technology choices, and build-vs-buy recommendations directly to VP/Director leadership and architecture review boards.",
      "Defined security integration rules (encryption, IAM roles, access controls) and OpenTelemetry tracing standards for microservices, which helped speed up production incident debugging.",
      "Mentor other engineers on distributed systems design, helping teams understand tradeoffs around eventual consistency, network partitioning, and database isolation.",
      "Led the technical design of our event-driven order processing platform on Apache Kafka, setting up partitioning key strategies to ensure correct message ordering under heavy load.",
      "Designed automated message transformation pipelines to process downstream financial data, reducing manual reconciliation work and bottlenecks.",
      "Helped teams adopt AI coding practices (like Copilot) and co-developed an LLM-based documentation tool that won 2nd Runner-Up at the 2024 JPMorgan Chase Hackathon.",
      "Led the migration of legacy .NET monoliths to .NET 8 microservices, reducing service bootstrap time from 3 weeks to under 5 days using reusable design templates."
    ],
    techStack: [".NET 8", "C#", "Apache Kafka", "AWS (ECS/Lambda)", "OpenTelemetry", "SQL CDC", "Sumo Logic", "Clean Architecture"]
  },
  {
    key: "nice",
    company: "NICE",
    location: "Pune, India",
    period: "10/2021 - 06/2022",
    logo: "./images/nice.svg",
    logoBg: "#ffffff",
    roles: [
      { title: "Technical Lead Software Engineer", date: "10/2021 - 06/2022" }
    ],
    scope: {
      engineers: "5 Engineers",
      impact: "0 Manual Credential Touches",
      focus: "Security & Microservice Resilience"
    },
    highlights: [
      "Designed reusable libraries for resilience (Polly retries, circuit breakers) and centralized exception handling, shared across microservices.",
      "Built an automated database credential rotation pipeline using AWS Secrets Manager and Lambda, removing manual password handling and improving security posture.",
      "Led a team of 5 developers through the software delivery lifecycle, establishing coding guidelines, setting up CI/CD pipelines, and running design reviews."
    ],
    techStack: [".NET Core", "AWS Secrets Manager", "AWS Lambda", "CI/CD Pipelines", "Polly Resilience", "Docker"]
  },
  {
    key: "pitney",
    company: "Pitney Bowes",
    location: "Pune, India",
    period: "04/2020 - 10/2021",
    logo: "./images/pitneybowes.png",
    logoBg: "#0f1a30",
    roles: [
      { title: "Senior Software Engineer", date: "04/2020 - 10/2021" }
    ],
    scope: {
      engineers: "Sole Owner of Core Sync",
      impact: "Monolith Decoupled Successfully",
      focus: "Monolith Migration & CDC"
    },
    highlights: [
      "Owned a Kafka-based synchronization module from design and development through to production support.",
      "Replaced a legacy Classic ASP monolith database sync with an event-driven system on Kafka, removing blocking database locks and enabling real-time data movement.",
      "Migrated parts of our core shipping systems to .NET Core microservices incrementally, ensuring zero downtime for live merchant traffic.",
      "Designed REST APIs and messaging flows to connect legacy platforms, microservices, and external shipping carriers."
    ],
    techStack: [".NET Core", "Apache Kafka", "SQL Server", "CDC", "Microservices", "REST APIs"]
  },
  {
    key: "fis",
    company: "FIS",
    location: "Pune & Bangkok",
    period: "02/2019 - 04/2020",
    logo: "./images/FIS.svg",
    logoBg: "#ffffff",
    roles: [
      { title: "Technical Consultant", date: "02/2019 - 04/2020" }
    ],
    scope: {
      engineers: "Onsite/Offshore Alignment",
      impact: "Global Bank Client Customization",
      focus: "Risk Workflows & Data Aggregation"
    },
    highlights: [
      "Configured and customized risk assessment platforms used for loan decisions and portfolio analysis by global financial clients.",
      "Wrote backend services in .NET and Python to aggregate and process client financial data from various upstream banking legacy systems.",
      "Coordinated requirements and releases directly with client teams onsite in Bangkok and developers back in Pune.",
      "Set up centralized logging using Serilog and Sumo Logic, which helped teams diagnose production bugs faster."
    ],
    techStack: [".NET Framework", "Python", "SQL Server", "Serilog", "Sumo Logic", "Risk Analytics"]
  },
  {
    key: "zensar",
    company: "Zensar Technologies",
    location: "Pune, India",
    period: "08/2015 - 02/2019",
    logo: "./images/Zensar.png",
    logoBg: "#ffffff",
    roles: [
      { title: "Software Engineer", date: "08/2015 - 02/2019" }
    ],
    scope: {
      engineers: "Core Dev Team",
      impact: "30% Production Uptime Increase",
      focus: "Monitoring & Server Automation"
    },
    highlights: [
      "Developed backend features and automated workflows for enterprise .NET systems in retail and manufacturing.",
      "Built a custom server monitoring and alerting tool, which improved production server uptime by 30%.",
      "Tuned slow SQL Server queries, index rules, and stored procedures, speeding up average report generation times by 40%.",
      "Wrote unit tests using NUnit and Moq to cover core transaction paths, keeping test coverage above 80% to protect against regressions.",
      "Worked in a standard Agile sprint team, reviewing code, fixing bugs, and coordinating deployments with QA and product owners."
    ],
    techStack: [".NET Framework", "C#", "SQL Server", "ASP.NET", "Agile Automation"]
  }
];
