// Technical map. "use" lines describe how each technology has actually been used
// in the projects on this site or in work; items without project evidence say so.

export interface Skill {
  name: string;
  use: string[];
  refs?: string[]; // project slugs
}

export interface SkillGroup {
  id: string;
  label: string;
  items: Skill[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    items: [
      {
        name: "Python",
        use: ["Backend development", "APIs", "Automation", "Data processing"],
        refs: ["apexiq", "novabank", "premieriq", "chatwire"],
      },
      {
        name: "C#",
        use: ["Custom queues and circular buffers", "BST / AVL trees", "Sorting and greedy algorithms", "Graph search"],
        refs: ["emergency-call-queue", "video-game-catalogue", "aid-optimiser", "metro-routes"],
      },
      {
        name: "C++",
        use: ["Compiled, systems-level programming", "Working knowledge alongside C#"],
      },
      {
        name: "JavaScript / TypeScript",
        use: ["Next.js and React front ends", "Browser clients for ChatWire and NovaBank", "This site"],
        refs: ["apexiq", "premieriq", "chatwire", "portfolio"],
      },
      {
        name: "SQL",
        use: ["Schema design and queries", "Transactions and row level locking", "Customer segmentation at Belstaff"],
        refs: ["novabank", "chatwire"],
      },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    items: [
      {
        name: "FastAPI",
        use: ["Route modules and OpenAPI docs", "Server side provider keys and caching", "Rate limits, CORS allowlists, trusted hosts"],
        refs: ["apexiq", "novabank", "premieriq"],
      },
      {
        name: "Flask",
        use: ["JSON HTTP auth routes", "Flask-SocketIO live events on one process"],
        refs: ["chatwire"],
      },
      {
        name: ".NET",
        use: [".NET Framework console applications for the ADS coursework"],
        refs: ["emergency-call-queue", "video-game-catalogue"],
      },
      {
        name: "REST APIs",
        use: ["JWT protected resources", "Idempotency keys on money routes", "Same origin /api proxies"],
        refs: ["novabank", "apexiq", "premieriq"],
      },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    items: [
      {
        name: "PostgreSQL",
        use: ["ACID transactions", "FOR UPDATE row locks ordered by id", "Concurrent transfer tests against a real database"],
        refs: ["novabank"],
      },
      {
        name: "SQLite",
        use: ["Users, messages, friends and feed for ChatWire", "Quick smoke database for NovaBank"],
        refs: ["chatwire", "novabank"],
      },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    items: [
      { name: "Git", use: ["Every project on GitHub", "Branch and pull request workflow for this site"] },
      {
        name: "Docker",
        use: ["Docker Compose with Postgres for NovaBank", "One container Dockerfile for ApexIQ", "Railway deploys"],
        refs: ["novabank", "apexiq"],
      },
      { name: "Linux / Bash", use: ["Container and deployment environments", "Working knowledge"] },
      { name: "Azure", use: ["Microsoft cloud platform", "Working knowledge alongside Microsoft 365 support at MMU"] },
    ],
  },
  {
    id: "concepts",
    label: "Concepts",
    items: [
      { name: "Algorithms", use: ["QuickSort and greedy selection", "BFS / DFS", "Poisson Monte Carlo simulation"] },
      { name: "Data Structures", use: ["Circular buffers", "Binary search and AVL trees", "Graphs"] },
      { name: "APIs", use: ["Designing the route surface", "Provider integration with throttling and caching"] },
      { name: "Databases", use: ["Double-entry ledgers", "Balanced debit and credit entries", "Indexing and locking"] },
      { name: "Concurrency", use: ["Ordered row locks to avoid deadlock", "Idempotent retries", "Racing transfer tests"] },
      { name: "System Design", use: ["One origin layouts", "Keys never in the browser", "Empty feeds stay empty"] },
    ],
  },
];
