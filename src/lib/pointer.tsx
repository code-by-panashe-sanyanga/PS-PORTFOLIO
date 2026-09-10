import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

interface Pointer {
  /** normalised -1..1 across the viewport, spring smoothed */
  nx: MotionValue<number>;
  ny: MotionValue<number>;
  /** raw px */
  x: MotionValue<number>;
  y: MotionValue<number>;
  fine: boolean;
}

const Ctx = createContext<Pointer | null>(null);

export function PointerProvider({ children }: { children: ReactNode }) {
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const rawNx = useMotionValue(0);
  const rawNy = useMotionValue(0);
  const nx = useSpring(rawNx, { stiffness: 60, damping: 20, mass: 1 });
  const ny = useSpring(rawNy, { stiffness: 60, damping: 20, mass: 1 });
  const fine = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      rawNx.set((e.clientX / window.innerWidth) * 2 - 1);
      rawNy.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    const leave = () => {
      rawNx.set(0);
      rawNy.set(0);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerleave", leave);
    };
  }, [x, y, rawNx, rawNy]);

  return <Ctx.Provider value={{ nx, ny, x, y, fine }}>{children}</Ctx.Provider>;
}

export function usePointer() {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePointer outside PointerProvider");
  return v;
}
