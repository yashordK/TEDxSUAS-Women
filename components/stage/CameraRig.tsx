"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import * as THREE from "three";
import { ease, useStage } from "./StageContext";
import { MIC_TARGET } from "./Lights";
import { leftFade } from "./shaders/patch";

const INTRO_SECONDS = 2.8;

interface Framing {
  fov: number;
  filmOffset: number;
  from: THREE.Vector3;
  to: THREE.Vector3;
  look: THREE.Vector3;
  /** Pointer parallax strength. */
  parallax: number;
  /** Vertical view shift as a fraction of the canvas height (portrait only). */
  shiftY: number;
}

/** Open band between the hero title and the bottom copy, as fractions of the viewport height. */
type Band = { top: number; bottom: number };
const DEFAULT_BAND: Band = { top: 0.33, bottom: 0.64 };

/** Measures the band on narrow screens, where the stage shows between the two text blocks. */
function measureBand(): Band {
  const title = document.querySelector(".hero-title");
  const copy = document.querySelector("[data-hero-bottom]");
  if (!title || !copy) return DEFAULT_BAND;
  const h = window.innerHeight;
  const top = title.getBoundingClientRect().bottom / h;
  const bottom = copy.getBoundingClientRect().top / h;
  return bottom - top > 0.1 ? { top, bottom } : DEFAULT_BAND;
}

/** Mic height in world units: stand 1.42 + head ≈ 1.67, × MIC_SCALE 1.6. */
const MIC_H = 2.67;

/**
 * Wide screens: stage to the right of the copy. Portrait: the mic is fitted into the
 * open band between the title and the bottom copy, as large as the band allows, so
 * no text ever sits on it (≈ 30–35% of the screen height on a 390×844 phone).
 */
function getFraming(aspect: number, height: number, band: Band): Framing {
  if (aspect >= 1) {
    // Landscape phones / very short windows: pull back so the mic reads smaller
    // and the whole stage stays in frame under the strip.
    // Low camera ~10° above the floor plane, tight 18° lens, looking at the mic.
    const k = height <= 520 ? 1.18 : 1;
    const dist = 21 * k;
    const elev = THREE.MathUtils.degToRad(10);
    const look = new THREE.Vector3(...MIC_TARGET);
    const to = new THREE.Vector3(0, look.y + dist * Math.sin(elev), dist * Math.cos(elev));
    return {
      fov: 18,
      filmOffset: -Math.min(8, Math.max(0, (aspect - 1.15) * 11)),
      from: to.clone().multiplyScalar(1.1),
      to,
      look,
      parallax: 0.5,
      shiftY: 0,
    };
  }
  const fov = 45;
  const tanHalf = Math.tan(THREE.MathUtils.degToRad(fov / 2));
  // Mic fills 86% of the band (a little air above the head and below the base).
  const frac = Math.max(0.18, (band.bottom - band.top) * 0.86);
  const d = MIC_H / (frac * 2 * tanHalf);
  const midY = MIC_H / 2;
  return {
    fov,
    filmOffset: 0,
    from: new THREE.Vector3(0, midY + d * 0.32, d * 1.3),
    to: new THREE.Vector3(0, midY + d * 0.2, d),
    look: new THREE.Vector3(0, midY, 0),
    parallax: 0.6,
    // The look point lands mid-screen; shift the view so it lands mid-band instead.
    shiftY: 0.5 - (band.top + band.bottom) / 2,
  };
}

/** Intro dolly, pointer parallax with damping, and a slow idle drift. */
export function CameraRig() {
  const runtime = useStage();
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const startAt = useRef<number | null>(null);
  const [band, setBand] = useState<Band>(DEFAULT_BAND);
  const framing = useMemo(
    () => getFraming(size.width / size.height, size.height, band),
    [size.width, size.height, band],
  );

  // Re-measure the open band when the layout settles (fonts, resize).
  useEffect(() => {
    const update = () =>
      setBand((prev) => {
        const next = measureBand();
        return Math.abs(next.top - prev.top) + Math.abs(next.bottom - prev.bottom) > 0.005 ? next : prev;
      });
    update();
    document.fonts?.ready.then(update);
    const ro = new ResizeObserver(update);
    const copy = document.querySelector("[data-hero-bottom]");
    if (copy) ro.observe(copy);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [size.width, size.height]);
  const look = useMemo(() => new THREE.Vector3(), []);
  const base = useMemo(() => new THREE.Vector3(), []);
  const goal = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const portrait = size.width / size.height < 1;
    leftFade.uFadeX0.value = portrait ? -40 : -6.5;
    leftFade.uFadeX1.value = portrait ? -39 : -1.2;
  }, [size.width, size.height]);

  useEffect(() => {
    camera.fov = framing.fov;
    camera.filmGauge = 35;
    camera.filmOffset = framing.filmOffset;
    if (framing.shiftY) {
      camera.setViewOffset(size.width, size.height, 0, framing.shiftY * size.height, size.width, size.height);
    } else {
      camera.clearViewOffset();
    }
    camera.updateProjectionMatrix();
    look.copy(framing.look);
  }, [camera, framing, look, size.width, size.height]);

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
      base.z * (1 + Math.sin(t * 0.09) * 0.03 * drift),
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
