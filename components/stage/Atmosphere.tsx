"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { beamFragment, beamVertex } from "./shaders/beam";
import { dustFragment, dustVertex } from "./shaders/dust";
import { hazeFragment, hazeVertex } from "./shaders/haze";
import { CARPET_RADIUS, SPOT_POSITION, SPOT_TARGET } from "./Lights";
import { range, useStage } from "./StageContext";

// The beam runs from the lamp to the carpet centre. Beam and dust are authored in a local
// frame with +y pointing at the lamp; BeamFrame tilts that frame onto the real axis.
const AXIS = new THREE.Vector3(...SPOT_POSITION).sub(new THREE.Vector3(...SPOT_TARGET));
const BEAM_HEIGHT = AXIS.length();
const BEAM_RADIUS = CARPET_RADIUS * 0.92;
const BEAM_QUAT = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), AXIS.clone().normalize());

export function BeamFrame({ children }: { children: React.ReactNode }) {
  return (
    <group position={SPOT_TARGET} quaternion={BEAM_QUAT}>
      {children}
    </group>
  );
}

/** Volumetric cone under the key light. */
export function SpotBeam() {
  const { intro } = useStage();
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uColor: { value: new THREE.Color("#ffc9cf") },
    }),
    [],
  );
  useFrame(({ clock }) => {
    // Write through the live material: R3F may not keep our uniforms object.
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value = clock.elapsedTime;
    u.uIntensity.value = 0.2 * range(intro.value, 0.02, 0.18);
  });
  return (
    <mesh position={[0, BEAM_HEIGHT / 2, 0]} renderOrder={2}>
      <coneGeometry args={[BEAM_RADIUS, BEAM_HEIGHT, 96, 1, true]} />
      <shaderMaterial
        ref={mat}
        vertexShader={beamVertex}
        fragmentShader={beamFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

interface HazeLayer {
  position: [number, number, number];
  scale: [number, number];
  opacity: number;
  seed: number;
  color: string;
}

// Low haze hugging the floor; nothing tall enough to veil the backdrop.
const LAYERS: HazeLayer[] = [
  { position: [0.6, 0.45, -1.2], scale: [12, 1.4], opacity: 0.1, seed: 7.7, color: "#a30a22" },
  { position: [0.4, 0.3, 1.2], scale: [10, 1.0], opacity: 0.06, seed: 2.9, color: "#7a0819" },
];

/** Layered smoke sheets with slow drift. */
export function Haze({ layers = LAYERS }: { layers?: HazeLayer[] }) {
  const { intro } = useStage();
  const mats = useMemo(
    () =>
      layers.map(
        (l) =>
          new THREE.ShaderMaterial({
            vertexShader: hazeVertex,
            fragmentShader: hazeFragment,
            uniforms: {
              uTime: { value: 0 },
              uOpacity: { value: l.opacity },
              uSeed: { value: l.seed },
              uColor: { value: new THREE.Color(l.color) },
              uIntro: { value: 0 },
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          }),
      ),
    [layers],
  );
  useFrame(({ clock }) => {
    const on = range(intro.value, 0.1, 0.7);
    mats.forEach((m) => {
      m.uniforms.uTime.value = clock.elapsedTime;
      m.uniforms.uIntro.value = on;
    });
  });
  return (
    <group>
      {layers.map((l, i) => (
        <mesh key={i} position={l.position} material={mats[i]} renderOrder={1}>
          <planeGeometry args={[l.scale[0], l.scale[1]]} />
        </mesh>
      ))}
    </group>
  );
}

/** Motes drifting through the beam. */
export function Dust({ count = 1200 }: { count?: number }) {
  const { intro } = useStage();
  const dpr = useThree((s) => s.viewport.dpr);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const size = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const y = Math.random() * BEAM_HEIGHT;
      const r = Math.sqrt(Math.random()) * BEAM_RADIUS * 1.1;
      const a = Math.random() * Math.PI * 2;
      pos.set([Math.cos(a) * r, y, Math.sin(a) * r], i * 3);
      seed[i] = Math.random();
      size[i] = 0.25 + Math.pow(Math.random(), 4) * 0.9;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    return g;
  }, [count]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uBeamTop: { value: BEAM_HEIGHT },
      uBeamRadius: { value: BEAM_RADIUS },
      uIntensity: { value: 0 },
    }),
    [],
  );
  useFrame(({ clock }) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value = clock.elapsedTime;
    u.uPixelRatio.value = dpr;
    u.uIntensity.value = 0.32 * range(intro.value, 0.15, 0.5);
  });
  return (
    <points geometry={geometry} renderOrder={3}>
      <shaderMaterial
        ref={mat}
        vertexShader={dustVertex}
        fragmentShader={dustFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
