import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

/** Environment settings for the background field. Each page tunes these. */
export interface FieldMode {
  density: number; // 0..1
  speed: number; // 0..1
  links: number; // 0..1 link distance multiplier
  calm?: boolean; // contact: slower, sparser
}

interface FieldApi {
  mode: FieldMode;
  setMode: (m: Partial<FieldMode>) => void;
  /** brief energy pulse, e.g. hovering a project */
  pulse: () => void;
  pulseRef: React.MutableRefObject<number>;
  on: boolean;
  setOn: (v: boolean) => void;
}

const DEFAULT: FieldMode = { density: 0.9, speed: 0.6, links: 1 };
const Ctx = createContext<FieldApi | null>(null);

export function FieldProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<FieldMode>(DEFAULT);
  /** Catalogue reading surface: canvas stays off. */
  const [on, setOn] = useState(false);
  const pulseRef = useRef(0);
  const setMode = useCallback((m: Partial<FieldMode>) => setModeState((prev) => ({ ...DEFAULT, ...prev, ...m })), []);
  const pulse = useCallback(() => {
    pulseRef.current = 1;
  }, []);
  const value = useMemo(() => ({ mode, setMode, pulse, pulseRef, on, setOn }), [mode, setMode, pulse, on]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useField() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useField outside FieldProvider");
  return v;
}

/** Declare the field environment for the current page. */
export function useFieldMode(mode: Partial<FieldMode>) {
  const { setMode } = useField();
  const key = JSON.stringify(mode);
  useEffect(() => {
    setMode(JSON.parse(key));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, setMode]);
}
