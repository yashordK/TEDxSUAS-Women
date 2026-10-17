"use client";

import { useEffect, useRef } from "react";
import { site } from "@/lib/site";

const NAMES = site.changemakers.map((c) => c.name);
const ROWS = 7;
const PER_ROW = 12;
const GLOWING = 5;

/** Deterministic shuffle (same on server and client, so hydration matches). */
function shuffled(seed: number) {
  const a = [...NAMES];
  let s = seed * 9301 + 49297;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const rows = Array.from({ length: ROWS }, (_, r) => {
  const out: string[] = [];
  let k = r;
  while (out.length < PER_ROW) out.push(...shuffled(++k));
  return out.slice(0, PER_ROW);
});

/**
 * /theme hero backdrop: a tilted wall of women's names on the right ~55%, fading out
 * toward the headline. Most names are faint; a few glow TED red at a time, changing
 * every few seconds. Red beam from the top right with drifting dust. Decoration only.
 * Reduced motion: one fixed set of glowing names, no beam or dust movement.
 */
export function NamesWall() {
  const wall = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wall.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const pick = () => {
      const box = el.getBoundingClientRect();
      const narrow = window.innerWidth < 1024;
      // centre inside the unfaded part of the wall (the mask fades its edges)
      const [x0, x1, y0, y1] = narrow ? [0.3, 0.96, 0.12, 0.36] : [0.42, 0.95, 0.08, 0.9];
      const visible = [...el.querySelectorAll<HTMLElement>(".nw-name")].filter((n) => {
        const r = n.getBoundingClientRect();
        const cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2;
        return cx > box.left + box.width * x0 && cx < box.left + box.width * x1 && cy > box.top + box.height * y0 && cy < box.top + box.height * y1;
      });
      const prev = new Set(el.querySelectorAll(".nw-glow"));
      prev.forEach((n) => n.classList.remove("nw-glow"));
      // prefer names that weren't just glowing, so each change is visible
      const fresh = visible.filter((n) => !prev.has(n));
      const pool = fresh.length >= GLOWING ? fresh : [...fresh, ...visible.filter((n) => prev.has(n))];
      for (let i = 0; i < GLOWING && pool.length; i++) {
        const j = reduce ? Math.floor((i * pool.length) / GLOWING) : Math.floor(Math.random() * pool.length);
        pool.splice(j, 1)[0]?.classList.add("nw-glow");
      }
    };

    pick();
    if (reduce) return;
    const t = window.setInterval(pick, 3800);
    const onResize = () => pick();
    window.addEventListener("resize", onResize);
    return () => {
      window.clearInterval(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div aria-hidden className="nw">
      {/* keep the headline side dark over the photo */}
      <span className="absolute inset-0 bg-[linear-gradient(90deg,rgb(5_3_4/0.92)_0%,rgb(5_3_4/0.8)_35%,rgb(5_3_4/0.25)_62%,transparent_80%)]" />
      <div ref={wall} className="nw-wall">
        <div className="nw-plane">
          {rows.map((row, r) => (
            <p key={r} className="nw-row" style={{ marginLeft: `${-(r % 3) * 4}%` }}>
              {row.map((n, i) => (
                <span key={i}>
                  <span className="nw-name">{n}</span>
                  <span className="nw-sep"> · </span>
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
      <span className="nw-beam" />
      <span className="nw-dust" />
    </div>
  );
}
