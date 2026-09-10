import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { skillGroups, type Skill } from "../data/skills";
import { projects, coursework } from "../data/projects";

/**
 * Technical map. Groups on the left as columns of nodes; a rail of projects on
 * the right. Hovering / focusing a technology draws its links to the systems
 * where it was actually used and explains how.
 */
export default function SkillMap() {
  const [active, setActive] = useState<Skill | null>(skillGroups[0].items[0]);
  const rail = useMemo(
    () => [
      ...projects.map((p) => ({ slug: p.slug, name: p.name, to: `/work/${p.slug}` })),
      ...coursework.map((c) => ({ slug: c.slug, name: c.title, to: `/work/${c.slug}` })),
    ],
    []
  );
  const refs = new Set(active?.refs ?? []);

  return (
    <div className="skillmap">
      <div className="skillmap-groups">
        {skillGroups.map((g) => (
          <div className="skillmap-group" key={g.id}>
            <span className="mono">{g.label}</span>
            <ul>
              {g.items.map((s) => {
                const on = active?.name === s.name;
                return (
                  <li key={s.name}>
                    <button
                      type="button"
                      className={`skill-node${on ? " is-on" : ""}`}
                      onMouseEnter={() => setActive(s)}
                      onFocus={() => setActive(s)}
                      onClick={() => setActive(s)}
                      aria-pressed={on}
                    >
                      <span className="dot" aria-hidden="true" />
                      {s.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="skillmap-detail" aria-live="polite">
        {active && (
          <>
            <span className="mono accent">{active.name}</span>
            <ul className="skillmap-uses">
              {active.use.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
            <span className="mono">Used in</span>
            <ul className="skillmap-rail">
              {rail.map((r) => {
                const hit = refs.has(r.slug);
                return (
                  <li key={r.slug} className={hit ? "is-hit" : ""}>
                    {hit ? <Link to={r.to}>{r.name}</Link> : <span>{r.name}</span>}
                  </li>
                );
              })}
            </ul>
            {refs.size === 0 && <p className="skillmap-none">No project on this site uses it yet; listed as working knowledge.</p>}
          </>
        )}
      </div>
    </div>
  );
}
