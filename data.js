/**
 * Career Database & Skill Benchmarks Data
 */
const CAREER_DATA = {
  "ai_ml": {
    id: "ai_ml",
    title: "AI & Machine Learning Engineer",
    icon: "fa-brain",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
    description: "Design, build, and deploy intelligent machine learning models, neural networks, and generative AI systems to solve complex problems.",
    avgSalary: { entry: "$85,000", mid: "$130,000", senior: "$190,000+" },
    demandLevel: "Critical Growth (34% YoY)",
    topIndustries: ["Tech Giants", "FinTech", "Healthcare AI", "Autonomous Vehicles", "SaaS"],
    certifications: [
      { name: "AWS Certified Machine Learning - Specialty", provider: "Amazon Web Services", duration: "3-4 Months" },
      { name: "TensorFlow Developer Certificate", provider: "Google", duration: "2 Months" },
      { name: "Deep Learning Specialization", provider: "DeepLearning.AI / Coursera", duration: "3 Months" }
    ],
    skills: [
      { id: "python", name: "Python Programming", category: "core", requiredLevel: 90, importance: "Critical", description: "NumPy, Pandas, Data Structures, OOP, Async IO" },
      { id: "math_stat", name: "Mathematics & Statistics", category: "core", requiredLevel: 85, importance: "Critical", description: "Linear Algebra, Calculus, Probability, Inferential Stats" },
      { id: "ml_algo", name: "Machine Learning Algorithms", category: "core", requiredLevel: 88, importance: "Critical", description: "Regression, Decision Trees, SVM, Random Forests, XGBoost" },
      { id: "deep_learning", name: "Deep Learning & Neural Networks", category: "core", requiredLevel: 80, importance: "High", description: "CNNs, RNNs, Transformers, PyTorch / TensorFlow" },
      { id: "gen_ai", name: "LLMs & Generative AI", category: "core", requiredLevel: 75, importance: "High", description: "LangChain, RAG, Prompt Engineering, Vector Databases (Pinecone/Chroma)" },
      { id: "data_eng", name: "Data Pipeline & Preprocessing", category: "tools", requiredLevel: 78, importance: "High", description: "ETL pipelines, Feature Engineering, SQL, Spark" },
      { id: "mlops", name: "MLOps & Model Deployment", category: "tools", requiredLevel: 70, importance: "Medium", description: "Docker, MLflow, FastAPI, Kubernetes, AWS SageMaker" },
      { id: "git", name: "Git & Version Control", category: "tools", requiredLevel: 80, importance: "High", description: "Git flow, GitHub Actions, CI/CD" },
      { id: "problem_solving", name: "Analytical Problem Solving", category: "soft", requiredLevel: 90, importance: "Critical", description: "Algorithmic thinking, experimental mindset" },
      { id: "comm", name: "Technical Communication", category: "soft", requiredLevel: 75, importance: "Medium", description: "Translating model metrics into business impact" }
    ]
  },
  "fullstack": {
    id: "fullstack",
    title: "Full Stack Web Developer",
    icon: "fa-code",
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
    description: "Architect and develop modern end-to-end web applications, interactive interfaces, scalable backend microservices, and databases.",
    avgSalary: { entry: "$75,000", mid: "$115,000", senior: "$165,000+" },
    demandLevel: "Very High Demand",
    topIndustries: ["Software & SaaS", "E-Commerce", "Digital Agencies", "Finance & Banking", "Startups"],
    certifications: [
      { name: "Meta Full-Stack Engineer Certificate", provider: "Meta / Coursera", duration: "4-6 Months" },
      { name: "AWS Certified Developer - Associate", provider: "Amazon Web Services", duration: "2-3 Months" },
      { name: "MongoDB Certified Developer", provider: "MongoDB University", duration: "1-2 Months" }
    ],
    skills: [
      { id: "js_ts", name: "JavaScript & TypeScript", category: "core", requiredLevel: 92, importance: "Critical", description: "ES6+, Async/Await, Type Safety, DOM Manipulation" },
      { id: "react_next", name: "React.js & Next.js", category: "core", requiredLevel: 88, importance: "Critical", description: "Hooks, State Management (Zustand/Redux), SSR, Server Components" },
      { id: "html_css", name: "HTML5 & Modern CSS", category: "core", requiredLevel: 90, importance: "Critical", description: "Flexbox, Grid, CSS Variables, Animations, TailwindCSS/Vanilla CSS" },
      { id: "node_express", name: "Node.js & Express / NestJS", category: "core", requiredLevel: 85, importance: "Critical", description: "REST APIs, GraphQL, Middleware, Authentication (JWT/OAuth)" },
      { id: "databases", name: "Databases (SQL & NoSQL)", category: "core", requiredLevel: 82, importance: "Critical", description: "PostgreSQL, MongoDB, ORMs (Prisma/Drizzle), Query Optimization" },
      { id: "system_design", name: "System Architecture & APIs", category: "tools", requiredLevel: 75, importance: "High", description: "Microservices, Caching (Redis), Websockets, Web Security" },
      { id: "docker_cloud", name: "Cloud & DevOps Basics", category: "tools", requiredLevel: 70, importance: "Medium", description: "Docker, Vercel/AWS, CI/CD Workflows, NGINX" },
      { id: "testing", name: "Automated Testing", category: "tools", requiredLevel: 72, importance: "Medium", description: "Jest, Playwright, Cypress, Unit & Integration testing" },
      { id: "git", name: "Git & Collaborative Dev", category: "tools", requiredLevel: 85, importance: "High", description: "Branching strategies, Code Reviews, Pull Requests" },
      { id: "problem_solving", name: "Debugging & Troubleshooting", category: "soft", requiredLevel: 88, importance: "High", description: "Root cause analysis, browser devtools, network profiling" }
    ]
  },
  "data_science": {
    id: "data_science",
    title: "Data Scientist & Analytics Specialist",
    icon: "fa-chart-pie",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    description: "Extract actionable business insights, uncover hidden data trends, and construct predictive statistical models using data visualization and ML.",
    avgSalary: { entry: "$80,000", mid: "$125,000", senior: "$175,000+" },
    demandLevel: "High Growth",
    topIndustries: ["Business Intelligence", "Retail & E-Commerce", "Healthcare", "Consulting", "Insurance"],
    certifications: [
      { name: "Google Data Analytics Professional Certificate", provider: "Google", duration: "3 Months" },
      { name: "IBM Data Science Professional Certificate", provider: "IBM", duration: "4 Months" },
      { name: "Microsoft Certified: Power BI Data Analyst", provider: "Microsoft", duration: "2 Months" }
    ],
    skills: [
      { id: "python_r", name: "Python / R for Data Science", category: "core", requiredLevel: 90, importance: "Critical", description: "Pandas, NumPy, SciPy, Jupyter Notebooks" },
      { id: "sql_advanced", name: "Advanced SQL & Querying", category: "core", requiredLevel: 92, importance: "Critical", description: "Window Functions, CTEs, Aggregations, Query Optimization" },
      { id: "statistics", name: "Statistical Analysis & Hypothesis", category: "core", requiredLevel: 88, importance: "Critical", description: "A/B Testing, Regression, ANOVA, Confidence Intervals" },
      { id: "data_viz", name: "Data Visualization & Dashboards", category: "tools", requiredLevel: 85, importance: "High", description: "Tableau, PowerBI, Matplotlib, Seaborn, Plotly" },
      { id: "predictive_modeling", name: "Predictive Analytics & ML", category: "core", requiredLevel: 80, importance: "High", description: "Scikit-Learn, Time Series Forecasting, Classification" },
      { id: "big_data", name: "Big Data Technologies", category: "tools", requiredLevel: 68, importance: "Medium", description: "Apache Spark, PySpark, Snowflake, BigQuery" },
      { id: "git", name: "Version Control & Data Management", category: "tools", requiredLevel: 75, importance: "Medium", description: "Git, DVC (Data Version Control), Reproducible research" },
      { id: "storytelling", name: "Data Storytelling & Reporting", category: "soft", requiredLevel: 90, importance: "Critical", description: "Translating data findings to C-level executive presentations" }
    ]
  },
  "cybersecurity": {
    id: "cybersecurity",
    title: "Cybersecurity Analyst & Ethical Hacker",
    icon: "fa-shield-halved",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    description: "Protect systems, networks, and enterprise data from cyber threats, perform vulnerability assessments, penetration testing, and incident response.",
    avgSalary: { entry: "$78,000", mid: "$120,000", senior: "$170,000+" },
    demandLevel: "Critical Shortage / High Demand",
    topIndustries: ["Government & Defense", "Banking & Finance", "Healthcare", "Cloud Providers", "Enterprise IT"],
    certifications: [
      { name: "CompTIA Security+", provider: "CompTIA", duration: "2-3 Months" },
      { name: "Certified Ethical Hacker (CEH)", provider: "EC-Council", duration: "3 Months" },
      { name: "Certified Information Systems Security Professional (CISSP)", provider: "ISC2", duration: "5-6 Months" }
    ],
    skills: [
      { id: "networking", name: "Network Fundamentals & Protocols", category: "core", requiredLevel: 92, importance: "Critical", description: "TCP/IP, DNS, VPN, Firewalls, Wireshark packet analysis" },
      { id: "linux_sys", name: "Linux & Operating Systems Security", category: "core", requiredLevel: 88, importance: "Critical", description: "Bash scripting, Permission models, Hardening, Kernel security" },
      { id: "sec_tools", name: "Security Tools & SIEM", category: "tools", requiredLevel: 85, importance: "High", description: "Splunk, Nmap, Burp Suite, Metasploit, Snort" },
      { id: "pen_testing", name: "Penetration Testing & VAPT", category: "core", requiredLevel: 80, importance: "High", description: "OWASP Top 10, Exploitation techniques, Vulnerability scanning" },
      { id: "crypto", name: "Cryptography & PKI", category: "core", requiredLevel: 78, importance: "High", description: "Symmetric/Asymmetric encryption, TLS/SSL, Hashing algorithms" },
      { id: "incident_resp", name: "Incident Response & Forensics", category: "tools", requiredLevel: 75, importance: "Medium", description: "Threat hunting, Malware triage, Memory analysis" },
      { id: "python_sec", name: "Python Scripting for Automation", category: "tools", requiredLevel: 80, importance: "High", description: "Automating threat intelligence, custom exploit scripts" },
      { id: "compliance", name: "Security Compliance & Standards", category: "soft", requiredLevel: 72, importance: "Medium", description: "ISO 27001, NIST framework, GDPR, SOC2 compliance" }
    ]
  },
  "cloud_devops": {
    id: "cloud_devops",
    title: "Cloud & DevOps Infrastructure Engineer",
    icon: "fa-cloud",
    color: "#ec4899",
    gradient: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
    description: "Build robust, scalable cloud infrastructure, automate deployment pipelines (CI/CD), manage containers, and ensure 99.99% service uptime.",
    avgSalary: { entry: "$82,000", mid: "$135,000", senior: "$185,000+" },
    demandLevel: "Very High Demand",
    topIndustries: ["Cloud Computing", "SaaS Enterprises", "Financial Tech", "E-Commerce Giants"],
    certifications: [
      { name: "AWS Certified Solutions Architect - Associate", provider: "Amazon Web Services", duration: "3 Months" },
      { name: "Certified Kubernetes Administrator (CKA)", provider: "CNCF / Linux Foundation", duration: "3-4 Months" },
      { name: "HashiCorp Certified: Terraform Associate", provider: "HashiCorp", duration: "2 Months" }
    ],
    skills: [
      { id: "cloud_providers", name: "Cloud Platforms (AWS/Azure/GCP)", category: "core", requiredLevel: 90, importance: "Critical", description: "IAM, EC2/S3/VPC, Lambda, CloudWatch, Serverless" },
      { id: "containers", name: "Docker & Containerization", category: "core", requiredLevel: 92, importance: "Critical", description: "Dockerfile optimization, Multi-stage builds, Container security" },
      { id: "k8s", name: "Kubernetes & Orchestration", category: "core", requiredLevel: 85, importance: "Critical", description: "Deployments, Services, Helm charts, Ingress controllers" },
      { id: "iac", name: "Infrastructure as Code (Terraform)", category: "tools", requiredLevel: 88, importance: "High", description: "State management, Modules, HCL syntax, Ansible" },
      { id: "cicd", name: "CI/CD Pipeline Automation", category: "tools", requiredLevel: 90, importance: "Critical", description: "GitHub Actions, GitLab CI, Jenkins, ArgoCD, GitOps" },
      { id: "linux_scripting", name: "Linux Administration & Bash/Python", category: "core", requiredLevel: 85, importance: "High", description: "Shell scripting, process management, log parsing" },
      { id: "monitoring", name: "Observability & Monitoring", category: "tools", requiredLevel: 80, importance: "High", description: "Prometheus, Grafana, ELK Stack, Distributed Tracing" }
    ]
  },
  "ui_ux": {
    id: "ui_ux",
    title: "UI/UX & Digital Product Designer",
    icon: "fa-palette",
    color: "#f43f5e",
    gradient: "linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)",
    description: "Design delightful, user-centric digital experiences, craft interactive wireframes, conduct user research, and maintain design systems.",
    avgSalary: { entry: "$70,000", mid: "$108,000", senior: "$150,000+" },
    demandLevel: "Steady Growth",
    topIndustries: ["Product SaaS", "Consumer Apps", "Design Agencies", "FinTech"],
    certifications: [
      { name: "Google UX Design Professional Certificate", provider: "Google", duration: "4-5 Months" },
      { name: "Nielsen Norman Group UX Master Certification", provider: "NN/g", duration: "Variable" }
    ],
    skills: [
      { id: "figma", name: "Figma & Prototyping", category: "core", requiredLevel: 95, importance: "Critical", description: "Auto-layout, Components, Variants, Interactive Prototypes" },
      { id: "ux_research", name: "User Research & Usability Testing", category: "core", requiredLevel: 88, importance: "Critical", description: "User interviews, Card sorting, Persona mapping, Heuristic evaluation" },
      { id: "wireframing", name: "Wireframing & Information Architecture", category: "core", requiredLevel: 90, importance: "Critical", description: "User flows, Site maps, Low to high-fidelity wireframes" },
      { id: "design_system", name: "Design Systems & UI Component Libraries", category: "tools", requiredLevel: 85, importance: "High", description: "Tokens, Color systems, Typography hierarchies, Accessibility (WCAG)" },
      { id: "html_css_basics", name: "Frontend Basics (HTML/CSS)", category: "tools", requiredLevel: 65, importance: "Medium", description: "Understanding CSS Flex/Grid to communicate effectively with devs" },
      { id: "empathy", name: "Empathy & User-Centric Mindset", category: "soft", requiredLevel: 95, importance: "Critical", description: "Advocating for user needs against technical constraints" }
    ]
  }
};

