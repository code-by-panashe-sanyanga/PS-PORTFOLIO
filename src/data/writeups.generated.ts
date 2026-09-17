// Case study content for each project. Prose is written by hand; keep the section
// order stable because Project.tsx maps sections by index.
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
    "description": "ApexIQ F1 pit wall: what it does, the stack, the request path, features, testing and how I deployed it.",
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
        "heading": "What ApexIQ is and what it runs on",
        "html": "<p>\n  ApexIQ is an F1 pit wall dashboard I built so I could follow a session through the telemetry\n  an engineer watches rather than the numbers a broadcast puts on screen. The public site is\n  Next.js, FastAPI runs behind it, and the browser only ever calls\n  <code>/api</code> on the Next.js host. Championship\n  data comes from f1api.dev, while live timing, weather and GPS come from OpenF1. Neither feed\n  needs an API key, which kept the deploy simple. OpenF1 does not always send tyre\n  temperatures, ERS or practice gaps, and when it does not, the UI leaves those fields blank\n  rather than inventing numbers.\n</p>\n<table>\n  <thead>\n    <tr>\n      <th>Layer</th>\n      <th>Choice</th>\n      <th>Reason</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>API</td>\n      <td>Python, FastAPI, httpx</td>\n      <td>A single process builds the briefing, pit wall, map and live data</td>\n    </tr>\n    <tr>\n      <td>Championship</td>\n      <td>f1api.dev</td>\n      <td>Standings, calendar, drivers, teams, circuits and compare. No key</td>\n    </tr>\n    <tr>\n      <td>Live timing / GPS</td>\n      <td>OpenF1</td>\n      <td>Sessions, car data, GPS, laps, stints, weather and race control. No key</td>\n    </tr>\n    <tr>\n      <td>UI</td>\n      <td>Next.js 15, React 19, TypeScript, Three.js</td>\n      <td>Single page. /api proxy on the same host. 3D car drawn in code</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "How a request travels through the app",
        "html": "<p>\n  The browser never speaks to FastAPI directly. Next.js sits in front of it and forwards\n  <code>/api/*</code> through. FastAPI keeps OpenF1 down to roughly 3 requests a second and 30\n  a minute, caches the pit wall and map responses once it has built them, then hands them back\n  to the UI. With the throttle in one place, no open tab can hammer the feed on its own.\n</p>\n\n<p>\n  The two APIs disagree on driver numbers, which broke my first attempt at stitching them\n  together, so the UI matches drivers on name and acronym instead. GPS for the track map is\n  taken from the middle of a session rather than the end. Grab the last few seconds of a\n  finished practice and every point sits in the garage, so I drop sample sets that barely\n  move across the map.\n</p>",
        "mermaid": [
          "flowchart LR\n  Browser[Browser UI] -->|same origin /api| Next[Next.js]\n  Next -->|proxy localhost| API[FastAPI]\n  API --> Cache[TTL cache]\n  API --> F1[f1api.dev]\n  API --> OF[OpenF1]\n  API --> Next\n  Next --> Browser"
        ]
      },
      {
        "heading": "What I got working",
        "html": "<ul>\n  <li>Pit wall showing position, tyre compound, tyre age, speed and sectors whenever the feed sends them</li>\n  <li>Track outline built from OpenF1 GPS, with driver dots placed on the circuit</li>\n  <li>Championship standings and the remaining rounds from f1api.dev</li>\n  <li>Last race grid to finish, calendar times, the 2026 grid and a driver compare view</li>\n  <li>3D car view for whichever driver is selected on the pit wall, drawn in Three.js</li>\n  <li>CORS allowlist, trusted hosts, 120 requests a minute on the API, and OpenAPI docs off unless debug is on</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "How the repo is laid out",
        "html": "<p>\n  Backend and frontend live in the same repo but stay separate, so I can start the API on its\n  own while I am working on it.\n</p>\n<pre class=\"folder-tree\">ApexIQ/\n├── backend/\n│   ├── app/main.py\n│   ├── app/routes.py\n│   ├── app/security.py\n│   ├── app/clients/           # f1api.dev, OpenF1, throttle\n│   └── app/services/          # briefing, live, map\n└── frontend/\n    ├── src/app/api/[...path]/route.ts\n    ├── src/app/page.tsx\n    ├── src/components/hero/CarScene.tsx\n    ├── src/components/live/TrackMap.tsx\n    └── src/lib/api.ts</pre>",
        "mermaid": []
      },
      {
        "heading": "Timescale",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Phase</th>\n      <th>When</th>\n      <th>Work</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Clients and pit wall</td>\n      <td>Sep 2026</td>\n      <td>f1api.dev and OpenF1 clients, the pit wall UI, the 3D car</td>\n    </tr>\n    <tr>\n      <td>Circuit GPS and polish</td>\n      <td>Sep 2026</td>\n      <td>Mid session GPS window, rate limit cache, clearer labels in the UI</td>\n    </tr>\n    <tr>\n      <td>Repo</td>\n      <td>Sep 2026</td>\n      <td>GitHub, README, one-container Dockerfile</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Problems I hit and how I fixed them",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Problem</th>\n      <th>What I did</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>OpenF1 allows about 30 requests a minute</td>\n      <td>Put a shared rate limit in front of the client, cache the built pit wall and map, and poll less often once the session has ended</td>\n    </tr>\n    <tr>\n      <td>GPS after the session ends sits in the garage</td>\n      <td>Read GPS from the middle of the session, and throw away point sets that barely move</td>\n    </tr>\n    <tr>\n      <td>httpx turns <code>date&gt;=</code> into <code>date&gt;==</code></td>\n      <td>Took a while to spot. I now build the OpenF1 query strings by hand so the filter stays <code>date&gt;=VALUE</code></td>\n    </tr>\n    <tr>\n      <td>Driver numbers differ between the two APIs</td>\n      <td>Match on acronym and name, never on number</td>\n    </tr>\n    <tr>\n      <td>Feed omits tyre temperatures and ERS</td>\n      <td>Leave those blank and show what does arrive: compound, age, RPM, throttle, gear, speed and DRS</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Testing",
        "html": "<p>\n  I have not written a pytest suite for this repo, so the checks were done by hand against the\n  live APIs:\n</p>\n<ul>\n  <li>Briefing and championship load from f1api.dev</li>\n  <li>The pit wall picks up the latest OpenF1 session and does not invent practice gaps</li>\n  <li><code>GET /api/live/map</code> returns a path that actually spreads in x/y when GPS exists</li>\n  <li>The map stays blank when GPS is missing or useless</li>\n  <li><code>GET /health</code> answers on Next.js</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Running it locally and where it lives",
        "html": "<p>\n  Locally, FastAPI listens on <code>127.0.0.1:8000</code> and Next.js on\n  <code>http://127.0.0.1:3000</code>, with <code>API_INTERNAL_URL</code> pointing at the API.\n  Open the Next.js URL, not port 8000. The source is on GitHub, and the public demo runs as\n  one Railway service.\n</p>",
        "mermaid": []
      }
    ]
  },
  {
    "slug": "novabank",
    "title": "NovaBank",
    "date": "Jun to Jul 2026, personal project",
    "description": "NovaBank write up: what it is, the stack, the money path, features, testing and deployment.",
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
        "heading": "What NovaBank is, and what I built it with",
        "html": "<p>\n  NovaBank is a small online bank with a dashboard on the front of it. I built it because I wanted\n  to understand how a bank actually moves money, rather than just storing a balance and changing\n  the number. Every transfer writes matching debit and credit lines, login proves who you are, and\n  the money routes check that you are only touching your own accounts.\n</p>\n<table>\n  <thead>\n    <tr>\n      <th>Layer</th>\n      <th>Choice</th>\n      <th>Reason</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>API</td>\n      <td>Python, FastAPI</td>\n      <td>Clear route modules, and OpenAPI docs for checking endpoints by hand</td>\n    </tr>\n    <tr>\n      <td>Database</td>\n      <td>PostgreSQL (Docker Compose); SQLite for a quick smoke test</td>\n      <td>Postgres gives me ACID and row locks on transfers</td>\n    </tr>\n    <tr>\n      <td>ORM / money types</td>\n      <td>SQLAlchemy, Decimal</td>\n      <td>Keeps float away from currency</td>\n    </tr>\n    <tr>\n      <td>Auth</td>\n      <td>bcrypt + JWT with a role claim</td>\n      <td>Customer vs admin gates, plus ownership checks on accounts and cards</td>\n    </tr>\n    <tr>\n      <td>UI</td>\n      <td>HTML, CSS, JavaScript, Chart.js</td>\n      <td>Browser client for the dashboard, pots, cards and admin</td>\n    </tr>\n    <tr>\n      <td>Live updates</td>\n      <td>WebSockets</td>\n      <td>Balances refresh as soon as money posts</td>\n    </tr>\n    <tr>\n      <td>Ops</td>\n      <td>Docker Compose, Railway deploy</td>\n      <td>Postgres parity locally, and a public demo</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Design: the money path and the system view",
        "html": "<p>\n  Only the ledger transfer service is allowed to post money rows. I kept that rule strict, so when\n  a balance looks wrong there is one place to go and read. The browser talks to REST with a JWT kept in localStorage, and holds a WebSocket\n  open so balances update once a post has landed.\n</p>\n\n<h3>Transfer steps</h3>\n<ol>\n  <li>Lock the accounts involved, ordered by id (<code>FOR UPDATE</code> on Postgres), so two crossing transfers do not deadlock each other.</li>\n  <li>Insert a <code>transactions</code> row as an immutable header, with an optional idempotency key.</li>\n  <li>Insert balanced <code>ledger_entries</code>, where debits have to equal credits for that transaction.</li>\n  <li>Update <code>balance_cache</code> inside the same database transaction.</li>\n  <li>Commit, or roll the whole unit back.</li>\n</ol>\n<p>\n  Customer deposit accounts sit on the liability side, because the bank owes the customer that\n  money. A deposit credits the customer and debits a system account, a withdrawal does the reverse,\n  and a transfer debits A and credits B. If a client sends the same <code>idempotencyKey</code>\n  twice, the second call hands back the original transaction instead of posting again.\n</p>",
        "mermaid": [
          "flowchart LR\n  Browser[Browser UI] -->|REST + JWT| API[FastAPI]\n  Browser -->|WebSocket| API\n  API --> Ledger[ledger service]\n  Ledger --> DB[(PostgreSQL)]\n  API --> Fraud[fraud rules]\n  Fraud --> DB\n  Admin[Admin routes] --> API"
        ]
      },
      {
        "heading": "Features I built",
        "html": "<ul>\n  <li>Register and log in; a new user gets a current account, a savings account and a debit card</li>\n  <li>Deposit, withdraw and transfer by account number, with statements and CSV export</li>\n  <li>Savings pots, round ups on card payments, and a spending breakdown by category</li>\n  <li>Card freeze / unfreeze, spending limits and merchant category blocks (card numbers, PINs and account closure are stubs)</li>\n  <li>FX rate lookup and conversion through Frankfurter / ECB (<code>/fx/rate</code>, <code>/fx/convert</code>)</li>\n  <li>Session style device list ideas, and an audit log over money and admin actions</li>\n  <li>Admin side: customer search, account freeze, flagged transaction review</li>\n  <li>Fraud rules that flag rather than block large amounts, bursts of outbound transfers, and outliers</li>\n  <li>Card numbers masked in API responses, and ownership checks on the account and card routes</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "How the repo is laid out",
        "html": "<p>\n  The application code lives in <code>novabank/</code>, with the ledger and the fraud rules pulled\n  out into <code>services/</code> so the route files stay thin.\n</p>\n<pre class=\"folder-tree\">NovaBank/\n├── novabank/\n│   ├── main.py              # app, pages, WebSocket, /docs\n│   ├── api.py               # REST routes\n│   ├── auth.py / database.py / features.py\n│   └── services/\n│       ├── ledger.py        # double entry transfer service\n│       └── fraud.py         # anomaly rules (flag, do not block)\n├── templates/ + static/     # UI\n├── tests/                   # pytest (incl. concurrent Postgres suite)\n├── seed_ledger.py\n├── docker-compose.yml\n├── Dockerfile\n└── requirements.txt</pre>",
        "mermaid": []
      },
      {
        "heading": "Timescale",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Phase</th>\n      <th>When</th>\n      <th>Work</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Core ledger and auth</td>\n      <td>Jun 2026</td>\n      <td>Accounts, JWT, and deposit / withdraw / transfer inside one DB transaction</td>\n    </tr>\n    <tr>\n      <td>Customer product surface</td>\n      <td>Jun to Jul 2026</td>\n      <td>Pots, cards, statements, insights, WebSocket updates</td>\n    </tr>\n    <tr>\n      <td>Admin and fraud</td>\n      <td>Jul 2026</td>\n      <td>Audit views, flag rules, worker scan</td>\n    </tr>\n    <tr>\n      <td>Hardening and deploy</td>\n      <td>Jul 2026</td>\n      <td>pytest over the ledger path, Docker Compose Postgres, Railway demo</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Problems I hit, and how I fixed them",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Challenge</th>\n      <th>Approach</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>A transfer failing halfway through</td>\n      <td>Validation runs as its own pass over every leg before a single row is created, so a rejected post leaves nothing staged</td>\n    </tr>\n    <tr>\n      <td>Two transfers hitting the same accounts at once</td>\n      <td>On Postgres the account rows are locked in id order, so crossing transfers queue instead of deadlocking</td>\n    </tr>\n    <tr>\n      <td>Float rounding turning up in balances</td>\n      <td>Money is stored and computed as Decimal</td>\n    </tr>\n    <tr>\n      <td>A slow client submitting the same payment twice</td>\n      <td>Idempotency keys on deposit / withdraw / transfer, so the repeat returns the first transaction</td>\n    </tr>\n    <tr>\n      <td>Leaking card data, or another user's accounts</td>\n      <td>Card numbers are masked, and every sensitive route checks ownership before it answers</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Testing",
        "html": "<p>\n  The automated tests are pytest, pointed at the ledger and the transfer path. Run them from the\n  NovaBank repo:\n</p>\n<pre class=\"checklist\">pytest -q\n# locally: 9 passed, 2 skipped (skipped need NOVABANK_PG_URL)\nNOVABANK_PG_URL=postgresql+psycopg://... pytest -q tests/test_concurrent_postgres.py</pre>\n<p>What those suites cover, plus the manual checks I make before calling a build done:</p>\n<ul>\n  <li>A transfer from A to B updates both sides and leaves the ledger entries balanced</li>\n  <li>A forced failure mid flow does not leave one side updated</li>\n  <li>A customer cannot read another customer's account by id</li>\n  <li>Admin routes reject a customer JWT</li>\n  <li>A repeated idempotency key does not double post</li>\n  <li>Postgres concurrency: racing withdrawals and crossed transfers still leave a consistent ledger (<code>tests/test_concurrent_postgres.py</code>)</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Running it and deploying it",
        "html": "<p>\n  For a quick local smoke test: Python 3.12, a venv, <code>pip install -r requirements.txt</code>,\n  seed, then <code>uvicorn novabank.main:app --reload --port 5002</code>. To run it against\n  Postgres instead, <code>docker compose up --build</code>, then seed with <code>DATABASE_URL</code>\n  pointed at the compose database. The public demo is hosted on Railway.\n</p>\n<p>\n  Every seeded user shares the password <code>Password123</code>:\n  <code>alex@example.com</code> and <code>jamie@example.com</code> are customers, and\n  <code>admin@novabank.co.uk</code> is the admin.\n</p>",
        "mermaid": []
      }
    ]
  },
  {
    "slug": "premieriq",
    "title": "PremierIQ",
    "date": "Sep 2026, personal project",
    "description": "A write up of PremierIQ: what it is for, the stack behind it, the design, the features, testing and deployment.",
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
        "heading": "What PremierIQ is, and what it runs on",
        "html": "<p>\n  PremierIQ is a Premier League dashboard that sits somewhere close to a BBC Sport football\n  page: live standings, match chances and a season outlook. The chances are not looked up\n  anywhere, they come out of simulating each fixture over and over in NumPy. The free feed\n  carries no injuries, no confirmed lineups and no odds, so the app does not pretend to have\n  them. Gemini text is optional, and all it does is put the simulation numbers into words.\n</p>\n<table>\n  <thead>\n    <tr>\n      <th>Layer</th>\n      <th>Choice</th>\n      <th>Reason</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>API</td>\n      <td>Python, FastAPI, NumPy</td>\n      <td>Standings, squads, weather, Match IQ and Season IQ all in one process</td>\n    </tr>\n    <tr>\n      <td>Football data</td>\n      <td>football-data.org v4</td>\n      <td>Premier League table, teams, matches and scorers. Roughly 10 requests a minute on the free tier</td>\n    </tr>\n    <tr>\n      <td>Weather</td>\n      <td>OpenWeather, Open-Meteo fallback</td>\n      <td>Conditions at the home stadium at the moment a sim runs</td>\n    </tr>\n    <tr>\n      <td>Briefing text</td>\n      <td>Gemini 3.8 Flash (optional)</td>\n      <td>Narrates the Monte Carlo JSON and nothing else. No key means ai comes back null</td>\n    </tr>\n    <tr>\n      <td>UI</td>\n      <td>Next.js 15, React 19, TypeScript, MapLibre GL</td>\n      <td>Single page. A same origin /api rewrite keeps the keys away from the browser</td>\n    </tr>\n    <tr>\n      <td>Map tiles</td>\n      <td>OpenFreeMap liberty style</td>\n      <td>Night restyle and 3D buildings without paying for a map key</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Design: how a request travels",
        "html": "<p>\n  The browser only ever speaks to the Next.js origin. Next rewrites <code>/api/*</code>\n  through to FastAPI, which is where the provider keys live. FastAPI caches\n  football-data.org responses in process, then runs the simulation.\n</p>\n\n<h3>What feeds a Match IQ rating</h3>\n<ol>\n  <li>Season goals for and against per game (weight 0.60).</li>\n  <li>The last five completed matches, recency weighted (0.30).</li>\n  <li>Home / away split where there are at least three samples, otherwise the prior season (0.10).</li>\n  <li>Completed head to head meetings where there are at least two (0.05).</li>\n  <li>Second half rates when half time scores exist (0.05).</li>\n</ol>\n<p>\n  Any of those pieces can be missing early in a season, so the weights are scaled again\n  whenever one drops out. Weather, away travel fatigue, rest days and a formation modifier the user picks\n  for the sim are layered on after that. What comes out is a goal expectation per side, and I\n  take 10,000 Poisson draws against it and count how often each result appears. Goals arrive\n  as rare, roughly independent events, which is exactly the shape Poisson handles, and\n  counting simulated outcomes is something I can explain line by line rather than hand waving\n  at a fitted model. Confidence is capped at 64% if a side has played fewer than five games,\n  since there is not enough of a sample to justify anything higher. Season IQ reuses the same\n  strength idea across the remaining listed fixtures and runs 2,000 full table sims.\n</p>",
        "mermaid": [
          "flowchart LR\n  Browser[Browser UI] -->|same origin /api| Next[Next.js]\n  Next -->|rewrite| API[FastAPI]\n  API --> Cache[TTL cache]\n  API --> FD[football-data.org]\n  API --> WX[OpenWeather / Open-Meteo]\n  API --> Eng[NumPy Poisson]\n  Eng -->|JSON numbers| Gem[Gemini optional]\n  API --> Next\n  Next --> Browser"
        ]
      },
      {
        "heading": "What the app actually does",
        "html": "<ul>\n  <li>Live TOTAL standings, plus competition scorers when the provider returns them</li>\n  <li>Match IQ, with an upcoming fixture strip, assumed formations, weather and rest days</li>\n  <li>Squad panel: ages, colours, founded, website, coach extras and club scorers</li>\n  <li>Stadium map with a night restyle, 3D buildings, fly to on a pin, and weather when you click one</li>\n  <li>Season IQ across the remaining listed fixtures, with rest day congestion read off the calendar</li>\n  <li>CORS allowlist, trusted hosts, 90 requests a minute, OpenAPI off unless debug is on</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "How the repo is laid out",
        "html": "<p>\n  Backend and frontend live side by side in the one repo. The split inside\n  <code>backend/app</code> is the part I fussed over: routes stay thin and every bit of\n  simulation work is kept in <code>services/engine.py</code>.\n</p>\n<pre class=\"folder-tree\">PremierIQ/\n├── backend/\n│   ├── app/main.py              # FastAPI, middleware\n│   ├── app/routes.py            # HTTP surface\n│   ├── app/security.py          # CORS, rate limit, redaction\n│   ├── app/providers/football_data.py\n│   └── app/services/\n│       ├── engine.py            # Monte Carlo + season IQ\n│       ├── weather.py\n│       ├── gemini.py            # optional briefing\n│       └── stadiums.py          # local lat/lon table\n└── frontend/\n    ├── next.config.mjs          # /api rewrite + headers\n    ├── src/app/page.tsx         # single page\n    ├── src/components/          # Match IQ, map, squads\n    └── src/lib/api.ts           # same origin client</pre>",
        "mermaid": []
      },
      {
        "heading": "How the build was paced",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Phase</th>\n      <th>When</th>\n      <th>Work</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Core dashboard and engine</td>\n      <td>Sep 2026</td>\n      <td>Standings, squads, Poisson Match IQ, weather, stadium map</td>\n    </tr>\n    <tr>\n      <td>Season IQ and hardening</td>\n      <td>Sep 2026</td>\n      <td>Remaining fixture table, rest days, H2H, caching, rate limits</td>\n    </tr>\n    <tr>\n      <td>Deploy path</td>\n      <td>Sep 2026</td>\n      <td>GitHub repo, one Railway service, keys kept server side</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Problems I hit, and what I did about them",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Challenge</th>\n      <th>Approach</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>football-data.org rate limit (~10/min)</td>\n      <td>An in process TTL cache absorbs the repeat hits. Teams and standings are separate calls, and nothing is polled on a timer</td>\n    </tr>\n    <tr>\n      <td>Feed has no injuries, lineups, odds, or HOME/AWAY tables</td>\n      <td>I refused to fill those gaps anywhere: not in the JSON, not in UI copy, not in the Gemini text. Formations are labelled as sim assumptions</td>\n    </tr>\n    <tr>\n      <td>Keys leaking to the browser</td>\n      <td>No NEXT_PUBLIC_API_URL at all. Next rewrites /api to FastAPI, and the API holds a CORS allowlist</td>\n    </tr>\n    <tr>\n      <td>MapLibre inside a CSS transform animation</td>\n      <td>Stopped wrapping the map in that animation, and initialise it from useEffect instead</td>\n    </tr>\n    <tr>\n      <td>Gemini inventing match facts</td>\n      <td>The prompt is handed the Monte Carlo JSON and nothing besides. Missing key or failed call, and the sim UI still stands on its own</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "How I checked it",
        "html": "<p>\n  I have not written a pytest suite for this repo. Checking was manual, against the live\n  football-data.org feed and the local API:\n</p>\n<ul>\n  <li>Standings and teams load as independent calls</li>\n  <li>Match IQ returns probabilities and scorelines with <code>ai</code> null when Gemini is unset</li>\n  <li>Season IQ returns a structured unavailable payload if remaining fixtures cannot load</li>\n  <li>Map pins fly to a stadium, and weather extras appear when the provider returns them</li>\n  <li><code>GET /health</code> on the API process</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Running it, and where it lives",
        "html": "<p>\n  Locally, FastAPI runs on <code>127.0.0.1:8000</code> and Next on\n  <code>http://127.0.0.1:3000</code>, with <code>API_INTERNAL_URL</code> pointed at the API.\n  Open the UI origin rather than port 8000, otherwise the rewrite never gets a look in. Source\n  is on GitHub, and the public demo runs as one Railway service.\n</p>",
        "mermaid": []
      }
    ]
  },
  {
    "slug": "chatwire",
    "title": "ChatWire",
    "date": "May 2026 · rebuilt Sep 2026 (v2)",
    "description": "ChatWire case study: the version 2 social app (Home, Explore, Chat and You), what changed from the version 1 room chat, and how privacy, testing and deployment work.",
    "images": [
      {
        "src": "chatwire-v2-home.png",
        "alt": "ChatWire v2 Home timeline with a repost showing the quoted post"
      },
      {
        "src": "chatwire-v2-explore.png",
        "alt": "ChatWire v2 Explore media wall with photos and clips"
      },
      {
        "src": "chatwire-v2-chat.png",
        "alt": "ChatWire v2 Chat: communities, channels, stories, friends and DMs"
      },
      {
        "src": "chatwire-v2-you.png",
        "alt": "ChatWire v2 You profile with posts, reposts and private Saved"
      },
      {
        "src": "chatwire-v2-login.png",
        "alt": "ChatWire v2 login card with the demo account"
      },
      {
        "src": "chatwire-join.png",
        "alt": "Version 1 ChatWire join and login screen"
      },
      {
        "src": "chatwire-chat.png",
        "alt": "Version 1 ChatWire channel chat UI"
      },
      {
        "src": "chatwire-timeline.png",
        "alt": "Version 1 ChatWire feed and timeline"
      },
      {
        "src": "chatwire-light.png",
        "alt": "Version 1 ChatWire light theme"
      }
    ],
    "tech": [
      "Python",
      "Flask",
      "Flask-SocketIO",
      "SQLite",
      "WebRTC",
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
        "heading": "What ChatWire is, and what it runs on",
        "html": "<p>\n  ChatWire is a live social app: communities and channels, direct messages, a Home timeline,\n  Explore with short Clips and rooms, 24h stories, and a You profile with private Saved boards.\n  I built it because I wanted to know how apps like Discord and Instagram get one message onto every\n  open screen at once. Logging in goes over normal HTTP. Everything live runs through Socket.IO, and\n  accounts and history sit in SQLite. v2 (Sep 2026) is the current build: a single shell of Home,\n  Explore, Chat and You, rather than the room-name join form I started with.\n</p>\n<table>\n  <thead>\n    <tr>\n      <th>Layer</th>\n      <th>Choice</th>\n      <th>Reason</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Server</td>\n      <td>Python, Flask, Flask-SocketIO</td>\n      <td>HTTP APIs and live events in one process, which is plenty for this demo</td>\n    </tr>\n    <tr>\n      <td>Data</td>\n      <td>SQLite on a Railway volume</td>\n      <td>Users, messages, friends, posts and boards survive a deploy</td>\n    </tr>\n    <tr>\n      <td>Auth</td>\n      <td>bcrypt + signed session tokens</td>\n      <td>A reconnect uses the token, not the password</td>\n    </tr>\n    <tr>\n      <td>Client</td>\n      <td>HTML, CSS, JavaScript</td>\n      <td>Home, Explore, Chat and You in one shell, with a Ctrl+K switcher</td>\n    </tr>\n    <tr>\n      <td>Calls</td>\n      <td>Socket.IO signalling + WebRTC</td>\n      <td>Meet now presence, then optional mic, camera and screen share</td>\n    </tr>\n    <tr>\n      <td>Presence</td>\n      <td>In memory</td>\n      <td>Online status changes constantly and does not need to outlive a restart</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Version 2 in full, and what changed since version 1",
        "html": "<p>\n  v2 is the build I would put in front of someone first. The app opens on <strong>Home</strong>: a\n  Following or For you timeline where you post text, a photo or a short video, quote or repost, and\n  jump into any author's profile. <strong>Explore</strong> leads with media — a masonry wall of photos\n  and clips, a Clips feed for vertical video, and rooms with votes. <strong>Chat</strong> keeps the\n  Discord shape: communities, channels, pins, direct messages, stories, Meet now and Go live.\n  <strong>You</strong> is a proper profile, with posts, reposts, story highlights, follower counts and\n  Saved boards that nobody but the owner can see. Open somebody else's profile and you get their posts,\n  reposts and status with Follow and Message, and never their Saved.\n</p>\n<p>\n  Version 1 came first, in May, and it earned its place. You typed a display name and a room name, and\n  your messages went out to everyone else in that room. No accounts, nothing stored, everything gone on\n  restart. That prototype is where I worked out how live messaging actually behaves: what a socket\n  connection does when the page reloads, and why the server has to be the thing that decides who receives an\n  event. What it could\n  not be was an app. Without identity there was nothing to follow, nothing private, and nothing worth\n  coming back to.\n</p>\n<p>\n  v2 is that prototype grown up. Registration and login sit behind bcrypt hashes and a signed session\n  token, with a short lockout after repeated failures, and the same gate covers changing a password.\n  Messages belong to channels inside communities, with pins, DMs, typing indicators, reactions, edits and\n  unread counts, so a conversation has somewhere to live instead of scrolling away.\n</p>\n<p>\n  I spent a while cleaning up the interface. The same comment, like, quote, repost and save controls are\n  used in the timeline, in rooms and on profiles, so you do not have to relearn them in each part of the\n  app. Fewer words, more icons, one action per control. Photos and short videos upload from the device\n  rather than asking for a URL.\n</p>\n<p>\n  Hiding things in the UI was not enough. Post and board IDs are sequential, so someone could simply ask\n  for a different one, and I found I was only filtering the list endpoint. Posts, stories, boards and Saved\n  counts are now filtered in the data layer, on every read and write helper, so a stranger who guesses an\n  ID still gets nothing back. There are tests to keep those checks in place.\n</p>\n<p>\n  Deployment had to move with all of that. Railway mounts a volume and the app reads <code>DATA_DIR</code>,\n  so the database and the uploads are still around after a redeploy. A weak <code>SECRET_KEY</code> refuses\n  to boot in production, TURN credentials only go to a signed-in session, and <code>/api/version</code>\n  reports the running build, which is how I check whether a deploy actually shipped.\n</p>\n<table>\n  <thead>\n    <tr>\n      <th>Area</th>\n      <th>Version 1</th>\n      <th>Version 2 (current)</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Getting in</td>\n      <td>A display name and a room name, no accounts</td>\n      <td>Register and login with bcrypt hashes, a signed session token and lockout after repeated failures</td>\n    </tr>\n    <tr>\n      <td>Shape of the app</td>\n      <td>One shared room per page</td>\n      <td>Home, Explore, Chat and You in one shell behind a single primary nav</td>\n    </tr>\n    <tr>\n      <td>Messaging</td>\n      <td>Messages broadcast to the room</td>\n      <td>Communities, channels, pins, DMs, typing, reactions, edit and unread counts</td>\n    </tr>\n    <tr>\n      <td>Social</td>\n      <td>None</td>\n      <td>Timeline with For you ranking, quotes and reposts, stories, follows, rooms with votes</td>\n    </tr>\n    <tr>\n      <td>Media</td>\n      <td>Text only</td>\n      <td>Device photo and short video uploads, a Clips feed, saved boards of pins</td>\n    </tr>\n    <tr>\n      <td>Profiles</td>\n      <td>A display name and nothing else</td>\n      <td>Avatar, status, posts, reposts, highlights and private Saved; other profiles get Follow and Message</td>\n    </tr>\n    <tr>\n      <td>Calls</td>\n      <td>None</td>\n      <td>Meet now presence with optional mic, camera and screen share over WebRTC</td>\n    </tr>\n    <tr>\n      <td>Privacy</td>\n      <td>Anything said in the room was public</td>\n      <td>Friend and visibility checks on every read and write helper, and Saved is owner only</td>\n    </tr>\n    <tr>\n      <td>Storage</td>\n      <td>In memory, gone on restart</td>\n      <td>SQLite on a mounted volume, with uploads on the same volume</td>\n    </tr>\n    <tr>\n      <td>Tests</td>\n      <td>Manual only</td>\n      <td>38 pytest tests: auth, sockets, feed and story privacy, Saved privacy, Wave helpers</td>\n    </tr>\n  </tbody>\n</table>\n<p>\n  One design note on the messaging side. Channel history loads once and pages with a cursor\n  (<code>before_id</code> / <code>has_more</code>), then new events append to what is already on screen,\n  so switching rooms does not replay the whole history. Unread counts and DM threads are stored in SQLite\n  and pushed over sockets.\n</p>",
        "mermaid": [
          "flowchart LR\n  UI[HTML CSS JS] -->|JSON HTTP| Flask\n  UI -->|Socket.IO| Sockets\n  Flask --> SQL[(SQLite)]\n  Sockets --> SQL\n  Sockets --> UI"
        ]
      },
      {
        "heading": "What I built",
        "html": "<ul>\n  <li>Home: Following and For you timeline, posting, quotes and reposts, trending tags</li>\n  <li>Explore: media wall, Clips for short video, rooms with votes, boards of saved pins</li>\n  <li>Chat: communities, channels, pins, DMs, typing, reactions, edit, stories, Ctrl+K quick switcher</li>\n  <li>You: avatar, status, posts, reposts, story highlights and private Saved boards</li>\n  <li>Other people's profiles: posts, reposts and status with Follow, Message and back, and never Saved</li>\n  <li>Meet now presence, then optional mic, camera and screen share over WebRTC, with TURN from env</li>\n  <li>Device photo and short video uploads for chat, posts, stories and Clips</li>\n  <li>Friend requests, block, report, sign out, and a dark and light theme</li>\n  <li>Login lockout, password rules, per connection write rate limits, CSP and security headers</li>\n  <li>Friends and visibility checks in the data layer before anything is read or written</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "How the code is laid out",
        "html": "<p>Routes stay in one place, the socket handlers are split by what they do, and the social queries live away from the core schema so the privacy checks are easy to find.</p>\n<pre class=\"folder-tree\">ChatWire/\n├── app.py                 # Flask routes (/api/auth/*, uploads, health, version, ICE)\n├── sockets/               # live chat, social, discover and wave events\n├── db.py                  # schema + core queries (DATA_DIR aware)\n├── db_ext.py              # social queries: feed ranking, boards, profiles, privacy\n├── state.py               # online presence (memory)\n├── throttle.py            # per connection rate limits\n├── validate.py            # payload checks\n├── static/                # UI (Home, Explore, Chat, You)\n├── seed.py                # optional sample data\n└── tests/                 # pytest</pre>",
        "mermaid": []
      },
      {
        "heading": "How long it took",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Phase</th>\n      <th>When</th>\n      <th>Work</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Rooms prototype (v1)</td>\n      <td>May 2026</td>\n      <td>Name and room join, messages broadcast to the room, join and leave notices</td>\n    </tr>\n    <tr>\n      <td>Accounts and communities</td>\n      <td>May 2026</td>\n      <td>Register and login, communities, channels, DMs, reactions, typing, stories</td>\n    </tr>\n    <tr>\n      <td>Calls and hardening</td>\n      <td>May 2026</td>\n      <td>Meet now, WebRTC media, lockout, rate limits, permission checks and pytest</td>\n    </tr>\n    <tr>\n      <td>v2 product shell</td>\n      <td>Sep 2026</td>\n      <td>Home, Explore, Chat and You, plus For you ranking, Clips, rooms, boards and profiles</td>\n    </tr>\n    <tr>\n      <td>v2 privacy and ops</td>\n      <td>Sep 2026</td>\n      <td>Saved made private, visibility checks in the data layer, DATA_DIR volume, secret and TURN gates</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Problems I hit, and what I did about them",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Challenge</th>\n      <th>Approach</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Filtering the feed list looked like privacy, but it only hid things from the list</td>\n      <td>I moved the same visibility check into every read and write helper, then pinned it with tests</td>\n    </tr>\n    <tr>\n      <td>Saved boards leaked anyway, through the counts on a profile and through guessable board ids</td>\n      <td>Counts read as zero for anyone else, and a board is checked for ownership before its pins come back</td>\n    </tr>\n    <tr>\n      <td>Reposts rendered as empty cards in the timeline</td>\n      <td>Every feed row now carries a stub of the quoted post, so a repost always shows what it quotes</td>\n    </tr>\n    <tr>\n      <td>Switching rooms reloaded the whole history each time</td>\n      <td>History loads once and new events append; older messages come in through cursor pagination</td>\n    </tr>\n    <tr>\n      <td>Railway wiped the database on every deploy</td>\n      <td>Mount a volume and read <code>DATA_DIR</code>, so SQLite and the uploads persist</td>\n    </tr>\n    <tr>\n      <td>Sockets could be spammed and the login form could be hammered</td>\n      <td>Per connection write rate limits, plus a short account lockout on login and on change password</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Testing",
        "html": "<p>From the ChatWire repo:</p>\n<pre class=\"checklist\">pip install -r requirements-dev.txt\npytest -q</pre>\n<p>38 tests cover auth hardening, socket flows, feed and story privacy, Saved and board privacy, and\nthe ranking helpers. The things I still check by hand:</p>\n<ul>\n  <li>Two browsers side by side: a channel message lands live in both</li>\n  <li>A stranger cannot read, like, comment on or view a friends only post or story</li>\n  <li>Another profile shows posts and reposts, but never Saved</li>\n  <li>A non admin cannot rename a community or a channel</li>\n  <li>Failed logins trigger the lockout, and change password goes through the same gate</li>\n  <li>Reconnecting with the session token works without retyping the password</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Running it, deploying it, and the screenshots",
        "html": "<p>\n  Locally it is a venv, <code>pip install -r requirements.txt</code>, <code>python app.py</code>, then\n  http://localhost:5001, with <code>python seed.py</code> if you want sample data. Getting it onto Railway\n  brought its own problems. The live demo mounts a volume at <code>/data</code> and runs with\n  <code>DATA_DIR=/data</code>, so accounts, posts and uploads are still there after a redeploy. A weak\n  <code>SECRET_KEY</code> stops the boot in production, and <code>/api/version</code> tells me which build\n  is actually live, which saved me guessing more than once. Demo login: <code>demo</code> /\n  <code>demo123456</code>, and it is an admin account so renaming works in a demo.\n</p>\n<p>\n  The first five screenshots below are the current v2 build: Home, Explore, Chat, You and the login card.\n  The last four are version 1, kept as a record of what the app looked like before the Home, Explore, Chat\n  and You rebuild.\n</p>",
        "mermaid": []
      }
    ]
  },
  {
    "slug": "emergency-call-queue",
    "title": "Emergency Call Queue",
    "date": "Year 2, 6G5Z0024 ADS, Assessed Exercise 1",
    "description": "Emergency Call Queue: ADS assessed exercise 1, a hand-written circular queue in C#.",
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
        "heading": "What the brief asked for, and the stack",
        "html": "<p>\n  Assessed Exercise 1 is a console simulation of an emergency dispatch desk. Calls arrive, they\n  sit in a queue, and they get handled in order. The constraint is what makes it interesting:\n  the built-in <code>Queue&lt;T&gt;</code> was banned, so I wrote the queue myself in C#. That\n  meant owning enqueue, dequeue, capacity and, by the last task, the wrap-around indices of a\n  circular buffer, instead of hiding behind a framework collection.\n</p>\n<table>\n  <thead>\n    <tr><th>Layer</th><th>Choice</th><th>Reason</th></tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Language</td>\n      <td>C# console app</td>\n      <td>A menu-driven dispatcher as a C# (.NET Framework) console app</td>\n    </tr>\n    <tr>\n      <td>Domain model</td>\n      <td><code>EmergencyCall</code></td>\n      <td>CallerName, EmergencyType and SeverityLevel (1 to 5), all validated</td>\n    </tr>\n    <tr>\n      <td>Structure</td>\n      <td>Custom <code>EmergencyQueue</code></td>\n      <td>No framework queue, so the storage and the indices are mine to manage</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Design",
        "html": "<p>\n  The linear queue ADT comes together in Task A: Enqueue, Dequeue, Peek, Count, IsFull and\n  IsEmpty, with a menu to log a call, dispatch the oldest one, and list everything still\n  waiting. Validation lives in the properties, so an illegal severity such as 6 or -1 is\n  rejected at the boundary and bad data never reaches the structure at all.\n</p>\n<pre class=\"folder-tree\">Dispatcher menu\n  -> EmergencyCall (validated fields, IComparable by severity)\n  -> EmergencyQueue\n       Enqueue / Dequeue / Peek / Count / IsEmpty / IsFull\n       PeekHighestSeverity (earliest wins on ties)\n       DequeueFirstKCalls\n       circular array buffer (front / rear / currentSize, wrap with %)</pre>\n<p>\n  PeekHighestSeverity reads across the waiting calls without dequeuing anything, and a tie goes\n  to whoever rang in first. <code>DequeueFirstKCalls</code> lifts the first k calls off the\n  front in one go. Storage then became a circular buffer, so the gap left at the front of the\n  array after a dequeue gets reused rather than quietly costing me capacity.\n</p>",
        "mermaid": []
      },
      {
        "heading": "Features I implemented",
        "html": "<ul>\n  <li>EmergencyCall with validated severity and typed emergency categories</li>\n  <li>Hand-written queue: enqueue, dequeue, peek, count, full / empty</li>\n  <li>Menu: add a call, dispatch the next one, list all waiting calls</li>\n  <li>PeekHighestSeverity, which leaves the order untouched</li>\n  <li>DequeueFirstKCalls for a bulk removal from the front</li>\n  <li>Circular buffer accounting across every queue operation</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Folder structure",
        "html": "<pre class=\"folder-tree\">ADS_Assess1/\n├── EmergencyCall.cs\n├── EmergencyQueue.cs\n├── Program.cs\n├── App.config\n└── Properties/AssemblyInfo.cs\nADS_Assess1.sln</pre>",
        "mermaid": []
      },
      {
        "heading": "How the work was phased",
        "html": "<table>\n  <thead>\n    <tr><th>Phase</th><th>Work</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Task A</td><td>Call model, core queue operations, menu, listing</td></tr>\n    <tr><td>Task B</td><td>Highest severity peek, bulk dequeue</td></tr>\n    <tr><td>Task C</td><td>Circular buffer migration, then re-checking the Task A and B behaviour</td></tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Problems I ran into and how I fixed them",
        "html": "<table>\n  <thead>\n    <tr><th>Challenge</th><th>Approach</th></tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>The framework Queue was off limits</td>\n      <td>Managed my own storage, head and tail (wrapping later), plus capacity checks</td>\n    </tr>\n    <tr>\n      <td>Peeking the worst call without breaking FIFO</td>\n      <td>Traverse logically, never dequeue mid-scan, and let the earliest arrival win a tie</td>\n    </tr>\n    <tr>\n      <td>Bulk dequeue leaving the queue half-modified</td>\n      <td>An auxiliary queue or array, so a partial failure cannot corrupt the primary structure</td>\n    </tr>\n    <tr>\n      <td>Wrap-around index bugs in the circular buffer</td>\n      <td>Stepped through the full, empty and wrap-around cases in the debugger</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Checks I ran",
        "html": "<ul>\n  <li>Enqueue then dequeue gives back FIFO order</li>\n  <li>A severity outside 1 to 5 is rejected</li>\n  <li>PeekHighestSeverity returns the earliest of the calls sharing the maximum severity</li>\n  <li>Dequeue k removes exactly k items when that many exist</li>\n  <li>After Task C: fill, empty and wrap around without a false IsFull or IsEmpty</li>\n  <li>The list view agrees with the internal count</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Running it, and links",
        "html": "<p>\n  Open <code>ADS_Assess1.sln</code> in Visual Studio (F5 / Ctrl+F5), or build it with\n  <code>msbuild ADS_Assess1.sln</code> and run\n  <code>ADS_Assess1\\bin\\Debug\\ADS_Assess1.exe</code>. There is nothing to deploy to the web here;\n  the ADT and the interactive menu are the artefact.\n</p>",
        "mermaid": []
      }
    ]
  },
  {
    "slug": "video-game-catalogue",
    "title": "Video Game Catalogue",
    "date": "Year 2, 6G5Z0024 ADS, Assessed Exercise 2",
    "description": "Video Game Catalogue: ADS assessed exercise 2 on trees, starting with a BST and ending with an AVL in C#.",
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
        "heading": "What the brief asked for, and the stack",
        "html": "<p>\n  The scenario for Assessed Exercise 2 is a retro gaming preservation catalogue: store games and\n  search them quickly using binary trees. Pre-built tree libraries were forbidden and tree\n  behaviour had to be recursive, which rules out the tidy iterative loops I would normally reach\n  for. Titles are unique, so the title doubles as the key. A console menu is the operator\n  surface for insert, walk, query, update, and later AVL insert and remove.\n</p>\n<table>\n  <thead>\n    <tr><th>Layer</th><th>Choice</th><th>Reason</th></tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Language</td>\n      <td>C# console</td>\n      <td>A C# (.NET Framework) console menu for comparing BST against AVL</td>\n    </tr>\n    <tr>\n      <td>Domain</td>\n      <td><code>VideoGame</code> (title, developer, year)</td>\n      <td>The unique title is the BST key</td>\n    </tr>\n    <tr>\n      <td>Structures</td>\n      <td>Node, BinTree, BSTree, then AVLTree</td>\n      <td>Work up from an ordered BST to a balanced AVL with rotations</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Design",
        "html": "<p>\n  Task A wires insert into a BSTree and surfaces InOrder, PreOrder and PostOrder from BinTree so\n  the operator picks the walk. Because the tree is keyed by title, finding the earliest game means\n  finding the alphabetically first title; height is recursive too. Task B adds a node count, update\n  by title, and a listing by year. Task C brings in an AVLTree that inherits from BSTree and\n  rebalances on insert using the four rotations. The menu flips between BST and AVL at runtime,\n  which is the part I found genuinely useful: the same catalogue, two heights, side by side.\n</p>\n<pre class=\"folder-tree\">Menu\n  -> VideoGame records (keyed by title)\n  -> BSTree: insert, walks, earliest title, height, count, update, by-year, remove\n  -> AVLTree (extends BSTree): insert with LL / LR / RL / RR rotations\n  -> runtime switch between BST and AVL modes</pre>",
        "mermaid": []
      },
      {
        "heading": "Features I implemented",
        "html": "<ul>\n  <li>Insert games with unique titles into a BST</li>\n  <li>In, pre and post order listings from the menu</li>\n  <li>Earliest game, meaning the alphabetically first title, and tree height</li>\n  <li>Node count, in-place update by title, and a filter by year</li>\n  <li>AVL insert with rotations whenever balance breaks</li>\n  <li>Remove and exists checks inherited from the BST layer</li>\n  <li>Switching between BST and AVL modes at runtime</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Folder structure",
        "html": "<pre class=\"folder-tree\">ADSPortEx2/\n├── Node.cs\n├── BinTree.cs\n├── BSTree.cs\n├── AVLTree.cs\n├── VideoGame.cs\n├── Program.cs\n├── App.config\n└── Properties/AssemblyInfo.cs\nADSPortEx2.sln</pre>",
        "mermaid": []
      },
      {
        "heading": "How the work was phased",
        "html": "<table>\n  <thead>\n    <tr><th>Phase</th><th>Work</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Task A</td><td>Game model, BST insert, walks, earliest title, height</td></tr>\n    <tr><td>Task B</td><td>Count, update, listing by year</td></tr>\n    <tr><td>Task C</td><td>AVL rotations on insert, plus the BST / AVL runtime switch</td></tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Problems I ran into and how I fixed them",
        "html": "<table>\n  <thead>\n    <tr><th>Challenge</th><th>Approach</th></tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Everything had to be recursive</td>\n      <td>No iterative shortcuts for walks, height or count; mirrored the lecture patterns instead</td>\n    </tr>\n    <tr>\n      <td>Update kept behaving like a second insert</td>\n      <td>Same left / right decisions, but on an equal title mutate the node rather than insert</td>\n    </tr>\n    <tr>\n      <td>A skewed BST degrading towards a linked list</td>\n      <td>Balance factor checks and the four rotation cases on insert</td>\n    </tr>\n    <tr>\n      <td>Showing the two structures actually differ</td>\n      <td>Switch BST / AVL at runtime and compare height on the same catalogue</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Checks I ran",
        "html": "<ul>\n  <li>Insert then InOrder lists the titles in sorted order</li>\n  <li>A duplicate title takes the update path instead of forking a second key</li>\n  <li>The earliest game is the alphabetically first title</li>\n  <li>Height and count stay consistent after inserts</li>\n  <li>The year filter returns only that year</li>\n  <li>An insert sequence that would skew a BST leaves the AVL shallow</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Running it, and links",
        "html": "<p>\n  Open <code>ADSPortEx2.sln</code> in Visual Studio (F5 / Ctrl+F5), or build it with\n  <code>msbuild ADSPortEx2.sln</code> and run\n  <code>ADSPortEx2\\bin\\Debug\\ADSPortEx2.exe</code>. The artefact is a pair of recursive ADTs with\n  menu coverage of BST versus AVL.\n</p>",
        "mermaid": []
      }
    ]
  },
  {
    "slug": "aid-optimiser",
    "title": "Aid Distribution Optimiser",
    "date": "Year 2, 6G5Z0024 ADS, Assessed Task 3",
    "description": "Aid Distribution Optimiser: ADS assessed task 3 covering complexity analysis, a generic QuickSort and a greedy drone loadout.",
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
        "heading": "What the brief asked for, and the stack",
        "html": "<p>\n  Three skills arrive together in Assessed Task 3, and the unit treats them as one package: argue\n  Big O on real methods, write a generic QuickSort, then point a greedy packer at a drone aid\n  problem. A drone carries at most 75 kg. Every item has a weight and a survival priority, and the\n  algorithm may only take whole items, ranked by priority per kilogram, until the next one would\n  break the cap.\n</p>\n<table>\n  <thead>\n    <tr><th>Layer</th><th>Choice</th><th>Reason</th></tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Analysis</td>\n      <td>Line by line Big O on Algorithm1 / Algorithm2</td>\n      <td>Task A marks want the full working and the notation, not a guessed label</td>\n    </tr>\n    <tr>\n      <td>Sort</td>\n      <td>Generic QuickSort over <code>IComparable</code></td>\n      <td>CompareTo instead of &lt; / == so ints and strings share one sorter</td>\n    </tr>\n    <tr>\n      <td>Domain</td>\n      <td><code>AidItem</code> + <code>PriorityRatio</code></td>\n      <td>Priority / Weight sets the greedy order</td>\n    </tr>\n    <tr>\n      <td>Selection</td>\n      <td><code>GreedyUtils</code> knapsack style picker</td>\n      <td>0/1 items with a hard 75 kg stop</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Design",
        "html": "<p>\n  Task A is where documentation counts as engineering: open ComplexityFunctions, cost each line,\n  and state the overall class. Task B lifts the provided QuickSort skeleton into a generic form and\n  demonstrates it from the menu on both integer and string arrays. Task C introduces AidItem, with\n  a name, a weight from 1 to 50, a priority from 1 to 10, and a read only PriorityRatio, and then\n  picks the highest ratio first. The brief lets me reuse the generic QuickSort to order the items\n  before packing, which is a nice payoff for having written the sort generically in the first place.\n</p>\n<pre class=\"folder-tree\">Program menu\n  -> Sort integers / strings   (generic QuickSort)\n  -> Add AidItem / list items\n  -> Run greedy packer\n       sort by PriorityRatio desc\n       take whole items while weight + next &lt;= 75\n       report loadout, total weight, total priority</pre>",
        "mermaid": []
      },
      {
        "heading": "Features I implemented",
        "html": "<ul>\n  <li>A written complexity analysis of the two required algorithms</li>\n  <li>Generic QuickSort through CompareTo, so any IComparable element type works</li>\n  <li>Menu demos over int and string arrays</li>\n  <li>AidItem with validated weight and priority ranges</li>\n  <li>A greedy loadout builder with the 75 kg ceiling and no fractional items</li>\n  <li>The chosen selection printed out with totals for weight and priority</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Folder structure",
        "html": "<pre class=\"folder-tree\">ADSPortEx3/\n├── ComplexityFunctions.cs\n├── SortUtils.cs\n├── GreedyUtils.cs\n├── AidItem.cs\n├── Program.cs\n├── App.config\n└── Properties/AssemblyInfo.cs\nADSPortEx3.sln</pre>",
        "mermaid": []
      },
      {
        "heading": "How the work was phased",
        "html": "<table>\n  <thead>\n    <tr><th>Phase</th><th>Work</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Task A</td><td>Complexity write up with the full working</td></tr>\n    <tr><td>Task B</td><td>Generic QuickSort plus menu demos</td></tr>\n    <tr><td>Task C</td><td>AidItem model, greedy packer, menu integration</td></tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Problems I ran into and how I fixed them",
        "html": "<table>\n  <thead>\n    <tr><th>Challenge</th><th>Approach</th></tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Comparing generic values without the usual operators</td>\n      <td>Every pivot decision goes through CompareTo</td>\n    </tr>\n    <tr>\n      <td>Greedy is not globally optimal</td>\n      <td>Kept the brief's ratio heuristic and documented the totals so the policy is visible to markers</td>\n    </tr>\n    <tr>\n      <td>Edge cases around the capacity limit</td>\n      <td>Stop as soon as the next whole item would exceed 75 kg, and never take a fraction</td>\n    </tr>\n    <tr>\n      <td>Losing analysis marks on presentation</td>\n      <td>Per line notation, matching the ExampleQuestion format in the template</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Checks I ran",
        "html": "<ul>\n  <li>QuickSort: unsorted ints and strings come back in non decreasing CompareTo order</li>\n  <li>AidItem rejects a weight or priority outside the ranges in the brief</li>\n  <li>PriorityRatio equals Priority / Weight for sample items</li>\n  <li>The greedy packer never exceeds 75 kg</li>\n  <li>Higher ratio items are taken first when both would fit</li>\n  <li>An empty list, and a single oversized item, give a sensible empty or skipped loadout</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Running it, and links",
        "html": "<p>\n  Open <code>ADSPortEx3.sln</code> in Visual Studio (F5 / Ctrl+F5), or build it with\n  <code>msbuild ADSPortEx3.sln</code> and run\n  <code>ADSPortEx3\\bin\\Debug\\ADSPortEx3.exe</code>. Nothing is deployed to a server. What there is\n  to look at is the analysis alongside working sort and greedy paths.\n</p>",
        "mermaid": []
      }
    ]
  },
  {
    "slug": "metro-routes",
    "title": "Metro Network Route Planner",
    "date": "Year 2, 6G5Z0024 ADS, Assessed Exercise 4",
    "description": "Metro Network Route Planner: ADS assessed exercise 4 on list based weighted graphs, traversal and a greedy route.",
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
        "heading": "What the brief asked for, and the stack",
        "html": "<p>\n  One rule shaped everything in Assessed Exercise 4: the graph had to be list based, and Dictionary\n  was not allowed. So there was no hash map shortcut, only adjacency lists I maintained myself. The\n  scenario is a city metro for a transport authority, where a station holds a name and a passenger\n  capacity, and the links between stations form the graph.\n</p>\n<table>\n  <thead>\n    <tr><th>Layer</th><th>Choice</th><th>Reason</th></tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Language</td>\n      <td>C# console</td>\n      <td>A C# (.NET Framework) console harness driving a sample metro network</td>\n    </tr>\n    <tr>\n      <td>Domain</td>\n      <td><code>Station</code></td>\n      <td>Name plus PassengerCapacity</td>\n    </tr>\n    <tr>\n      <td>Graph</td>\n      <td>List based <code>Graph</code> / <code>GraphNode</code></td>\n      <td>No Dictionary, so nodes, edges and counts are all explicit</td>\n    </tr>\n    <tr>\n      <td>Weights</td>\n      <td>Integer minutes on edges</td>\n      <td>Travel time feeds the metrics and the route walk</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Design",
        "html": "<p>\n  Task A builds the unweighted skeleton: add nodes, add edges, report <code>NumNodes</code> and\n  <code>NumEdges</code>. Task B attaches travel times through <code>AddWeightedEdge</code> and then\n  the network metrics on top of them: AverageOutbound, AverageTravelTime, and GetAllConnections for\n  a given station. Task C is the exploration layer, with BFS or DFS across the network and\n  FastestRoute, which starts at a station, always takes the unused outbound edge with the lowest\n  travel time, never revisits a station, and hands back the path it walked.\n</p>\n<pre class=\"folder-tree\">Program harness\n  -> Station records (name + passenger capacity)\n  -> Graph&lt;T&gt; adjacency lists (LinkedList of nodes)\n       AddNode / AddEdge / NumNodes / NumEdges\n       AddWeightedEdge (minutes)\n       AverageOutbound, AverageTravelTime, GetAllConnections\n       BFS / DFS\n       FastestRoute: greedy lowest weight next hop, no revisits</pre>\n<p>\n  FastestRoute is not a full Dijkstra search over every path, and I would not pretend otherwise. It\n  is the greedy walk the brief specifies: pick the locally cheapest unused edge at each step. That\n  distinction matters when I have to explain the algorithm in a viva or an interview.\n</p>",
        "mermaid": []
      },
      {
        "heading": "Features I implemented",
        "html": "<ul>\n  <li>Station model carrying a capacity</li>\n  <li>List based graph: add node, add edge, node and edge counts</li>\n  <li>Weighted edges measured in minutes</li>\n  <li>Average outbound degree and average travel time</li>\n  <li>Neighbour listing by station id</li>\n  <li>BFS or DFS traversal driven from the console harness</li>\n  <li>FastestRoute, a greedy path that never revisits a station</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Folder structure",
        "html": "<pre class=\"folder-tree\">ADSPortEx4/\n├── Graph.cs\n├── GraphNode.cs\n├── Station.cs\n├── Program.cs\n├── App.config\n├── packages.config\n└── Properties/AssemblyInfo.cs\nADSPortEx4.sln</pre>",
        "mermaid": []
      },
      {
        "heading": "How the work was phased",
        "html": "<table>\n  <thead>\n    <tr><th>Phase</th><th>Work</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Task A</td><td>Stations, list graph skeleton, counts, menu</td></tr>\n    <tr><td>Task B</td><td>Weights, averages, adjacency query</td></tr>\n    <tr><td>Task C</td><td>Traversal and FastestRoute</td></tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Problems I ran into and how I fixed them",
        "html": "<table>\n  <thead>\n    <tr><th>Challenge</th><th>Approach</th></tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Dictionary was not allowed</td>\n      <td>Held nodes and adjacency in lists, and looked stations up by id with explicit scans</td>\n    </tr>\n    <tr>\n      <td>Adding weights changed the model underneath me</td>\n      <td>Everything after Task B goes through the AddWeightedEdge path</td>\n    </tr>\n    <tr>\n      <td>FastestRoute is not the true shortest path</td>\n      <td>Implemented the brief's greedy rule and made no claim of global optimality</td>\n    </tr>\n    <tr>\n      <td>Routes looping back on themselves</td>\n      <td>Tracked visited stations while walking the route</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Checks I ran",
        "html": "<ul>\n  <li>NumNodes and NumEdges match a small network I built by hand</li>\n  <li>Weighted edges move AverageTravelTime the way I expect</li>\n  <li>GetAllConnections returns adjacent ids and nothing else</li>\n  <li>BFS and DFS visit each reachable node once on a simple connected graph</li>\n  <li>FastestRoute never repeats a station and prefers the locally lowest weight edge</li>\n  <li>Starting from a disconnected station gives a route that stops once no unused edges remain</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Running it, and links",
        "html": "<p>\n  Open <code>ADSPortEx4.sln</code> in Visual Studio (F5 / Ctrl+F5), or build it with\n  <code>msbuild ADSPortEx4.sln</code> and run\n  <code>ADSPortEx4\\bin\\Debug\\ADSPortEx4.exe</code>. There is no web host involved. The graph ADT and\n  the harness are the artefact.\n</p>",
        "mermaid": []
      }
    ]
  },
  {
    "slug": "whats-for-dinner",
    "title": "What's For Dinner",
    "date": "Year 2, 6G5Z0023 Thematic Project, group",
    "description": "What's For Dinner: a recipe finder built by a group for the Year 2 6G5Z0023 Thematic Project, covering architecture, delivery, testing and team practice.",
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
        "heading": "The brief, and what we built it with",
        "html": "<p>\n  What's For Dinner is a Year 2 Thematic Project (1CWK100) recipe finder. The brief handed us a\n  product with a real use case: help people cook with the ingredients already in the cupboard,\n  cut food waste, and browse meals by cuisine. As a team we went for a responsive website rather\n  than a store app, mainly because a browser MVP was something we could actually finish inside\n  the unit timeline.\n</p>\n<p>\n  My own contribution sat across delivery and code. Nobody had a formal job title, but I picked\n  up informal lead work: research, building pages, helping teammates who were stuck, and keeping\n  tasks moving on Teams and Trello when progress stalled. The MVP we had agreed on did ship:\n  ingredient input, recipe suggestions from a matching path, and browse by country or cuisine.\n  Saved favourites and full user accounts were pushed back to later work so the core path stayed\n  finishable.\n</p>\n<table>\n  <thead>\n    <tr>\n      <th>Layer</th>\n      <th>Choice</th>\n      <th>Reason</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Client</td>\n      <td>HTML, CSS, JavaScript</td>\n      <td>Multi page UI with shared navigation, responsive from phone to desktop</td>\n    </tr>\n    <tr>\n      <td>Server / data</td>\n      <td>Python backend serving recipe data</td>\n      <td>Keeps matching and recipe content out of hard coded page markup where possible</td>\n    </tr>\n    <tr>\n      <td>Collaboration</td>\n      <td>GitHub, Trello, Microsoft Teams</td>\n      <td>Parallel work, a visible task board, daily style check ins</td>\n    </tr>\n    <tr>\n      <td>Delivery style</td>\n      <td>Staged Agile (research, design, build, test)</td>\n      <td>Adapt when a feature overran, without restarting the whole plan</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Design and the route through the site",
        "html": "<p>\n  The path through the product is short on purpose. A visitor lands on home, then either searches\n  by ingredient or keyword, follows an inspiration route with dish of the day style prompts, or\n  browses by country. Shared CSS and navigation hold it together as one product instead of a set\n  of mismatched student pages.\n</p>\n\n<p>\n  Matching is the architectural centre. What the user types maps onto recipe records instead of a\n  static list being dumped in front of them. That kept the social goal of using what you already\n  have tied to the data model, not just to the copy on the page. We also treated the cuisine\n  content as something to check for accuracy and cultural care, not as filler text.\n</p>",
        "mermaid": [
          "flowchart TD\n  Home[Home] --> Search[Ingredient / keyword search]\n  Home --> Browse[Browse by cuisine]\n  Home --> Inspire[Inspiration / dish of the day]\n  Search --> Match[Recipe matching]\n  Browse --> Match\n  Inspire --> Match\n  Match --> Detail[Recipe view]\n  Detail --> Backend[Python recipe data]"
        ]
      },
      {
        "heading": "What made it into the MVP",
        "html": "<ul>\n  <li>Ingredient and keyword search that returns workable recipe suggestions</li>\n  <li>Browse by country or cuisine</li>\n  <li>An inspiration path for when the user has no fixed dish in mind</li>\n  <li>Responsive layout, tested at desktop and phone widths</li>\n  <li>Shared navigation and styling across every page</li>\n  <li>Python backed recipe data behind the matching path</li>\n  <li>Team process: a Trello board, Teams for blockers, GitHub for parallel commits</li>\n</ul>\n<p>\n  Two things were knowingly left out: saved favourites and accounts built to a production\n  standard. We wrote both down as future work so that GDPR and password storage would not hold up\n  shipping the core finder.\n</p>",
        "mermaid": []
      },
      {
        "heading": "Repository layout",
        "html": "<pre class=\"folder-tree\">WHATS-FOR-DINNER/\n├── index.html                 # entry / redirect into frontend pages\n├── frontend/\n│   └── pages/                 # home, recipes, cuisine views\n├── backend/                   # Python recipe data / server side logic\n├── .gitignore\n└── README / team docs</pre>",
        "mermaid": []
      },
      {
        "heading": "How the project ran",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Phase</th>\n      <th>Work</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Preferences and kickoff</td>\n      <td>Assigned the Recipe Finder brief; team formed; MVP goals written down</td>\n    </tr>\n    <tr>\n      <td>Research and design</td>\n      <td>Information architecture, the page list, and the cuisine and food waste framing</td>\n    </tr>\n    <tr>\n      <td>Build</td>\n      <td>Frontend pages, the matching path, backend recipe data, shared CSS</td>\n    </tr>\n    <tr>\n      <td>Integration pain</td>\n      <td>Merge conflicts from parallel edits; process tightened (Teams before a push, Trello ownership)</td>\n    </tr>\n    <tr>\n      <td>MVP freeze and demo</td>\n      <td>Core search and browse working; stretch features deferred; demonstration video recorded</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Problems we hit, and what we did about them",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Challenge</th>\n      <th>Approach</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Git merge conflicts breaking the layout</td>\n      <td>Talk on Teams before pushing; Trello ownership so two people were not editing the same file blind</td>\n    </tr>\n    <tr>\n      <td>Uneven effort across the group</td>\n      <td>Tasks redistributed; I chased updates and carried the gaps so the MVP still shipped (lesson: set expectations earlier next time)</td>\n    </tr>\n    <tr>\n      <td>Scope against the time we had</td>\n      <td>Cut favourites and accounts; protect search, browse and matching</td>\n    </tr>\n    <tr>\n      <td>Ethics and legality</td>\n      <td>Accurate cuisine content; a UI written with the Equality Act in mind (readable type, clear nav, responsive); GDPR noted for any future account data</td>\n    </tr>\n    <tr>\n      <td>Security for a later account feature</td>\n      <td>The MVP holds minimal personal data; password protection planned for a real account release rather than bolted on late</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Testing",
        "html": "<p>\n  Testing was manual, measured against the team MVP definition and the unit brief. We did not run\n  a separate automated suite in this module, so confidence came from browser checks and rehearsing\n  the demo.\n</p>\n<ul>\n  <li>Ingredient search returns relevant recipes, not empty results or random noise</li>\n  <li>Cuisine browse lists the dishes you would expect</li>\n  <li>Navigation is consistent on every page</li>\n  <li>Layout holds at phone width and desktop width</li>\n  <li>The demo path from home to a result completes with no dead links</li>\n  <li>After the merge fixes, the previously broken CSS no longer regressed the shared shell</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Running it, and where the code lives",
        "html": "<p>\n  What sits in the repo is static frontend pages plus a Python backend folder. Open the root\n  <code>index.html</code>, or serve the folder with a local static server, and start the backend\n  if live data is needed. Source and write up live on GitHub, and the demonstration video was\n  submitted through MMUTube for the unit.\n</p>",
        "mermaid": []
      }
    ]
  },
  {
    "slug": "vault-comics",
    "title": "Vault Comics",
    "date": "Year 1, 6G4Z0024 Web Development, individual",
    "description": "Vault Comics: an individual Year 1 6G4Z0024 Web Development project, a comic shop site with a catalogue, localStorage cart, checkout demo and PHP contact form.",
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
        "heading": "What the site does, and the stack behind it",
        "html": "<p>\n  Vault Comics is a site for a comic book shop. A shopper can browse the catalogue, drop titles\n  into a cart that survives a refresh, walk through a demo checkout, and send a message from the\n  contact page.\n</p>\n<table>\n  <thead>\n    <tr>\n      <th>Layer</th>\n      <th>Choice</th>\n      <th>Reason</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Pages</td>\n      <td>HTML5 (home, catalogue, basket, pay, success, about, contact)</td>\n      <td>A multi-page shop flow rather than one landing page</td>\n    </tr>\n    <tr>\n      <td>Presentation</td>\n      <td>CSS Grid and Flexbox in <code>css/style.css</code></td>\n      <td>Responsive catalogue and layout without a framework</td>\n    </tr>\n    <tr>\n      <td>Behaviour</td>\n      <td>JavaScript in <code>js/script.js</code></td>\n      <td>Cart, forms and the mobile nav</td>\n    </tr>\n    <tr>\n      <td>Persistence</td>\n      <td>browser <code>localStorage</code></td>\n      <td>Cart items stay put after the tab is closed</td>\n    </tr>\n    <tr>\n      <td>Contact</td>\n      <td>PHP handler plus EmailJS / mailto fallbacks</td>\n      <td>Hosting environments handle mail differently</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Design and page flow",
        "html": "<p>\n  This is a small multi-page shop. Home puts a few featured comics up front, the catalogue lists\n  the full set, and basket reads and writes the cart in <code>localStorage</code>. Pay and success\n  are a demo checkout path; I went nowhere near live card processing. About and Contact are full\n  pages of their own, and the contact form tries PHP first, then the other mail options if the\n  host will not send mail.\n</p>",
        "mermaid": [
          "flowchart LR\n  Home[index.html] --> Catalogue[comics.html]\n  Catalogue -->|add item| Basket[basket.html]\n  Basket --> Pay[pay.html]\n  Pay --> Success[success.html]\n  Home --> About[aboutus.html]\n  Home --> Contact[contactus.html]\n  Contact -->|PHP / EmailJS / mailto| Mail[email]\n  Basket <-->|localStorage| Store[(browser storage)]"
        ]
      },
      {
        "heading": "Features I built",
        "html": "<ul>\n  <li>Homepage with featured comics</li>\n  <li>A full catalogue page</li>\n  <li>A working shopping cart that persists across sessions via localStorage</li>\n  <li>Demo checkout and order confirmation pages</li>\n  <li>About and Contact pages</li>\n  <li>Contact form with a PHP handler, plus fallbacks for awkward hosts</li>\n  <li>Responsive layout for phone and desktop</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Files in the repo",
        "html": "<pre class=\"folder-tree\">VaultComics/\n├── index.html\n├── comics.html\n├── basket.html\n├── pay.html\n├── success.html\n├── aboutus.html\n├── contactus.html\n├── contact-form-handler.php\n├── css/style.css\n├── js/script.js\n└── image/                 # comic covers</pre>",
        "mermaid": []
      },
      {
        "heading": "How the build was phased",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Phase</th>\n      <th>Work</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Structure</td>\n      <td>Multi-page layout, shared nav, responsive shell</td>\n    </tr>\n    <tr>\n      <td>Catalogue</td>\n      <td>Product pages, images, Grid and Flexbox polish</td>\n    </tr>\n    <tr>\n      <td>Cart</td>\n      <td>Add, remove and persist with localStorage</td>\n    </tr>\n    <tr>\n      <td>Checkout and contact</td>\n      <td>Demo pay flow; PHP contact handler plus fallbacks</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Bugs I ran into, and the fixes",
        "html": "<table>\n  <thead>\n    <tr>\n      <th>Challenge</th>\n      <th>Approach</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Images would not load</td>\n      <td>Removed a duplicate CSS link that pointed at a missing file</td>\n    </tr>\n    <tr>\n      <td>Mobile hamburger menu misbehaving</td>\n      <td>Stopped two JS functions sharing the same name and fighting each other</td>\n    </tr>\n    <tr>\n      <td>Contact mail behaving differently per host</td>\n      <td>A PHP handler, an EmailJS option and a mailto fallback</td>\n    </tr>\n    <tr>\n      <td>Cart surviving a refresh</td>\n      <td>Serialise the cart state to localStorage on every change</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Testing",
        "html": "<ul>\n  <li>Add items, refresh, and confirm the basket still holds them</li>\n  <li>Remove items and clear the cart</li>\n  <li>Walk pay through to success without claiming a real payment went through</li>\n  <li>Resize to phone width and check the catalogue and nav stay usable</li>\n  <li>Submit the contact form and confirm at least one delivery path works on the host under test</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Running it locally, and links",
        "html": "<p>\n  It is a static site: open <code>index.html</code>, or serve the folder with\n  <code>python -m http.server 8000</code>. Contact mail needs PHP configured on the host,\n  otherwise EmailJS or mailto covers it. Source is on GitHub.\n</p>",
        "mermaid": []
      }
    ]
  },
  {
    "slug": "space-survival",
    "title": "Space Survival",
    "date": "Year 1, 6G4Z0020 Programming, Don't Crash!! coursework",
    "description": "Space Survival: a Processing arcade game for the Year 1 6G4Z0020 Programming Don't Crash!! coursework, with a centred ship, lives, scoring, levels and OOP entities in one sketch.",
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
        "heading": "The game, and what it runs on",
        "html": "<p>\n  Space Survival is a 2D arcade survival game written in Processing (Java). The ship never leaves\n  the centre of the screen; the arrow keys shove the whole obstacle field away from the middle\n  instead. Coloured shapes fly in from the edges: circles, squares and triangles.\n</p>\n<table>\n  <thead>\n    <tr><th>Layer</th><th>Choice</th><th>Reason</th></tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Runtime</td>\n      <td>Processing 3 / 4 (Java)</td>\n      <td>Required by the unit assessment</td>\n    </tr>\n    <tr>\n      <td>Layout</td>\n      <td>Single sketch <code>Space_Survival.pde</code></td>\n      <td>Every class and the draw loop live in one file</td>\n    </tr>\n    <tr>\n      <td>Entities</td>\n      <td><code>Player</code>, <code>Obstacle</code>, <code>ExplosionAnimation</code>, <code>Particle</code></td>\n      <td>Ship, hazards and hit effects</td>\n    </tr>\n    <tr>\n      <td>Collision</td>\n      <td>Circle distance via <code>dist()</code></td>\n      <td>Compare the ship and obstacle radii</td>\n    </tr>\n    <tr>\n      <td>Evidence</td>\n      <td><code>Development-report.pdf</code></td>\n      <td>Write-up of the design, features and testing</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Design and game states",
        "html": "<p>\n  A small state machine drives the sketch: MENU, PLAYING, GAMEOVER. In play, the obstacles sit in\n  an <code>ArrayList</code>, spawn on a timer, and are dropped once they leave the screen, which\n  scores a point. Every 20 points <code>updateDifficulty()</code> shortens the spawn interval and\n  speeds the motion up. A hit costs a life, shows an explosion burst, and starts a short\n  invulnerability shield so you are not hit again straight away.\n</p>\n<pre class=\"folder-tree\">draw() state machine\n  MENU     -> SPACE starts PLAYING\n  PLAYING  -> arrows shove field; spawn / move / collide; score + levels\n  GAMEOVER -> R restart, M menu\n\nArrayList&lt;Obstacle&gt; + ArrayList&lt;ExplosionAnimation&gt; / Particle\nPlayer.collision uses dist() vs obstacle radius</pre>",
        "mermaid": []
      },
      {
        "heading": "What the game does",
        "html": "<ul>\n  <li>Ship fixed at centre; arrow keys push the obstacle field</li>\n  <li>Five lives drawn as hearts, and a brief shield after a hit</li>\n  <li>A point for each obstacle that leaves the screen; a level up every 20 points</li>\n  <li>Obstacles as coloured circle / square / triangle shapes with level-scaled velocity</li>\n  <li>Explosion and particle effects on a hit, with a larger burst on game over</li>\n  <li>Starfield background, plus engine flicker and shield visuals on the ship</li>\n  <li>MENU / PLAYING / GAMEOVER states driven by SPACE, R and M</li>\n  <li>Development report PDF in the repo</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Files in the sketch folder",
        "html": "<pre class=\"folder-tree\">Space_Survival/\n├── Space_Survival.pde       # setup/draw + Player, Obstacle, Explosion, Particle\n└── Development-report.pdf</pre>",
        "mermaid": []
      },
      {
        "heading": "How the build progressed",
        "html": "<table>\n  <thead>\n    <tr><th>Phase</th><th>Work</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Core loop</td><td>Centred ship, relative motion, collision, obstacle list</td></tr>\n    <tr><td>Game feel</td><td>Lives, score, levels, shield, explosions</td></tr>\n    <tr><td>Polish</td><td>Menu and game over states, starfield, development report</td></tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Problems and fixes",
        "html": "<table>\n  <thead>\n    <tr><th>Challenge</th><th>Approach</th></tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Relative motion felt wrong at first</td>\n      <td>Lock the ship to centre and apply the opposite delta to every obstacle on a key press</td>\n    </tr>\n    <tr>\n      <td>Obstacle objects leaking</td>\n      <td>Remove them from the ArrayList once off screen or destroyed</td>\n    </tr>\n    <tr>\n      <td>Instant second hit after a collision</td>\n      <td>An invulnerability window with a visible shield</td>\n    </tr>\n    <tr>\n      <td>Difficulty staying flat</td>\n      <td><code>updateDifficulty()</code> raises the level and shortens the spawn interval as the score climbs</td>\n    </tr>\n  </tbody>\n</table>",
        "mermaid": []
      },
      {
        "heading": "Testing",
        "html": "<ul>\n  <li>Arrow keys move the field opposite to the press</li>\n  <li>A collision at the expected distance costs a life and shows the shield</li>\n  <li>Obstacles keep drifting with no key held, and removed ones leave the list</li>\n  <li>Score and level-up thresholds behave as designed</li>\n  <li>SPACE, R and M move correctly between menu, play and game over</li>\n</ul>",
        "mermaid": []
      },
      {
        "heading": "Running it, its limits, and links",
        "html": "<p>\n  Install Processing, open <code>Space_Survival.pde</code> (the folder name has to match) and run\n  it. There is no high-score file between runs, no sound, and the enemy types stay as coloured\n  shapes rather than sprites. Source and the development report are on GitHub as a\n  personal-profile re-upload.\n</p>",
        "mermaid": []
      }
    ]
  }
];
