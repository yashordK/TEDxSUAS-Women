"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { range, useStage } from "./StageContext";

/** Mic is built at ~1.65 m and scaled up for presence on the stage. */
export const MIC_SCALE = 1.6;
/** Carpet circle under the mic. */
export const CARPET_RADIUS = 2.2;
/** One fixture, above-right and slightly in front, aimed at the carpet centre. */
export const SPOT_POSITION: [number, number, number] = [3.4, 8.0, 2.0];
export const SPOT_TARGET: [number, number, number] = [0, 0, 0];
/** Mid-height of the mic: camera look point and DoF focus. */
export const MIC_TARGET: [number, number, number] = [0, 1.35, 0];
/** Warm red: #EB0028 tinted toward white. */
export const SPOT_COLOR = "#ffc2c8";

const SPOT_DISTANCE = new THREE.Vector3(...SPOT_POSITION).distanceTo(new THREE.Vector3(...SPOT_TARGET));
// Cone sized so the pool lands on the carpet circle (penumbra eats the inner edge).
export const SPOT_ANGLE = Math.atan((CARPET_RADIUS * 0.95) / SPOT_DISTANCE);

/**
 * Key spot on the carpet (casts the long mic shadow) plus its weak spill on the
 * backdrop's right side. No ambient: outside the pool the stage falls to near-black.
 */
export function Lights() {
  const { intro, tier } = useStage();
  const key = useRef<THREE.SpotLight>(null);
  const spill = useRef<THREE.SpotLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);
  const spillTarget = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    target.position.set(...SPOT_TARGET);
    spillTarget.position.set(2.8, 2.6, -6);
  }, [target, spillTarget]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // Snaps on with a short tungsten flicker, then holds.
    const k = range(intro.value, 0.02, 0.14);
    const flicker = k < 1 ? 0.6 + 0.4 * Math.sin(t * 90) : 1;
    if (key.current) key.current.intensity = 820 * k * flicker;
    if (spill.current) spill.current.intensity = 1800 * range(intro.value, 0.12, 0.5);
  });

  const shadowSize = tier === "high" ? 2048 : 1024;

  return (
    <>
      <primitive object={target} />
      <primitive object={spillTarget} />
      <spotLight
        ref={key}
        position={SPOT_POSITION}
        target={target}
        color={SPOT_COLOR}
        angle={SPOT_ANGLE}
        penumbra={0.85}
        distance={20}
        decay={2}
        intensity={0}
        castShadow
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-bias={-0.00012}
        shadow-normalBias={0.02}
        shadow-radius={tier === "high" ? 8 : 3}
        shadow-camera-near={3}
        shadow-camera-far={14}
      />
      <spotLight
        ref={spill}
        position={SPOT_POSITION}
        target={spillTarget}
        color={SPOT_COLOR}
        angle={0.42}
        penumbra={1}
        distance={22}
        decay={2}
        intensity={0}
      />
    </>
  );
}