/**
 * Preset Student Profiles for 1-Click Instant Demos
 */
const PRESET_PROFILES = [
  {
    id: "preset_ai_sophomore",
    name: "Alex Chen",
    academicYear: "Computer Science Sophomore (Year 2)",
    weeklyHours: 15,
    targetRole: "ai_ml",
    skillProficiencies: {
      python: 75,
      math_stat: 70,
      ml_algo: 45,
      deep_learning: 20,
      gen_ai: 30,
      data_eng: 50,
      mlops: 15,
      git: 65,
      problem_solving: 80,
      comm: 60
    }
  },
  {
    id: "preset_web_self_taught",
    name: "Maya Lin",
    academicYear: "Final Year Student / Self-Taught Dev",
    weeklyHours: 20,
    targetRole: "fullstack",
    skillProficiencies: {
      js_ts: 80,
      react_next: 75,
      html_css: 85,
      node_express: 60,
      databases: 50,
      system_design: 35,
      docker_cloud: 25,
      testing: 40,
      git: 78,
      problem_solving: 75
    }
  },
  {
    id: "preset_cyber_junior",
    name: "Jordan Vance",
    academicYear: "IT & Cybersecurity Junior (Year 3)",
    weeklyHours: 12,
    targetRole: "cybersecurity",
    skillProficiencies: {
      networking: 78,
      linux_sys: 70,
      sec_tools: 55,
      pen_testing: 40,
      crypto: 50,
      incident_resp: 30,
      python_sec: 45,
      compliance: 40
    }
  }
];

