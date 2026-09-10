import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { profile } from "../data/profile";

const links = [
  { to: "/", label: "Home", idx: "00" },
  { to: "/work", label: "Work", idx: "01" },
  { to: "/about", label: "About", idx: "02" },
  { to: "/experience", label: "Experience", idx: "03" },
  { to: "/contact", label: "Contact", idx: "04" },
];

function MagneticLink({ to, label, idx }: { to: string; label: string; idx: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 300, damping: 24 });
  const y = useSpring(my, { stiffness: 300, damping: 24 });

  const onMove = (e: React.PointerEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset} className="nav-item">
      <NavLink ref={ref} to={to} end={to === "/"} className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}>
        <span className="nav-idx">{idx}</span>
        <span className="nav-label">{label}</span>
      </NavLink>
    </motion.div>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", open);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("no-scroll");
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`nav${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
        <div className="wrap nav-bar">
          <Link to="/" className="brand" aria-label="Panashe Sanyanga, home">
            <span className="brand-mark">PS</span>
            <span className="brand-meta mono">
              {profile.role} <span className="brand-dot" aria-hidden="true" /> {profile.focus}
            </span>
          </Link>

          <nav className="nav-links" aria-label="Primary">
            {links.map((l) => (
              <MagneticLink key={l.to} {...l} />
            ))}
          </nav>

          <button
            type="button"
            className="nav-toggle mono"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            className="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav aria-label="Menu" className="menu-links wrap">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <NavLink to={l.to} end={l.to === "/"} className="menu-link display">
                    <span className="mono accent">{l.idx}</span>
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="menu-foot wrap">
              <a className="mono" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <a className="mono" href={profile.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a className="mono" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
