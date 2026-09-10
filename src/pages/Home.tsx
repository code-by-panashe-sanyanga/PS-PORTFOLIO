import { motion, useTransform, useScroll, useReducedMotion } from "framer-motion";
import { usePointer } from "../lib/pointer";
import { useFieldMode } from "../lib/field";
import { profile, intro } from "../data/profile";
import { featured } from "../data/projects";
import { Reveal, SectionHead, SysLink, useTitle } from "../components/primitives";
import ProjectIndex from "../components/ProjectIndex";
import ContactBlock from "../components/ContactBlock";

export default function Home({ introDone }: { introDone: boolean }) {
  useTitle("Panashe Sanyanga | Software Engineer");
  useFieldMode({ density: 0.35, speed: 0.25, links: 0.45, calm: true });
  const { nx, ny } = usePointer();
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();

  const tx = useTransform(nx, (v) => (reduced ? 0 : v * -8));
  const ty = useTransform(ny, (v) => (reduced ? 0 : v * -5));
  const heroFade = useTransform(scrollY, [0, 280], [1, 0.35]);
  const heroRise = useTransform(scrollY, [0, 280], [0, reduced ? 0 : -24]);

  const d = introDone ? 0 : 0.05;

  return (
    <>
      <section className="hero hero-compact" aria-label="Introduction">
        <motion.div className="hero-inner wrap" style={{ opacity: heroFade, y: heroRise }}>
          <motion.p
            className="hero-meta mono"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: d, duration: 0.5 }}
          >
            {profile.role}
          </motion.p>

          <motion.h1
            className="display display-xl hero-name"
            style={{ x: tx, y: ty }}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d + 0.04, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="hero-line">{profile.first}</span>
            <span className="hero-line">{profile.last}</span>
          </motion.h1>

          <motion.p
            className="hero-tagline"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d + 0.18, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            className="hero-cta"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: d + 0.28, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <SysLink to="/work" idx="01" variant="primary">
              View work
            </SysLink>
            <SysLink href={`${import.meta.env.BASE_URL}${profile.cvPdf}`} idx="02">
              Download CV
            </SysLink>
          </motion.div>
        </motion.div>
      </section>

      <section className="section section-tight" id="work" aria-labelledby="work-h">
        <div className="wrap">
          <Reveal>
            <h2 id="work-h" className="display display-lg sec-big">
              Selected work
            </h2>
            <p className="lede">{intro.lead}</p>
          </Reveal>
          <ProjectIndex items={featured} defaultOpen={featured[0]?.slug} />
          <Reveal className="sec-foot">
            <SysLink to="/work" idx="→">
              All projects
            </SysLink>
            <SysLink to="/about" idx="→">
              About and skills
            </SysLink>
          </Reveal>
        </div>
      </section>

      <section className="section section-contact" id="contact" aria-label="Contact">
        <div className="wrap">
          <SectionHead idx="03" label="Contact" />
          <ContactBlock />
        </div>
      </section>
    </>
  );
}