/**
 * Resource catalog for learning roadmaps
 */
const SKILL_RESOURCES = {
  python: [
    { title: "Complete Python Bootcamp (Zero to Hero)", type: "Course", source: "Udemy / Angela Yu", free: false, url: "https://www.udemy.com/" },
    { title: "Python Data Science Handbook", type: "Book", source: "O'Reilly (Jake VanderPlas)", free: true, url: "https://jakevdp.github.io/PythonDataScienceHandbook/" },
    { title: "LeetCode 75 Python Problem Set", type: "Practice", source: "LeetCode", free: true, url: "https://leetcode.com/" }
  ],
  ml_algo: [
    { title: "Machine Learning Specialization by Andrew Ng", type: "Course", source: "Coursera / Stanford", free: true, url: "https://www.coursera.org/specializations/machine-learning-introduction" },
    { title: "Scikit-Learn Official User Guide & Tutorials", type: "Documentation", source: "Scikit-Learn", free: true, url: "https://scikit-learn.org/" }
  ],
  deep_learning: [
    { title: "Deep Learning Specialization", type: "Course", source: "DeepLearning.AI", free: false, url: "https://www.deeplearning.ai/" },
    { title: "PyTorch 60min Blitz & Official Tutorials", type: "Interactive Docs", source: "PyTorch.org", free: true, url: "https://pytorch.org/tutorials/" }
  ],
  gen_ai: [
    { title: "LangChain & Vector Databases Crash Course", type: "Tutorial", source: "FreeCodeCamp", free: true, url: "https://www.youtube.com/" },
    { title: "Generative AI with LLMs", type: "Course", source: "AWS & DeepLearning.AI", free: true, url: "https://www.coursera.org/" }
  ],
  js_ts: [
    { title: "JavaScript.info (Modern JS Tutorial)", type: "Interactive Book", source: "JS.info", free: true, url: "https://javascript.info/" },
    { title: "Understanding TypeScript", type: "Course", source: "Udemy / Maximilian Schwarzmüller", free: false, url: "https://www.udemy.com/" }
  ],
  react_next: [
    { title: "React.dev Official Interactive Docs", type: "Docs", source: "React Team", free: true, url: "https://react.dev/" },
    { title: "Next.js 14 App Router Course", type: "Tutorial", source: "Vercel Academy", free: true, url: "https://nextjs.org/learn" }
  ],
  node_express: [
    { title: "Node.js API Masterclass with Express & MongoDB", type: "Course", source: "Traversy Media / Udemy", free: false, url: "https://www.udemy.com/" },
    { title: "Node.js Design Patterns", type: "Book", source: "Packt", free: false, url: "https://www.nodejsdesignpatterns.com/" }
  ],
  databases: [
    { title: "SQLBolt - Interactive SQL Lessons", type: "Practice", source: "SQLBolt", free: true, url: "https://sqlbolt.com/" },
    { title: "Prisma ORM & PostgreSQL Fundamentals", type: "Docs", source: "Prisma.io", free: true, url: "https://www.prisma.io/docs" }
  ],
  networking: [
    { title: "NetworkChuck Coffee & Networking Course", type: "Video Series", source: "YouTube", free: true, url: "https://www.youtube.com/" },
    { title: "Wireshark Packet Analysis Masterclass", type: "Course", source: "Cybrary", free: true, url: "https://www.cybrary.it/" }
  ]
};

