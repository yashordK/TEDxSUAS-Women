"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { beamFragment, beamVertex } from "./shaders/beam";
import { dustFragment, dustVertex } from "./shaders/dust";
import { glowFragment, hazeFragment, hazeVertex } from "./shaders/haze";
import { SPOT_POSITION } from "./Lights";
import { range, useStage } from "./StageContext";

const BEAM_HEIGHT = SPOT_POSITION[1];
const BEAM_RADIUS = 1.45;

/** Volumetric cone under the key light. */
export function SpotBeam() {
  const { intro } = useStage();
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uColor: { value: new THREE.Color("#ffd9c4") },
    }),
    [],
  );
  useFrame(({ clock }) => {
    // Write through the live material: R3F may not keep our uniforms object.
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value = clock.elapsedTime;
    u.uIntensity.value = 0.24 * range(intro.value, 0.02, 0.18);
  });
  return (
    <mesh position={[SPOT_POSITION[0], BEAM_HEIGHT / 2, SPOT_POSITION[2]]} renderOrder={2}>
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

/** Large, low-contrast red glow behind the mic: fills the stage without a hard shape. */
export function BackGlow() {
  const { intro } = useStage();
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#a3001b") },
      uIntensity: { value: 0 },
      uTime: { value: 0 },
    }),
    [],
  );
  useFrame(({ clock }) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value = clock.elapsedTime;
    u.uIntensity.value = 0.16 * range(intro.value, 0.25, 0.8);
  });
  return (
    <mesh position={[0, 2.4, -5.6]} renderOrder={0}>
      <planeGeometry args={[15, 10]} />
      <shaderMaterial
        ref={mat}
        vertexShader={hazeVertex}
        fragmentShader={glowFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
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

const LAYERS: HazeLayer[] = [
  // Between mic and X: swallows the bottom of the X.
  { position: [0, 1.2, -3.0], scale: [12, 3.6], opacity: 0.22, seed: 1.3, color: "#c2102a" },
  { position: [0, 2.6, -3.9], scale: [16, 6], opacity: 0.12, seed: 4.1, color: "#a00820" },
  // Low ground fog across the stage.
  { position: [0, 0.6, -0.8], scale: [14, 2.2], opacity: 0.14, seed: 7.7, color: "#b80c26" },
  { position: [0, 0.4, 1.4], scale: [12, 1.6], opacity: 0.08, seed: 2.9, color: "#8a0a1d" },
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
    <points geometry={geometry} position={[SPOT_POSITION[0], 0, SPOT_POSITION[2]]} renderOrder={3}>
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
