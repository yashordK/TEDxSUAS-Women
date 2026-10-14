"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { range, useStage } from "./StageContext";

/** Mic is built at ~1.65 m and scaled up for presence on the stage. */
export const MIC_SCALE = 1.6;
// Directly overhead so the pool lands centred on the mic and the disc.
export const SPOT_POSITION: [number, number, number] = [0, 8.2, 0];
export const MIC_TARGET: [number, number, number] = [0, 1.9, 0];

/** Hard warm key on the mic, red rims from both wings. */
export function Lights() {
  const { intro, tier } = useStage();
  const key = useRef<THREE.SpotLight>(null);
  const rimL = useRef<THREE.SpotLight>(null);
  const rimR = useRef<THREE.SpotLight>(null);
  const ambient = useRef<THREE.AmbientLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);
  const rimTarget = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    // Aim at the floor under the mic: a vertical cone centred on the disc.
    target.position.set(0, 0, 0);
    rimTarget.position.set(...MIC_TARGET);
  }, [target, rimTarget]);

  useFrame(({ clock }) => {
    const p = intro.value;
    const t = clock.elapsedTime;
    // Key light snaps on with a short tungsten flicker.
    const k = range(p, 0.02, 0.14);
    const flicker = k < 1 ? 0.6 + 0.4 * Math.sin(t * 90) : 1;
    if (key.current) key.current.intensity = 720 * k * flicker;
    const rim = range(p, 0.14, 0.5);
    if (rimL.current) rimL.current.intensity = 260 * rim;
    if (rimR.current) rimR.current.intensity = 260 * rim;
    if (ambient.current) ambient.current.intensity = 0.05 * rim;
  });

  const shadowSize = tier === "high" ? 2048 : 1024;

  return (
    <>
      <primitive object={target} />
      <primitive object={rimTarget} />
      <ambientLight ref={ambient} color="#ff2a3a" intensity={0} />
      <spotLight
        ref={key}
        position={SPOT_POSITION}
        target={target}
        color="#ffe6d2"
        angle={0.17}
        penumbra={0.5}
        distance={16}
        decay={2}
        intensity={0}
        castShadow
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-bias={-0.00015}
        shadow-normalBias={0.02}
        shadow-radius={6}
        shadow-camera-near={2}
        shadow-camera-far={12}
      />
      <spotLight
        ref={rimL}
        position={[-5.5, 3.2, -1.6]}
        target={rimTarget}
        color="#ff1030"
        angle={0.5}
        penumbra={0.9}
        distance={16}
        decay={2}
        intensity={0}
      />
      <spotLight
        ref={rimR}
        position={[5.5, 3.2, -1.6]}
        target={rimTarget}
        color="#ff1030"
        angle={0.5}
        penumbra={0.9}
        distance={16}
        decay={2}
        intensity={0}
      />
    </>
  );
}
