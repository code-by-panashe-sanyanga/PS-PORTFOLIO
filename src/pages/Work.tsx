import { Link } from "react-router-dom";
import { useFieldMode } from "../lib/field";
import { builds, coursework } from "../data/projects";
import { Reveal, SectionHead, useTitle } from "../components/primitives";
import ProjectIndex from "../components/ProjectIndex";

export default function Work() {
  useTitle("Work | Panashe Sanyanga");
  useFieldMode({ density: 0.45, speed: 0.35, links: 0.65, calm: true });

  return (
    <>
      <section className="page-head" aria-labelledby="work-title">
        <div className="wrap">
          <span className="mono accent">01 Work</span>
          <h1 id="work-title" className="display display-xl">
            Work
          </h1>
          <p className="lede">Live demos and case studies.</p>
        </div>
      </section>

      <section className="section section-tight" aria-label="Projects">
        <div className="wrap">
          <ProjectIndex items={builds} expanded />
        </div>
      </section>

      <section className="section archive-section" id="coursework" aria-labelledby="cw-h">
        <div className="wrap">
          <SectionHead idx="02" label="Archive" meta={`${coursework.length}`} />
          <Reveal>
            <h2 id="cw-h" className="sr-only">
              Archive
            </h2>
            <p className="lede archive-lede">Earlier algorithms and web builds.</p>
          </Reveal>
          <ol className="archive">
            {coursework.map((c, i) => (
              <Reveal as="li" key={c.slug} delay={i * 0.03}>
                <Link to={`/work/${c.slug}`} className="archive-row">
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="archive-title">{c.title}</span>
                  <span className="archive-module mono">{c.module}</span>
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
