import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { easeOut } from "../lib/motion";

/* Reveal: fade/rise once when scrolled into view ---------------------------- */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  y = 24,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "p" | "span" | "header" | "article";
  y?: number;
}) {
  const reduced = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ ...easeOut, delay }}
    >
      {children}
    </Comp>
  );
}

/* Words: masked word-by-word reveal for display type ----------------------- */
export function Words({
  text,
  className,
  delay = 0,
  stagger = 0.05,
  inView = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  inView?: boolean;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  // Observe the (unclipped) container, not the clipped word, or IO never fires.
  const seen = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const go = reduced || !inView || seen;
  const words = text.split(" ");
  return (
    <span className={`words ${className ?? ""}`} ref={ref}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words
          .map((w, i) => (
            <span className="word" key={`${w}-${i}`}>
              <motion.span
                className="word-in"
                initial={reduced ? false : { y: "110%", rotate: 2 }}
                animate={go ? { y: "0%", rotate: 0 } : undefined}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: delay + i * stagger }}
              >
                {w}
              </motion.span>
            </span>
          ))
          .flatMap((el, i) => (i < words.length - 1 ? [el, " "] : [el]))}
      </span>
    </span>
  );
}

/* SysLink: the CTA ---------------------------------------------------------- */
export function SysLink({
  to,
  href,
  idx,
  children,
  variant = "default",
  className,
  onClick,
}: {
  to?: string;
  href?: string;
  idx?: string;
  children: ReactNode;
  variant?: "default" | "primary" | "quiet";
  className?: string;
  onClick?: () => void;
}) {
  const cls = `syslink ${variant !== "default" ? variant : ""} ${className ?? ""}`;
  const inner = (
    <>
      {idx && <span className="idx">{idx}</span>}
      <span>{children}</span>
      <svg className="arrow" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M3 13 13 3M6 3h7v7" />
      </svg>
    </>
  );
  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer" onClick={onClick}>
      {inner}
    </a>
  );
}

/* SectionHead ----------------------------------------------------------------- */
export function SectionHead({ idx, label, meta }: { idx: string; label: string; meta?: string }) {
  return (
    <Reveal className="sec-head" as="header">
      <span className="mono accent">
        {idx} / {label}
      </span>
      <span className="hairline" />
      {meta && <span className="mono">{meta}</span>}
    </Reveal>
  );
}

/* Html: verbatim write-up content ------------------------------------------- */
export function Html({ html, className }: { html: string; className?: string }) {
  return <div className={`prose ${className ?? ""}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

/* Title hook ------------------------------------------------------------------ */
export function useTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

export function Footer() {
  return (
    <footer className="footer wrap">
      <span className="mono">
        © {new Date().getFullYear()} <strong>Panashe Sanyanga</strong>
      </span>
      <span className="mono">Manchester, UK</span>
      <a className="mono" href="https://github.com/code-by-panashe-sanyanga/PS-PORTFOLIO" target="_blank" rel="noopener noreferrer">
        Source
      </a>
    </footer>
  );
}
