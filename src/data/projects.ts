import { writeups, type Writeup } from "./writeups.generated";

/** Visual motif used by SystemVisual / project heroes. */
export type Motif = "telemetry" | "ledger" | "probability" | "stream" | "audit" | "algorithm";

export interface ArchNode {
  id: string;
  label: string;
  note: string;
}

export interface ArchEdge {
  from: string;
  to: string;
  label?: string;
}

export interface Project {
  slug: string;
  index: string;
  name: string;
  title: string; // long form, e.g. "Formula 1 Race Intelligence Dashboard"
  description: string; // from the existing cards
  year: string;
  role: string;
  tech: string[];
  motif: Motif;
  image: string;
  imageAlt: string;
  github: string;
  live?: string;
  featured: boolean;
  /** Short problem statement, written from the existing write-up. */
  problem: string;
  /** Engineering decisions, each already stated in the write-up. */
  decisions: string[];
  /** Architecture graph (from the write-up's request path). */
  arch: { nodes: ArchNode[]; edges: ArchEdge[] };
  /** Illustrative labels for the motif visual (not statistics). */
  signals: string[];
  writeup?: Writeup;
}

const wu = (slug: string) => writeups.find((w) => w.slug === slug);

export const projects: Project[] = [
  {
    slug: "apexiq",
    index: "01",
    name: "ApexIQ",
    title: "Formula 1 Race Intelligence Dashboard",
    description:
      "Formula 1 race intelligence dashboard combining live timing, telemetry, GPS circuit data, championship standings and driver comparisons. Built with FastAPI, Next.js, TypeScript and Three.js, with server-side API integration, caching and request throttling.",
    year: "2026",
    role: "Personal project · sole developer",
    tech: ["Python", "FastAPI", "Next.js", "TypeScript", "Three.js", "OpenF1"],
    motif: "telemetry",
    image: "apexiq-dashboard.png",
    imageAlt: "ApexIQ pit wall with 3D car and Italian Grand Prix session",
    github: "https://github.com/code-by-panashe-sanyanga/ApexIQ",
    live: "https://apexiq-production-75e5.up.railway.app",
    featured: true,
    problem:
      "Two public Formula 1 feeds, neither keyed, with different driver numbering, a ~30 request a minute limit, and GPS that points at the garage once a session ends. The dashboard has to compose live timing, a circuit trace and championship context without inventing data the feeds do not publish.",
    decisions: [
      "One origin: the browser only talks to Next.js, which proxies /api to FastAPI on localhost.",
      "Global throttle and composed pit-wall and map caches keep OpenF1 under its limit; polls slow down once a session is completed.",
      "Join drivers on acronym and name, not number, because OpenF1 and f1api.dev disagree.",
      "Sample a mid-session GPS window and ignore point clouds with almost no x/y spread.",
      "Empty feeds stay empty: no fake tyre temperatures, ERS or practice interval gaps.",
      "Procedural Three.js car built in code, so no licensed mesh.",
    ],
    arch: {
      nodes: [
        { id: "browser", label: "Browser UI", note: "Next.js single page. Pit wall, circuit trace, championship, compare, 3D HUD." },
        { id: "next", label: "Next.js", note: "Public origin. Proxies /api/* to FastAPI on localhost. Only surface the browser sees." },
        { id: "api", label: "FastAPI", note: "Composes briefing, pit wall, map and telemetry. Throttles OpenF1 to ~3/s and 30/min." },
        { id: "cache", label: "TTL cache", note: "Composed feeds cached so repeated UI polls do not hit providers." },
        { id: "f1", label: "f1api.dev", note: "Standings, calendar, drivers, teams, circuits, compare. No token." },
        { id: "openf1", label: "OpenF1", note: "Sessions, car_data, location, laps, stints, weather, race control. No token." },
      ],
      edges: [
        { from: "browser", to: "next", label: "same origin /api" },
        { from: "next", to: "api", label: "proxy localhost" },
        { from: "api", to: "cache" },
        { from: "api", to: "f1" },
        { from: "api", to: "openf1" },
      ],
    },
    signals: ["POS", "COMPOUND", "TYRE AGE", "SPEED", "SECTOR", "GPS x/y", "DRS", "GEAR"],
    writeup: wu("apexiq"),
  },
  {
    slug: "novabank",
    index: "02",
    name: "NovaBank",
    title: "Double-Entry Banking API",
    description:
      "Banking application focused on transaction safety and database correctness. Built a double-entry ledger with PostgreSQL row-level locking, ACID transactions and idempotency keys, alongside JWT authentication, ownership checks, fraud rules and concurrent transaction testing.",
    year: "2026",
    role: "Personal project · sole developer",
    tech: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "JWT", "Docker"],
    motif: "ledger",
    image: "novabank-dashboard.png",
    imageAlt: "NovaBank dashboard",
    github: "https://github.com/code-by-panashe-sanyanga/NovaBank",
    live: "https://novabank-api-production-2778.up.railway.app",
    featured: true,
    problem:
      "Move money the way a real bank has to, not a happy path demo. Transfers race, clients retry, floats round, and a partial failure must never leave one side of a transfer updated. Customers must not be able to read each other's accounts or cards.",
    decisions: [
      "A double-entry ledger instead of a single mutable balance field. Debits must equal credits for every transaction.",
      "Only the ledger transfer service posts money rows.",
      "Lock the accounts involved, ordered by id (FOR UPDATE on Postgres), so crossing transfers cannot deadlock.",
      "Insert the transaction header, the balanced ledger entries and the balance cache update in one database transaction. Commit or roll the whole unit back.",
      "Idempotency keys on deposit, withdraw and transfer: a repeated key returns the original transaction instead of posting again.",
      "Decimal for money, never float. Card numbers masked; ownership checked on every sensitive route. Fraud rules flag, they do not block.",
    ],
    arch: {
      nodes: [
        { id: "browser", label: "Browser UI", note: "Dashboard, pots, cards, admin. REST with a JWT, plus a WebSocket for live balance updates." },
        { id: "api", label: "FastAPI", note: "Route modules with OpenAPI docs. bcrypt + JWT with a role claim. Ownership checks." },
        { id: "ledger", label: "Ledger service", note: "The only code path that posts money rows. Ordered row locks, balanced entries, idempotency keys." },
        { id: "fraud", label: "Fraud rules", note: "Flags large amounts, burst outbound transfers and outliers. Never blocks." },
        { id: "db", label: "PostgreSQL", note: "ACID transactions, FOR UPDATE row locks, transactions + ledger_entries + balance_cache." },
        { id: "admin", label: "Admin routes", note: "Customer search, account freeze, flagged transaction review. Rejects customer JWTs." },
      ],
      edges: [
        { from: "browser", to: "api", label: "REST + JWT · WebSocket" },
        { from: "api", to: "ledger" },
        { from: "ledger", to: "db" },
        { from: "api", to: "fraud" },
        { from: "fraud", to: "db" },
        { from: "admin", to: "api" },
      ],
    },
    signals: ["POST /transfer", "FOR UPDATE", "DEBIT", "CREDIT", "IDEMPOTENCY-KEY", "COMMIT", "JWT role", "balance_cache"],
    writeup: wu("novabank"),
  },
  {
    slug: "premieriq",
    index: "03",
    name: "PremierIQ",
    title: "Premier League Simulation Dashboard",
    description:
      "Premier League analytics platform combining live football data with statistical modelling. Uses a 10,000-draw Poisson Monte Carlo engine for match predictions, alongside weather, squad, stadium and remaining fixture analysis. Built with FastAPI, NumPy, Next.js and TypeScript.",
    year: "2026",
    role: "Personal project · sole developer",
    tech: ["Python", "FastAPI", "NumPy", "Next.js", "TypeScript", "MapLibre"],
    motif: "probability",
    image: "premieriq-standings.png",
    imageAlt: "PremierIQ live standings table",
    github: "https://github.com/code-by-panashe-sanyanga/PremierIQ",
    live: "https://premieriq-production.up.railway.app",
    featured: true,
    problem:
      "Mix a live football feed with a statistical model without pretending the feed has injuries, confirmed lineups or betting odds. The free tier allows about ten requests a minute and the provider keys must never reach the browser.",
    decisions: [
      "Poisson Monte Carlo in NumPy: 10,000 draws per fixture, 2,000 full table runs for Season IQ.",
      "Match IQ weights season goals (0.60), last five recency weighted (0.30), home/away split (0.10), head to head (0.05) and second half rates (0.05), rescaled when a piece is missing.",
      "Confidence capped at 64% if a side has played fewer than five games.",
      "In process TTL cache; teams and standings fetched as separate calls, never polled on a timer.",
      "No NEXT_PUBLIC_API_URL. Next.js rewrites /api to FastAPI so keys stay server side. CORS allowlist on the API.",
      "Gemini is optional and only narrates the Monte Carlo JSON. If the key is missing the sim UI still stands.",
    ],
    arch: {
      nodes: [
        { id: "browser", label: "Browser UI", note: "Next.js single page: standings, Match IQ, squads, night stadium map, Season IQ." },
        { id: "next", label: "Next.js", note: "Rewrites /api/* to FastAPI. Same origin so provider keys never reach the browser." },
        { id: "api", label: "FastAPI", note: "Holds the provider keys. Caches football-data.org in process, then runs the simulation." },
        { id: "cache", label: "TTL cache", note: "Free tier is ~10 requests a minute. Standings and teams are separate calls." },
        { id: "fd", label: "football-data.org", note: "Premier League table, teams, matches, scorers." },
        { id: "wx", label: "Weather", note: "OpenWeather with Open-Meteo fallback. Conditions at the home stadium when a sim runs." },
        { id: "eng", label: "NumPy Poisson", note: "10,000 draws per fixture. Season IQ: 2,000 full table runs on remaining fixtures." },
        { id: "gem", label: "Gemini (optional)", note: "Writes a briefing from the Monte Carlo JSON only. Missing key means ai is null." },
      ],
      edges: [
        { from: "browser", to: "next", label: "same origin /api" },
        { from: "next", to: "api", label: "rewrite" },
        { from: "api", to: "cache" },
        { from: "api", to: "fd" },
        { from: "api", to: "wx" },
        { from: "api", to: "eng" },
        { from: "eng", to: "gem", label: "JSON numbers" },
      ],
    },
    signals: ["λ home", "λ away", "10,000 draws", "P(home)", "P(draw)", "P(away)", "xG", "rest days"],
    writeup: wu("premieriq"),
  },
  {
    slug: "chatwire",
    index: "04",
    name: "ChatWire",
    title: "Real-Time Chat Application",
    description:
      "Real-time messaging platform with live channels, direct messages, presence and optional WebRTC calls. Built with Flask-SocketIO and SQLite, with cursor-based pagination, signed sessions, permission checks, login lockout and rate limiting.",
    year: "2026",
    role: "Personal project · sole developer",
    tech: ["Python", "Flask", "Flask-SocketIO", "SQLite", "WebRTC", "pytest"],
    motif: "stream",
    image: "chatwire-chat.png",
    imageAlt: "ChatWire chat UI",
    github: "https://github.com/code-by-panashe-sanyanga/ChatWire",
    live: "https://chat-wire-production.up.railway.app",
    featured: true,
    problem:
      "After mostly request/response HTTP work, learn server push properly: live delivery to every open client, auth that survives a reconnect without the password, permission checks on every social read, and protection against brute force and socket spam.",
    decisions: [
      "JSON HTTP for login, Socket.IO for live events, both on one Flask process.",
      "bcrypt passwords and signed session tokens: reconnect with a token, not the password.",
      "Channel history loads once with cursor pagination (before_id / has_more); new events append instead of replaying the room.",
      "Short account lockout after repeated failures, applied to login and change password.",
      "Per connection rate limits on chat and social write events.",
      "Friends only feed and story views check the viewer is allowed before returning data. Presence kept in memory for demo scale.",
    ],
    arch: {
      nodes: [
        { id: "ui", label: "HTML CSS JS", note: "Channel UI, DMs, feed, Ctrl+K switcher, Meet now calls." },
        { id: "flask", label: "Flask", note: "JSON HTTP: /api/auth/*, health. bcrypt + signed session tokens." },
        { id: "sockets", label: "Socket.IO", note: "Live chat, social and feed events. Per connection rate limits." },
        { id: "sql", label: "SQLite", note: "Users, messages, friends, feed, unread counts, DM threads." },
        { id: "rtc", label: "WebRTC (STUN)", note: "Optional mic/camera peer media once presence says a call is live." },
      ],
      edges: [
        { from: "ui", to: "flask", label: "JSON HTTP" },
        { from: "ui", to: "sockets", label: "Socket.IO" },
        { from: "flask", to: "sql" },
        { from: "sockets", to: "sql" },
        { from: "sockets", to: "ui", label: "push" },
        { from: "ui", to: "rtc" },
      ],
    },
    signals: ["message:new", "typing", "presence", "before_id", "has_more", "reaction", "dm:thread", "lockout"],
    writeup: wu("chatwire"),
  },
  {
    slug: "portfolio",
    index: "05",
    name: "Portfolio",
    title: "Portfolio / Accessibility Work",
    description:
      "This site. Originally static HTML, CSS and vanilla JavaScript on GitHub Pages with an accessibility pass on the screenshot gallery; rebuilt in 2026 as a React and Vite experience with a shared motion system and full reduced-motion support.",
    year: "2026",
    role: "Design, build, accessibility audit",
    tech: ["React", "TypeScript", "Vite", "Framer Motion", "Puppeteer", "GitHub Pages"],
    motif: "audit",
    image: "portfolio-home.png",
    imageAlt: "Home page of the previous portfolio site",
    github: "https://github.com/code-by-panashe-sanyanga/PS-PORTFOLIO",
    live: "https://code-by-panashe-sanyanga.github.io/PS-PORTFOLIO/",
    featured: true,
    problem:
      "One link to send recruiters instead of a CV attachment plus a pile of separate repositories. A CV cannot show a screenshot, explain a specific design decision or link straight to a live demo. The site also had to be usable with a keyboard and a screen reader, and respect reduced motion.",
    decisions: [
      "Accessibility pass on the screenshot lightbox rather than leaving it as a future improvement: focus moves into the dialog and is trapped with Tab / Shift+Tab, and returns to the thumbnail on close.",
      "Left / Right arrows and Escape work from anywhere while the viewer is open.",
      "Autoplay is skipped entirely under prefers-reduced-motion and stops immediately if the setting changes while open.",
      "Puppeteer smoke tests cover landmarks, one h1 per page, non-empty alt text on project images, the focus trap and the reduced-motion path.",
      "No CMS or database: every page's content is the file itself. Write-ups are kept verbatim as data in the rebuilt site.",
      "Rebuilt with React, Vite and Framer Motion; every animation respects prefers-reduced-motion and the opening sequence can be skipped.",
    ],
    arch: {
      nodes: [
        { id: "browser", label: "Browser", note: "Loads HTML, CSS and JS. Lightbox and motion state live in the client only." },
        { id: "pages", label: "GitHub Pages", note: "Serves the built files as they are. Nothing is rendered at request time." },
        { id: "data", label: "Write-up data", note: "Project write-ups kept verbatim as typed data and rendered by the case-study template." },
        { id: "tests", label: "Puppeteer", note: "Landmarks, single h1, alt text, focus trap, reduced motion." },
      ],
      edges: [
        { from: "browser", to: "pages", label: "GET" },
        { from: "pages", to: "browser" },
        { from: "data", to: "browser" },
        { from: "tests", to: "browser", label: "smoke" },
      ],
    },
    signals: ["role=dialog", "aria-modal", "focus trap", "Escape", "prefers-reduced-motion", "alt", "h1 ×1", "landmarks"],
  },
];

export const featured = projects.filter((p) => p.featured);

export interface Coursework {
  slug: string;
  title: string;
  module: string;
  tech: string[];
  github: string;
  writeup: Writeup;
}

const courseworkOrder = [
  "emergency-call-queue",
  "video-game-catalogue",
  "aid-optimiser",
  "metro-routes",
  "whats-for-dinner",
  "vault-comics",
  "space-survival",
];

export const coursework: Coursework[] = courseworkOrder.map((slug) => {
  const w = wu(slug)!;
  return {
    slug,
    title: w.title,
    module: w.date,
    tech: w.tech,
    github: w.links.find((l) => l.label === "GitHub")?.href ?? "",
    writeup: w,
  };
});

export function findProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function findCoursework(slug: string) {
  return coursework.find((c) => c.slug === slug);
}
