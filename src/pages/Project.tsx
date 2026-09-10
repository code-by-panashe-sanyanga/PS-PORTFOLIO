import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useFieldMode } from "../lib/field";
import { usePointer } from "../lib/pointer";
import { findCoursework, findProject, featured, type Project as ProjectT } from "../data/projects";
import type { Writeup } from "../data/writeups.generated";
import { Html, Reveal, SysLink, Words, useTitle } from "../components/primitives";
import SystemVisual from "../components/SystemVisual";
import ArchitectureFlow from "../components/ArchitectureFlow";

interface Section {
  id: string;
  label: string;
  node: React.ReactNode;
}

const sec = (w: Writeup | undefined, i: number) => w?.sections[i]?.html ?? "";

function useSectionTracker(ids: string[]) {
  const [current, setCurrent] = useState(ids[0]);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.28;
      let cur = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) cur = id;
      }
      setCurrent(cur);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ids]);
  return current;
}

export default function Project() {
  const { slug = "" } = useParams();
  const project = findProject(slug);
  const cw = findCoursework(slug);
  if (!project && !cw) return <Navigate to="/work" replace />;
  return project ? <FeaturedCase p={project} /> : <CourseworkCase slug={slug} />;
}

function Hero({
  index,
  name,
  title,
  meta,
  tech,
  github,
  live,
  visual,
  image,
  imageAlt,
}: {
  index: string;
  name: string;
  title: string;
  meta: string[];
  tech: string[];
  github: string;
  live?: string;
  visual?: React.ReactNode;
  image?: string;
  imageAlt?: string;
}) {
  const { nx, ny } = usePointer();
  const reduced = useReducedMotion();
  const rx = useTransform(ny, (v) => (reduced ? 0 : v * -3));
  const ry = useTransform(nx, (v) => (reduced ? 0 : v * 5));
  const { scrollY } = useScroll();
  const shotY = useTransform(scrollY, [0, 600], [0, reduced ? 0 : -60]);

  return (
    <section className="case-hero" aria-label="Project">
      <div className="wrap case-hero-grid">
        <div className="case-hero-copy">
          <p className="case-back mono">
            <Link to="/work">← Work</Link>
            <span className="accent">{index}</span>
          </p>
          <h1 className="display display-xl">
            <Words text={name} inView={false} delay={0.08} stagger={0.08} />
          </h1>
          <p className="case-title">{title}</p>
          <ul className="case-meta mono">
            {meta.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
          <ul className="tags case-tags">
            {tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <div className="case-links">
            {live && (
              <SysLink href={live} idx="01" variant="primary">
                Live demo
              </SysLink>
            )}
            <SysLink href={github} idx={live ? "02" : "01"}>
              GitHub
            </SysLink>
          </div>
        </div>
        <motion.div className="case-hero-media" style={{ rotateX: rx, rotateY: ry, y: shotY }}>
          {visual}
          {image && (
            <figure className="case-shot">
              <img src={`${import.meta.env.BASE_URL}images/${image}`} alt={imageAlt ?? ""} loading="eager" decoding="async" />
            </figure>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function CaseBody({ sections }: { sections: Section[] }) {
  const ids = useMemo(() => sections.map((s) => s.id), [sections]);
  const current = useSectionTracker(ids);
  return (
    <div className="wrap case-body">
      <nav className="case-index" aria-label="Sections">
        <ol>
          {sections.map((s, i) => (
            <li key={s.id} className={current === s.id ? "is-current" : ""}>
              <a href={`#${s.id}`}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                <span>{s.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="case-sections">
        {sections.map((s, i) => (
          <Reveal as="section" key={s.id} className="case-section">
            <h2 id={s.id} className="case-h">
              <span className="mono accent">{String(i + 1).padStart(2, "0")}</span>
              <span className="display display-sm">{s.label}</span>
            </h2>
            <div className="case-content">{s.node}</div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function NextProject({ slug }: { slug: string }) {
  const i = featured.findIndex((p) => p.slug === slug);
  const next = featured[(i + 1) % featured.length];
  if (i < 0) return null;
  return (
    <Reveal className="wrap case-next">
      <span className="mono">Next system</span>
      <Link to={`/work/${next.slug}`} className="case-next-link">
        <span className="mono accent">{next.index}</span>
        <span className="display display-lg">{next.name}</span>
        <span className="case-next-title">{next.title}</span>
      </Link>
    </Reveal>
  );
}

function FeaturedCase({ p }: { p: ProjectT }) {
  useTitle(`${p.name} | Panashe Sanyanga`);
  useFieldMode({ density: 0.55, speed: 0.4, links: 0.8 });
  const w = p.writeup;

  const sections: Section[] = [
    {
      id: "overview",
      label: "Overview",
      node: w ? <Html html={firstParagraph(sec(w, 0))} /> : <p className="prose">{p.description}</p>,
    },
    { id: "problem", label: "The problem", node: <p className="prose case-problem">{p.problem}</p> },
    { id: "system", label: "The system", node: w ? <Html html={sec(w, 1)} /> : <p className="prose">{p.description}</p> },
    { id: "architecture", label: "Architecture", node: <ArchitectureFlow nodes={p.arch.nodes} edges={p.arch.edges} /> },
    {
      id: "technology",
      label: "Technology",
      node: w ? (
        <Html html={tableOnly(sec(w, 0))} />
      ) : (
        <ul className="tags">
          {p.tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      ),
    },
    {
      id: "decisions",
      label: "Engineering decisions",
      node: (
        <ol className="decisions">
          {p.decisions.map((d, i) => (
            <li key={i}>
              <span className="mono accent">{String(i + 1).padStart(2, "0")}</span>
              <span>{d}</span>
            </li>
          ))}
        </ol>
      ),
    },
    ...(w ? [{ id: "challenges", label: "Challenges", node: <Html html={sec(w, 5)} /> }] : []),
    ...(w
      ? [
          {
            id: "built",
            label: "What I built",
            node: (
              <>
                <Html html={sec(w, 2)} />
                <details className="case-more">
                  <summary className="mono">Folder structure and timescale</summary>
                  <Html html={sec(w, 3)} />
                  <Html html={sec(w, 4)} />
                </details>
              </>
            ),
          },
          {
            id: "result",
            label: "Result",
            node: (
              <>
                <Html html={sec(w, 6)} />
                <Html html={sec(w, 7)} />
                {w.images.length > 0 && (
                  <ul className="case-gallery">
                    {w.images.map((im) => (
                      <li key={im.src}>
                        <img src={`${import.meta.env.BASE_URL}images/${im.src}`} alt={im.alt} loading="lazy" decoding="async" />
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ),
          },
        ]
      : [
          {
            id: "built",
            label: "What I built",
            node: (
              <div className="prose">
                <p>
                  A static portfolio: hub pages, a project write-up per system, a CV page, a screenshot lightbox with keyboard
                  and screen reader support, and a Puppeteer smoke test suite. Rebuilt in 2026 as a React and Vite application
                  with the write-ups preserved verbatim as data.
                </p>
              </div>
            ),
          },
          {
            id: "result",
            label: "Result",
            node: (
              <div className="prose">
                <p>
                  One link that shows a screenshot, explains a specific design decision and links straight to a live demo, for
                  every project. Keyboard, screen reader and reduced motion paths are tested rather than assumed.
                </p>
              </div>
            ),
          },
        ]),
    {
      id: "links",
      label: "GitHub / Live demo",
      node: (
        <div className="case-links">
          {p.live && (
            <SysLink href={p.live} idx="01" variant="primary">
              Live demo
            </SysLink>
          )}
          <SysLink href={p.github} idx={p.live ? "02" : "01"}>
            GitHub
          </SysLink>
        </div>
      ),
    },
  ];

  return (
    <>
      <Hero
        index={p.index}
        name={p.name}
        title={p.title}
        meta={[p.year, p.role]}
        tech={p.tech}
        github={p.github}
        live={p.live}
        visual={<SystemVisual motif={p.motif} signals={p.signals} />}
        image={p.image}
        imageAlt={p.imageAlt}
      />
      <CaseBody sections={sections} />
      <NextProject slug={p.slug} />
    </>
  );
}

const cwLabels = ["Overview", "The system", "What I built", "Structure", "Timescale", "Challenges", "Testing", "Deployment"];

function CourseworkCase({ slug }: { slug: string }) {
  const c = findCoursework(slug)!;
  useTitle(`${c.title} | Panashe Sanyanga`);
  useFieldMode({ density: 0.5, speed: 0.35, links: 0.8 });
  const w = c.writeup;
  const sections: Section[] = [
    ...w.sections.map((s, i) => ({ id: `s${i}`, label: cwLabels[i] ?? s.heading, node: <Html html={s.html} /> })),
    {
      id: "links",
      label: "GitHub",
      node: (
        <div className="case-links">
          <SysLink href={c.github} idx="01">
            GitHub
          </SysLink>
        </div>
      ),
    },
  ];
  return (
    <>
      <Hero
        index="CW"
        name={c.title}
        title={c.module}
        meta={["Coursework", "Manchester Metropolitan University"]}
        tech={c.tech}
        github={c.github}
        visual={<SystemVisual motif="algorithm" signals={c.tech} />}
        image={w.images[0]?.src}
        imageAlt={w.images[0]?.alt}
      />
      <CaseBody sections={sections} />
      <Reveal className="wrap case-next">
        <span className="mono">Back to</span>
        <Link to="/work#coursework" className="case-next-link">
          <span className="display display-lg">Coursework archive</span>
        </Link>
      </Reveal>
    </>
  );
}

/* helpers to split the verbatim "Purpose and tech stack" section */
function firstParagraph(html: string) {
  const m = html.match(/<p>[\s\S]*?<\/p>/);
  return m ? m[0] : html;
}
function tableOnly(html: string) {
  const m = html.match(/<table>[\s\S]*?<\/table>/);
  return m ? m[0] : "";
}
