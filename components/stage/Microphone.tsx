"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { easing } from "maath";
import * as THREE from "three";
import { MIC_SCALE } from "./Lights";
import { useStage } from "./StageContext";
import { createBrushedRoughness, createGrilleMaps } from "./textures";

const GLB_URL = "/models/mic.glb";
const STAND_HEIGHT = 1.42;

type Profile = [number, number][];

function lathe(profile: Profile, segments = 72) {
  const g = new THREE.LatheGeometry(
    profile.map(([r, y]) => new THREE.Vector2(r, y)),
    segments,
  );
  g.computeVertexNormals();
  return g;
}

// Radius / height profiles in metres, bottom → top.
const BASE: Profile = [
  [0, 0],
  [0.162, 0],
  [0.168, 0.002],
  [0.171, 0.007],
  [0.171, 0.016],
  [0.168, 0.021],
  [0.158, 0.025],
  [0.15, 0.027],
  [0.118, 0.034],
  [0.06, 0.04],
  [0.034, 0.043],
  [0.028, 0.048],
  [0.026, 0.056],
  [0.022, 0.066],
  [0, 0.066],
];

// Rubber foot ring under the base.
const FOOT: Profile = [
  [0.12, -0.004],
  [0.165, -0.004],
  [0.165, 0.001],
  [0.12, 0.001],
  [0.12, -0.004],
];

const LOWER_TUBE: Profile = [
  [0, 0.06],
  [0.0155, 0.06],
  [0.0155, 0.9],
  [0, 0.9],
];

const CLUTCH: Profile = [
  [0, 0.88],
  [0.0135, 0.88],
  [0.019, 0.888],
  [0.0205, 0.905],
  [0.0205, 0.93],
  [0.017, 0.945],
  [0.0095, 0.952],
  [0, 0.952],
];

const UPPER_TUBE: Profile = [
  [0, 0.94],
  [0.0108, 0.94],
  [0.0094, STAND_HEIGHT],
  [0, STAND_HEIGHT],
];

const SWIVEL: Profile = [
  [0, STAND_HEIGHT - 0.01],
  [0.009, STAND_HEIGHT - 0.01],
  [0.0115, STAND_HEIGHT],
  [0.0115, STAND_HEIGHT + 0.022],
  [0.008, STAND_HEIGHT + 0.03],
  [0, STAND_HEIGHT + 0.03],
];

// Handheld mic, from the XLR end to the grille band.
const MIC_BODY: Profile = [
  [0, 0],
  [0.0105, 0],
  [0.0125, 0.004],
  [0.0135, 0.012],
  [0.0142, 0.03],
  [0.0175, 0.1],
  [0.0215, 0.15],
  [0.0232, 0.168],
  [0.0232, 0.172],
  [0, 0.172],
];

const GRILLE_BAND: Profile = [
  [0, 0.17],
  [0.0238, 0.17],
  [0.0252, 0.174],
  [0.0252, 0.184],
  [0.0242, 0.188],
  [0, 0.188],
];

