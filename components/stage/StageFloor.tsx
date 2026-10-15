"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { glowFragment, hazeVertex } from "./shaders/haze";
import { range, useStage } from "./StageContext";
import { createFiberNoise, createRadialTexture } from "./textures";
import { FloorPhoto } from "./FloorPhoto";

export const DISC_RADIUS = 3.6;

// [inner radius, width, opacity]: the layered "TED circle" lines.
const RINGS: [number, number, number][] = [
  [DISC_RADIUS - 0.32, 0.03, 0.45],
  [DISC_RADIUS + 0.03, 0.06, 0.8],
  [DISC_RADIUS + 0.95, 0.045, 0.35],
];

/** Glossy black stage, the glowing red carpet disc and its ring lines. */
export function StageFloor() {
  const { tier, intro } = useStage();
  const discMat = useRef<THREE.MeshStandardMaterial>(null);
  const bleedMat = useRef<THREE.ShaderMaterial>(null);
  const ringMats = useRef<THREE.MeshBasicMaterial[]>([]);

  const { fiber, discGlow } = useMemo(() => {
    const fiber = createFiberNoise(256);
    fiber.repeat.set(36, 36);
    // Hot crimson centre falling off toward the rim, slight lift at the edge.
    const discGlow = createRadialTexture([
      [0, "#ffffff"],
      [0.18, "#e6e6e6"],
      [0.45, "#7a7a7a"],
      [0.78, "#383838"],
      [0.95, "#4a4a4a"],
      [1, "#101010"],
    ]);
    return { fiber, discGlow };
  }, []);

  const bleedUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#ff0a2e") },
      uIntensity: { value: 0 },
      uTime: { value: 0 },
    }),
    [],
  );

  useFrame(({ clock }) => {
    const on = range(intro.value, 0.1, 0.55);
    if (discMat.current) discMat.current.emissiveIntensity = 1.15 * on;
    const u = bleedMat.current?.uniforms;
    if (u) {
      u.uIntensity.value = 0.32 * on;
      u.uTime.value = clock.elapsedTime;
    }
    const rings = range(intro.value, 0.3, 0.8);
    ringMats.current.forEach((m, i) => {
      m.opacity = rings * RINGS[i][2];
    });
  });

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[90, 90]} />
        {tier === "high" ? (
          <MeshReflectorMaterial
            blur={[300, 90]}
            resolution={1024}
            mixBlur={0.85}
            mixStrength={18}
            mixContrast={1.2}
            roughness={0.62}
            depthScale={1.1}
            minDepthThreshold={0.35}
            maxDepthThreshold={1.4}
            color="#120306"
            metalness={0.6}
            roughnessMap={fiber}
            mirror={0.75}
          />
        ) : (
          <meshStandardMaterial color="#0d0204" roughness={0.28} metalness={0.65} envMapIntensity={0.7} />
        )}
      </mesh>

      {/* Photographed floor boards over the glossy base, faded out at every edge. */}
      <FloorPhoto />

      {/* Red bloom bleeding from the disc onto the glossy floor. */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.002} renderOrder={1}>
        <planeGeometry args={[DISC_RADIUS * 3.4, DISC_RADIUS * 3.4]} />
        <shaderMaterial
          ref={bleedMat}
          vertexShader={hazeVertex}
          fragmentShader={glowFragment}
          uniforms={bleedUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Carpet disc: matte fibre, lit from within like the poster. */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.006} receiveShadow>
        <circleGeometry args={[DISC_RADIUS, 160]} />
        <meshStandardMaterial
          ref={discMat}
          color="#6a0614"
          roughness={0.86}
          metalness={0}
          bumpMap={fiber}
          bumpScale={0.5}
          emissive="#e8001f"
          emissiveMap={discGlow}
          emissiveIntensity={0}
        />
      </mesh>

      {RINGS.map(([r, w], i) => (
        <mesh key={r} rotation-x={-Math.PI / 2} position-y={0.016} renderOrder={2}>
          <ringGeometry args={[r, r + w, 320]} />
          <meshBasicMaterial
            ref={(m) => {
              if (m) ringMats.current[i] = m;
            }}
            color={new THREE.Color("#ff2a44").multiplyScalar(i === 1 ? 3.2 : 1.8)}
            transparent
            opacity={0}
            toneMapped={false}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-4}
          />
        </mesh>
      ))}
    </group>
  );
}
