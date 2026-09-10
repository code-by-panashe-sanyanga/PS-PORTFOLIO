import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { ArchEdge, ArchNode } from "../data/projects";

interface Props {
  nodes: ArchNode[];
  edges: ArchEdge[];
}

/**
 * Interactive architecture graph. Nodes are laid out in columns by their
 * distance from the entry node; hover/focus a node to read what it does.
 * Horizontal on wide screens, vertical on narrow ones.
 */
export default function ArchitectureFlow({ nodes, edges }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [vertical, setVertical] = useState(false);
  const [activeId, setActiveId] = useState<string>(nodes[0]?.id);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setVertical(e.contentRect.width < 640));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const layout = useMemo(() => {
    // levels by longest path from sources
    const level = new Map<string, number>();
    const incoming = new Map<string, number>();
    nodes.forEach((n) => incoming.set(n.id, 0));
    edges.forEach((e) => incoming.set(e.to, (incoming.get(e.to) ?? 0) + 1));
    const queue = nodes.filter((n) => (incoming.get(n.id) ?? 0) === 0).map((n) => n.id);
    queue.forEach((id) => level.set(id, 0));
    let guard = 0;
    while (queue.length && guard++ < 500) {
      const id = queue.shift()!;
      const l = level.get(id) ?? 0;
      edges
        .filter((e) => e.from === id)
        .forEach((e) => {
          const next = Math.max(level.get(e.to) ?? 0, l + 1);
          if (next !== level.get(e.to)) {
            level.set(e.to, next);
            queue.push(e.to);
          }
        });
    }
    nodes.forEach((n) => {
      if (!level.has(n.id)) level.set(n.id, 0);
    });
    // "admin" style nodes that only point into the graph sit on level 0 with the browser
    const cols = new Map<number, string[]>();
    nodes.forEach((n) => {
      const l = level.get(n.id)!;
      cols.set(l, [...(cols.get(l) ?? []), n.id]);
    });
    const colCount = Math.max(...cols.keys()) + 1;
    const rowCount = Math.max(...[...cols.values()].map((c) => c.length));

    const W = 132;
    const H = 46;
    const GX = 92;
    const GY = 20;
    const pos = new Map<string, { x: number; y: number }>();
    for (const [l, ids] of cols) {
      const total = ids.length * H + (ids.length - 1) * GY;
      const top = (rowCount * H + (rowCount - 1) * GY - total) / 2;
      ids.forEach((id, i) => pos.set(id, { x: l * (W + GX), y: top + i * (H + GY) }));
    }
    const width = colCount * W + (colCount - 1) * GX;
    const height = rowCount * H + (rowCount - 1) * GY;
    return { pos, W, H, width, height };
  }, [nodes, edges]);

  const { pos, W, H } = layout;
  const P = (id: string) => {
    const p = pos.get(id)!;
    return { x: p.x, y: p.y, w: W, h: H };
  };
  const vw = layout.width;
  const vh = layout.height;
  const active = nodes.find((n) => n.id === activeId) ?? nodes[0];

  // Narrow screens: a readable flow list ordered by level, instead of a shrunken graph.
  if (vertical) {
    const ordered = [...nodes].sort((a, b) => pos.get(a.id)!.x - pos.get(b.id)!.x);
    return (
      <div ref={wrapRef} className="arch is-vertical">
        <ol className="arch-list">
          {ordered.map((n) => {
            const outs = edges.filter((e) => e.from === n.id).map((e) => nodes.find((x) => x.id === e.to)?.label);
            return (
              <li key={n.id}>
                <span className="mono accent">{n.label}</span>
                <p>{n.note}</p>
                {outs.length > 0 && <span className="mono arch-outs">→ {outs.join(" · ")}</span>}
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="arch">
      <svg viewBox={`-8 -8 ${vw + 16} ${vh + 16}`} className="arch-svg" role="img" aria-label="Architecture diagram">
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
          </marker>
        </defs>
        {edges.map((e, i) => {
          const a = P(e.from);
          const b = P(e.to);
          const forward = b.x >= a.x;
          const x1 = forward ? a.x + a.w : a.x;
          const y1 = a.y + a.h / 2;
          const x2 = forward ? b.x : b.x + b.w;
          const y2 = b.y + b.h / 2;
          const d = `M${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`;
          const hot = e.from === activeId || e.to === activeId;
          return (
            <g key={i} className={`arch-edge${hot ? " is-hot" : ""}`}>
              <path d={d} markerEnd="url(#arr)" />
              {!reduced && (
                <circle r="2.2" className="arch-pkt">
                  <animateMotion dur={`${2.6 + (i % 3) * 0.7}s`} repeatCount="indefinite" path={d} begin={`${i * 0.4}s`} />
                </circle>
              )}
              {e.label && (
                <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6} textAnchor="middle" className="arch-label">
                  {e.label}
                </text>
              )}
            </g>
          );
        })}
        {nodes.map((n) => {
          const p = P(n.id);
          const hot = n.id === activeId;
          return (
            <g
              key={n.id}
              className={`arch-node${hot ? " is-hot" : ""}`}
              tabIndex={0}
              role="button"
              aria-pressed={hot}
              aria-label={`${n.label}: ${n.note}`}
              onMouseEnter={() => setActiveId(n.id)}
              onFocus={() => setActiveId(n.id)}
              onClick={() => setActiveId(n.id)}
            >
              <rect x={p.x} y={p.y} width={p.w} height={p.h} rx="2" />
              <text x={p.x + p.w / 2} y={p.y + p.h / 2} textAnchor="middle" dominantBaseline="central">
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="arch-note" aria-live="polite">
        <span className="mono accent">{active.label}</span>
        <p>{active.note}</p>
      </div>
    </div>
  );
}
