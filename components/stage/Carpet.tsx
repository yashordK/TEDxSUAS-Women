"use client";

import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { CARPET_RADIUS } from "./Lights";
import { patchStageMaterial } from "./shaders/patch";

/** Soft contact darkening on the wood just around the carpet edge. */
function edgeShadowTexture() {
  const s = 256;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d")!;
  const outer = 1.25; // texture radius in carpet radii
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  const at = (r: number) => r / outer;
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(at(0.94), "rgba(0,0,0,0)");
  grad.addColorStop(at(1.0), "rgba(0,0,0,0.7)");
  grad.addColorStop(at(1.25) - 0.0001, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  return { texture: new THREE.CanvasTexture(c), outer };
}

/**
 * Red pile circle, 2 mm above the wood. Fibres catch the light through a bump map from
 * the same photo; no reflections (roughness 0.95, no env); a darker rim at the edge.
 */
export function Carpet() {
  const gl = useThree((s) => s.gl);
  const map = useTexture("/images/stage/carpet.webp");

  const { material, edge } = useMemo(() => {
    const aniso = gl.capabilities.getMaxAnisotropy();
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(4, 4);
    map.anisotropy = aniso;
    map.needsUpdate = true;

    // Bump uses the same pixels, read as data (not colour-managed).
    const bump = map.clone();
    bump.colorSpace = THREE.NoColorSpace;
    bump.needsUpdate = true;

    const material = patchStageMaterial(
      new THREE.MeshStandardMaterial({
        map,
        bumpMap: bump,
        bumpScale: 1.2,
        roughness: 0.95,
        metalness: 0,
        envMapIntensity: 0,
        color: "#d0c8c8",
      }),
      { post: "gl_FragColor.rgb *= mix(1.0, 0.35, smoothstep(CARPET_R - 0.55, CARPET_R, length(vStageWorld.xz)));".replaceAll("CARPET_R", CARPET_RADIUS.toFixed(2)) },
    );
    return { material, edge: edgeShadowTexture() };
  }, [map, gl]);

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position-y={0.001} renderOrder={1}>
        <circleGeometry args={[CARPET_RADIUS * edge.outer, 96]} />
        <meshBasicMaterial color="#000000" alphaMap={edge.texture} transparent depthWrite={false} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.002} receiveShadow material={material}>
        <circleGeometry args={[CARPET_RADIUS, 128]} />
      </mesh>
    </group>
  );
}
