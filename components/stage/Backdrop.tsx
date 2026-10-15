"use client";

import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { patchStageMaterial } from "./shaders/patch";

// Wide and gently curved, ~6 units behind the mic. Plane aspect ≈ the photo's (1672×941),
// so the curtain is never tiled or stretched.
const W = 18;
const H = W * (941 / 1672);
const Z = -6;
const BEND = 0.012; // z = -BEND·x²: the wings curve toward the camera

/** Red velvet backdrop, multiplied down to ~35%, lit only by the spot's spill. */
export function Backdrop() {
  const gl = useThree((s) => s.gl);
  const map = useTexture("/images/stage/curtain.webp");

  const { geometry, material } = useMemo(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = gl.capabilities.getMaxAnisotropy();
    map.wrapS = map.wrapT = THREE.ClampToEdgeWrapping;
    map.needsUpdate = true;

    const geometry = new THREE.PlaneGeometry(W, H, 96, 1);
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      pos.setZ(i, BEND * x * x);
    }
    geometry.computeVertexNormals();

    const material = patchStageMaterial(
      new THREE.MeshStandardMaterial({ map, color: "#595959", roughness: 0.92, metalness: 0, envMapIntensity: 0 }),
    );
    return { geometry, material };
  }, [map, gl]);

  return <mesh geometry={geometry} material={material} position={[0, H / 2 - 0.05, Z]} receiveShadow />;
}
