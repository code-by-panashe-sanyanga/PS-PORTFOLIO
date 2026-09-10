import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { profile } from "../data/profile";

/** Splash off. First paint is the work. */
export function shouldPlayIntro(_pathname: string) {
  return false;
}

/**
 * Opening sequence kept for optional use. Currently disabled via shouldPlayIntro.
 */
export default function Intro({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0); // 0 dark, 1 name, 2 role, 3 systems, 4 out
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (reduced) {
      setVisible(false);
      onDone();
      return;
    }
    const t = [
      window.setTimeout(() => setPhase(1), 120),
      window.setTimeout(() => setPhase(2), 700),
      window.setTimeout(() => setPhase(3), 1100),
      window.setTimeout(() => setPhase(4), 1700),
      window.setTimeout(() => {
        setVisible(false);
        onDone();
      }, 2100),
    ];
    return () => t.forEach(clearTimeout);
  }, [reduced, onDone]);

  const skip = () => {
    setVisible(false);
    onDone();
  };

  const labels = ["DESIGN", "BUILD", "TEST", "SHIP"];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="intro"
          role="dialog"
          aria-label="Opening"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] } }}
          onClick={skip}
        >
          <div className="intro-grid" aria-hidden="true" data-phase={phase} />

          <div className="intro-center" aria-hidden="true">
            <motion.div
              className="intro-name display"
              initial={{ opacity: 0, y: 12, letterSpacing: "0.02em" }}
              animate={
                phase >= 4
                  ? { opacity: 0, y: -18, scale: 0.98 }
                  : phase >= 1
                    ? { opacity: 1, y: 0, letterSpacing: "-0.03em" }
                    : {}
              }
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {profile.first} {profile.last}
            </motion.div>

            <motion.div
              className="intro-role mono"
              initial={{ opacity: 0, y: 8 }}
              animate={phase >= 4 ? { opacity: 0, y: -10 } : phase >= 2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {profile.role}
            </motion.div>

            <motion.div
              className="intro-line"
              initial={{ scaleX: 0 }}
              animate={phase >= 4 ? { scaleX: 0, opacity: 0 } : phase >= 2 ? { scaleX: 1 } : {}}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />

            <div className="intro-labels">
              {labels.map((l, i) => (
                <motion.span
                  key={l}
                  className="mono"
                  initial={{ opacity: 0, y: 6 }}
                  animate={phase >= 4 ? { opacity: 0 } : phase >= 3 ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.09 }}
                >
                  {String(i + 1).padStart(2, "0")} {l}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="intro-corners mono" aria-hidden="true">
            <motion.span initial={{ opacity: 0 }} animate={phase >= 3 && phase < 4 ? { opacity: 1 } : { opacity: 0 }}>
              {profile.role}
            </motion.span>
            <motion.span initial={{ opacity: 0 }} animate={phase >= 3 && phase < 4 ? { opacity: 1 } : { opacity: 0 }}>
              {profile.focus}
            </motion.span>
          </div>

          <button type="button" className="intro-skip mono" onClick={skip}>
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
