// GENERATED from the original project-*.html write-ups. Content is verbatim.
// Regenerate rather than hand-edit.
export interface WriteupSection {
  heading: string;
  html: string;
  mermaid: string[];
}

export interface Writeup {
  slug: string;
  title: string;
  date: string;
  description: string;
  images: { src: string; alt: string }[];
  tech: string[];
  links: { href: string; label: string }[];
  sections: WriteupSection[];
}

export const writeups: Writeup[] = [
  {
    "slug": "apexiq",
    "title": "ApexIQ",
    "date": "Sep 2026, personal project",
    "description": "ApexIQ F1 pit wall: purpose, stack, design, features, testing and deploy.",
    "images": [
      {
        "src": "apexiq-dashboard.png",
        "alt": "ApexIQ pit wall with 3D car and Italian Grand Prix session"
      }
    ],
    "tech": [
      "Python",
      "FastAPI",
      "Next.js",
      "Three.js",
      "OpenF1"
    ],
    "links": [
      {
        "href": "https://apexiq-production-75e5.up.railway.app",
        "label": "Live demo"
      },
      {
        "href": "https://github.com/code-by-panashe-sanyanga/ApexIQ",
        "label": "GitHub"
      }
    ],
    "sections": [
      {
        "heading": "Purpose and tech stack",
        "html": "<p>\n  ApexIQ is an F1 pit wall dashboard. The public site is Next.js. FastAPI runs on the server.\n  The browser only calls <code>/api</code> on the Next.js host. Championship data comes from\n  f1api.dev. Live timing, weather and GPS come from OpenF1. Neither feed needs an API key.\n  When OpenF1 omits tyre temperatures, ERS or practice gaps, the UI leaves those fields blank\n  instead of inventing numbers.\n</p>\n<table>\n  <thead>\n    <tr>\n      <th>Layer</th>\n      <th>Choice</th>\n      <th>Reason</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>API</td>\n      <td>Python, FastAPI, httpx</td>\n      <td>One process builds briefing, pit wall, map and live data</td>\n    </tr>\n    <tr>\n      <td>Championship</td>\n      <td>f1api.dev</td>\n      <td>Standings, calendar, drivers, teams, circuits, compare. No key</td>\n    </tr>\n    <tr>\n      <td>Live timing / GPS</td>\n      <td>OpenF1</td>\n      <td>Sessions, car data, GPS, laps, stints, weather, race control. No key</td>\n    </tr>\n    <tr>\n      <td>UI</td>\n      <td>Next.js 15, React 19, TypeScript, Three.js</td>\n      <td>Single page. /api proxy on the same host. 3D car drawn in code</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Design (request path)",
        "html": "<p>\n  The browser only talks to Next.js. Next.js forwards <code>/api/*</code> to FastAPI.\n  FastAPI limits OpenF1 to about 3 requests a second and 30 a minute, caches the built\n  pit wall and map responses, then returns them to the UI.\n</p>\n\n<p>\n  OpenF1 and f1api.dev use different driver numbers, so the UI matches drivers by name and\n  acronym. For the track map, GPS is taken from the middle of the session. If you take the\n  last seconds of a finished practice, the points sit in the garage, so those samples are\n  dropped when they barely move on the map.\n</p>",
        "mermaid": [
          "flowchart LR\n  Browser[Browser UI] -->|same origin /api| Next[Next.js]\n  Next -->|proxy localhost| API[FastAPI]\n  API --> Cache[TTL cache]\n  API --> F1[f1api.dev]\n  API --> OF[OpenF1]\n  API --> Next\n  Next --> Browser"
        ]
      },
      {
        "heading": "Features implemented",
        "html": "<ul>\n  <li>Pit wall with position, tyre compound, tyre age, speed and sectors when the feed sends them</li>\n  <li>Track outline from OpenF1 GPS, with driver dots on the circuit</li>\n  <li>Championship standings and remaining rounds from f1api.dev</li>\n  <li>Last race grid to finish, calendar times, 2026 grid and driver compare</li>\n  <li>3D car view for the driver selected on the pit wall, drawn in Three.js</li>\n  <li>CORS allowlist, trusted hosts, 120 requests a minute on the API, OpenAPI docs off unless debug is on</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Folder structure",
        "html": "<pre class=\"folder-tree\">ApexIQ/\n├── backend/\n│   ├── app/main.py\n│   ├── app/routes.py\n│   ├── app/security.py\n│   ├── app/clients/           # f1api.dev, OpenF1, throttle\n│   └── app/services/          # briefing, live, map\n└── frontend/\n    ├── src/app/api/[...path]/route.ts\n    ├── src/app/page.tsx\n    ├── src/components/hero/CarScene.tsx\n    ├── src/components/live/TrackMap.tsx\n    └── src/lib/api.ts</pre>",
        "mermaid": []
      },
      {
        "heading": "Timescale",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Phase</th>\n      <th>When</th>\n      <th>Work</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Clients and pit wall</td>\n      <td>Sep 2026</td>\n      <td>f1api.dev and OpenF1 clients, pit wall UI, 3D car</td>\n    </tr>\n    <tr>\n      <td>Circuit GPS and polish</td>\n      <td>Sep 2026</td>\n      <td>Mid session GPS window, rate limit cache, clearer UI labels</td>\n    </tr>\n    <tr>\n      <td>Repo</td>\n      <td>Sep 2026</td>\n      <td>GitHub, README, one-container Dockerfile</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Challenges and how they were handled",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Challenge</th>\n      <th>Approach</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>OpenF1 allows about 30 requests a minute</td>\n      <td>Shared rate limit, cache the built pit wall and map, poll less often after the session ends</td>\n    </tr>\n    <tr>\n      <td>GPS after the session ends sits in the garage</td>\n      <td>Use mid session GPS. Drop point sets that barely move</td>\n    </tr>\n    <tr>\n      <td>httpx turns <code>date&gt;=</code> into <code>date&gt;==</code></td>\n      <td>Build OpenF1 query strings by hand so the filter stays <code>date&gt;=VALUE</code></td>\n    </tr>\n    <tr>\n      <td>Driver numbers differ between the two APIs</td>\n      <td>Match on acronym and name, not number</td>\n    </tr>\n    <tr>\n      <td>Feed omits tyre temperatures and ERS</td>\n      <td>Leave them blank. Show compound, age, RPM, throttle, gear, speed and DRS when present</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Testing",
        "html": "<p>\n  There is no pytest suite on this repo. Checks were done by hand against the live APIs:\n</p>\n<ul>\n  <li>Briefing and championship load from f1api.dev</li>\n  <li>Pit wall uses the latest OpenF1 session and does not invent practice gaps</li>\n  <li><code>GET /api/live/map</code> returns a path that actually spreads in x/y when GPS exists</li>\n  <li>If GPS is missing or useless, the map stays blank</li>\n  <li><code>GET /health</code> on Next.js</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Deployment and links",
        "html": "<p>\n  Locally, FastAPI runs on <code>127.0.0.1:8000</code> and Next.js on\n  <code>http://127.0.0.1:3000</code> with <code>API_INTERNAL_URL</code> pointing at the API.\n  Open the Next.js URL, not port 8000. Source is on GitHub. The public demo is one Railway service.\n</p>",
        "mermaid": []
      }
    ]
  },
  {
    "slug": "novabank",
    "title": "NovaBank",
    "date": "Jun to Jul 2026, personal project",
    "description": "NovaBank project write up: purpose, tech stack, design, features, testing, and deployment.",
    "images": [
      {
        "src": "novabank-dashboard.png",
        "alt": "NovaBank dashboard"
      },
      {
        "src": "novabank-pots.png",
        "alt": "NovaBank savings pots"
      },
      {
        "src": "novabank-cards.png",
        "alt": "NovaBank cards"
      }
    ],
    "tech": [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "JWT",
      "Docker"
    ],
    "links": [
      {
        "href": "https://novabank-api-production-2778.up.railway.app",
        "label": "Live demo"
      },
      {
        "href": "https://github.com/code-by-panashe-sanyanga/NovaBank",
        "label": "GitHub"
      }
    ],
    "sections": [
      {
        "heading": "Purpose and tech stack",
        "html": "<p>\n  NovaBank is a small online bank with a dashboard. I built it because I wanted to understand\n  how banks move money, not just store a balance. Transfers write matching debit and credit\n  lines, login checks who you are, and money routes check you only touch your own accounts.\n</p>\n<table>\n  <thead>\n    <tr>\n      <th>Layer</th>\n      <th>Choice</th>\n      <th>Reason</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>API</td>\n      <td>Python, FastAPI</td>\n      <td>Clear route modules and OpenAPI docs for checking endpoints</td>\n    </tr>\n    <tr>\n      <td>Database</td>\n      <td>PostgreSQL (Docker Compose); SQLite for quick smoke</td>\n      <td>Postgres for ACID and row locks on transfers</td>\n    </tr>\n    <tr>\n      <td>ORM / money types</td>\n      <td>SQLAlchemy, Decimal</td>\n      <td>Avoid float for currency</td>\n    </tr>\n    <tr>\n      <td>Auth</td>\n      <td>bcrypt + JWT with role claim</td>\n      <td>Customer vs admin gates; ownership checks on accounts and cards</td>\n    </tr>\n    <tr>\n      <td>UI</td>\n      <td>HTML, CSS, JavaScript, Chart.js</td>\n      <td>Browser client for dashboard, pots, cards, admin</td>\n    </tr>\n    <tr>\n      <td>Live updates</td>\n      <td>WebSockets</td>\n      <td>Balance refresh after money posts</td>\n    </tr>\n    <tr>\n      <td>Ops</td>\n      <td>Docker Compose, Railway deploy</td>\n      <td>Local Postgres parity; public demo</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Design (money path and system view)",
        "html": "<p>\n  Only the ledger transfer service is meant to post money rows. The browser calls REST with\n  a JWT in localStorage and opens a WebSocket for live balance updates after posts.\n</p>\n\n<h3>Transfer steps</h3>\n<ol>\n  <li>Lock the accounts involved, ordered by id (<code>FOR UPDATE</code> on Postgres) so two crossing transfers do not deadlock.</li>\n  <li>Insert a <code>transactions</code> row (immutable header; optional idempotency key).</li>\n  <li>Insert balanced <code>ledger_entries</code> (debits must equal credits for that transaction).</li>\n  <li>Update <code>balance_cache</code> in the same database transaction.</li>\n  <li>Commit, or roll the whole unit back.</li>\n</ol>\n<p>\n  Customer deposit accounts are treated as liabilities (the bank owes the customer). Deposit\n  credits the customer and debits a system account; withdraw does the reverse; transfer\n  debits A and credits B. If a client repeats the same <code>idempotencyKey</code>, the\n  second call returns the original transaction instead of posting again.\n</p>",
        "mermaid": [
          "flowchart LR\n  Browser[Browser UI] -->|REST + JWT| API[FastAPI]\n  Browser -->|WebSocket| API\n  API --> Ledger[ledger service]\n  Ledger --> DB[(PostgreSQL)]\n  API --> Fraud[fraud rules]\n  Fraud --> DB\n  Admin[Admin routes] --> API"
        ]
      },
      {
        "heading": "Features implemented",
        "html": "<ul>\n  <li>Register / login; new users get a current account, savings account, and debit card</li>\n  <li>Deposit, withdraw, transfer by account number; statements and CSV export</li>\n  <li>Savings pots, round ups on card payments, category spending breakdown</li>\n  <li>Card freeze / unfreeze, spending limits, merchant category blocks (card numbers, PINs, and account closure are stubs)</li>\n  <li>FX rate lookup and convert via Frankfurter / ECB (<code>/fx/rate</code>, <code>/fx/convert</code>)</li>\n  <li>Session style device list ideas and audit log on money and admin actions</li>\n  <li>Admin: customer search, account freeze, flagged transaction review</li>\n  <li>Fraud rules that flag (not block) large amounts, burst outbound transfers, and outliers</li>\n  <li>Card numbers masked in API responses; ownership checks on account and card routes</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Folder structure",
        "html": "<pre class=\"folder-tree\">NovaBank/\n├── novabank/\n│   ├── main.py              # app, pages, WebSocket, /docs\n│   ├── api.py               # REST routes\n│   ├── auth.py / database.py / features.py\n│   └── services/\n│       ├── ledger.py        # double entry transfer service\n│       └── fraud.py         # anomaly rules (flag, do not block)\n├── templates/ + static/     # UI\n├── tests/                   # pytest (incl. concurrent Postgres suite)\n├── seed_ledger.py\n├── docker-compose.yml\n├── Dockerfile\n└── requirements.txt</pre>",
        "mermaid": []
      },
      {
        "heading": "Timescale",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Phase</th>\n      <th>When</th>\n      <th>Work</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Core ledger and auth</td>\n      <td>Jun 2026</td>\n      <td>Accounts, JWT, deposit / withdraw / transfer in one DB transaction</td>\n    </tr>\n    <tr>\n      <td>Customer product surface</td>\n      <td>Jun to Jul 2026</td>\n      <td>Pots, cards, statements, insights, WebSocket updates</td>\n    </tr>\n    <tr>\n      <td>Admin and fraud</td>\n      <td>Jul 2026</td>\n      <td>Audit views, flag rules, worker scan</td>\n    </tr>\n    <tr>\n      <td>Hardening and deploy</td>\n      <td>Jul 2026</td>\n      <td>pytest on ledger path, Docker Compose Postgres, Railway demo</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Challenges and how they were handled",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Challenge</th>\n      <th>Approach</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Partial failure mid transfer</td>\n      <td>Validation runs as its own pass over every leg before any row is created, so a rejected post leaves nothing staged</td>\n    </tr>\n    <tr>\n      <td>Concurrent transfers on the same accounts</td>\n      <td>Row locks ordered by account id on Postgres</td>\n    </tr>\n    <tr>\n      <td>Float rounding on money</td>\n      <td>Store and compute with Decimal</td>\n    </tr>\n    <tr>\n      <td>Double submit from a slow client</td>\n      <td>Idempotency keys on deposit / withdraw / transfer</td>\n    </tr>\n    <tr>\n      <td>Leaking card data or other users' accounts</td>\n      <td>Mask card numbers; check ownership on every sensitive route</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Testing",
        "html": "<p>\n  Automated tests use pytest on the ledger and transfer path. Run from the NovaBank repo:\n</p>\n<pre class=\"checklist\">pytest -q\n# locally: 9 passed, 2 skipped (skipped need NOVABANK_PG_URL)\nNOVABANK_PG_URL=postgresql+psycopg://... pytest -q tests/test_concurrent_postgres.py</pre>\n<p>What those suites cover, plus manual checks before calling a build done:</p>\n<ul>\n  <li>Transfer A to B updates both sides and leaves balanced ledger entries</li>\n  <li>Forced failure mid flow does not leave one side updated</li>\n  <li>Customer cannot read another customer's account by id</li>\n  <li>Admin routes reject a customer JWT</li>\n  <li>Repeated idempotency key does not double post</li>\n  <li>Postgres concurrency: racing withdrawals and crossed transfers leave a consistent ledger (<code>tests/test_concurrent_postgres.py</code>)</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Deployment and links",
        "html": "<p>\n  Local quick smoke: Python 3.12, venv, <code>pip install -r requirements.txt</code>, seed,\n  then <code>uvicorn novabank.main:app --reload --port 5002</code>. For Postgres:\n  <code>docker compose up --build</code>, then seed with\n  <code>DATABASE_URL</code> pointed at the compose database. Public demo is on Railway.\n</p>\n<p>\n  Demo logins use the password <code>Password123</code> for all seeded users:\n  <code>alex@example.com</code> and <code>jamie@example.com</code> (customers), and\n  <code>admin@novabank.co.uk</code> (admin).\n</p>",
        "mermaid": []
      }
    ]
  },
  {
    "slug": "premieriq",
    "title": "PremierIQ",
    "date": "Sep 2026, personal project",
    "description": "PremierIQ project write up: purpose, tech stack, design, features, testing, and deployment.",
    "images": [
      {
        "src": "premieriq-standings.png",
        "alt": "PremierIQ live standings table"
      },
      {
        "src": "premieriq-matchiq.png",
        "alt": "PremierIQ Match IQ simulation setup"
      },
      {
        "src": "premieriq-map.png",
        "alt": "PremierIQ night stadium map"
      }
    ],
    "tech": [
      "Python",
      "FastAPI",
      "Next.js",
      "NumPy",
      "MapLibre"
    ],
    "links": [
      {
        "href": "https://premieriq-production.up.railway.app",
        "label": "Live demo"
      },
      {
        "href": "https://github.com/code-by-panashe-sanyanga/PremierIQ",
        "label": "GitHub"
      }
    ],
    "sections": [
      {
        "heading": "Purpose and tech stack",
        "html": "<p>\n  PremierIQ is a Premier League dashboard closer to a BBC Sport style football page: live\n  standings, match chances and a season outlook. Match chances come from many simulated\n  scorelines in NumPy. The free feed does not include injuries, confirmed lineups or odds, so\n  the app does not invent them. Optional Gemini text only summarises the simulation numbers.\n</p>\n<table>\n  <thead>\n    <tr>\n      <th>Layer</th>\n      <th>Choice</th>\n      <th>Reason</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>API</td>\n      <td>Python, FastAPI, NumPy</td>\n      <td>Standings, squads, weather, Match IQ and Season IQ on one process</td>\n    </tr>\n    <tr>\n      <td>Football data</td>\n      <td>football-data.org v4</td>\n      <td>Premier League table, teams, matches, scorers. About 10 requests a minute on the free tier</td>\n    </tr>\n    <tr>\n      <td>Weather</td>\n      <td>OpenWeather, Open-Meteo fallback</td>\n      <td>Current conditions at the home stadium when a sim runs</td>\n    </tr>\n    <tr>\n      <td>Briefing text</td>\n      <td>Gemini 3.8 Flash (optional)</td>\n      <td>Narrates Monte Carlo JSON only. Missing key means ai is null</td>\n    </tr>\n    <tr>\n      <td>UI</td>\n      <td>Next.js 15, React 19, TypeScript, MapLibre GL</td>\n      <td>Single page. Same origin /api rewrite so keys never reach the browser</td>\n    </tr>\n    <tr>\n      <td>Map tiles</td>\n      <td>OpenFreeMap liberty style</td>\n      <td>Night restyle and 3D buildings without a paid map key</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Design (request path)",
        "html": "<p>\n  The browser only talks to the Next.js origin. Next rewrites <code>/api/*</code> to FastAPI.\n  FastAPI holds the provider keys, caches football-data.org responses in process, then runs\n  the simulation.\n</p>\n\n<h3>Match IQ mix</h3>\n<ol>\n  <li>Season goals for / against per game (weight 0.60).</li>\n  <li>Last five completed matches, recency weighted (0.30).</li>\n  <li>Home / away split if there are at least three samples, else prior season (0.10).</li>\n  <li>Completed head to head if there are at least two (0.05).</li>\n  <li>Second half rates if half time scores exist (0.05).</li>\n</ol>\n<p>\n  Weights are scaled again when a piece is missing. Then weather, away travel fatigue,\n  rest days, and a formation modifier the user picks for the sim. 10,000 Poisson draws.\n  Confidence is capped at 64% if a side has played fewer than five games. Season IQ uses\n  the same strength idea on remaining listed fixtures, 2,000 full table runs.\n</p>",
        "mermaid": [
          "flowchart LR\n  Browser[Browser UI] -->|same origin /api| Next[Next.js]\n  Next -->|rewrite| API[FastAPI]\n  API --> Cache[TTL cache]\n  API --> FD[football-data.org]\n  API --> WX[OpenWeather / Open-Meteo]\n  API --> Eng[NumPy Poisson]\n  Eng -->|JSON numbers| Gem[Gemini optional]\n  API --> Next\n  Next --> Browser"
        ]
      },
      {
        "heading": "Features implemented",
        "html": "<ul>\n  <li>Live TOTAL standings and competition scorers when the provider returns them</li>\n  <li>Match IQ with upcoming fixture strip, assumed formations, weather and rest days</li>\n  <li>Squad panel: ages, colours, founded, website, coach extras, club scorers</li>\n  <li>Stadium map: night restyle, 3D buildings, pin fly to, weather on pin click</li>\n  <li>Season IQ: remaining listed fixtures, rest day congestion from the calendar</li>\n  <li>CORS allowlist, trusted hosts, 90 requests a minute, OpenAPI off unless debug is on</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Folder structure",
        "html": "<pre class=\"folder-tree\">PremierIQ/\n├── backend/\n│   ├── app/main.py              # FastAPI, middleware\n│   ├── app/routes.py            # HTTP surface\n│   ├── app/security.py          # CORS, rate limit, redaction\n│   ├── app/providers/football_data.py\n│   └── app/services/\n│       ├── engine.py            # Monte Carlo + season IQ\n│       ├── weather.py\n│       ├── gemini.py            # optional briefing\n│       └── stadiums.py          # local lat/lon table\n└── frontend/\n    ├── next.config.mjs          # /api rewrite + headers\n    ├── src/app/page.tsx         # single page\n    ├── src/components/          # Match IQ, map, squads\n    └── src/lib/api.ts           # same origin client</pre>",
        "mermaid": []
      },
      {
        "heading": "Timescale",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Phase</th>\n      <th>When</th>\n      <th>Work</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Core dashboard and engine</td>\n      <td>Sep 2026</td>\n      <td>Standings, squads, Poisson Match IQ, weather, stadium map</td>\n    </tr>\n    <tr>\n      <td>Season IQ and hardening</td>\n      <td>Sep 2026</td>\n      <td>Remaining fixture table, rest days, H2H, cache, rate limits</td>\n    </tr>\n    <tr>\n      <td>Deploy path</td>\n      <td>Sep 2026</td>\n      <td>GitHub repo, Railway two service layout, keys stay server side</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Challenges and how they were handled",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Challenge</th>\n      <th>Approach</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>football-data.org rate limit (~10/min)</td>\n      <td>In process TTL cache. Teams and standings fetched as separate calls, not polled on a timer</td>\n    </tr>\n    <tr>\n      <td>Feed has no injuries, lineups, odds, or HOME/AWAY tables</td>\n      <td>Do not invent those fields in JSON, UI copy, or Gemini text. Formations are labelled as sim assumptions</td>\n    </tr>\n    <tr>\n      <td>Keys leaking to the browser</td>\n      <td>No NEXT_PUBLIC_API_URL. Next rewrites /api to FastAPI. CORS allowlist on the API</td>\n    </tr>\n    <tr>\n      <td>MapLibre inside a CSS transform animation</td>\n      <td>Do not wrap the map in that animation. Initialise from useEffect</td>\n    </tr>\n    <tr>\n      <td>Gemini inventing match facts</td>\n      <td>Prompt is Monte Carlo JSON only. If the key is missing or the call fails, the sim UI still stands</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Testing",
        "html": "<p>\n  There is no pytest suite on this repo. Checks were manual against the live football-data.org\n  feed and the local API:\n</p>\n<ul>\n  <li>Standings and teams load as independent calls</li>\n  <li>Match IQ returns probabilities and scorelines with <code>ai</code> null when Gemini is unset</li>\n  <li>Season IQ returns a structured unavailable payload if remaining fixtures cannot load</li>\n  <li>Map pins fly to a stadium and weather extras show when the provider returns them</li>\n  <li><code>GET /health</code> on the API process</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Deployment and links",
        "html": "<p>\n  Local: FastAPI on <code>127.0.0.1:8000</code>, Next on\n  <code>http://127.0.0.1:3000</code> with <code>API_INTERNAL_URL</code> pointing at the API.\n  Open the UI origin, not port 8000. Source is on GitHub. Public demo is one Railway service.\n</p>",
        "mermaid": []
      }
    ]
  },
  {
    "slug": "chatwire",
    "title": "ChatWire",
    "date": "May 2026, personal project",
    "description": "ChatWire project write up: purpose, tech stack, design, features, testing, and deployment.",
    "images": [
      {
        "src": "chatwire-join.png",
        "alt": "ChatWire join screen"
      },
      {
        "src": "chatwire-chat.png",
        "alt": "ChatWire chat UI"
      },
      {
        "src": "chatwire-timeline.png",
        "alt": "ChatWire timeline"
      }
    ],
    "tech": [
      "Python",
      "Flask-SocketIO",
      "SQLite",
      "pytest"
    ],
    "links": [
      {
        "href": "https://chat-wire-production.up.railway.app",
        "label": "Live demo"
      },
      {
        "href": "https://github.com/code-by-panashe-sanyanga/ChatWire",
        "label": "GitHub"
      }
    ],
    "sections": [
      {
        "heading": "Purpose and tech stack",
        "html": "<p>\n  ChatWire is a live chat app with channels, direct messages and online status. I built it to\n  understand how apps like Discord and Instagram get a message onto every open screen at once.\n  Login uses normal HTTP. Live messages use Socket.IO. Accounts and history sit in SQLite.\n</p>\n<table>\n  <thead>\n    <tr>\n      <th>Layer</th>\n      <th>Choice</th>\n      <th>Reason</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Server</td>\n      <td>Python, Flask, Flask-SocketIO</td>\n      <td>HTTP APIs plus live events on one process for this demo</td>\n    </tr>\n    <tr>\n      <td>Data</td>\n      <td>SQLite</td>\n      <td>Simple persistence for users, messages, friends, feed</td>\n    </tr>\n    <tr>\n      <td>Auth</td>\n      <td>bcrypt + signed session tokens</td>\n      <td>Reconnect with a token, not the password</td>\n    </tr>\n    <tr>\n      <td>Client</td>\n      <td>HTML, CSS, JavaScript</td>\n      <td>Channel UI, DMs, feed, Ctrl+K switcher</td>\n    </tr>\n    <tr>\n      <td>Channel calls</td>\n      <td>Socket.IO + WebRTC (STUN)</td>\n      <td>Meet now presence plus optional mic/camera peer media</td>\n    </tr>\n    <tr>\n      <td>Presence</td>\n      <td>In memory</td>\n      <td>Online status changes often and need not survive restart</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Design (request path and live path)",
        "html": "<p>\n  Channel history loads once with cursor pagination (<code>before_id</code> /\n  <code>has_more</code>). New events append so switching rooms does not replay the whole\n  history. Unread counts and DM threads are stored in SQLite and pushed over sockets.\n</p>",
        "mermaid": [
          "flowchart LR\n  UI[HTML CSS JS] -->|JSON HTTP| Flask\n  UI -->|Socket.IO| Sockets\n  Flask --> SQL[(SQLite)]\n  Sockets --> SQL\n  Sockets --> UI"
        ]
      },
      {
        "heading": "Features implemented",
        "html": "<ul>\n  <li>Communities, channels, DMs, reactions, stories, friends, typing, edit / delete</li>\n  <li>Channel calls: Meet now presence plus optional mic/camera (WebRTC, STUN only)</li>\n  <li>Settings: theme, password, display name, notification sound, mic/camera allow</li>\n  <li>Ctrl+K quick switcher between channels</li>\n  <li>Admin rename gates for communities and channels</li>\n  <li>Login lockout after repeated failures; same check on change password</li>\n  <li>Rate limits on chat and social write paths</li>\n  <li>Friends only feed and story views check the viewer is allowed before returning data</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Folder structure",
        "html": "<pre class=\"folder-tree\">ChatWire/\n├── app.py                 # Flask routes (/api/auth/*, health)\n├── sockets/               # live chat / social / feed events\n├── db.py                  # schema + queries\n├── state.py               # online presence (memory)\n├── throttle.py            # per connection rate limits\n├── validate.py            # payload checks\n├── static/                # UI\n├── seed.py                # optional sample data\n└── tests/                 # pytest</pre>",
        "mermaid": []
      },
      {
        "heading": "Timescale",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Phase</th>\n      <th>When</th>\n      <th>Work</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Auth and rooms</td>\n      <td>May 2026</td>\n      <td>Register / login, communities, channels, basic messages</td>\n    </tr>\n    <tr>\n      <td>Live product features</td>\n      <td>May 2026</td>\n      <td>DMs, reactions, typing, stories, presence</td>\n    </tr>\n    <tr>\n      <td>Calls and hardening</td>\n      <td>May 2026</td>\n      <td>Call presence + WebRTC media, lockout, rate limits, permission checks, pytest</td>\n    </tr>\n    <tr>\n      <td>Deploy</td>\n      <td>May 2026</td>\n      <td>Railway public demo</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Challenges and how they were handled",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Challenge</th>\n      <th>Approach</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Reloading full history on every room switch</td>\n      <td>Load once, then append events; cursor pagination for older messages</td>\n    </tr>\n    <tr>\n      <td>Auth only on login</td>\n      <td>Signed tokens; ownership and friend checks on feed / stories / renames</td>\n    </tr>\n    <tr>\n      <td>Brute force on login or change password</td>\n      <td>Short account lockout after repeated failures</td>\n    </tr>\n    <tr>\n      <td>Spam on sockets</td>\n      <td>Per connection rate limits on write events</td>\n    </tr>\n    <tr>\n      <td>Presence scale</td>\n      <td>Keep online status in memory for this demo; document JOIN batching for later</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Testing",
        "html": "<p>From the ChatWire repo:</p>\n<pre class=\"checklist\">pip install -r requirements-dev.txt\npytest -q</pre>\n<p>Manual checks:</p>\n<ul>\n  <li>Two browsers: message in a channel appears live for both</li>\n  <li>Non friend cannot open a friends only feed or story</li>\n  <li>Non admin cannot rename a community or channel</li>\n  <li>Failed logins trigger lockout; change password is covered by the same gate</li>\n  <li>Reconnect with session token without retyping the password</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Deployment and links",
        "html": "<p>\n  Local: venv, <code>pip install -r requirements.txt</code>, <code>python app.py</code>,\n  open http://localhost:5001. Optional <code>python seed.py</code>. Live demo is on Railway.\n  Demo login: <code>demo</code> / <code>demo123456</code> (admin, so rename works in demos).\n</p>",
        "mermaid": []
      }
    ]
  },
  {
    "slug": "emergency-call-queue",
    "title": "Emergency Call Queue",
    "date": "Year 2, 6G5Z0024 ADS, Assessed Exercise 1",
    "description": "Emergency Call Queue: ADS assessed exercise on custom circular queues in C#.",
    "images": [],
    "tech": [
      "C#",
      "Queues",
      "Circular buffer"
    ],
    "links": [
      {
        "href": "https://github.com/code-by-panashe-sanyanga/ADS-Queues-Emergency-Call-System",
        "label": "GitHub"
      }
    ],
    "sections": [
      {
        "heading": "Purpose and tech stack",
        "html": "<p>\n  Assessed Exercise 1 asked for a console simulation of an emergency dispatch desk. Calls\n  arrive, sit in a queue, and are handled in order. The hard constraint was architectural:\n  implement the queue myself in C#. Built in <code>Queue&lt;T&gt;</code> was banned. The\n  point of the exercise is to own enqueue, dequeue, capacity, and later a circular buffer,\n  not to hide behind the framework collection.\n</p>\n<table>\n  <thead>\n    <tr><th>Layer</th><th>Choice</th><th>Reason</th></tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Language</td>\n      <td>C# console app</td>\n      <td>C# (.NET Framework) console app with a menu-driven dispatcher</td>\n    </tr>\n    <tr>\n      <td>Domain model</td>\n      <td><code>EmergencyCall</code></td>\n      <td>CallerName, EmergencyType, SeverityLevel (1 to 5) with validation</td>\n    </tr>\n    <tr>\n      <td>Structure</td>\n      <td>Custom <code>EmergencyQueue</code></td>\n      <td>No framework queue; full control of storage and indices</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Design",
        "html": "<p>\n  Task A establishes a linear queue ADT: Enqueue, Dequeue, Peek, Count, IsFull, IsEmpty,\n  plus a menu to log calls, dispatch the oldest, and list the waiting set. Properties reject\n  illegal severity values (for example 6 or -1) at the boundary so bad data never enters the\n  structure.\n</p>\n<pre class=\"folder-tree\">Dispatcher menu\n  -> EmergencyCall (validated fields, IComparable by severity)\n  -> EmergencyQueue\n       Enqueue / Dequeue / Peek / Count / IsEmpty / IsFull\n       PeekHighestSeverity (earliest wins on ties)\n       DequeueFirstKCalls\n       circular array buffer (front / rear / currentSize, wrap with %)</pre>\n<p>\n  PeekHighestSeverity scans without dequeue (ties broken by earliest arrival).\n  <code>DequeueFirstKCalls</code> removes the first k calls from the front. Storage is a\n  circular buffer so space at the front of the array is reused after dequeues instead of\n  wasting capacity.\n</p>",
        "mermaid": []
      },
      {
        "heading": "Features implemented",
        "html": "<ul>\n  <li>EmergencyCall with validated severity and typed emergency categories</li>\n  <li>Manual queue: enqueue, dequeue, peek, count, full / empty</li>\n  <li>Menu: add call, dispatch next, list all waiting calls</li>\n  <li>PeekHighestSeverity without mutating order</li>\n  <li>DequeueFirstKCalls for bulk remove from the front</li>\n  <li>Circular buffer accounting across all queue operations</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Folder structure",
        "html": "<pre class=\"folder-tree\">ADS_Assess1/\n├── EmergencyCall.cs\n├── EmergencyQueue.cs\n├── Program.cs\n├── App.config\n└── Properties/AssemblyInfo.cs\nADS_Assess1.sln</pre>",
        "mermaid": []
      },
      {
        "heading": "Timescale",
        "html": "<table>\n  <thead>\n    <tr><th>Phase</th><th>Work</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Task A</td><td>Call model, core queue ops, menu, listing</td></tr>\n    <tr><td>Task B</td><td>Highest severity peek, bulk dequeue</td></tr>\n    <tr><td>Task C</td><td>Circular buffer migration and regression of A/B behaviour</td></tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Challenges and how they were handled",
        "html": "<table>\n  <thead>\n    <tr><th>Challenge</th><th>Approach</th></tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>No framework Queue</td>\n      <td>Own storage, head/tail (later wrap), and capacity checks</td>\n    </tr>\n    <tr>\n      <td>Peek highest without breaking FIFO</td>\n      <td>Traverse logically; never dequeue during the scan; earliest wins on ties</td>\n    </tr>\n    <tr>\n      <td>Bulk dequeue correctness</td>\n      <td>Auxiliary queue or array so partial failure does not corrupt the primary structure</td>\n    </tr>\n    <tr>\n      <td>Circular wrap bugs</td>\n      <td>Step through with the debugger on full, empty, and wrap around cases</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Testing",
        "html": "<ul>\n  <li>Enqueue then dequeue restores FIFO order</li>\n  <li>Severity outside 1 to 5 is rejected</li>\n  <li>PeekHighestSeverity returns the earliest of the max severity set</li>\n  <li>Dequeue k removes exactly k items when enough exist</li>\n  <li>After Task C: fill, empty, and wrap around without false IsFull / IsEmpty</li>\n  <li>List view matches internal count</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Deployment and links",
        "html": "<p>\n  Open <code>ADS_Assess1.sln</code> in Visual Studio (F5 / Ctrl+F5), or build with\n  <code>msbuild ADS_Assess1.sln</code> and run\n  <code>ADS_Assess1\\bin\\Debug\\ADS_Assess1.exe</code>. No web deploy. The artefact is the ADT\n  and interactive menu.\n</p>",
        "mermaid": []
      }
    ]
  },
  {
    "slug": "video-game-catalogue",
    "title": "Video Game Catalogue",
    "date": "Year 2, 6G5Z0024 ADS, Assessed Exercise 2",
    "description": "Video Game Catalogue: ADS trees exercise, BST then AVL in C#.",
    "images": [],
    "tech": [
      "C#",
      "BST",
      "AVL"
    ],
    "links": [
      {
        "href": "https://github.com/code-by-panashe-sanyanga/ADS-Trees-Video-Game-Manager",
        "label": "GitHub"
      }
    ],
    "sections": [
      {
        "heading": "Purpose and tech stack",
        "html": "<p>\n  Assessed Exercise 2 is a retro gaming preservation catalogue: store games and search them\n  efficiently using binary trees. The brief forbids pre built tree libraries and requires\n  recursion for tree behaviour. Titles are unique keys. The console menu is the operator\n  surface for insert, walk, query, update, and later AVL insert and remove.\n</p>\n<table>\n  <thead>\n    <tr><th>Layer</th><th>Choice</th><th>Reason</th></tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Language</td>\n      <td>C# console</td>\n      <td>C# (.NET Framework) console menu for BST / AVL comparison</td>\n    </tr>\n    <tr>\n      <td>Domain</td>\n      <td><code>VideoGame</code> (title, developer, year)</td>\n      <td>Unique title used as the BST key</td>\n    </tr>\n    <tr>\n      <td>Structures</td>\n      <td>Node, BinTree, BSTree, then AVLTree</td>\n      <td>Progress from ordered BST to balanced AVL with rotations</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Design",
        "html": "<p>\n  Task A wires insert into a BSTree and exposes InOrder, PreOrder, and PostOrder from\n  BinTree so the operator can choose a walk. Finding the earliest game means the\n  alphabetically first title (the tree is keyed by title), plus recursive height. Task B\n  adds count, update by title, and list by year. Task C adds an AVLTree that inherits from\n  BSTree and rebalances on insert with the four rotations. The menu can switch between BST\n  and AVL at runtime so you can compare heights on the same data.\n</p>\n<pre class=\"folder-tree\">Menu\n  -> VideoGame records (keyed by title)\n  -> BSTree: insert, walks, earliest title, height, count, update, by-year, remove\n  -> AVLTree (extends BSTree): insert with LL / LR / RL / RR rotations\n  -> runtime switch between BST and AVL modes</pre>",
        "mermaid": []
      },
      {
        "heading": "Features implemented",
        "html": "<ul>\n  <li>Insert unique titled games into a BST</li>\n  <li>In / pre / post order listings via the menu</li>\n  <li>Earliest (alphabetically first) game and tree height</li>\n  <li>Node count, update in place by title, filter by year</li>\n  <li>AVL insert with rotations when balance breaks</li>\n  <li>Remove / exists checks from the BST layer</li>\n  <li>Runtime switch between BST and AVL modes</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Folder structure",
        "html": "<pre class=\"folder-tree\">ADSPortEx2/\n├── Node.cs\n├── BinTree.cs\n├── BSTree.cs\n├── AVLTree.cs\n├── VideoGame.cs\n├── Program.cs\n├── App.config\n└── Properties/AssemblyInfo.cs\nADSPortEx2.sln</pre>",
        "mermaid": []
      },
      {
        "heading": "Timescale",
        "html": "<table>\n  <thead>\n    <tr><th>Phase</th><th>Work</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Task A</td><td>Game model, BST insert, walks, earliest title, height</td></tr>\n    <tr><td>Task B</td><td>Count, update, list by year</td></tr>\n    <tr><td>Task C</td><td>AVL rotations on insert, BST/AVL runtime switch</td></tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Challenges and how they were handled",
        "html": "<table>\n  <thead>\n    <tr><th>Challenge</th><th>Approach</th></tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Everything recursive</td>\n      <td>No iterative shortcuts for walks, height, or count; mirror lecture patterns</td>\n    </tr>\n    <tr>\n      <td>Update vs insert</td>\n      <td>Same left/right decisions; on equal title mutate the node instead of inserting</td>\n    </tr>\n    <tr>\n      <td>Unbalanced BST degradation</td>\n      <td>AVL balance factor checks and the four rotation cases on insert</td>\n    </tr>\n    <tr>\n      <td>Comparing structures</td>\n      <td>Switch BST / AVL at runtime and compare height on the same catalogue</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Testing",
        "html": "<ul>\n  <li>Insert then InOrder lists titles sorted</li>\n  <li>Duplicate title path updates rather than forking a second key</li>\n  <li>Earliest game is the alphabetically first title</li>\n  <li>Height and count stay consistent after inserts</li>\n  <li>Year filter returns only that year</li>\n  <li>AVL insert sequence that would skew a BST stays shallow</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Deployment and links",
        "html": "<p>\n  Open <code>ADSPortEx2.sln</code> in Visual Studio (F5 / Ctrl+F5), or build with\n  <code>msbuild ADSPortEx2.sln</code> and run\n  <code>ADSPortEx2\\bin\\Debug\\ADSPortEx2.exe</code>. The artefact is recursive ADTs with menu\n  coverage of BST versus AVL.\n</p>",
        "mermaid": []
      }
    ]
  },
  {
    "slug": "aid-optimiser",
    "title": "Aid Distribution Optimiser",
    "date": "Year 2, 6G5Z0024 ADS, Assessed Task 3",
    "description": "Aid Distribution Optimiser: complexity, generic QuickSort, greedy drone loadout.",
    "images": [],
    "tech": [
      "C#",
      "QuickSort",
      "Greedy"
    ],
    "links": [
      {
        "href": "https://github.com/code-by-panashe-sanyanga/ADS-Sorting-and-Greedy-Algorithms",
        "label": "GitHub"
      }
    ],
    "sections": [
      {
        "heading": "Purpose and tech stack",
        "html": "<p>\n  Assessed Task 3 combines three skills the unit treats as one package: argue Big O on real\n  methods, ship a generic QuickSort, then apply a greedy packer to a drone aid problem. Each\n  drone carries at most 75 kg. Items have weight and survival priority. The algorithm must\n  take whole items only, ranked by priority per kilogram, until the next item would break\n  the cap.\n</p>\n<table>\n  <thead>\n    <tr><th>Layer</th><th>Choice</th><th>Reason</th></tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Analysis</td>\n      <td>Line by line Big O on Algorithm1 / Algorithm2</td>\n      <td>Task A marks need full working and notation, not a guessed label</td>\n    </tr>\n    <tr>\n      <td>Sort</td>\n      <td>Generic QuickSort over <code>IComparable</code></td>\n      <td>CompareTo instead of &lt; / == so ints and strings share one sorter</td>\n    </tr>\n    <tr>\n      <td>Domain</td>\n      <td><code>AidItem</code> + <code>PriorityRatio</code></td>\n      <td>Priority / Weight drives greedy order</td>\n    </tr>\n    <tr>\n      <td>Selection</td>\n      <td><code>GreedyUtils</code> knapsack style picker</td>\n      <td>0/1 items, 75 kg hard stop</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Design",
        "html": "<p>\n  Task A is documentation as engineering: open ComplexityFunctions, derive the cost of each\n  line, and state the overall class. Task B lifts the provided QuickSort skeleton into a\n  generic form demonstrated from the menu on integer and string arrays. Task C introduces\n  AidItem (name, weight 1 to 50, priority 1 to 10, read only PriorityRatio), then greedily\n  selects highest ratio first. The brief allows reusing the generic QuickSort to order items\n  before packing.\n</p>\n<pre class=\"folder-tree\">Program menu\n  -> Sort integers / strings   (generic QuickSort)\n  -> Add AidItem / list items\n  -> Run greedy packer\n       sort by PriorityRatio desc\n       take whole items while weight + next &lt;= 75\n       report loadout, total weight, total priority</pre>",
        "mermaid": []
      },
      {
        "heading": "Features implemented",
        "html": "<ul>\n  <li>Written complexity analysis for the two required algorithms</li>\n  <li>Generic QuickSort via CompareTo for any IComparable element type</li>\n  <li>Menu demos for int and string arrays</li>\n  <li>AidItem with validated weight and priority ranges</li>\n  <li>Greedy loadout builder with 75 kg ceiling and no fractional items</li>\n  <li>Printed selection with totals for weight and priority</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Folder structure",
        "html": "<pre class=\"folder-tree\">ADSPortEx3/\n├── ComplexityFunctions.cs\n├── SortUtils.cs\n├── GreedyUtils.cs\n├── AidItem.cs\n├── Program.cs\n├── App.config\n└── Properties/AssemblyInfo.cs\nADSPortEx3.sln</pre>",
        "mermaid": []
      },
      {
        "heading": "Timescale",
        "html": "<table>\n  <thead>\n    <tr><th>Phase</th><th>Work</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Task A</td><td>Complexity write up with full working</td></tr>\n    <tr><td>Task B</td><td>Generic QuickSort + menu demos</td></tr>\n    <tr><td>Task C</td><td>AidItem model, greedy packer, menu integration</td></tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Challenges and how they were handled",
        "html": "<table>\n  <thead>\n    <tr><th>Challenge</th><th>Approach</th></tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Generic compare without operators</td>\n      <td>Pivot decisions through CompareTo only</td>\n    </tr>\n    <tr>\n      <td>Greedy is not globally optimal</td>\n      <td>Accept the brief's ratio heuristic; document totals so markers see the policy</td>\n    </tr>\n    <tr>\n      <td>Capacity edge cases</td>\n      <td>Stop when the next whole item would exceed 75 kg; never take a fraction</td>\n    </tr>\n    <tr>\n      <td>Analysis marks</td>\n      <td>Per line notation matching the ExampleQuestion format in the template</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Testing",
        "html": "<ul>\n  <li>QuickSort: unsorted ints and strings leave a non decreasing CompareTo order</li>\n  <li>AidItem rejects weight or priority outside the brief ranges</li>\n  <li>PriorityRatio equals Priority / Weight for sample items</li>\n  <li>Greedy never exceeds 75 kg</li>\n  <li>Higher ratio items are preferred when both fit</li>\n  <li>Empty list and single oversized item produce a sensible empty or skipped loadout</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Deployment and links",
        "html": "<p>\n  Open <code>ADSPortEx3.sln</code> in Visual Studio (F5 / Ctrl+F5), or build with\n  <code>msbuild ADSPortEx3.sln</code> and run\n  <code>ADSPortEx3\\bin\\Debug\\ADSPortEx3.exe</code>. No server deploy. Analysis plus working\n  sort and greedy paths.\n</p>",
        "mermaid": []
      }
    ]
  },
  {
    "slug": "metro-routes",
    "title": "Metro Network Route Planner",
    "date": "Year 2, 6G5Z0024 ADS, Assessed Exercise 4",
    "description": "Metro Network Route Planner: list based weighted graphs, traversal, greedy route.",
    "images": [],
    "tech": [
      "C#",
      "Graphs",
      "BFS / DFS"
    ],
    "links": [
      {
        "href": "https://github.com/code-by-panashe-sanyanga/ADS-Graphs-Transport-Network",
        "label": "GitHub"
      }
    ],
    "sections": [
      {
        "heading": "Purpose and tech stack",
        "html": "<p>\n  Assessed Exercise 4 models a city metro for a transport authority. Stations hold a name\n  and passenger capacity. Links between stations form a graph. The brief is explicit about\n  representation: the graph must be list based, and Dictionary is not allowed. That forces\n  adjacency lists you control, not a hash map shortcut.\n</p>\n<table>\n  <thead>\n    <tr><th>Layer</th><th>Choice</th><th>Reason</th></tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Language</td>\n      <td>C# console</td>\n      <td>C# (.NET Framework) console harness for a sample metro network</td>\n    </tr>\n    <tr>\n      <td>Domain</td>\n      <td><code>Station</code></td>\n      <td>Name + PassengerCapacity</td>\n    </tr>\n    <tr>\n      <td>Graph</td>\n      <td>List based <code>Graph</code> / <code>GraphNode</code></td>\n      <td>No Dictionary; explicit nodes, edges, counts</td>\n    </tr>\n    <tr>\n      <td>Weights</td>\n      <td>Integer minutes on edges</td>\n      <td>Travel time for metrics and route walking</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Design",
        "html": "<p>\n  Task A builds the unweighted skeleton: add nodes, add edges, report <code>NumNodes</code>\n  and <code>NumEdges</code>. Task B attaches travel times through\n  <code>AddWeightedEdge</code>, then network metrics: AverageOutbound, AverageTravelTime,\n  and GetAllConnections for a station. Task C adds exploration: BFS or DFS across the\n  network, plus FastestRoute, which starts at a station and always takes the unused outbound\n  edge with the lowest travel time, never revisiting a station, then returns the path taken.\n</p>\n<pre class=\"folder-tree\">Program harness\n  -> Station records (name + passenger capacity)\n  -> Graph&lt;T&gt; adjacency lists (LinkedList of nodes)\n       AddNode / AddEdge / NumNodes / NumEdges\n       AddWeightedEdge (minutes)\n       AverageOutbound, AverageTravelTime, GetAllConnections\n       BFS / DFS\n       FastestRoute: greedy lowest weight next hop, no revisits</pre>\n<p>\n  FastestRoute is not a full Dijkstra search over all paths. It is the greedy walk the brief\n  specifies: locally cheapest unused edge at each step. That is an important design\n  distinction when explaining the algorithm in a viva or interview.\n</p>",
        "mermaid": []
      },
      {
        "heading": "Features implemented",
        "html": "<ul>\n  <li>Station model with capacity</li>\n  <li>List based graph: add node, add edge, node and edge counts</li>\n  <li>Weighted edges in minutes</li>\n  <li>Average outbound degree and average travel time</li>\n  <li>Neighbour listing by station id</li>\n  <li>BFS or DFS traversal from the console harness</li>\n  <li>FastestRoute greedy path with no station revisited</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Folder structure",
        "html": "<pre class=\"folder-tree\">ADSPortEx4/\n├── Graph.cs\n├── GraphNode.cs\n├── Station.cs\n├── Program.cs\n├── App.config\n├── packages.config\n└── Properties/AssemblyInfo.cs\nADSPortEx4.sln</pre>",
        "mermaid": []
      },
      {
        "heading": "Timescale",
        "html": "<table>\n  <thead>\n    <tr><th>Phase</th><th>Work</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Task A</td><td>Stations, list graph skeleton, counts, menu</td></tr>\n    <tr><td>Task B</td><td>Weights, averages, adjacency query</td></tr>\n    <tr><td>Task C</td><td>Traversal + FastestRoute</td></tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Challenges and how they were handled",
        "html": "<table>\n  <thead>\n    <tr><th>Challenge</th><th>Approach</th></tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>No Dictionary</td>\n      <td>Store nodes and adjacency in lists; look up by id with explicit scans</td>\n    </tr>\n    <tr>\n      <td>Weights changing the model</td>\n      <td>AddWeightedEdge path used after Task B</td>\n    </tr>\n    <tr>\n      <td>FastestRoute vs true shortest path</td>\n      <td>Implement the brief's greedy rule; do not claim global optimality</td>\n    </tr>\n    <tr>\n      <td>Revisit prevention</td>\n      <td>Track visited stations while walking the route</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Testing",
        "html": "<ul>\n  <li>NumNodes and NumEdges match manual construction of a small network</li>\n  <li>Weighted edges affect AverageTravelTime as expected</li>\n  <li>GetAllConnections returns only adjacent ids</li>\n  <li>BFS/DFS visit each reachable node once on a simple connected graph</li>\n  <li>FastestRoute never repeats a station and prefers the locally lowest weight edge</li>\n  <li>Disconnected start yields a route that stops when no unused edges remain</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Deployment and links",
        "html": "<p>\n  Open <code>ADSPortEx4.sln</code> in Visual Studio (F5 / Ctrl+F5), or build with\n  <code>msbuild ADSPortEx4.sln</code> and run\n  <code>ADSPortEx4\\bin\\Debug\\ADSPortEx4.exe</code>. No web host. The graph ADT and harness\n  are the artefact.\n</p>",
        "mermaid": []
      }
    ]
  },
  {
    "slug": "whats-for-dinner",
    "title": "What's For Dinner",
    "date": "Year 2, 6G5Z0023 Thematic Project, group",
    "description": "What's For Dinner: Year 2 Thematic Project recipe finder. Architecture, delivery, testing, and team practice.",
    "images": [
      {
        "src": "whatsfordinner-home.png",
        "alt": "What's For Dinner homepage"
      },
      {
        "src": "whatsfordinner-recipes.png",
        "alt": "What's For Dinner recipes"
      }
    ],
    "tech": [
      "HTML",
      "CSS",
      "JavaScript",
      "Python"
    ],
    "links": [
      {
        "href": "https://github.com/code-by-panashe-sanyanga/WHATS-FOR-DINNER",
        "label": "GitHub"
      }
    ],
    "sections": [
      {
        "heading": "Purpose and tech stack",
        "html": "<p>\n  What's For Dinner is a Year 2 Thematic Project (1CWK100) recipe finder. The brief put us on a\n  product with a real use case: help people cook with ingredients they already have, cut food\n  waste, and browse meals by cuisine. The team chose a responsive website over a store app\n  so we could ship a browser MVP within the unit timeline.\n</p>\n<p>\n  My contribution sat across delivery and code. Roles were not titled formally, but I took on\n  informal lead work: research, page development, supporting teammates who were stuck, and\n  keeping tasks moving on Teams and Trello when progress stalled. The MVP we agreed as a team\n  shipped: ingredient input, recipe suggestions from a matching path, and country or cuisine\n  browse. Saved favourites and full user accounts were scoped out for later so the core path\n  stayed finishable.\n</p>\n<table>\n  <thead>\n    <tr>\n      <th>Layer</th>\n      <th>Choice</th>\n      <th>Reason</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Client</td>\n      <td>HTML, CSS, JavaScript</td>\n      <td>Multi page UI, shared navigation, responsive layout for phone and desktop</td>\n    </tr>\n    <tr>\n      <td>Server / data</td>\n      <td>Python backend serving recipe data</td>\n      <td>Keep matching and recipe content off hard coded page markup where possible</td>\n    </tr>\n    <tr>\n      <td>Collaboration</td>\n      <td>GitHub, Trello, Microsoft Teams</td>\n      <td>Parallel work, visible task board, daily style check ins</td>\n    </tr>\n    <tr>\n      <td>Delivery style</td>\n      <td>Staged Agile (research, design, build, test)</td>\n      <td>Adapt when a feature overran without restarting the whole plan</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Design",
        "html": "<p>\n  The product path is deliberately short. A visitor lands on home, either searches by\n  ingredient or keyword, takes an inspiration route (dish of the day style prompts), or\n  browses by country. Shared CSS and navigation keep every page one product, not a set of\n  mismatched student pages.\n</p>\n\n<p>\n  Matching is the architectural centre: user inputs map onto recipe records rather than\n  dumping a static list. That kept the social goal (use what you have) tied to the data model\n  instead of to marketing copy alone. We also treated cuisine content as something to check\n  for accuracy and cultural care, not filler text.\n</p>",
        "mermaid": [
          "flowchart TD\n  Home[Home] --> Search[Ingredient / keyword search]\n  Home --> Browse[Browse by cuisine]\n  Home --> Inspire[Inspiration / dish of the day]\n  Search --> Match[Recipe matching]\n  Browse --> Match\n  Inspire --> Match\n  Match --> Detail[Recipe view]\n  Detail --> Backend[Python recipe data]"
        ]
      },
      {
        "heading": "Features implemented",
        "html": "<ul>\n  <li>Ingredient and keyword search that returns workable recipe suggestions</li>\n  <li>Browse by country or cuisine</li>\n  <li>Inspiration path when the user has no fixed dish in mind</li>\n  <li>Responsive layout tested for desktop and phone widths</li>\n  <li>Shared navigation and styling across pages</li>\n  <li>Python backed recipe data for the matching path</li>\n  <li>Team process: Trello board, Teams for blockers, GitHub for parallel commits</li>\n</ul>\n<p>\n  Explicitly not in the MVP: saved favourites and production grade accounts. Those were\n  listed as future work so GDPR and password storage did not block shipping the core finder.\n</p>",
        "mermaid": []
      },
      {
        "heading": "Folder structure",
        "html": "<pre class=\"folder-tree\">WHATS-FOR-DINNER/\n├── index.html                 # entry / redirect into frontend pages\n├── frontend/\n│   └── pages/                 # home, recipes, cuisine views\n├── backend/                   # Python recipe data / server side logic\n├── .gitignore\n└── README / team docs</pre>",
        "mermaid": []
      },
      {
        "heading": "Timescale",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Phase</th>\n      <th>Work</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Preferences and kickoff</td>\n      <td>Assigned Recipe Finder brief; team formed; MVP goals written down</td>\n    </tr>\n    <tr>\n      <td>Research and design</td>\n      <td>Information architecture, page list, cuisine and waste framing</td>\n    </tr>\n    <tr>\n      <td>Build</td>\n      <td>Frontend pages, matching path, backend recipe data, shared CSS</td>\n    </tr>\n    <tr>\n      <td>Integration pain</td>\n      <td>Merge conflicts from parallel edits; process tightened (Teams before push, Trello ownership)</td>\n    </tr>\n    <tr>\n      <td>MVP freeze and demo</td>\n      <td>Core search and browse working; stretch features deferred; demonstration video recorded</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Challenges and how they were handled",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Challenge</th>\n      <th>Approach</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Git merge conflicts breaking layout</td>\n      <td>Communicate on Teams before push; Trello ownership so two people were not editing the same file blind</td>\n    </tr>\n    <tr>\n      <td>Uneven effort across the group</td>\n      <td>Redistributed tasks; chased updates; carried gaps so the MVP still shipped (lesson: set expectations earlier next time)</td>\n    </tr>\n    <tr>\n      <td>Scope vs time</td>\n      <td>Cut favourites and accounts; protect search, browse, and matching</td>\n    </tr>\n    <tr>\n      <td>Ethics and legality</td>\n      <td>Accurate cuisine content; Equality Act minded UI (readable type, clear nav, responsive); GDPR noted for any future account data</td>\n    </tr>\n    <tr>\n      <td>Security for a later account feature</td>\n      <td>MVP kept personal data minimal; password protection planned for a real account release rather than bolted on late</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Testing",
        "html": "<p>\n  Testing was manual against the team MVP definition and the unit brief. We did not run a\n  separate automated suite in this module; confidence came from browser checks and demo\n  rehearsal.\n</p>\n<ul>\n  <li>Ingredient search returns relevant recipes, not empty or random noise</li>\n  <li>Cuisine browse lists the expected dishes</li>\n  <li>Navigation is consistent on every page</li>\n  <li>Layout holds at phone width and desktop width</li>\n  <li>Demo path (home to result) completes without dead links</li>\n  <li>After merge fixes, previously broken CSS no longer regressed the shared shell</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Deployment and links",
        "html": "<p>\n  The site is static frontend pages plus a Python backend folder in the repo. Open the root\n  <code>index.html</code> (or serve the folder with a local static server) and start the\n  backend if live data is required. Source and write up live on GitHub; demonstration video\n  was submitted via MMUTube for the unit.\n</p>",
        "mermaid": []
      }
    ]
  },
  {
    "slug": "vault-comics",
    "title": "Vault Comics",
    "date": "Year 1, 6G4Z0024 Web Development, individual",
    "description": "Vault Comics: Year 1 comic shop site with catalogue, localStorage cart, checkout demo, and PHP contact form.",
    "images": [
      {
        "src": "vaultcomics-home.png",
        "alt": "Vault Comics home"
      },
      {
        "src": "vaultcomics-catalogue.png",
        "alt": "Vault Comics catalogue"
      }
    ],
    "tech": [
      "HTML",
      "CSS",
      "JavaScript",
      "PHP"
    ],
    "links": [
      {
        "href": "https://github.com/code-by-panashe-sanyanga/Vault-Comics",
        "label": "GitHub"
      }
    ],
    "sections": [
      {
        "heading": "Purpose and tech stack",
        "html": "<p>\n  Vault Comics is a comic book shop site. Shoppers can browse a catalogue, add titles to a cart\n  that survives a refresh, walk a demo checkout, and send a contact message.\n</p>\n<table>\n  <thead>\n    <tr>\n      <th>Layer</th>\n      <th>Choice</th>\n      <th>Reason</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Pages</td>\n      <td>HTML5 (home, catalogue, basket, pay, success, about, contact)</td>\n      <td>Multi-page shop flow rather than a single landing page</td>\n    </tr>\n    <tr>\n      <td>Presentation</td>\n      <td>CSS Grid and Flexbox in <code>css/style.css</code></td>\n      <td>Responsive catalogue and layout without a framework</td>\n    </tr>\n    <tr>\n      <td>Behaviour</td>\n      <td>JavaScript in <code>js/script.js</code></td>\n      <td>Cart, forms, and mobile nav</td>\n    </tr>\n    <tr>\n      <td>Persistence</td>\n      <td>browser <code>localStorage</code></td>\n      <td>Cart items stay after closing the tab</td>\n    </tr>\n    <tr>\n      <td>Contact</td>\n      <td>PHP handler plus EmailJS / mailto fallbacks</td>\n      <td>Hosting environments handle mail differently</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Design",
        "html": "<p>\n  The site is a small multi-page shop. Home highlights featured comics. The catalogue lists\n  the full set. Basket reads and writes the cart in <code>localStorage</code>. Pay and success\n  are a demo checkout path (not live card processing). About and Contact are full pages; the\n  contact form tries PHP first, then other mail options if the host will not send mail.\n</p>",
        "mermaid": [
          "flowchart LR\n  Home[index.html] --> Catalogue[comics.html]\n  Catalogue -->|add item| Basket[basket.html]\n  Basket --> Pay[pay.html]\n  Pay --> Success[success.html]\n  Home --> About[aboutus.html]\n  Home --> Contact[contactus.html]\n  Contact -->|PHP / EmailJS / mailto| Mail[email]\n  Basket <-->|localStorage| Store[(browser storage)]"
        ]
      },
      {
        "heading": "Features implemented",
        "html": "<ul>\n  <li>Homepage with featured comics</li>\n  <li>Full catalogue page</li>\n  <li>Working shopping cart that persists across sessions via localStorage</li>\n  <li>Demo checkout and order confirmation pages</li>\n  <li>About and Contact pages</li>\n  <li>Contact form with PHP handler and fallbacks for awkward hosts</li>\n  <li>Responsive layout for phone and desktop</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Folder structure",
        "html": "<pre class=\"folder-tree\">VaultComics/\n├── index.html\n├── comics.html\n├── basket.html\n├── pay.html\n├── success.html\n├── aboutus.html\n├── contactus.html\n├── contact-form-handler.php\n├── css/style.css\n├── js/script.js\n└── image/                 # comic covers</pre>",
        "mermaid": []
      },
      {
        "heading": "Timescale",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Phase</th>\n      <th>Work</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Structure</td>\n      <td>Multi-page layout, shared nav, responsive shell</td>\n    </tr>\n    <tr>\n      <td>Catalogue</td>\n      <td>Product pages, images, Grid / Flexbox polish</td>\n    </tr>\n    <tr>\n      <td>Cart</td>\n      <td>Add / remove / persist with localStorage</td>\n    </tr>\n    <tr>\n      <td>Checkout and contact</td>\n      <td>Demo pay flow; PHP contact handler plus fallbacks</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Challenges and how they were handled",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Challenge</th>\n      <th>Approach</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Images not loading</td>\n      <td>Removed a duplicate CSS link pointing at a missing file</td>\n    </tr>\n    <tr>\n      <td>Mobile hamburger menu</td>\n      <td>Stopped two JS functions sharing the same name and fighting each other</td>\n    </tr>\n    <tr>\n      <td>Contact mail across hosts</td>\n      <td>PHP handler, EmailJS option, and mailto fallback</td>\n    </tr>\n    <tr>\n      <td>Cart surviving refresh</td>\n      <td>Serialize cart state to localStorage on every change</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Testing",
        "html": "<ul>\n  <li>Add items, refresh, confirm the basket still holds them</li>\n  <li>Remove items and clear the cart</li>\n  <li>Walk pay to success without claiming a real payment went through</li>\n  <li>Resize to phone width: catalogue and nav stay usable</li>\n  <li>Submit contact and confirm at least one delivery path works on the host under test</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Deployment and links",
        "html": "<p>\n  Static site: open <code>index.html</code> or serve the folder with\n  <code>python -m http.server 8000</code>. Contact mail needs PHP configured on the host, or\n  EmailJS / mailto as fallback. Source is on GitHub.\n</p>",
        "mermaid": []
      }
    ]
  },
  {
    "slug": "space-survival",
    "title": "Space Survival",
    "date": "Year 1, 6G4Z0020 Programming, Don't Crash!! coursework",
    "description": "Space Survival: Processing arcade game with centred ship, lives, scoring, levels, and OOP entities in one sketch.",
    "images": [
      {
        "src": "spacesurvival-menu.png",
        "alt": "Space Survival menu"
      },
      {
        "src": "spacesurvival-play.png",
        "alt": "Space Survival gameplay"
      }
    ],
    "tech": [
      "Processing",
      "Java",
      "OOP"
    ],
    "links": [
      {
        "href": "https://github.com/code-by-panashe-sanyanga/Space-Survival",
        "label": "GitHub"
      }
    ],
    "sections": [
      {
        "heading": "Purpose and tech stack",
        "html": "<p>\n  Space Survival is a 2D arcade survival game in Processing (Java). The ship stays centred;\n  arrow keys shove the whole obstacle field away from the middle. Coloured shapes (circles,\n  squares, triangles) fly in from the edges.\n</p>\n<table>\n  <thead>\n    <tr><th>Layer</th><th>Choice</th><th>Reason</th></tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Runtime</td>\n      <td>Processing 3 / 4 (Java)</td>\n      <td>Required by the unit assessment</td>\n    </tr>\n    <tr>\n      <td>Layout</td>\n      <td>Single sketch <code>Space_Survival.pde</code></td>\n      <td>All classes and the draw loop live in one file</td>\n    </tr>\n    <tr>\n      <td>Entities</td>\n      <td><code>Player</code>, <code>Obstacle</code>, <code>ExplosionAnimation</code>, <code>Particle</code></td>\n      <td>Ship, hazards, and hit effects</td>\n    </tr>\n    <tr>\n      <td>Collision</td>\n      <td>Circle distance via <code>dist()</code></td>\n      <td>Compare ship and obstacle radii</td>\n    </tr>\n    <tr>\n      <td>Evidence</td>\n      <td><code>Development-report.pdf</code></td>\n      <td>Design, features, and testing write-up</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Design",
        "html": "<p>\n  A small state machine drives the sketch: MENU, PLAYING, GAMEOVER. In play, obstacles live\n  in an <code>ArrayList</code>, spawn on a timer, and leave when they exit the screen (scoring\n  a point). Difficulty scales every 20 points via <code>updateDifficulty()</code>, which\n  shortens spawn interval and speeds motion. A hit costs a life, shows an explosion burst,\n  and starts a short invulnerability shield so you are not hit again immediately.\n</p>\n<pre class=\"folder-tree\">draw() state machine\n  MENU     -> SPACE starts PLAYING\n  PLAYING  -> arrows shove field; spawn / move / collide; score + levels\n  GAMEOVER -> R restart, M menu\n\nArrayList&lt;Obstacle&gt; + ArrayList&lt;ExplosionAnimation&gt; / Particle\nPlayer.collision uses dist() vs obstacle radius</pre>",
        "mermaid": []
      },
      {
        "heading": "Features implemented",
        "html": "<ul>\n  <li>Ship fixed at centre; arrow keys push the obstacle field</li>\n  <li>Five lives shown as hearts; brief shield after a hit</li>\n  <li>Score for each obstacle that leaves the screen; level up every 20 points</li>\n  <li>Obstacles as coloured circle / square / triangle shapes with level-scaled velocity</li>\n  <li>Explosion and particle effects on hit (larger burst on game over)</li>\n  <li>Starfield background; engine flicker and shield visuals on the ship</li>\n  <li>MENU / PLAYING / GAMEOVER with SPACE, R, and M controls</li>\n  <li>Development report PDF in the repo</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Folder structure",
        "html": "<pre class=\"folder-tree\">Space_Survival/\n├── Space_Survival.pde       # setup/draw + Player, Obstacle, Explosion, Particle\n└── Development-report.pdf</pre>",
        "mermaid": []
      },
      {
        "heading": "Timescale",
        "html": "<table>\n  <thead>\n    <tr><th>Phase</th><th>Work</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Core loop</td><td>Centred ship, relative motion, collision, obstacle list</td></tr>\n    <tr><td>Game feel</td><td>Lives, score, levels, shield, explosions</td></tr>\n    <tr><td>Polish</td><td>Menu / game over states, starfield, development report</td></tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Challenges and how they were handled",
        "html": "<table>\n  <thead>\n    <tr><th>Challenge</th><th>Approach</th></tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Relative motion feels wrong at first</td>\n      <td>Lock the ship to centre; apply opposite deltas to every obstacle on key press</td>\n    </tr>\n    <tr>\n      <td>Leaking obstacle objects</td>\n      <td>Remove from the ArrayList when off screen or destroyed</td>\n    </tr>\n    <tr>\n      <td>Instant multi-hit after a collision</td>\n      <td>Invulnerability window with a visible shield</td>\n    </tr>\n    <tr>\n      <td>Difficulty staying flat</td>\n      <td><code>updateDifficulty()</code> raises level and shortens spawn interval with score</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Testing",
        "html": "<ul>\n  <li>Arrow keys move the field opposite to the press</li>\n  <li>Collision at the expected distance costs a life and shows the shield</li>\n  <li>Obstacles keep drifting with no key held; removed ones leave the list</li>\n  <li>Score and level-up thresholds behave as designed</li>\n  <li>SPACE / R / M move correctly between menu, play, and game over</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Deployment and links",
        "html": "<p>\n  Install Processing, open <code>Space_Survival.pde</code> (folder name must match), and run.\n  No high-score file between runs; no sound; enemy types stay as coloured shapes rather than\n  sprites. Source and the development report are on GitHub as a personal-profile re-upload.\n</p>",
        "mermaid": []
      }
    ]
  }
];