function ProceduralMic() {
  const { brushed, grille } = useMemo(() => {
    const brushed = createBrushedRoughness(256);
    brushed.repeat.set(1, 8);
    const grille = createGrilleMaps(512, 22);
    [grille.map, grille.normalMap, grille.roughnessMap].forEach((t) => t.repeat.set(4, 2));
    return { brushed, grille };
  }, []);

  const geo = useMemo(
    () => ({
      base: lathe(BASE, 128),
      foot: lathe(FOOT, 96),
      lower: lathe(LOWER_TUBE, 48),
      clutch: lathe(CLUTCH, 48),
      upper: lathe(UPPER_TUBE, 48),
      swivel: lathe(SWIVEL, 48),
      body: lathe(MIC_BODY, 64),
      band: lathe(GRILLE_BAND, 64),
    }),
    [],
  );

  const stand = (
    // Polished chrome: mirrors the studio env (red strip, warm softbox), brushed along the tube.
    <meshPhysicalMaterial
      color="#a9a9b0"
      metalness={1}
      roughness={0.38}
      clearcoat={0.2}
      clearcoatRoughness={0.25}
      envMapIntensity={0.7}
    />
  );

  return (
    <group>
      <mesh geometry={geo.base} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#cfcfd4"
          metalness={1}
          roughness={0.34}
          roughnessMap={brushed}
          anisotropy={0.5}
          clearcoat={1}
          clearcoatRoughness={0.2}
          envMapIntensity={1.1}
        />
      </mesh>
      <mesh geometry={geo.foot}>
        <meshStandardMaterial color="#050505" roughness={0.9} />
      </mesh>
      <mesh geometry={geo.lower} castShadow>
        {stand}
      </mesh>
      <mesh geometry={geo.clutch} castShadow>
        <meshPhysicalMaterial color="#0a0a0b" metalness={0.2} roughness={0.55} clearcoat={0.3} />
      </mesh>
      <mesh geometry={geo.upper} castShadow>
        {stand}
      </mesh>
      <mesh geometry={geo.swivel} castShadow>
        {stand}
      </mesh>

      {/* Clip + handheld mic, tilted toward the speaker. */}
      <group position={[0, STAND_HEIGHT + 0.022, 0]} rotation={[0.42, 0, 0]}>
        <mesh position={[0, 0.02, 0]} castShadow>
          <boxGeometry args={[0.018, 0.04, 0.03]} />
          <meshPhysicalMaterial color="#0b0b0c" roughness={0.6} metalness={0} clearcoat={0.2} />
        </mesh>
        <mesh position={[0, 0.07, 0]} rotation-x={Math.PI / 2} castShadow>
          <torusGeometry args={[0.019, 0.0055, 16, 48, Math.PI * 1.6]} />
          <meshPhysicalMaterial color="#0b0b0c" roughness={0.55} metalness={0} clearcoat={0.3} />
        </mesh>

        <group position={[0, -0.01, 0]}>
          <mesh geometry={geo.body} castShadow>
            <meshPhysicalMaterial color="#0e0e11" metalness={0.75} roughness={0.3} clearcoat={1} clearcoatRoughness={0.2} envMapIntensity={1.2} />
          </mesh>
          <mesh geometry={geo.band} castShadow>
            <meshPhysicalMaterial color="#b4b4ba" metalness={1} roughness={0.3} roughnessMap={brushed} envMapIntensity={1.8} />
          </mesh>
          {/* Spherical mesh grille + dark acoustic foam inside. */}
          <mesh position={[0, 0.212, 0]} castShadow>
            <sphereGeometry args={[0.0305, 96, 64]} />
            <meshPhysicalMaterial
              map={grille.map}
              normalMap={grille.normalMap}
              normalScale={new THREE.Vector2(1.6, 1.6)}
              roughnessMap={grille.roughnessMap}
              metalness={1}
              roughness={0.42}
              clearcoat={0.35}
              clearcoatRoughness={0.2}
              envMapIntensity={1.6}
            />
          </mesh>
          <mesh position={[0, 0.212, 0]}>
            <sphereGeometry args={[0.027, 32, 24]} />
            <meshStandardMaterial color="#050505" roughness={1} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function GlbMic() {
  const { scene } = useGLTF(GLB_URL);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const height = box.max.y - box.min.y || 1;
    const scale = (STAND_HEIGHT + 0.25) / height;
    clone.scale.setScalar(scale);
    const scaled = new THREE.Box3().setFromObject(clone);
    const center = scaled.getCenter(new THREE.Vector3());
    clone.position.set(-center.x, -scaled.min.y, -center.z);
    clone.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) o.castShadow = o.receiveShadow = true;
    });
    return clone;
  }, [scene]);
  return <primitive object={model} />;
}

/** Stand mic: uses /models/mic.glb when present, else the procedural build. */
export function Microphone({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const { pointer } = useStage();
  const group = useRef<THREE.Group>(null);
  const [hasGlb, setHasGlb] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(GLB_URL, { method: "HEAD" })
      .then((r) => {
        const type = r.headers.get("content-type") ?? "";
        if (alive && r.ok && !type.includes("text/html")) setHasGlb(true);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useFrame((_, dt) => {
    if (group.current) easing.dampE(group.current.rotation, [0, -0.35 + pointer.x * 0.12, 0], 0.6, dt);
  });

  return (
    <group position={position} scale={MIC_SCALE}>
      <group ref={group}>
        {hasGlb ? (
          <Suspense fallback={<ProceduralMic />}>
            <GlbMic />
          </Suspense>
        ) : (
          <ProceduralMic />
        )}
      </group>
    </group>
  );
}
