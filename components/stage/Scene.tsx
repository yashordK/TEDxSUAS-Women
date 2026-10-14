"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { BackGlow, Dust, Haze, SpotBeam } from "./Atmosphere";
import { CameraRig } from "./CameraRig";
import { Curtains } from "./Curtains";
import { Effects } from "./Effects";
import { Lights } from "./Lights";
import { Microphone } from "./Microphone";
import { StageEnvironment } from "./StageEnvironment";
import { StageFloor } from "./StageFloor";
import { StageSet } from "./StageSet";
import { useStage } from "./StageContext";

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
      <fogExp2 attach="fog" args={["#0b0205", 0.04]} />
      <StageEnvironment />
      <Lights />
      <CameraRig />

      <StageFloor />
      <StageSet />
      <Curtains />
      <BackGlow />
      <Microphone />

      <Haze />
      <SpotBeam />
      <Dust count={high ? 700 : 260} />

      <Effects />
      <ReadySignal onReady={onReady} />
    </>
  );
}
