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
    title: "Formula 1 pit wall dashboard",
    description:
      "Live F1 dashboard: timing, track map, standings and driver compare. Built like a small BBC Sport style race page, with the server talking to free F1 data feeds. Live on Railway.",
    year: "2026",
    role: "Full stack",
    tech: ["Python", "FastAPI", "Next.js", "TypeScript", "Three.js", "OpenF1"],
    motif: "telemetry",
    image: "apexiq-dashboard.png",
    imageAlt: "ApexIQ pit wall with 3D car and Italian Grand Prix session",
    github: "https://github.com/code-by-panashe-sanyanga/ApexIQ",
    live: "https://apexiq-production-75e5.up.railway.app",
    featured: true,
    problem:
      "I wanted a live Formula 1 page I could trust, closer to a pit wall or a BBC Sport race view than a static site. Free data feeds do not line up cleanly: the same driver can have different numbers in each feed, you can only ask for live data a limited number of times per minute, the track map can jump into the garage when a session ends, and some live values never arrive at all. The hard part was stitching that into one dashboard without inventing numbers the feed never sent.",
    decisions: [
      "The browser only talks to my site. The site asks the server for data, so the free feed details stay off the client.",
      "I limit how often the live feed is called and cache answers, so I do not burn through the request limit.",
      "Drivers are matched by name and short code, not by number, because the two feeds disagree on numbers.",
      "The track map uses GPS from the middle of the session. If the points barely move, they are treated as garage noise and ignored.",
      "If tyre temperatures, ERS or practice gaps are missing from the feed, those spots stay blank on screen.",
      "The 3D car is drawn in code, so there is no licensed car model.",
    ],
    arch: {
      nodes: [
        { id: "browser", label: "Browser UI", note: "Next.js page: pit wall, track map, standings, compare, 3D car." },
        { id: "next", label: "Next.js", note: "Public site. Forwards /api/* to FastAPI. Only host the browser talks to." },
        { id: "api", label: "FastAPI", note: "Builds briefing, pit wall, map and live data. Limits OpenF1 to about 3/s and 30/min." },
        { id: "cache", label: "TTL cache", note: "Stores built responses so the UI can poll without hitting the providers every time." },
        { id: "f1", label: "f1api.dev", note: "Standings, calendar, drivers, teams, circuits, compare. No API key." },
        { id: "openf1", label: "OpenF1", note: "Sessions, car data, GPS, laps, stints, weather, race control. No API key." },
      ],
      edges: [
        { from: "browser", to: "next", label: "same host /api" },
        { from: "next", to: "api", label: "proxy to localhost" },
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
    title: "Banking app with transfers",
    description:
      "A small online bank with a dashboard: accounts, cards, pots and transfers. Built to learn how banks move money safely. Live on Railway.",
    year: "2026",
    role: "Full stack",
    tech: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "JWT", "Docker"],
    motif: "ledger",
    image: "novabank-dashboard.png",
    imageAlt: "NovaBank dashboard",
    github: "https://github.com/code-by-panashe-sanyanga/NovaBank",
    live: "https://novabank-api-production-2778.up.railway.app",
    featured: true,
    problem:
      "I wanted to understand how a bank moves money, not just store a balance number on a user. Two people can transfer at the same time, a slow phone can send the same payment twice, and a crash halfway through must not leave one side paid and the other unpaid. Customers also must not see each other's accounts or card numbers.",
    decisions: [
      "Every transfer writes a debit and a matching credit, like a real ledger, instead of editing one balance field.",
      "Only one service is allowed to post money rows, so payments cannot sneak in through random routes.",
      "When two transfers touch the same accounts, the database locks those rows in a fixed order so they cannot freeze waiting on each other.",
      "The transfer header, the ledger lines and the balance update succeed or fail together as one database commit.",
      "If the client sends the same payment key again, the app returns the first result instead of moving the money twice.",
      "Money uses exact decimal values, not floating point. Card numbers are masked. Fraud rules can flag odd behaviour, but they do not block payments in this demo.",
    ],
    arch: {
      nodes: [
        { id: "browser", label: "Browser UI", note: "Dashboard, pots, cards and admin screens. Talks to the server with a login token, and gets live balance updates." },
        { id: "api", label: "FastAPI", note: "HTTP routes, login, and checks that you only touch your own accounts." },
        { id: "ledger", label: "Ledger service", note: "The only place that posts money. Locks accounts, writes balanced entries, handles repeat payment keys." },
        { id: "fraud", label: "Fraud rules", note: "Flags large or burst transfers for review. Does not block them." },
        { id: "db", label: "PostgreSQL", note: "Stores accounts, ledger lines and balances. Supports locks during transfers." },
        { id: "admin", label: "Admin routes", note: "Search customers, freeze accounts, review flagged payments. Customer logins cannot use these." },
      ],
      edges: [
        { from: "browser", to: "api", label: "HTTP, login token, live updates" },
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
    title: "Premier League dashboard",
    description:
      "Premier League standings, match chances, season outlook and a stadium map. Built like a BBC Sport style football page with live table data. Live on Railway.",
    year: "2026",
    role: "Full stack",
    tech: ["Python", "FastAPI", "NumPy", "Next.js", "TypeScript", "MapLibre"],
    motif: "probability",
    image: "premieriq-standings.png",
    imageAlt: "PremierIQ live standings table",
    github: "https://github.com/code-by-panashe-sanyanga/PremierIQ",
    live: "https://premieriq-production.up.railway.app",
    featured: true,
    problem:
      "I wanted a football site closer to BBC Sport: live standings, and a clear view of match chances, without pretending the free data feed has injuries, confirmed lineups or betting odds. The feed only allows about ten requests a minute, and the secret keys for that feed must never end up in the browser.",
    decisions: [
      "Match chances come from many simulated scorelines in NumPy (10,000 per fixture). Season outlook runs the remaining table 2,000 times.",
      "The model mixes season form, recent games, home and away splits, and head to head when those pieces exist. Weights are adjusted if something is missing.",
      "If a team has played fewer than five games, confidence is capped so early-season noise does not look certain.",
      "Standings and team lists are fetched separately and cached briefly, so the app does not hammer the free feed on a timer.",
      "The browser only talks to my site. The site asks the server for data, so football API keys stay on the server.",
      "Optional Gemini text only summarises the simulation numbers. If that key is missing, the match view still works.",
    ],
    arch: {
      nodes: [
        { id: "browser", label: "Browser UI", note: "Standings, Match IQ, squads, stadium map, Season IQ." },
        { id: "next", label: "Next.js", note: "Public site. Forwards /api to the server so keys stay off the client." },
        { id: "api", label: "FastAPI", note: "Holds provider keys, caches football data, runs the simulations." },
        { id: "cache", label: "TTL cache", note: "Keeps recent table and team responses so the free feed is not hit too often." },
        { id: "fd", label: "football-data.org", note: "Premier League table, teams, matches, scorers." },
        { id: "wx", label: "Weather", note: "Weather at the home stadium when a sim runs, with a fallback provider." },
        { id: "eng", label: "Match engine", note: "Simulates many scorelines per fixture, and many full remaining seasons." },
        { id: "gem", label: "Gemini (optional)", note: "Writes a short briefing from the simulation JSON only." },
      ],
      edges: [
        { from: "browser", to: "next", label: "same host /api" },
        { from: "next", to: "api", label: "forward" },
        { from: "api", to: "cache" },
        { from: "api", to: "fd" },
        { from: "api", to: "wx" },
        { from: "api", to: "eng" },
        { from: "eng", to: "gem", label: "simulation numbers" },
      ],
    },
    signals: ["λ home", "λ away", "10,000 draws", "P(home)", "P(draw)", "P(away)", "xG", "rest days"],
    writeup: wu("premieriq"),
  },
  {
    slug: "chatwire",
    index: "04",
    name: "ChatWire",
    title: "Live social app",
    description:
      "v2 rebuild of a room chat into a social product: Home timeline, Explore with clips and boards, Chat with communities and DMs, and You profiles. Privacy checks in the data layer, 38 tests. Live on Railway.",
    year: "2026",
    role: "Full stack",
    tech: ["Python", "Flask", "Flask-SocketIO", "SQLite", "WebRTC", "pytest"],
    motif: "stream",
    image: "chatwire-v2-home.png",
    imageAlt: "ChatWire v2 Home timeline with a repost showing the quoted post",
    github: "https://github.com/code-by-panashe-sanyanga/ChatWire",
    live: "https://chat-wire-production.up.railway.app",
    featured: true,
    problem:
      "I wanted to understand how apps like Discord and Instagram get a message onto every open screen at once. Refreshing a page is not enough. People need to stay signed in after a reconnect without typing the password again, friends-only posts must stay private, and login or chat spam should not be easy. Version 1 was a display name plus a room name, so anything in the room was public and nothing survived a restart. Version 2 had to become a product someone could actually sign into and trust.",
    decisions: [
      "Login uses normal HTTP. Everything live rides Socket.IO on the same server process.",
      "v2 replaced the room join form with one shell: Home, Explore, Chat and You, so posting, browsing, messaging and your profile all live in the same app.",
      "Privacy is enforced in the data layer, not the UI. Feed, stories, boards and Saved are checked on every read and write helper because post and board ids are sequential.",
      "Saved is owner only: other people see your posts, reposts, highlights and status, never what you saved.",
      "Security: bcrypt hashes, signed session tokens for reconnect, lockout on login and change-password, CSP and related headers, and per-connection write rate limits.",
      "A channel loads older messages in pages. New messages append live, instead of reloading the whole history every time you switch room.",
      "Calls use WebRTC; /api/webrtc/ice hands STUN and optional TURN to a signed-in session only. Go live and screen share sit on the same call path.",
      "SQLite and uploads live on a Railway volume via DATA_DIR, so a deploy does not wipe accounts or media.",
    ],
    arch: {
      nodes: [
        { id: "ui", label: "Browser UI", note: "Channels, DMs, feed, discover, go-live, quick switcher." },
        { id: "flask", label: "Flask", note: "Login, logout, ICE credentials, upload, health." },
        { id: "sockets", label: "Socket.IO", note: "Chat, social, discover, live events. Rate limits on writes." },
        { id: "sql", label: "SQLite", note: "Users, messages, friends, feed, votes, boards, live sessions." },
        { id: "rtc", label: "WebRTC", note: "Meet now + go live mic/camera/screen; TURN-ready ICE." },
      ],
      edges: [
        { from: "ui", to: "flask", label: "login HTTP" },
        { from: "ui", to: "sockets", label: "live events" },
        { from: "flask", to: "sql" },
        { from: "sockets", to: "sql" },
        { from: "sockets", to: "ui", label: "push" },
        { from: "ui", to: "rtc" },
      ],
    },
    signals: ["message:new", "typing", "presence", "before_id", "has_more", "reaction", "dm:thread", "lockout", "live_start", "discover"],
    writeup: wu("chatwire"),
  },
  {
    slug: "portfolio",
    index: "05",
    name: "Portfolio",
    title: "This site",
    description:
      "This portfolio site: project pages, screenshots, demos and source links.",
    year: "2026",
    role: "Design, build, test, deploy",
    tech: ["React", "TypeScript", "Vite", "Framer Motion", "Puppeteer", "GitHub Pages"],
    motif: "audit",
    image: "portfolio-home.png",
    imageAlt: "Home page of this portfolio, Panashe Sanyanga, Software Engineer",
    github: "https://github.com/code-by-panashe-sanyanga/PS-PORTFOLIO",
    live: "https://code-by-panashe-sanyanga.github.io/PS-PORTFOLIO/",
    featured: false,
    problem:
      "I wanted my projects, screenshots and demos in one site instead of scattered links. It also had to work with a keyboard and a screen reader, and calm down motion when the system asks for less of it.",
    decisions: [
      "Screenshot viewer moves keyboard focus into the dialog, keeps Tab inside it, and returns focus when you close it.",
      "Arrow keys and Escape work while the viewer is open.",
      "If the OS asks for less motion, autoplay stays off.",
      "Automated checks cover page structure, one main heading per page, image text, the focus trap and reduced motion.",
      "No CMS or database. The pages are the content. Project write-ups live as data in the site.",
      "Built with React and Vite. Motion can be skipped.",
    ],
    arch: {
      nodes: [
        { id: "browser", label: "Browser", note: "Loads the site. Screenshot viewer and motion run in the browser." },
        { id: "pages", label: "GitHub Pages", note: "Hosts the built files. Nothing is generated on each request." },
        { id: "data", label: "Project write-ups", note: "Case study text stored as data and rendered by the project page." },
        { id: "tests", label: "Puppeteer", note: "Quick checks for headings, image text, focus trap and reduced motion." },
      ],
      edges: [
        { from: "browser", to: "pages", label: "GET" },
        { from: "pages", to: "browser" },
        { from: "data", to: "browser" },
        { from: "tests", to: "browser", label: "checks" },
      ],
    },
    signals: ["role=dialog", "aria-modal", "focus trap", "Escape", "prefers-reduced-motion", "alt", "h1 ×1", "landmarks"],
  },
];

export const featured = projects.filter((p) => p.featured);
/** All personal builds shown on the Work page (featured + portfolio case study). */
export const builds = projects;


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
