"use client";

import { MotionConfig, useReducedMotion } from "framer-motion";
import { ReactLenis } from "lenis/react";

export function Providers({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    // reducedMotion="user": Framer drops transform/layout animation when the OS asks
    <MotionConfig reducedMotion="user">
      {reduce ? (
        children
      ) : (
        <ReactLenis root options={{ lerp: 0.1, anchors: { offset: -80 }, autoRaf: true }}>
          {children}
        </ReactLenis>
      )}
    </MotionConfig>
  );
}
