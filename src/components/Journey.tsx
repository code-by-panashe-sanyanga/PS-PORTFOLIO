import { useRef } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { journey } from "../data/profile";
import { Reveal } from "./primitives";

/** Scroll-driven timeline from engineering into software. */
export default function Journey() {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 70%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return (
    <ol ref={ref} className="journey">
      <motion.span className="journey-line" style={{ scaleY: reduced ? 1 : progress }} aria-hidden="true" />
      {journey.map((j, i) => (
        <Reveal as="li" key={j.id} className="journey-step" delay={0.05}>
          <div className="journey-meta">
            <span className="mono accent">{String(i + 1).padStart(2, "0")}</span>
            <span className="mono">{j.period}</span>
          </div>
          <div className="journey-body">
            <h3 className="display display-sm">{j.title}</h3>
            <span className="journey-org">{j.org}</span>
            <p className="body">{j.body}</p>
            <ul className="tags">
              {j.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
