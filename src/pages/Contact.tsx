import { useFieldMode } from "../lib/field";
import { profile } from "../data/profile";
import { Words, useTitle } from "../components/primitives";
import ContactBlock from "../components/ContactBlock";

export default function Contact() {
  useTitle("Contact | Panashe Sanyanga");
  useFieldMode({ density: 0.4, speed: 0.25, links: 1.2, calm: true });

  return (
    <section className="page-head contact-page" aria-labelledby="contact-title">
      <div className="wrap">
        <span className="mono accent">04 / Contact</span>
        <h1 id="contact-title" className="display display-lg contact-name">
          <span className="hero-line">
            <Words text={profile.name} inView={false} delay={0.05} />
          </span>
          <span className="hero-line contact-role">
            <Words text={profile.role} inView={false} delay={0.2} />
          </span>
        </h1>
        <ContactBlock headline="Let’s build something." />
      </div>
    </section>
  );
}
