import { useFieldMode } from "../lib/field";
import { profile, intro, education, interests, howIWork } from "../data/profile";
import { Reveal, SectionHead, SysLink, Words, useTitle } from "../components/primitives";
import Journey from "../components/Journey";
import SkillMap from "../components/SkillMap";

export default function About() {
  useTitle("About | Panashe Sanyanga");
  useFieldMode({ density: 0.6, speed: 0.4, links: 1.1 });

  return (
    <>
      <section className="page-head" aria-labelledby="about-title">
        <div className="wrap">
          <span className="mono accent">02 / About</span>
          <h1 id="about-title" className="display display-xl">
            <span className="hero-line">
              <Words text="About" inView={false} delay={0.05} />
            </span>
            <span className="hero-line about-name">
              <Words text={profile.name} inView={false} delay={0.2} />
            </span>
          </h1>
          <div className="about-head-grid">
            <p className="lede">{intro.cv}</p>
            <dl className="about-facts">
              <div>
                <dt className="mono">Degree</dt>
                <dd>
                  <strong>{education[0].title}</strong>
                  <span>
                    {education[0].org} · {profile.graduation}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="mono">Now</dt>
                <dd>
                  <strong>IT Advisor</strong>
                  <span>Manchester Metropolitan University</span>
                </dd>
              </div>
              <div>
                <dt className="mono">Before</dt>
                <dd>
                  <strong>{education[1].title}</strong>
                  <span>{education[1].org}</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="journey-h">
        <div className="wrap">
          <SectionHead idx="01" label="Journey" meta="Engineering → software" />
          <Reveal>
            <h2 id="journey-h" className="display display-md sec-big">
              <Words text="Hardware first. Then everything underneath it." />
            </h2>
          </Reveal>
          <Journey />
        </div>
      </section>

      <section className="section" aria-labelledby="work-h">
        <div className="wrap about-work-grid">
          <div>
            <SectionHead idx="02" label="How I work" />
            <Reveal>
              <h2 id="work-h" className="display display-md sec-big">
                <Words text="Take it apart. Work out why." />
              </h2>
            </Reveal>
          </div>
          <Reveal className="body about-work-copy" delay={0.1}>
            {howIWork.map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
            <p>{intro.found}</p>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="interests-h">
        <div className="wrap">
          <SectionHead idx="03" label="Interests" />
          <Reveal>
            <h2 id="interests-h" className="sr-only">
              Interests
            </h2>
            <ul className="interest-grid">
              {interests.map((i, n) => (
                <li key={i}>
                  <span className="mono accent">{String(n + 1).padStart(2, "0")}</span>
                  <span className="display display-sm">{i}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section" id="skills" aria-labelledby="skills-h">
        <div className="wrap">
          <SectionHead idx="04" label="Technical map" meta="Hover a node" />
          <Reveal>
            <h2 id="skills-h" className="display display-md sec-big">
              <Words text="What I know, and where I used it." />
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
            <p className="lede">Technical CV for software engineering graduate applications: education, projects, full experience, and skills.</p>
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