/**
 * Knowledge Base for SkillBot AI Advisor
 */
const AI_ADVISOR_KNOWLEDGE = {
  greetings: [
    "Hello! I'm SkillBot, your AI Career & Learning Advisor. How can I help you accelerate your tech career journey today?",
    "Welcome! Ready to analyze your skill gaps and level up your portfolio? Ask me anything about skills, certifications, or roadmap strategies!"
  ],
  defaultAdvice: {
    title: "General Skill Strategy",
    content: "Focus first on core foundational skills (highest required level + critical importance). Mastering foundations makes learning secondary frameworks 3x faster!"
  },
  faqAnswers: {
    "skills_first": "Based on your current profile, focus on bridging skills where the gap between your current level and target level is greater than 35%. Prioritize High/Critical importance skills first before picking up niche tools.",
    "certifications": "Certifications validate knowledge, but portfolio projects land interviews! We recommend combining 1 respected industry certification with 2 public GitHub projects demonstrating end-to-end implementation.",
    "time_commitment": "Consistency beats cramming! Dedicated 12-15 hours per week structured as 2 hours daily + 4 hours weekend project building will help you achieve job-readiness in 5 to 7 months.",
    "interview_prep": "Start practicing problem-solving on LeetCode/HackerRank for technical roles, and prepare STAR method stories for soft skills. Don't forget to practice explaining your portfolio projects out loud!"
  }
};
