import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useField } from "../lib/field";

interface Node {
  x: number;
  y: number;
  z: number; // depth 0.35..1 (1 = nearest)
  vx: number;
  vy: number;
  seed: number;
}

interface Packet {
  a: number;
  b: number;
  t: number;
  speed: number;
}

/**
 * The environment. A sparse network of nodes in shallow 3D: nearer nodes are
 * brighter, move faster with the cursor and parallax more on scroll. Packets
 * travel along links to suggest data moving through a system. Canvas 2D, one
 * rAF loop, paused when hidden, static under prefers-reduced-motion.
 */
export default function Field() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { mode, pulseRef, on } = useField();
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    let raf = 0;
    let running = true;
    let last = performance.now();
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let scroll = window.scrollY;
    let scrollSmooth = scroll;
    let energy = 0;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    const build = () => {
      const area = w * h;
      const base = isTouch ? 26000 : 17000;
      const count = Math.round((area / base) * (0.55 + modeRef.current.density * 0.75));
      nodes = Array.from({ length: Math.max(24, Math.min(170, count)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: 0.35 + Math.random() * 0.65,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        seed: Math.random() * Math.PI * 2,
      }));
      packets = Array.from({ length: Math.round(nodes.length * 0.08) }, () => ({
        a: 0,
        b: 0,
        t: Math.random(),
        speed: 0.15 + Math.random() * 0.25,
      }));
      packets.forEach(retarget);
    };

    function retarget(p: Packet) {
      p.a = Math.floor(Math.random() * nodes.length);
      // nearest few to a
      let best = -1;
      let bestD = Infinity;
      for (let i = 0; i < nodes.length; i++) {
        if (i === p.a) continue;
        const d = dist2(nodes[p.a], nodes[i]);
        if (d < bestD && d > 900) {
          bestD = d;
          best = i;
        }
      }
      p.b = best < 0 ? (p.a + 1) % nodes.length : best;
      p.t = 0;
    }

    const dist2 = (a: Node, b: Node) => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (reduced) draw(0);
    };

    const onMove = (e: PointerEvent) => {
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
    };
    const onLeave = () => {
      pointer.tx = -9999;
      pointer.ty = -9999;
    };
    const onScroll = () => {
      scroll = window.scrollY;
    };
    const onVis = () => {
      running = document.visibilityState === "visible";
      if (running && !reduced) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    function draw(dt: number) {
      const m = modeRef.current;
      const speed = reduced ? 0 : (m.calm ? 0.35 : 0.6 + m.speed * 0.8) * (1 + energy * 1.4);
      const linkDist = (isTouch ? 110 : 140) * m.links * (1 + energy * 0.25);
      const linkDist2 = linkDist * linkDist;

      // smooth pointer & scroll
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      scrollSmooth += (scroll - scrollSmooth) * 0.08;

      ctx.clearRect(0, 0, w, h);

      const px = pointer.x;
      const py = pointer.y;
      const hasPointer = px > -1000;
      const cx = w / 2;
      const cy = h / 2;
      const offX = hasPointer ? (px - cx) / cx : 0;
      const offY = hasPointer ? (py - cy) / cy : 0;

      // integrate
      for (const n of nodes) {
        n.x += n.vx * speed * dt * 0.06;
        n.y += n.vy * speed * dt * 0.06;
        // slow breathing
        n.x += Math.sin(performance.now() * 0.0002 + n.seed) * 0.02 * speed;
        // wrap
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;
      }

      // projected positions (parallax by depth)
      const proj = nodes.map((n) => {
        const par = (1 - n.z) * 26;
        const sx = n.x - offX * par * 1.4;
        let sy = n.y - offY * par - ((scrollSmooth * 0.12 * (1 - n.z)) % h);
        if (sy < -30) sy += h + 60;
        // pointer repulsion, nearer nodes react more
        let rx = 0;
        let ry = 0;
        if (hasPointer) {
          const dx = sx - px;
          const dy = sy - py;
          const d2 = dx * dx + dy * dy;
          const r = 160;
          if (d2 < r * r && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = ((r - d) / r) * 22 * n.z;
            rx = (dx / d) * f;
            ry = (dy / d) * f;
          }
        }
        return { x: sx + rx, y: sy + ry, z: n.z };
      });

      // links
      ctx.lineWidth = 1;
      for (let i = 0; i < proj.length; i++) {
        const a = proj[i];
        for (let j = i + 1; j < proj.length; j++) {
          const b = proj[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > linkDist2) continue;
          const t = 1 - d2 / linkDist2;
          const z = (a.z + b.z) / 2;
          const alpha = t * (0.05 + z * 0.16) * (m.calm ? 0.6 : 1);
          ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // nodes
      for (const p of proj) {
        const r = 0.6 + p.z * 1.2;
        ctx.fillStyle = `rgba(243,243,240,${(0.18 + p.z * 0.5).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // packets along links
      if (!reduced) {
        for (const pk of packets) {
          const a = proj[pk.a];
          const b = proj[pk.b];
          if (!a || !b) continue;
          if (dist2(nodes[pk.a], nodes[pk.b]) > linkDist2 * 2.2) {
            retarget(pk);
            continue;
          }
          pk.t += pk.speed * speed * dt * 0.0011;
          if (pk.t >= 1) {
            retarget(pk);
            continue;
          }
          const x = a.x + (b.x - a.x) * pk.t;
          const y = a.y + (b.y - a.y) * pk.t;
          const fade = Math.sin(pk.t * Math.PI);
          ctx.fillStyle = `rgba(226,163,59,${(0.25 + fade * 0.55).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.4 + fade * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // pointer halo: faint ring that reads as a lens over the network
      if (hasPointer && !isTouch) {
        const g = ctx.createRadialGradient(px, py, 0, px, py, 220);
        g.addColorStop(0, "rgba(226,163,59,0.05)");
        g.addColorStop(1, "rgba(226,163,59,0)");
        ctx.fillStyle = g;
        ctx.fillRect(px - 220, py - 220, 440, 440);
      }

      // decay energy
      if (pulseRef.current > 0) {
        energy = Math.min(1, energy + pulseRef.current * 0.6);
        pulseRef.current = 0;
      }
      energy *= 0.94;
    }

    function tick(now: number) {
      if (!running) return;
      const dt = Math.min(48, now - last);
      last = now;
      draw(dt);
      raf = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    if (!reduced) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(tick);
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced, pulseRef]);

  return <canvas ref={ref} className={`field${on ? " is-on" : ""}`} aria-hidden="true" />;
}
