"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense } from "react";
import { ContactShadows } from "@react-three/drei";
import { BeamFrame, Dust, Haze, SpotBeam } from "./Atmosphere";
import { Backdrop } from "./Backdrop";
import { CameraRig } from "./CameraRig";
import { Carpet } from "./Carpet";
import { Effects } from "./Effects";
import { Lights } from "./Lights";
import { Microphone } from "./Microphone";
import { StageEnvironment } from "./StageEnvironment";
import { useStage } from "./StageContext";
import { WoodFloor } from "./WoodFloor";

/** Fires once shaders are compiled and a few frames have actually rendered. */
function ReadySignal({ onReady }: { onReady: () => void }) {
  const { gl, scene, camera } = useThree();
  const frames = useRef(0);
  const done = useRef(false);
  useEffect(() => {
    gl.compile(scene, camera);
  }, [gl, scene, camera]);
  useFrame(() => {
    if (done.current) return;
    frames.current += 1;
    if (frames.current > 4) {
      done.current = true;
      onReady();
    }
  });
  return null;
}

export function Scene({ onReady }: { onReady: () => void }) {
  const { tier } = useStage();
  const high = tier === "high";
  return (
    <>
      <color attach="background" args={["#050304"]} />
      {/* Exponential dark fog: the floor and backdrop dissolve into the room, no horizon line. */}
      <fogExp2 attach="fog" args={["#050304", 0.022]} />
      <StageEnvironment />
      <Lights />
      <CameraRig />

      {/* Textured surfaces stream in; the mic, beam and lights render meanwhile. */}
      <Suspense fallback={null}>
        <WoodFloor />
        <Carpet />
        <Backdrop />
      </Suspense>
      <Microphone />
      <ContactShadows position={[0, 0.004, 0]} scale={1.6} blur={2.4} far={0.6} opacity={0.85} resolution={high ? 512 : 256} frames={1} />

      <Haze />
      <BeamFrame>
        <SpotBeam />
        <Dust count={high ? 520 : 200} />
      </BeamFrame>

      <Effects />
      <ReadySignal onReady={onReady} />
    </>
  );
}
