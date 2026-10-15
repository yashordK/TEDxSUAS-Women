"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { range, useStage } from "./StageContext";

/** Stepped risers in the wings with thin red LED edges, as in the poster. */
export function StageSet() {
  const { intro } = useStage();
  const led = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#ff1a36").multiplyScalar(2.4),
        transparent: true,
        opacity: 0,
        toneMapped: false,
      }),
    [],
  );

  useFrame(({ clock }) => {
    const on = range(intro.value, 0.35, 0.85);
    led.opacity = on * (0.92 + 0.08 * Math.sin(clock.elapsedTime * 1.3));
  });

  const steps = [0, 1, 2];
  return (
    <group>
      {[-1, 1].map((sign) =>
        steps.map((i) => {
          const w = 4.2 - i * 0.9;
          const h = 0.32 + i * 0.32;
          const x = sign * (6.6 + i * 0.75);
          const z = -3.4 - i * 0.7;
          return (
            <group key={`${sign}-${i}`} position={[x, 0, z]} rotation-y={sign * -0.18}>
              <mesh position={[0, h / 2, 0]} receiveShadow castShadow>
                <boxGeometry args={[w, h, 0.9]} />
                <meshPhysicalMaterial color="#070203" roughness={0.38} metalness={0.4} clearcoat={0.6} clearcoatRoughness={0.2} />
              </mesh>
              <mesh position={[0, h + 0.004, 0.45]} material={led}>
                <boxGeometry args={[w, 0.012, 0.012]} />
              </mesh>
            </group>
          );
        }),
      )}
      {/* Back wall, almost black: gives the haze something to sit in front of. */}
      <mesh position={[0, 5, -7.5]}>
        <planeGeometry args={[40, 12]} />
        <meshStandardMaterial color="#0a0204" roughness={0.95} />
      </mesh>
    </group>
  );
}
