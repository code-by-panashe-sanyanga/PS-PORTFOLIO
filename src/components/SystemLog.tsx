import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { experience, type ExperienceEntry } from "../data/profile";
import { Reveal } from "./primitives";

function Record({ e, open, onToggle }: { e: ExperienceEntry; open: boolean; onToggle: () => void }) {
  const reduced = useReducedMotion();
  const current = /Present/.test(e.period);
  return (
    <Reveal as="article" className={`log-record${open ? " is-open" : ""}`}>
      <button type="button" className="log-head" aria-expanded={open} onClick={onToggle}>
        <span className="mono log-sys">
          <span className={`log-led${current ? " is-live" : ""}`} aria-hidden="true" />
          {current ? "ACTIVE" : "ARCHIVED"}
        </span>
        <span className="log-role display display-sm">{e.role}</span>
        <span className="log-org">{e.org}</span>
        <span className="mono log-period">{e.period}</span>
        <span className="mono log-toggle" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="log-body"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <dl className="log-grid">
              <div>
                <dt className="mono">Role</dt>
                <dd>
                  {e.role} · {e.type}
                </dd>
              </div>
              <div>
                <dt className="mono">Environment</dt>
                <dd>
                  <ul>
                    {e.environment.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div className="log-wide">
                <dt className="mono">Responsibilities</dt>
                <dd>
                  <ul>
                    {e.responsibilities.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="mono">Technical experience</dt>
                <dd>
                  <ul className="tags">
                    {e.technical.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="mono">Skills developed</dt>
                <dd>
                  <ul>
                    {e.skills.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </motion.div>
        )}
      </AnimatePresence>
    </Reveal>
  );
}

export default function SystemLog({ compact = false }: { compact?: boolean }) {
  const items = compact ? experience.filter((e) => e.primary) : experience;
  const [open, setOpen] = useState<string>(items[0].id);
  return (
    <div className="log">
      {items.map((e) => (
        <Record key={e.id} e={e} open={open === e.id} onToggle={() => setOpen(open === e.id ? "" : e.id)} />
      ))}
    </div>
  );
}
