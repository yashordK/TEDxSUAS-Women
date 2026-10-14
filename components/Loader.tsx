"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useProgress } from "@react-three/drei";

const MIN_DURATION = 2500;
const FLARE_MS = 520;
const PRELOAD = ["/brand/logo-white.png", "/brand/tedx_logo.png", "/reference/4.jpg"];

export interface LoaderProps {
  /** True once the 3D scene has compiled and rendered (or WebGL failed). */
  sceneReady: boolean;
  reducedMotion: boolean;
  onComplete: () => void;
}

/** "Mic spotlight" loader: the beam widens as real progress climbs to 100. */
export function Loader({ sceneReady, reducedMotion, onComplete }: LoaderProps) {
  const { progress: assetProgress, total } = useProgress();
  const [images, setImages] = useState(0);
  const [pct, setPct] = useState(0);
  const [flare, setFlare] = useState(false);
  const target = useRef(0);
  const completed = useRef(false);

  useEffect(() => {
    PRELOAD.forEach((src) => {
      const img = new Image();
      const done = () => setImages((n) => n + 1);
      img.onload = done;
      img.onerror = done;
      img.src = src;
    });
  }, []);

  const three = total === 0 ? 1 : assetProgress / 100;
  target.current = ((images / PRELOAD.length) * 0.3 + three * 0.25 + (sceneReady ? 0.45 : 0)) * 100;

  useEffect(() => {
    const start = performance.now();
    let shown = 0;
    let raf = 0;
    const tick = (now: number) => {
      const timeCap = ((now - start) / MIN_DURATION) * 100;
      const goal = Math.min(target.current, timeCap);
      shown += (goal - shown) * 0.12;
      if (goal >= 100 && shown > 99.5) shown = 100;
      setPct(Math.floor(shown));
      if (shown >= 100) {
        if (!completed.current) {
          completed.current = true;
          setFlare(true);
          window.setTimeout(onComplete, reducedMotion ? 0 : FLARE_MS);
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete, reducedMotion]);

  const p = pct / 100;
  const beamWidth = flare ? 1.35 : 0.22 + 0.78 * p;
  const beamOpacity = flare ? 1 : 0.12 + 0.68 * p;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-ink"
      initial={{ opacity: 1 }}
      exit={reducedMotion ? { opacity: 0, transition: { duration: 0.2 } } : { opacity: 0, scale: 1.08, transition: { duration: 0.9, ease: [0.65, 0, 0.35, 1] } }}
      role="progressbar"
      aria-label="Setting the stage"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 800" preserveAspectRatio="xMidYMax meet" aria-hidden>
        <defs>
          <linearGradient id="ld-beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff3ea" stopOpacity="0.9" />
            <stop offset="0.55" stopColor="#ffd2c4" stopOpacity="0.28" />
            <stop offset="1" stopColor="#ff3b55" stopOpacity="0.06" />
          </linearGradient>
          <radialGradient id="ld-pool" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffd9cc" stopOpacity="0.9" />
            <stop offset="0.45" stopColor="#eb0028" stopOpacity="0.55" />
            <stop offset="1" stopColor="#eb0028" stopOpacity="0" />
          </radialGradient>
          <filter id="ld-blur">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <g
          style={{
            transformOrigin: "200px 0px",
            transform: `scaleX(${beamWidth})`,
            opacity: beamOpacity,
            transition: "transform 160ms linear, opacity 160ms linear",
          }}
          filter="url(#ld-blur)"
        >
          <polygon points="188,0 212,0 300,740 100,740" fill="url(#ld-beam)" />
        </g>
        <ellipse
          cx="200"
          cy="742"
          rx={60 + 80 * (flare ? 1.2 : p)}
          ry={10 + 8 * p}
          fill="url(#ld-pool)"
          opacity={0.25 + 0.75 * p}
        />
        {/* Mic stand silhouette. */}
        <g fill="#000">
          <ellipse cx="200" cy="742" rx="26" ry="4.5" />
          <rect x="198.6" y="575" width="2.8" height="168" rx="1.2" />
          <rect x="197.2" y="640" width="5.6" height="10" rx="2" />
          <g transform="rotate(-18 200 575)">
            <rect x="197" y="540" width="6" height="36" rx="3" />
            <circle cx="200" cy="536" r="7.5" />
          </g>
        </g>
      </svg>

      {flare && !reducedMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 92%, rgba(255,235,225,0.55), rgba(235,0,40,0.18) 40%, transparent 70%)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.6] }}
          transition={{ duration: FLARE_MS / 1000 }}
          aria-hidden
        />
      )}

      <div className="relative -mt-[18vh] text-center">
        <p className="font-display text-[clamp(5rem,16vw,10rem)] leading-none tabular-nums text-white">
          {pct}
          <span className="text-[0.4em] align-top text-hot">%</span>
        </p>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.5em] text-[#d9cfd2]">Setting the stage</p>
      </div>
    </motion.div>
  );
}
