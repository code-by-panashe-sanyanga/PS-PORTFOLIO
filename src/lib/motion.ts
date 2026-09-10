import type { Transition, Variants } from "framer-motion";

export const springSoft: Transition = { type: "spring", stiffness: 120, damping: 22, mass: 0.9 };
export const springSnappy: Transition = { type: "spring", stiffness: 380, damping: 32, mass: 0.6 };
export const easeOut: Transition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] };

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 28, filter: "blur(10px)" },
  enter: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 },
  },
  exit: {
    opacity: 0,
    y: -24,
    filter: "blur(8px)",
    transition: { duration: 0.36, ease: [0.65, 0, 0.35, 1] },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...easeOut, delay: 0.06 * i },
  }),
};

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
