"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import * as THREE from "three";
import { ease, useStage } from "./StageContext";

const INTRO_SECONDS = 2.8;

interface Framing {
  fov: number;
  filmOffset: number;
  from: THREE.Vector3;
  to: THREE.Vector3;
  look: THREE.Vector3;
  /** Pointer parallax strength. */
  parallax: number;
}

/**
 * Wide screens: stage to the right of the copy. Portrait: the camera pulls back
 * so the disc spans most of the width, and aims above the mic so the stage sits
 * in the lower part of the frame, under the copy.
 */
function getFraming(aspect: number): Framing {
  if (aspect >= 1) {
    return {
      fov: 30,
      filmOffset: -Math.min(8, Math.max(0, (aspect - 1.15) * 11)),
      from: new THREE.Vector3(0, 4.6, 19),
      to: new THREE.Vector3(0, 3.4, 13.2),
      look: new THREE.Vector3(0, 1.75, -0.4),
      parallax: 1,
    };
  }
  const fov = 45;
  const tanHalf = Math.tan(THREE.MathUtils.degToRad(fov / 2));
  // Half-width of the floor to show at the disc: phones ≈ disc + a margin,
  // tablets a little wider so curtains show on both sides.
  const halfWidth = THREE.MathUtils.lerp(4.15, 5.4, THREE.MathUtils.clamp((aspect - 0.46) / 0.3, 0, 1));
  const d = halfWidth / (tanHalf * aspect);
  return {
    fov,
    filmOffset: 0,
    from: new THREE.Vector3(0, d * 0.28, d * 1.3),
    to: new THREE.Vector3(0, d * 0.2, d),
    look: new THREE.Vector3(0, d * 0.245, 0),
    parallax: 0.6,
  };
}

/** Intro dolly, pointer parallax with damping, and a slow idle drift. */
export function CameraRig() {
  const runtime = useStage();
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const startAt = useRef<number | null>(null);
  const framing = useMemo(() => getFraming(size.width / size.height), [size.width, size.height]);
  const look = useMemo(() => new THREE.Vector3(), []);
  const base = useMemo(() => new THREE.Vector3(), []);
  const goal = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    camera.fov = framing.fov;
    camera.filmGauge = 35;
    camera.filmOffset = framing.filmOffset;
    camera.updateProjectionMatrix();
    look.copy(framing.look);
  }, [camera, framing, look]);

  useEffect(() => {
    camera.position.copy(runtime.reducedMotion ? framing.to : framing.from);
    camera.lookAt(framing.look);
  }, [camera, framing, runtime.reducedMotion]);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    if (runtime.started && startAt.current === null) startAt.current = t;

    let p = 0;
    if (runtime.started) {
      p = runtime.reducedMotion ? 1 : Math.min(1, (t - (startAt.current ?? t)) / INTRO_SECONDS);
    }
    runtime.intro.value = p;

    base.lerpVectors(framing.from, framing.to, ease.inOutCubic(p));

    const drift = runtime.reducedMotion ? 0 : 1;
    const par = (runtime.reducedMotion ? 0.4 : 1) * framing.parallax;
    goal.set(
      base.x + runtime.pointer.x * 0.55 * par + Math.sin(t * 0.13) * 0.18 * drift,
      base.y + runtime.pointer.y * 0.22 * par + Math.sin(t * 0.21) * 0.06 * drift,
      base.z + Math.sin(t * 0.09) * 0.12 * drift,
    );

    if (p < 1 && !runtime.reducedMotion) {
      camera.position.copy(goal);
    } else {
      easing.damp3(camera.position, goal, 0.55, dt);
    }
    const L = framing.look;
    easing.damp3(look, [L.x + runtime.pointer.x * 0.12 * par, L.y + runtime.pointer.y * 0.06 * par, L.z], 0.4, dt);
    camera.lookAt(look);
  });

  return null;
}
