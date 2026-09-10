import { Link } from "react-router-dom";
import { useFieldMode } from "../lib/field";
import { featured, coursework } from "../data/projects";
import { Reveal, SectionHead, Words, useTitle } from "../components/primitives";
import ProjectIndex from "../components/ProjectIndex";

export default function Work() {
  useTitle("Work | Panashe Sanyanga");
  useFieldMode({ density: 0.7, speed: 0.5, links: 0.9 });

  return (
    <>
      <section className="page-head" aria-labelledby="work-title">
        <div className="wrap">
          <span className="mono accent">01 / Work</span>
          <h1 id="work-title" className="display display-xl">
            <Words text="Systems" inView={false} delay={0.1} />
          </h1>
          <p className="lede">
            Five self directed builds, each opened up as a case study: the problem, the system, the architecture, the decisions
            and what came out. Coursework sits below as an archive.
          </p>
        </div>
      </section>

      <section className="section" aria-label="Featured projects">
        <div className="wrap">
          <ProjectIndex items={featured} expanded />
        </div>
      </section>

      <section className="section" id="coursework" aria-labelledby="cw-h">
        <div className="wrap">
          <SectionHead idx="02" label="Coursework archive" meta={`${coursework.length} modules`} />
          <Reveal>
            <h2 id="cw-h" className="display display-md sec-big">
              <Words text="University module work." />
            </h2>
            <p className="lede">Year 2 algorithms and data structures in C#, a Year 2 group web project, and two Year 1 builds.</p>
          </Reveal>
          <ol className="archive">
            {coursework.map((c, i) => (
              <Reveal as="li" key={c.slug} delay={i * 0.04}>
                <Link to={`/work/${c.slug}`} className="archive-row">
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="archive-title">{c.title}</span>
                  <span className="archive-module mono">{c.module}</span>
                  <ul className="tags archive-tags">
                    {c.tech.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <svg className="arrow" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3 13 13 3M6 3h7v7" />
                  </svg>
                </Link>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
