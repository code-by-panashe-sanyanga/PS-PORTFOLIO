import { useState } from "react";
import { useReducedMotion } from "framer-motion";

interface Step {
  label: string;
  note: string;
  ref?: string;
}

interface Flow {
  id: string;
  title: string;
  steps: Step[];
}

/** Two request paths, described using decisions from the real projects. */
export const flows: Flow[] = [
  {
    id: "request",
    title: "A read request",
    steps: [
      { label: "Request", note: "The browser only ever talks to one origin. In ApexIQ and PremierIQ that is Next.js; the FastAPI process is never exposed." },
      { label: "API", note: "FastAPI validates the route and applies the guard rails: CORS allowlist, trusted hosts, a per-minute rate limit, OpenAPI off unless debug is on." },
      { label: "Service", note: "Composition happens here: throttle the upstream provider, join data sets on stable keys (driver acronym, not number), and never invent fields the feed does not publish." },
      { label: "Database / cache", note: "A TTL cache holds composed feeds so repeated UI polls do not hit a provider that allows ~10 to 30 requests a minute." },
      { label: "Response", note: "JSON with explicit empties. If a window has no GPS spread or Gemini has no key, the payload says so instead of filling the gap." },
    ],
  },
  {
    id: "money",
    title: "A money movement",
    steps: [
      { label: "Client", note: "Sends the transfer with a JWT in the header and an idempotency key, so a slow connection can retry safely." },
      { label: "Authentication", note: "bcrypt password on login, JWT with a role claim after. Every account and card route checks the caller owns the resource." },
      { label: "Business logic", note: "Only the ledger service posts money rows. Validation runs as its own pass over every leg before any row is created." },
      { label: "Database", note: "Lock the accounts involved, ordered by id (FOR UPDATE), so two crossing transfers cannot deadlock." },
      { label: "Transaction", note: "Insert the header, the balanced debit and credit entries and the balance cache update in one database transaction. Commit, or roll the whole unit back." },
    ],
  },
];

export default function Pipeline({ flow }: { flow: Flow }) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  return (
    <div className="pipeline">
      <div className="pipeline-head">
        <span className="mono accent">{flow.title}</span>
      </div>
      <ol className="pipeline-steps">
        {flow.steps.map((s, i) => (
          <li key={s.label} className={`pipeline-step${i === active ? " is-active" : ""}${i < active ? " is-done" : ""}`}>
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
            >
              <span className="mono">{String(i + 1).padStart(2, "0")}</span>
              <span className="pipeline-label">{s.label}</span>
            </button>
            {i < flow.steps.length - 1 && (
              <span className="pipeline-wire" aria-hidden="true">
                {!reduced && <span className="pipeline-pkt" />}
              </span>
            )}
          </li>
        ))}
      </ol>
      <div className="pipeline-note" aria-live="polite">
        <span className="mono">{flow.steps[active].label}</span>
        <p>{flow.steps[active].note}</p>
      </div>
    </div>
  );
}
