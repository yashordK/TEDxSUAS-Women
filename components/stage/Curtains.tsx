"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { curtainFragment, curtainVertex } from "./shaders/curtain";
import { range, useStage } from "./StageContext";

interface CurtainProps {
  side: "left" | "right";
  width?: number;
  height?: number;
}

function Curtain({ side, width = 4.2, height = 9 }: CurtainProps) {
  const { intro, reducedMotion } = useStage();
  const sign = side === "left" ? -1 : 1;
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: curtainVertex,
        fragmentShader: curtainFragment,
        uniforms: {
          uTime: { value: 0 },
          uFolds: { value: 7.5 },
          uDepth: { value: 0.16 },
          uSway: { value: reducedMotion ? 0 : 0.07 },
          uBase: { value: new THREE.Color("#8c0418") },
          uSheen: { value: new THREE.Color("#ff1638") },
          // Key from the stage centre, slightly above.
          uKeyDirV: { value: new THREE.Vector3(-sign * 0.8, 0.3, 0.5) },
          uIntro: { value: 0 },
          uSide: { value: 1 },
        },
        side: THREE.DoubleSide,
      }),
    [sign, reducedMotion],
  );
  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uIntro.value = range(intro.value, 0.2, 0.65);
  });
  return (
    <mesh
      material={material}
      position={[sign * 5.9, height / 2 - 0.05, -3.2]}
      rotation-y={-sign * 0.75}
    >
      <planeGeometry args={[width, height, 220, 60]} />
    </mesh>
  );
}

/** Heavy velvet wings, left and right. */
export function Curtains() {
  return (
    <>
      <Curtain side="left" />
      <Curtain side="right" />
    </>
  );
}
