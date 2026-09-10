import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Project } from "../data/projects";
import SystemVisual from "./SystemVisual";
import { useField } from "../lib/field";
import { SysLink } from "./primitives";

interface Props {
  items: Project[];
  /** Work page: every row open. Home: rows open on hover / tap. */
  expanded?: boolean;
  /** Home: open one system by default so proof is visible without a hover. */
  defaultOpen?: string;
}

/**
 * The project index. Each row is a system: number, name, one line, year.
 * Opening a row reveals the description, stack, a live system visual and the
 * link into the case study. The background field pulses on hover.
 */
export default function ProjectIndex({ items, expanded = false, defaultOpen }: Props) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);
  const { pulse } = useField();
  const reduced = useReducedMotion();
  const fine = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

  return (
    <ol className={`pindex${expanded ? " is-expanded" : ""}`}>
      {items.map((p, i) => {
        const isOpen = expanded || open === p.slug;
        return (
          <motion.li
            key={p.slug}
            className={`pindex-row${isOpen ? " is-open" : ""}`}
            initial={reduced ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}
            onMouseEnter={() => {
              if (!expanded && fine) setOpen(p.slug);
              pulse();
            }}
            onMouseLeave={() => {
              if (!expanded && fine) setOpen(defaultOpen ?? null);
            }}
          >
            <div className="pindex-head">
              {expanded ? (
                <Link to={`/work/${p.slug}`} className="pindex-title">
                  <span className="mono accent">{p.index}</span>
                  <span className="display display-md">{p.name}</span>
                  <span className="pindex-sub">{p.title}</span>
                </Link>
              ) : (
                <button
                  type="button"
                  className="pindex-title"
                  aria-expanded={isOpen}
                  aria-controls={`pindex-${p.slug}`}
                  onClick={() => setOpen(isOpen ? null : p.slug)}
                  onFocus={() => setOpen(p.slug)}
                >
                  <span className="mono accent">{p.index}</span>
                  <span className="display display-md">{p.name}</span>
                  <span className="pindex-sub">{p.title}</span>
                </button>
              )}
              <div className="pindex-meta mono">
                <span>{p.year}</span>
                <span className="pindex-role">{p.role}</span>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`pindex-${p.slug}`}
                  className="pindex-body"
                  initial={expanded || reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduced ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="pindex-grid">
                    <div className="pindex-copy">
                      <p className="body">{p.description}</p>
                      <ul className="tags">
                        {p.tech.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                      <div className="pindex-links">
                        <SysLink to={`/work/${p.slug}`} idx="→">
                          View project
                        </SysLink>
                        <a className="mono pindex-ext" href={p.github} target="_blank" rel="noopener noreferrer">
                          View the implementation
                        </a>
                        {p.live && (
                          <a className="mono pindex-ext" href={p.live} target="_blank" rel="noopener noreferrer">
                            Live demo
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="pindex-vis">
                      <SystemVisual motif={p.motif} signals={p.signals} active={isOpen} />
                      <Link to={`/work/${p.slug}`} className="pindex-shot" tabIndex={-1} aria-hidden="true">
                        <img src={`${import.meta.env.BASE_URL}images/${p.image}`} alt="" loading="lazy" decoding="async" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </ol>
  );
}
