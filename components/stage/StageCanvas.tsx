"use client";

import { Component, type ReactNode, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { detectQualityTier, prefersReducedMotion } from "@/lib/quality";
import { Scene } from "./Scene";
import { StageContext, type QualityTier, type StageRuntime } from "./StageContext";

export interface StageCanvasProps {
  /** Turns the lights on and starts the camera dolly. */
  started: boolean;
  onReady: () => void;
  onFail: () => void;
}

class StageErrorBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function StageCanvas({ started, onReady, onFail }: StageCanvasProps) {
  const [tier, setTier] = useState<QualityTier>(() => detectQualityTier());
  const runtime = useMemo<StageRuntime>(
    () => ({
      intro: { value: 0 },
      pointer: { x: 0, y: 0 },
      started: false,
      tier,
      reducedMotion: prefersReducedMotion(),
    }),
    // Rebuild only when the tier changes; the rest is mutated in place.
    [tier],
  );

  useEffect(() => {
    runtime.started = started;
  }, [runtime, started]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      runtime.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      runtime.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [runtime]);

  return (
    <StageErrorBoundary onError={onFail}>
      <StageContext.Provider value={runtime}>
        <Canvas
          shadows
          dpr={tier === "high" ? [1, 1.5] : [1, 1.25]}
          gl={{ antialias: false, powerPreference: "high-performance", stencil: false }}
          camera={{ position: [0, 5, 23], fov: 18, near: 0.1, far: 80 }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.domElement.addEventListener("webglcontextlost", (e) => {
              e.preventDefault();
              onFail();
            });
          }}
          aria-hidden
        >
          <StageContext.Provider value={runtime}>
            <PerformanceMonitor onDecline={() => setTier("low")} flipflops={1} />
            <Scene onReady={onReady} />
          </StageContext.Provider>
        </Canvas>
      </StageContext.Provider>
    </StageErrorBoundary>
  );
}
