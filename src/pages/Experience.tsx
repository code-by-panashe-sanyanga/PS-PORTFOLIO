import { useFieldMode } from "../lib/field";
import { experience } from "../data/profile";
import { Reveal, SectionHead, SysLink, Words, useTitle } from "../components/primitives";
import SystemLog from "../components/SystemLog";

export default function Experience() {
  useTitle("Experience | Panashe Sanyanga");
  useFieldMode({ density: 0.5, speed: 0.35, links: 0.9 });
  const primary = experience.find((e) => e.primary)!;

  return (
    <>
      <section className="page-head" aria-labelledby="exp-title">
        <div className="wrap">
          <span className="mono accent">03 / Experience</span>
          <h1 id="exp-title" className="display display-xl">
            <Words text="System log" inView={false} delay={0.1} />
          </h1>
          <div className="about-head-grid">
            <p className="lede">
              Alongside my degree, I work as an IT Advisor at Manchester Metropolitan University. It's hands-on support work:
              handling service desk tickets, PC imaging, SCCM software deployment, and helping staff and students with hardware,
              software, accounts and network issues. A lot of those problems do not have a straightforward answer, so the job
              has taught me to diagnose problems under pressure and explain the solution clearly.
            </p>
            <dl className="about-facts">
              <div>
                <dt className="mono">Current</dt>
                <dd>
                  <strong>{primary.role}</strong>
                  <span>
                    {primary.org} · {primary.period}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="mono">Records</dt>
                <dd>
                  <strong>{experience.length}</strong>
                  <span>2017 – present</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="section" aria-label="Log">
        <div className="wrap">
          <SectionHead idx="01" label="Records" meta="Newest first" />
          <SystemLog />
        </div>
      </section>

      <section className="section" aria-label="Next">
        <div className="wrap about-cv">
          <Reveal>
            <span className="mono">Related</span>
            <p className="lede">The engineering side of the story, and the systems it produced.</p>
          </Reveal>
          <Reveal className="case-links" delay={0.1}>
            <SysLink to="/about" idx="01">
              About
            </SysLink>
            <SysLink to="/work" idx="02">
              Work
            </SysLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
