import { profile } from "../data/profile";
import { Reveal, SysLink, Words } from "./primitives";

const rows = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}`, ext: false },
  { label: "GitHub", value: profile.githubHandle, href: profile.github, ext: true },
  { label: "LinkedIn", value: profile.linkedinHandle, href: profile.linkedin, ext: true },
];

export default function ContactBlock({ headline = "Let’s build something." }: { headline?: string }) {
  return (
    <div className="contact">
      <h2 className="display display-lg contact-head">
        <Words text={headline} />
      </h2>
      <ul className="contact-rows">
        {rows.map((r, i) => (
          <Reveal as="li" key={r.label} delay={i * 0.06}>
            <a href={r.href} className="contact-row" {...(r.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              <span className="mono">{r.label}</span>
              <span className="contact-value">{r.value}</span>
              <svg className="arrow" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 13 13 3M6 3h7v7" />
              </svg>
            </a>
          </Reveal>
        ))}
      </ul>
      <Reveal className="contact-actions" delay={0.2}>
        <SysLink href={`mailto:${profile.email}?subject=Hello%20Panashe`} idx="01" variant="primary">
          Send an email
        </SysLink>
        <SysLink href={`${import.meta.env.BASE_URL}${profile.cvPdf}`} idx="02">
          Download CV
        </SysLink>
        <span className="mono contact-note">{profile.availability}</span>
      </Reveal>
    </div>
  );
}
