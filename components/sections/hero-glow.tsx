"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect } from "react";

/**
 * Volumetric red light behind the hero, echoing the lit ribs and light trails of the
 * SUAS building in the poster. Everything blurred is rasterised once; only transform
 * and opacity animate, so it stays on the compositor.
 */

// Long sweeping ribbons, loosely tracing the calligraphy's underline flourish.
const RIBBONS = [
  { d: "M-120 640 C 260 470, 620 820, 980 600 S 1520 330, 1760 420", w: 2.2, o: 0.9 },
  { d: "M-120 690 C 300 520, 640 860, 1000 650 S 1520 390, 1760 470", w: 1.2, o: 0.55 },
  { d: "M-120 590 C 240 420, 600 770, 960 560 S 1500 280, 1760 360", w: 0.8, o: 0.4 },
  { d: "M-120 760 C 320 600, 700 900, 1060 720 S 1540 470, 1760 560", w: 14, o: 0.22 },
  { d: "M-120 520 C 220 360, 560 700, 920 500 S 1480 220, 1760 300", w: 22, o: 0.12 },
];

export function HeroGlow() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 40, damping: 20 });
  const y = useSpring(my, { stiffness: 40, damping: 20 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * -40);
      my.set((e.clientY / window.innerHeight - 0.5) * -24);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* core glow */}
      <div
        data-motion="decorative"
        className="absolute left-1/2 top-[58%] h-[70vh] w-[120vw] rounded-[50%] bg-[radial-gradient(closest-side,rgb(235_0_40/0.38),rgb(168_0_28/0.16)_55%,transparent)] will-change-transform md:w-[90vw]"
        style={{
          transform: "translate3d(-50%,-50%,0)",
          animation: "glow-breathe 10s ease-in-out infinite",
        }}
      />

      {/* ribbons: a soft bloom copy + a crisp copy, both parallaxed */}
      <motion.div className="absolute inset-0 will-change-transform" style={{ x, y }}>
        <div
          data-motion="decorative"
          className="absolute inset-[-10%]"
          style={{ animation: "ribbon-drift 18s ease-in-out infinite" }}
        >
          <Ribbons className="absolute inset-0 h-full w-full opacity-80 blur-2xl" />
          <Ribbons className="absolute inset-0 h-full w-full opacity-70" />
        </div>
      </motion.div>

      {/* light streak, like a car trail across the wet road in the poster */}
      <div className="absolute inset-x-0 top-[78%] h-px overflow-hidden">
        <span
          data-motion="decorative"
          className="absolute left-0 top-0 h-px w-[40vw] bg-[linear-gradient(90deg,transparent,var(--red),rgb(255_255_255/0.9),transparent)]"
          style={{ transform: "translateX(-100%)", animation: "streak 9s ease-in 3.5s infinite" }}
        />
      </div>

      {/* grain + vignette + floor fade */}
      <div className="grain absolute inset-0 opacity-[0.07] mix-blend-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--black)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-black" />
    </div>
  );
}

function Ribbons({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1640 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <defs>
        <linearGradient id="ribbon-grad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.3" stopColor="#ff4d5e" stopOpacity="0.6" />
          <stop offset="0.65" stopColor="#eb0028" stopOpacity="1" />
          <stop offset="1" stopColor="#a8001c" stopOpacity="0" />
        </linearGradient>
      </defs>
      {RIBBONS.map((r, i) => (
        <path
          key={i}
          d={r.d}
          stroke="url(#ribbon-grad)"
          strokeWidth={r.w}
          strokeOpacity={r.o}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
