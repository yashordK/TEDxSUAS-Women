"use client";

import { Environment, Lightformer } from "@react-three/drei";

/** Procedural reflection environment: no external HDR is fetched. */
export function StageEnvironment() {
  return (
    <Environment resolution={256} frames={1} background={false} environmentIntensity={0.55}>
      <color attach="background" args={["#020102"]} />
      {/* Overhead key strip: the white glint on the mic. */}
      <Lightformer form="rect" intensity={6} color="#fff1e6" position={[0, 6, 1]} rotation-x={Math.PI / 2} scale={[1.2, 4, 1]} />
      {/* Red wing strips. */}
      <Lightformer form="rect" intensity={4} color="#ff1030" position={[-6, 2, 0]} rotation-y={Math.PI / 2} scale={[8, 0.35, 1]} />
      <Lightformer form="rect" intensity={4} color="#ff1030" position={[6, 2, 0]} rotation-y={-Math.PI / 2} scale={[8, 0.35, 1]} />
      <Lightformer form="rect" intensity={2.5} color="#eb0028" position={[0, 1.5, -7]} scale={[10, 0.6, 1]} />
      {/* Low red floor bounce. */}
      <Lightformer form="ring" intensity={2} color="#ff2040" position={[0, -3, 0]} rotation-x={-Math.PI / 2} scale={4} />
    </Environment>
  );
}
