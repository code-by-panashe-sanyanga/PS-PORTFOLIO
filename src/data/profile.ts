// Real profile data. Sourced from the existing site copy and CV. Do not invent.

export const profile = {
  name: "Panashe Sanyanga",
  first: "Panashe",
  last: "Sanyanga",
  role: "Software Engineer",
  focus: "Backend / Systems / Fintech",
  tagline:
    "Computer Science student building backend systems, APIs, financial technology and data-driven applications.",
  location: "Manchester, UK",
  coords: "53.48° N · 2.24° W",
  availability: "Available from May 2027",
  graduation: "Graduating 2027",
  email: "panashe.sanyanga@hotmail.com",
  github: "https://github.com/code-by-panashe-sanyanga",
  githubHandle: "code-by-panashe-sanyanga",
  linkedin: "https://www.linkedin.com/in/panashe-l-s",
  linkedinHandle: "panashe-l-s",
  cvPage: "cv.html",
  cvPdf: "Panashe-Sanyanga-CV.pdf",
  siteRepo: "https://github.com/code-by-panashe-sanyanga/PS-PORTFOLIO",
};

export const intro = {
  // From the current homepage
  lead:
    "I build software to understand how systems work, solve technical problems and turn ideas into working applications. My projects cover backend development, APIs, databases, real time systems, data and AI assisted development, with a particular interest in financial technology and systems where reliability matters.",
  found:
    "This portfolio brings together the projects I’ve built, the technologies I’ve worked with and the engineering decisions behind them. I document not just what I built, but the problems I came across, how I approached them and what I learned along the way.",
  // From the CV profile
  cv: "Final year Computer Science student with hands on experience building backend systems that handle real constraints, including concurrent transactions, authentication and data integrity under load. My four self directed projects total over 35 automated tests and span database transaction safety, real time messaging and probabilistic simulation.",
};

export const education = [
  {
    title: "BSc (Hons) Computer Science",
    org: "Manchester Metropolitan University",
    period: "Sep 2023 – May 2027",
    note: "Final year. Graduating 2027.",
  },
  {
    title: "BTEC Level 3 Extended Diploma in Engineering (DDD)",
    org: "Milton Keynes College",
    period: "Sep 2013 – Jul 2015",
    note: "Mechanical and electrical engineering. Arduino and small hardware projects.",
  },
];

export interface ExperienceEntry {
  id: string;
  role: string;
  org: string;
  period: string;
  type: string;
  environment: string[];
  responsibilities: string[];
  technical: string[];
  skills: string[];
  primary?: boolean;
}

export const experience: ExperienceEntry[] = [
  {
    id: "mmu-it",
    role: "IT Advisor",
    org: "Manchester Metropolitan University",
    period: "Sep 2025 – Present",
    type: "Part time, alongside final year",
    environment: [
      "University service desk",
      "Windows PCs and Macs",
      "Microsoft 365, MFA, campus printing",
      "SCCM software deployment",
    ],
    responsibilities: [
      "Diagnose hardware, software, account and network issues for staff and students through the university service desk.",
      "Image and deploy Windows PCs and Macs; provide support for Microsoft 365, MFA and campus printing.",
      "Manage a busy ticket queue while communicating technical information clearly to people with different levels of technical knowledge.",
    ],
    technical: [
      "Service desk support",
      "PC imaging",
      "SCCM software deployment",
      "Hardware / software troubleshooting",
      "Accounts",
      "Networking",
      "Technical diagnosis",
      "User support",
    ],
    skills: [
      "Diagnosing problems under pressure",
      "Explaining solutions clearly to technical and non technical people",
      "Owning a ticket end to end",
    ],
    primary: true,
  },
  {
    id: "belstaff",
    role: "Sales Advisor",
    org: "Belstaff, Manchester",
    period: "Oct 2024 – Oct 2025",
    type: "Luxury retail",
    environment: ["Store floor", "Customer data"],
    responsibilities: [
      "Used SQL to query customer data and segment clients by purchase history for targeted outreach.",
      "Worked towards individual sales targets within a luxury retail environment.",
    ],
    technical: ["SQL", "Customer segmentation"],
    skills: ["Targets under scrutiny", "Clear communication"],
  },
  {
    id: "retail",
    role: "Retail Leadership",
    org: "Origin Kicks, Selfridges, UNIQLO, Anya Hindmarch, Ralph Lauren, Harding Brothers",
    period: "2017 – 2024",
    type: "Supervisory and loss prevention roles",
    environment: ["Luxury and high street retail", "Cruise ship deployment (Harding Brothers)"],
    responsibilities: [
      "Progressed through supervisory and loss prevention roles across luxury and high street retail, including leading a sales team on a cruise ship deployment (Harding Brothers) and reducing stock loss through new cross department processes (Selfridges).",
      "Consistently trained and developed junior staff while managing customer facing operations under pressure.",
    ],
    technical: ["Process design", "Loss prevention"],
    skills: ["Leading a team", "Taking ownership", "Working under pressure"],
  },
];

