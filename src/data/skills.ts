// Technical map. "use" lines describe how each technology has actually been used.
// Items without project evidence say so. No percentage bars, no invented depth.

export interface Skill {
  name: string;
  use: string[];
  refs?: string[];
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
        use: ["FastAPI services on ApexIQ, NovaBank and PremierIQ", "Flask and Socket.IO on ChatWire", "NumPy Monte Carlo on PremierIQ"],
        refs: ["apexiq", "novabank", "premieriq", "chatwire"],
      },
      {
        name: "SQL",
        use: ["NovaBank ledger schema and locking", "ChatWire message and friend tables"],
        refs: ["novabank", "chatwire"],
      },
      {
        name: "C#",
        use: ["Queues, BST and AVL trees, sorting, greedy packers, graph search"],
        refs: ["emergency-call-queue", "video-game-catalogue", "aid-optimiser", "metro-routes"],
      },
      {
        name: "JavaScript and TypeScript",
        use: ["Next.js UIs for ApexIQ and PremierIQ", "ChatWire and NovaBank browser clients", "This site"],
        refs: ["apexiq", "premieriq", "chatwire", "portfolio"],
      },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    items: [
      {
        name: "Next.js",
        use: ["ApexIQ and PremierIQ product UIs", "Same origin /api proxy so keys stay server side"],
        refs: ["apexiq", "premieriq"],
      },
      {
        name: "React",
        use: ["This portfolio", "Interactive case-study pages"],
        refs: ["portfolio"],
      },
      {
        name: "HTML, CSS and JS",
        use: ["ChatWire and NovaBank clients", "Vault Comics shop flow"],
        refs: ["chatwire", "novabank", "vault-comics"],
      },
      {
        name: "Three.js",
        use: ["Procedural car HUD on ApexIQ"],
        refs: ["apexiq"],
      },
      {
        name: "MapLibre",
        use: ["Night stadium map on PremierIQ"],
        refs: ["premieriq"],
      },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    items: [
      {
        name: "FastAPI",
        use: ["REST routes and OpenAPI on NovaBank", "Server side provider keys and caches on ApexIQ and PremierIQ"],
        refs: ["apexiq", "novabank", "premieriq"],
      },
      {
        name: "Flask",
        use: ["JSON auth routes", "Socket.IO live events on the same process as ChatWire"],
        refs: ["chatwire"],
      },
      {
        name: "SQLAlchemy",
        use: ["ORM and Decimal money types on NovaBank"],
        refs: ["novabank"],
      },
      {
        name: "REST APIs",
        use: ["JWT protected money routes", "Idempotency keys on deposit, withdraw and transfer", "Same origin /api proxies"],
        refs: ["novabank", "apexiq", "premieriq"],
      },
      {
        name: "JWT",
        use: ["Login issues a token with a role claim", "Protected routes validate the token and check ownership"],
        refs: ["novabank"],
      },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    items: [
      {
        name: "PostgreSQL",
        use: ["NovaBank ACID transfers", "FOR UPDATE locks ordered by account id", "Concurrent transfer tests against a real database"],
        refs: ["novabank"],
      },
      {
        name: "SQLite",
        use: ["ChatWire persistence", "NovaBank smoke database"],
        refs: ["chatwire", "novabank"],
      },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    items: [
      { name: "Git", use: ["Repos for every project", "Branch and PR workflow on this site"] },
      {
        name: "Docker",
        use: ["Docker Compose Postgres for NovaBank", "Dockerfile for ApexIQ"],
        refs: ["novabank", "apexiq"],
      },
      { name: "Linux and Bash", use: ["Containers and Railway deploys", "Working knowledge"] },
      { name: "pytest", use: ["11 tests on the NovaBank ledger path", "24 tests on ChatWire auth, access control and sockets"], refs: ["novabank", "chatwire"] },
      { name: "Azure", use: ["Working knowledge of Microsoft 365 and Azure support tooling"] },
    ],
  },
  {
    id: "concepts",
    label: "Concepts",
    items: [
      { name: "Algorithms", use: ["Sorting, trees and graphs", "PremierIQ Poisson Monte Carlo"] },
      { name: "Data Structures", use: ["Circular buffers", "BST and AVL trees", "Graphs"] },
      { name: "System Design", use: ["Browser talks to my site only", "API keys stay on the server", "Missing feed fields stay blank"] },
      { name: "Concurrency", use: ["Ordered row locks", "Idempotent retries", "Racing transfer tests"] },
      { name: "Testing", use: ["pytest on money and socket paths", "Puppeteer smoke tests on this site"] },
      { name: "Deployment", use: ["Docker Compose", "Railway live demos", "GitHub Pages"] },
    ],
  },
];
