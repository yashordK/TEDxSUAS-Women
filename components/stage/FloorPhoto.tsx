"use client";

import { Suspense, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

/**
 * Photographed stage floor (public/images/stage-floor.webp, the bottom 22% of
 * originals/home-hero-source.png) laid over the glossy base floor.
 *
 * It sits on its own stage-sized plane rather than the 90×90 base: clamped across the
 * whole base, the strip's edge pixels would smear into streaks. An alpha mask fades the
 * far edge, the near edge and the right edge out, and the whole left side (the headline
 * side) to nothing, so there is no seam and the copy area stays black.
 *
 * The texture is multiplied by a near-black colour so it never reads brighter than the
 * old floor; the spotlight still lights it because the material is lit (standard).
 */

// Plane size (world units). The strip is ~8:1; 24×8 is a 3:1 plane, i.e. a mild
// stretch along depth so the reflections lengthen like polished stage boards.
const W = 24;
const D = 8;
// The photo's mic base sits ~75% across the strip; put that point under the 3D mic (x=0).
const X = -(0.75 - 0.5) * W;
// Far edge just behind the mic, the rest running toward the camera.
const Z = D / 2 - 1.2;

function useFadeMask() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 128;
    const g = c.getContext("2d")!;
    const img = g.createImageData(c.width, c.height);
    const ss = (a: number, b: number, x: number) => {
      const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };
    for (let y = 0; y < c.height; y++) {
      // canvas row 0 = texture top = far edge (flipY)
      const v = 1 - y / (c.height - 1);
      const depth = (1 - ss(0.72, 1, v)) * ss(0, 0.18, v);
      for (let x = 0; x < c.width; x++) {
        const u = x / (c.width - 1);
        const side = ss(0.32, 0.6, u) * (1 - ss(0.9, 1, u));
        const a = Math.round(255 * depth * side);
        const i = (y * c.width + x) * 4;
        img.data.set([a, a, a, 255], i);
      }
    }
    g.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    return t;
  }, []);
}

function FloorPlane({ src }: { src: string }) {
  const gl = useThree((s) => s.gl);
  const map = useTexture(src);
  const alphaMap = useFadeMask();

  useMemo(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = gl.capabilities.getMaxAnisotropy();
    map.wrapS = map.wrapT = THREE.ClampToEdgeWrapping;
    map.needsUpdate = true;
  }, [map, gl]);

  return (
    <mesh rotation-x={-Math.PI / 2} position={[X, 0.003, Z]} renderOrder={1} receiveShadow>
      <planeGeometry args={[W, D]} />
      <meshStandardMaterial
        map={map}
        alphaMap={alphaMap}
        transparent
        depthWrite={false}
        // multiply: keeps the photo at or below the old floor's brightness
        color="#5a4a4c"
        roughness={0.35}
        metalness={0.5}
        polygonOffset
        polygonOffsetFactor={-2}
      />
    </mesh>
  );
}

/** Low-res strip first (≈0.6 KB), then the 2048px one, so first paint never waits on it. */
export function FloorPhoto() {
  return (
    <Suspense fallback={null}>
      <Suspense fallback={<FloorPlane src="/images/stage-floor-lowres.webp" />}>
        <FloorPlane src="/images/stage-floor.webp" />
      </Suspense>
    </Suspense>
  );
}
