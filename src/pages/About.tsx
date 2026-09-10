import { useFieldMode } from "../lib/field";
import { profile, intro } from "../data/profile";
import { Reveal, SectionHead, SysLink, useTitle } from "../components/primitives";
import SkillMap from "../components/SkillMap";

export default function About() {
  useTitle("About | Panashe Sanyanga");
  useFieldMode({ density: 0.4, speed: 0.3, links: 0.7, calm: true });

  return (
    <>
      <section className="page-head" aria-labelledby="about-title">
        <div className="wrap">
          <span className="mono accent">02 About</span>
          <h1 id="about-title" className="display display-xl">
            <span className="hero-line">About</span>
            <span className="hero-line about-name">{profile.name}</span>
          </h1>
          <p className="lede">{intro.who}</p>
          <p className="lede" style={{ marginTop: "1rem" }}>
            {intro.what}
          </p>
        </div>
      </section>

      <section className="section" id="skills" aria-labelledby="skills-h">
        <div className="wrap">
          <SectionHead idx="01" label="Skills" meta="Used on the projects" />
          <Reveal>
            <h2 id="skills-h" className="sr-only">
              Skills
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <SkillMap />
          </Reveal>
        </div>
      </section>

      <section className="section" aria-label="CV">
        <div className="wrap about-cv">
          <Reveal>
            <span className="mono">CV</span>
            <p className="lede">Experience, education and contact details.</p>
          </Reveal>
          <Reveal className="case-links" delay={0.1}>
            <SysLink href={`${import.meta.env.BASE_URL}${profile.cvPage}`} idx="01" variant="primary">
              View CV
            </SysLink>
            <SysLink href={`${import.meta.env.BASE_URL}${profile.cvPdf}`} idx="02">
              Download PDF
            </SysLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
