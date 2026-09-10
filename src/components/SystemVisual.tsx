import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import type { Motif } from "../data/projects";

/**
 * Illustrative system visuals for each project motif. These are diagrams of
 * the kind of data each system handles, not live or historical statistics.
 * Animation only runs while in view and is frozen under reduced motion.
 */
export default function SystemVisual({ motif, signals, active = true }: { motif: Motif; signals: string[]; active?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const live = inView && active && !reduced;

  return (
    <div ref={ref} className={`sysvis sysvis-${motif}${live ? " is-live" : ""}`} aria-hidden="true">
      {motif === "telemetry" && <Telemetry live={live} />}
      {motif === "ledger" && <Ledger live={live} />}
      {motif === "probability" && <Probability live={live} />}
      {motif === "stream" && <Stream live={live} />}
      {motif === "audit" && <Audit live={live} />}
      {motif === "algorithm" && <Algorithm live={live} />}
      <ul className="sysvis-signals">
        {signals.slice(0, 6).map((s) => (
          <li key={s} className="mono">
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

function useTicker(live: boolean, ms: number) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => setTick((t) => t + 1), ms);
    return () => window.clearInterval(id);
  }, [live, ms]);
  return tick;
}

/* 01 — circuit trace with a moving car dot and sector bars */
function Telemetry({ live }: { live: boolean }) {
  const path =
    "M40 120 C 60 40, 160 30, 220 60 S 330 40, 380 90 S 420 170, 340 190 S 200 170, 160 200 S 60 210, 40 120 Z";
  return (
    <svg viewBox="0 0 440 240" className="sysvis-svg">
      <path d={path} className="track" />
      <path d={path} className="track-hi" pathLength={100} />
      <circle r="4" className="car">
        {live && <animateMotion dur="7s" repeatCount="indefinite" path={path} />}
      </circle>
      <g className="sectors" transform="translate(40 224)">
        <rect x="0" width="120" height="3" className="s1" />
        <rect x="128" width="120" height="3" className="s2" />
        <rect x="256" width="104" height="3" className="s3" />
      </g>
      <g className="hud mono-svg" transform="translate(300 24)">
        <text y="0">P1 · SOFT · 12 LAPS</text>
        <text y="16">S1 S2 S3</text>
      </g>
    </svg>
  );
}

/* 02 — ledger entries posting in balanced pairs */
function Ledger({ live }: { live: boolean }) {
  const tick = useTicker(live, 1400);
  const rows = [
    ["TX-4821", "DEBIT", "acc 1042", "250.00"],
    ["TX-4821", "CREDIT", "acc 2210", "250.00"],
    ["TX-4822", "DEBIT", "acc 2210", "80.00"],
    ["TX-4822", "CREDIT", "acc 3005", "80.00"],
    ["TX-4823", "DEBIT", "acc 1042", "12.40"],
    ["TX-4823", "CREDIT", "acc 9001", "12.40"],
  ];
  const start = tick % rows.length;
  const view = [...rows.slice(start), ...rows.slice(0, start)].slice(0, 5);
  return (
    <div className="ledger">
      <div className="ledger-head mono">
        <span>txn</span>
        <span>side</span>
        <span>account</span>
        <span>amount</span>
      </div>
      {view.map((r, i) => (
        <div className={`ledger-row mono${i === 0 ? " is-new" : ""}`} key={`${r[0]}-${r[1]}-${start}`}>
          <span>{r[0]}</span>
          <span className={r[1] === "DEBIT" ? "dr" : "cr"}>{r[1]}</span>
          <span>{r[2]}</span>
          <span className="mono-num">{r[1] === "DEBIT" ? "−" : "+"}{r[3]}</span>
        </div>
      ))}
      <div className="ledger-foot mono">
        <span>FOR UPDATE · ordered by id</span>
        <span className="ok">Σ debits = Σ credits</span>
      </div>
    </div>
  );
}

/* 03 — match outcome probabilities and a Poisson goal histogram */
function Probability({ live }: { live: boolean }) {
  const tick = useTicker(live, 1800);
  // deterministic pseudo-random walk so values look like a sim converging
  const s = Math.sin(tick * 1.7) * 0.06;
  const home = 0.46 + s;
  const draw = 0.24 - s * 0.4;
  const away = 1 - home - draw;
  const pois = (k: number, l: number) => (Math.exp(-l) * l ** k) / [1, 1, 2, 6, 24, 120][k];
  const lam = 1.55 + Math.sin(tick) * 0.15;
  const hist = [0, 1, 2, 3, 4, 5].map((k) => pois(k, lam));
  const max = Math.max(...hist);
  return (
    <div className="prob">
      <div className="prob-bars">
        {[
          ["HOME", home],
          ["DRAW", draw],
          ["AWAY", away],
        ].map(([l, v]) => (
          <div className="prob-bar" key={l as string}>
            <span className="mono">{l as string}</span>
            <span className="bar">
              <span className="fill" style={{ transform: `scaleX(${(v as number).toFixed(3)})` }} />
            </span>
            <span className="mono mono-num">{((v as number) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
      <div className="prob-hist">
        {hist.map((h, k) => (
          <span key={k} className="col">
            <span className="col-fill" style={{ transform: `scaleY(${(h / max).toFixed(3)})` }} />
            <span className="mono">{k}</span>
          </span>
        ))}
        <span className="mono lam">λ {lam.toFixed(2)} · 10,000 draws</span>
      </div>
    </div>
  );
}

/* 04 — socket events flowing between clients */
function Stream({ live }: { live: boolean }) {
  const tick = useTicker(live, 900);
  const events = ["message:new", "typing", "presence:online", "reaction:add", "dm:thread", "message:new", "story:view"];
  const shown = Array.from({ length: 4 }, (_, i) => events[(tick + i) % events.length]);
  return (
    <div className="stream">
      <div className="stream-lane">
        <span className="peer mono">client A</span>
        <span className="wire">
          {live && <span className="pkt" />}
          {live && <span className="pkt d2" />}
        </span>
        <span className="peer mono">socket.io</span>
        <span className="wire">
          {live && <span className="pkt d1" />}
        </span>
        <span className="peer mono">client B</span>
      </div>
      <ul className="stream-log mono">
        {shown.map((e, i) => (
          <li key={`${e}-${tick}-${i}`} className={i === 0 ? "is-new" : ""}>
            <span className="t">{String(12 + ((tick + i) % 47)).padStart(2, "0")}:{String((tick * 7 + i * 13) % 60).padStart(2, "0")}</span>
            {e}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* 05 — accessibility checks passing */
function Audit({ live }: { live: boolean }) {
  const tick = useTicker(live, 1100);
  const checks = ["role=dialog + aria-modal", "focus moved into dialog", "Tab / Shift+Tab trapped", "Escape closes, focus restored", "arrow keys navigate", "reduced motion: autoplay off"];
  const done = live ? tick % (checks.length + 2) : checks.length;
  return (
    <ul className="audit mono">
      {checks.map((c, i) => (
        <li key={c} className={i < done ? "is-ok" : ""}>
          <span className="box" />
          {c}
        </li>
      ))}
    </ul>
  );
}

/* coursework — sorting bars */
function Algorithm({ live }: { live: boolean }) {
  const tick = useTicker(live, 700);
  const n = 14;
  const bars = Array.from({ length: n }, (_, i) => ((i * 7 + tick * 3) % n) + 1);
  return (
    <div className="algo">
      {bars.map((b, i) => (
        <span key={i} className="algo-bar" style={{ height: `${(b / n) * 100}%` }} />
      ))}
    </div>
  );
}
