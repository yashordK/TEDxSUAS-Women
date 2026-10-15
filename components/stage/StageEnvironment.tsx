"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Small dark studio environment for the chrome: near-black, one red strip light, and a
 * dim warm softbox on the spot's side so the grille and tubes have something to mirror.
 * Built in-scene; no HDR file is fetched.
 */
export function StageEnvironment() {
  return (
    <Environment resolution={128} frames={1} background={false} environmentIntensity={0.6}>
      <color attach="background" args={["#030203"]} />
      <Lightformer form="rect" intensity={5} color="#eb0028" position={[-4, 2.2, 3]} rotation-y={Math.PI / 3} scale={[0.35, 6, 1]} />
      <Lightformer form="rect" intensity={0.45} color="#ffd9d2" position={[3.4, 6, 2]} rotation-x={Math.PI / 2} scale={[1.2, 1.2, 1]} />
    </Environment>
  );
}
