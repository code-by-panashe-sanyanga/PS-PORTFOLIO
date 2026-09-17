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
      "A live Formula 1 dashboard with timing, a track map, standings and driver compare, closer to a pit wall screen than a static race page. The server does all the talking to the free F1 feeds. Live on Railway.",
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
      "I wanted a live Formula 1 page I could actually trust during a session, closer to a pit wall view than a static site. The free feeds are the difficult part. The same driver can carry a different number in each feed, live data can only be requested a limited number of times a minute, the track map jumps into the garage once a session ends, and some values never arrive at all. Getting those two feeds into one dashboard without inventing numbers they never sent was most of the work.",
    decisions: [
      "The browser only ever calls my own site. Next.js forwards those calls to FastAPI, so the provider details stay off the client.",
      "The API throttles how often the live feed is called and caches what it builds, otherwise the request limit runs out quickly.",
      "Drivers are matched on name and short code rather than number, because the two feeds disagree on numbers.",
      "The track map reads GPS from the middle of a session. Point sets that barely move are garage noise, so they get dropped.",
      "When tyre temperatures, ERS or practice gaps are missing from the feed, those fields stay blank instead of being filled with a guess.",
      "The 3D car is drawn in code, which avoids needing a licensed car model.",
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
      "A small online bank with a dashboard: accounts, cards, pots and transfers, written to work out how banks move money without losing track of it. Live on Railway.",
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
      "Storing a balance and editing the number is easy. Doing it the way a bank does, so the money is always accounted for, is not. Two people can transfer at the same moment, a slow phone can send the same payment twice, and a crash halfway through must not leave one side paid and the other unpaid. On top of that, no customer should be able to see somebody else's accounts or card numbers.",
    decisions: [
      "Every transfer writes a debit and a matching credit, the way a real ledger does, rather than editing a single balance field.",
      "Only the ledger service is allowed to post money rows, so a payment cannot sneak in through some other route.",
      "When two transfers touch the same accounts, the database locks those rows in id order, so they queue instead of deadlocking on each other.",
      "The transfer header, the ledger lines and the balance update commit together or not at all.",
      "If a client repeats the same idempotency key, the app hands back the original transaction instead of moving the money twice.",
      "Money is stored and calculated as exact decimals, never floats. Card numbers are masked in responses, and the fraud rules flag odd behaviour for review rather than blocking payments.",
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
      "Premier League standings, match chances, a season outlook and a stadium map. The match chances are simulated rather than looked up anywhere. Live on Railway.",
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
      "I wanted live standings alongside a clear read on how a fixture might go, without pretending the free feed carries injuries, confirmed lineups or odds, because it does not. The feed also allows only about ten requests a minute, and its key cannot be allowed anywhere near the browser.",
    decisions: [
      "Match chances come out of simulation, not a lookup: 10,000 Poisson draws per fixture in NumPy, and 2,000 full runs of the remaining table for the season outlook.",
      "The strength model mixes season form, the last five matches, home and away splits and head to head. Any of those can be missing early in a season, so the weights are rescaled when a piece drops out.",
      "Confidence is capped for teams with fewer than five games played, since early-season noise should not look like certainty.",
      "Standings and team lists are separate calls with a short in-process cache, and nothing is polled on a timer, which keeps the app inside the rate limit.",
      "The browser only calls my own origin. Next rewrites those requests to FastAPI, so the football and weather keys stay server side.",
      "Gemini is optional and only narrates the simulation JSON. With no key it returns null and the match view still stands on its own.",
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
      "A room chat rebuilt into a social app: a Home timeline, Explore with clips and boards, Chat with communities and DMs, and You profiles. Visibility checks sit in the data layer, with 38 tests behind them. Live on Railway.",
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
      "I started this to work out how apps like Discord and Instagram get one message onto every open screen at once, because refreshing a page clearly is not how they do it. Version 1 was a display name and a room name, so everything said in a room was public and nothing survived a restart. Turning that into something people could sign into meant staying logged in across a reconnect without retyping a password, keeping friends-only posts genuinely private, and making login and chat spam awkward rather than trivial.",
    decisions: [
      "Login goes over ordinary HTTP. Everything live runs through Socket.IO in the same server process.",
      "v2 dropped the room join form for one shell of Home, Explore, Chat and You, so posting, browsing, messaging and your profile are all parts of the same app.",
      "Post and board ids are sequential, so hiding things in the UI proved worthless. Feed, stories, boards and Saved are checked in the data layer, on every read and write helper.",
      "Saved is owner only. Other people get your posts, reposts, highlights and status, and never what you saved.",
      "Security is bcrypt hashes, signed session tokens for reconnect, a lockout on login and change password, CSP and related headers, and per-connection write rate limits.",
      "A channel loads its history once and pages older messages with a cursor. New messages append, rather than the whole history reloading each time you switch room.",
      "Calls run on WebRTC, with /api/webrtc/ice handing STUN and optional TURN to a signed-in session only. Go live and screen share reuse the same call path.",
      "SQLite and the uploads live on a Railway volume through DATA_DIR, because a deploy was wiping accounts and media before that.",
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
      "The site you are reading: a page per project, with screenshots, live demos and links to the source.",
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
      "My projects, screenshots and demos were spread across separate links, which is a poor way to show anyone what I have built. The site also had to be usable with a keyboard and a screen reader, and it had to stop moving things about when the operating system asks for less motion.",
    decisions: [
      "Opening the screenshot viewer moves focus into the dialog, keeps Tab inside it while it is open, and hands focus back to where you were when it closes.",
      "Arrow keys move between screenshots and Escape closes the viewer.",
      "When the OS asks for reduced motion, autoplay stays off.",
      "Puppeteer checks the things that break quietly: page structure, one main heading per page, image alt text, the focus trap and reduced motion.",
      "There is no CMS and no database. The pages are the content, and each case study lives as data inside the site.",
      "React and Vite, with the motion layer written so it can be skipped.",
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
