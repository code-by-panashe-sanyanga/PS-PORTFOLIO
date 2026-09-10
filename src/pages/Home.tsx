import { Link } from "react-router-dom";
import { motion, useTransform, useScroll, useReducedMotion } from "framer-motion";
import { usePointer } from "../lib/pointer";
import { useFieldMode } from "../lib/field";
import { profile, intro, education, interests } from "../data/profile";
import { featured } from "../data/projects";
import { Reveal, SectionHead, SysLink, Words, useTitle } from "../components/primitives";
import ProjectIndex from "../components/ProjectIndex";
import Pipeline, { flows } from "../components/Pipeline";
import SystemLog from "../components/SystemLog";
import ContactBlock from "../components/ContactBlock";

export default function Home({ introDone }: { introDone: boolean }) {
  useTitle("Panashe Sanyanga | Software Engineer");
  useFieldMode({ density: 1, speed: 0.7, links: 1 });
  const { nx, ny } = usePointer();
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();

  // Depth: type sits nearest the camera, labels further back.
  const tx = useTransform(nx, (v) => (reduced ? 0 : v * -14));
  const ty = useTransform(ny, (v) => (reduced ? 0 : v * -10));
  const lx = useTransform(nx, (v) => (reduced ? 0 : v * 10));
  const ly = useTransform(ny, (v) => (reduced ? 0 : v * 8));
  const heroFade = useTransform(scrollY, [0, 520], [1, 0]);
  const heroRise = useTransform(scrollY, [0, 520], [0, reduced ? 0 : -70]);

  const d = introDone ? 0 : 0.2;

  return (
    <>
      {/* 00 — Intro / hero */}
      <section className="hero" aria-label="Introduction">
        <motion.div className="hero-inner wrap" style={{ opacity: heroFade, y: heroRise }}>
          <motion.div className="hero-labels mono" style={{ x: lx, y: ly }}>
            <span>{profile.location}</span>
            <span>{profile.coords}</span>
            <span className="accent">{profile.focus}</span>
          </motion.div>

          <motion.h1 className="display display-xl hero-name" style={{ x: tx, y: ty }}>
            <span className="hero-line">
              <Words text={profile.first} inView={false} delay={d + 0.05} stagger={0} />
            </span>
            <span className="hero-line">
              <Words text={profile.last} inView={false} delay={d + 0.15} stagger={0} />
            </span>
          </motion.h1>

          <div className="hero-row">
            <motion.p
              className="hero-role display display-sm"
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: d + 0.45, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {profile.role}
            </motion.p>
            <motion.p
              className="hero-tagline"
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: d + 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {profile.tagline}
            </motion.p>
          </div>

          <motion.div
            className="hero-cta"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d + 0.75, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <SysLink to="/work" idx="01" variant="primary">
              View work
            </SysLink>
            <SysLink to="/about" idx="02">
              About me
            </SysLink>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-status wrap mono"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: d + 1.1, duration: 0.8 }}
        >
          <span>
            <span className="led" aria-hidden="true" /> {profile.availability}
          </span>
          <span>{featured.length} systems</span>
          <span>{profile.graduation}</span>
          <span className="hero-scroll">Scroll</span>
        </motion.div>
      </section>

      {/* 01 — Selected work */}
      <section className="section" id="work" aria-labelledby="work-h">
        <div className="wrap">
          <SectionHead idx="01" label="Selected work" meta={`${featured.length} systems`} />
          <Reveal>
            <h2 id="work-h" className="display display-lg sec-big">
              <Words text="Systems, not screenshots." />
            </h2>
            <p className="lede">
              Each project is a backend with real constraints: concurrent transfers, rate limited providers, live delivery, and
              feeds that must not be embellished. Open one to inspect it.
            </p>
          </Reveal>
          <ProjectIndex items={featured} />
          <Reveal className="sec-foot">
            <SysLink to="/work" idx="→">
              All work, including coursework
            </SysLink>
          </Reveal>
        </div>
      </section>

      {/* 02 — Engineering */}
      <section className="section" id="engineering" aria-labelledby="eng-h">
        <div className="wrap">
          <SectionHead idx="02" label="Engineering" meta="How I think" />
          <Reveal>
            <h2 id="eng-h" className="display display-lg sec-big">
              <Words text="The request is the unit of design." />
            </h2>
            <p className="lede">
              Two paths through the systems on this site. Move along the steps to see the decision made at each one and the
              project it came from.
            </p>
          </Reveal>
          <div className="pipelines">
            {flows.map((f, i) => (
              <Reveal key={f.id} delay={i * 0.1}>
                <Pipeline flow={f} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 03 — Experience */}
      <section className="section" id="experience" aria-labelledby="exp-h">
        <div className="wrap">
          <SectionHead idx="03" label="Experience" meta="System log" />
          <Reveal>
            <h2 id="exp-h" className="display display-lg sec-big">
              <Words text="Diagnosis under pressure." />
            </h2>
          </Reveal>
          <SystemLog compact />
          <Reveal className="sec-foot">
            <SysLink to="/experience" idx="→">
              Full log
            </SysLink>
          </Reveal>
        </div>
      </section>

      {/* 04 — About */}
      <section className="section" id="about" aria-labelledby="about-h">
        <div className="wrap about-teaser">
          <SectionHead idx="04" label="About" meta="Engineering journey" />
          <div className="about-teaser-grid">
            <Reveal>
              <h2 id="about-h" className="display display-lg sec-big">
                <Words text="From hardware to backend." />
              </h2>
              <p className="lede">{intro.lead}</p>
              <div className="sec-foot">
                <SysLink to="/about" idx="→">
                  The journey
                </SysLink>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <dl className="about-facts">
                {education.map((e) => (
                  <div key={e.title}>
                    <dt className="mono">{e.period}</dt>
                    <dd>
                      <strong>{e.title}</strong>
                      <span>{e.org}</span>
                    </dd>
                  </div>
                ))}
                <div>
                  <dt className="mono">Interests</dt>
                  <dd>
                    <ul className="tags">
                      {interests.map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 05 — Contact */}
      <section className="section section-contact" id="contact" aria-label="Contact">
        <div className="wrap">
          <SectionHead idx="05" label="Contact" meta="Final interaction" />
          <ContactBlock />
          <p className="mono home-more">
            <Link to="/contact">Contact page →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
