"use client";

import { createContext, useContext } from "react";

export type QualityTier = "high" | "low";

/**
 * Mutable per-frame state shared by the stage. Kept outside React state so
 * useFrame loops can read it without re-rendering.
 */
export interface StageRuntime {
  /** 0 → 1 over the intro (lights on + camera dolly). */
  intro: { value: number };
  /** Normalised pointer, -1..1, tracked on window. */
  pointer: { x: number; y: number };
  started: boolean;
  tier: QualityTier;
  reducedMotion: boolean;
}

export const StageContext = createContext<StageRuntime | null>(null);

export function useStage(): StageRuntime {
  const ctx = useContext(StageContext);
  if (!ctx) throw new Error("useStage must be used inside <StageContext>");
  return ctx;
}

export const ease = {
  outCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  inOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};

export function range(v: number, a: number, b: number) {
  return Math.min(1, Math.max(0, (v - a) / (b - a)));
}