export const interests = [
  "Backend Engineering",
  "APIs",
  "Databases",
  "Financial Technology",
  "Financial Markets",
  "Algorithmic Trading",
  "High Performance Systems",
  "Motorsport / F1",
];

/** The journey from engineering into software. Wording follows the About page and CV. */
export const journey = [
  {
    id: "engineering",
    period: "2013 – 2015",
    title: "Extended Diploma in Engineering",
    org: "Milton Keynes College",
    body:
      "While studying for my Extended Diploma in Engineering at college, I was originally considering mechanical or electrical engineering.",
    tags: ["Mechanical", "Electrical", "BTEC DDD"],
  },
  {
    id: "hardware",
    period: "College",
    title: "Arduino and hardware",
    org: "The pull towards software",
    body:
      "The Arduino boards and small hardware projects on the course were what pulled me towards software: writing code that made something physical happen and seeing the result straight away.",
    tags: ["Arduino", "Embedded", "Immediate feedback"],
  },
  {
    id: "markets",
    period: "Alongside",
    title: "Financial markets and trading bots",
    org: "Rules into software",
    body:
      "I also became interested in financial markets and Forex trading bots. Building automated strategies meant turning ideas into rules, writing those rules into software, and seeing what happened when markets did not behave as expected.",
    tags: ["Forex", "Automation", "Strategy rules"],
  },
  {
    id: "degree",
    period: "2023 – 2027",
    title: "BSc (Hons) Computer Science",
    org: "Manchester Metropolitan University",
    body:
      "Year 2 algorithms and data structures in C#: custom queues, BST and AVL trees, sorting and greedy algorithms, graph search. Year 1 web and programming coursework.",
    tags: ["C#", "Algorithms", "Data structures"],
  },
  {
    id: "backend",
    period: "May – Sep 2026",
    title: "Backend systems",
    org: "ChatWire · NovaBank · PremierIQ · ApexIQ",
    body:
      "Real time messaging with auth and rate limits, then a banking API designed around correctness with a double-entry ledger, row locks and idempotency keys, then two data dashboards with FastAPI behind Next.js and keys kept server side.",
    tags: ["FastAPI", "PostgreSQL", "Socket.IO", "Next.js"],
  },
  {
    id: "it",
    period: "Sep 2025 – Present",
    title: "IT Advisor",
    org: "Manchester Metropolitan University",
    body:
      "Hands-on support work: service desk tickets, PC imaging, SCCM software deployment, and helping staff and students with hardware, software, accounts and network issues. A lot of those problems do not have a straightforward answer, so the job has taught me to diagnose problems under pressure and explain the solution clearly.",
    tags: ["Service desk", "SCCM", "Diagnosis"],
  },
  {
    id: "next",
    period: "2027",
    title: "Graduating",
    org: "Available from May 2027",
    body:
      "Looking for a software engineering graduate role in backend, systems or financial technology.",
    tags: ["Backend", "Systems", "Fintech"],
  },
];

export const howIWork = [
  "Outside college and university, if a laptop, phone or tablet stopped working, I would usually try to figure out what was wrong before replacing it. I still approach software in much the same way: if I don't understand something, I want to take it apart and work out why.",
  "That curiosity is probably what has kept me interested in software. I enjoy building things, but I'm just as interested in understanding what happens underneath — especially when something goes wrong.",
];
