"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import * as THREE from "three";
import { ease, useStage } from "./StageContext";

const INTRO_SECONDS = 2.8;
const FROM = new THREE.Vector3(0, 4.6, 19);
const TO = new THREE.Vector3(0, 3.4, 13.2);
const LOOK = new THREE.Vector3(0, 1.75, -0.4);

/** Intro dolly, pointer parallax with damping, and a slow idle drift. */
export function CameraRig() {
  const runtime = useStage();
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const startAt = useRef<number | null>(null);
  const look = useMemo(() => LOOK.clone(), []);
  const base = useMemo(() => new THREE.Vector3(), []);
  const goal = useMemo(() => new THREE.Vector3(), []);

  // Frame the stage to the right of the copy on wide screens.
  useEffect(() => {
    const aspect = size.width / size.height;
    camera.fov = aspect < 1 ? 38 : 30;
    camera.filmGauge = 35;
    camera.filmOffset = -Math.min(8, Math.max(0, (aspect - 1.15) * 11));
    camera.updateProjectionMatrix();
  }, [camera, size]);

  useEffect(() => {
    camera.position.copy(runtime.reducedMotion ? TO : FROM);
    camera.lookAt(LOOK);
  }, [camera, runtime.reducedMotion]);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    if (runtime.started && startAt.current === null) startAt.current = t;

    let p = 0;
    if (runtime.started) {
      p = runtime.reducedMotion ? 1 : Math.min(1, (t - (startAt.current ?? t)) / INTRO_SECONDS);
    }
    runtime.intro.value = p;

    const k = ease.inOutCubic(p);
    base.lerpVectors(FROM, TO, k);

    const drift = runtime.reducedMotion ? 0 : 1;
    const par = runtime.reducedMotion ? 0.4 : 1;
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
    easing.damp3(look, [LOOK.x + runtime.pointer.x * 0.12, LOOK.y + runtime.pointer.y * 0.06, LOOK.z], 0.4, dt);
    camera.lookAt(look);
  });

  return null;
}
