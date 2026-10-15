"use client";

import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { patchStageMaterial } from "./shaders/patch";

const SIZE = 48;
const REPEAT = 8;

/** Roughness from the photo: dark grooves and grain read rougher than the plank faces. */
function roughnessFrom(image: CanvasImageSource & { width: number; height: number }) {
  const s = 512;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d")!;
  g.drawImage(image, 0, 0, s, s);
  const d = g.getImageData(0, 0, s, s);
  let lo = 255, hi = 0;
  for (let i = 0; i < d.data.length; i += 4) {
    const l = 0.2126 * d.data[i] + 0.7152 * d.data[i + 1] + 0.0722 * d.data[i + 2];
    d.data[i] = l;
    lo = Math.min(lo, l);
    hi = Math.max(hi, l);
  }
  for (let i = 0; i < d.data.length; i += 4) {
    const n = (d.data[i] - lo) / Math.max(1, hi - lo);
    const r = Math.round(255 * (0.55 + 0.45 * (1 - n))); // satin faces, matte grooves
    d.data[i] = d.data[i + 1] = d.data[i + 2] = r;
    d.data[i + 3] = 255;
  }
  g.putImageData(d, 0, 0);
  return new THREE.CanvasTexture(c);
}

/**
 * Dark plank stage. Glossier inside the spot pool, matte further out (world-space
 * roughness ramp), never brighter than the texture (colour ≤ white), and fading to
 * black toward the headline side.
 */
export function WoodFloor() {
  const gl = useThree((s) => s.gl);
  const map = useTexture("/images/stage/wood-floor.webp");

  const { roughnessMap, material } = useMemo(() => {
    const aniso = gl.capabilities.getMaxAnisotropy();
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(REPEAT, REPEAT);
    map.anisotropy = aniso;
    map.needsUpdate = true;

    const roughnessMap = roughnessFrom(map.image as HTMLImageElement);
    roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
    roughnessMap.repeat.set(REPEAT, REPEAT);
    roughnessMap.anisotropy = aniso;

    const material = patchStageMaterial(
      new THREE.MeshStandardMaterial({
        map,
        roughnessMap,
        color: "#8c8c8c",
        roughness: 1,
        metalness: 0,
        envMapIntensity: 0.35,
      }),
      {
        // 0.45× roughness in the pool → 1× by 6 units out
        rough: "roughnessFactor *= mix(0.45, 1.0, smoothstep(1.2, 6.0, length(vStageWorld.xz)));",
      },
    );
    return { roughnessMap, material };
  }, [map, gl]);

  return (
    <mesh rotation-x={-Math.PI / 2} receiveShadow material={material} userData={{ roughnessMap }}>
      <planeGeometry args={[SIZE, SIZE]} />
    </mesh>
  );
}
