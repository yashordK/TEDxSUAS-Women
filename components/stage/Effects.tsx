"use client";

import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  DepthOfField,
  EffectComposer,
  Noise,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, Effect, ToneMappingMode } from "postprocessing";
import * as THREE from "three";
import { gradeFragment } from "./shaders/grade";
import { MIC_TARGET } from "./Lights";
import { useStage } from "./StageContext";

class GradeEffect extends Effect {
  constructor(strength = 1) {
    super("GradeEffect", gradeFragment, {
      uniforms: new Map([["uStrength", new THREE.Uniform(strength)]]),
    });
  }
}

export function Effects() {
  const { tier } = useStage();
  const narrow = useThree((st) => st.size.width < 768);
  // Phones and weak GPUs: no DoF, no chromatic aberration.
  const high = tier === "high" && !narrow;
  const grade = useMemo(() => new GradeEffect(1), []);
  const caOffset = useMemo(() => new THREE.Vector2(0.0006, 0.0004), []); // edges only (radial)

  if (!high) {
    return (
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={0.9} luminanceSmoothing={0.15} intensity={0.9} radius={0.7} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <primitive object={grade} />
        <Vignette offset={0.28} darkness={0.82} />
        <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.14} />
      </EffectComposer>
    );
  }

  return (
    // multisampling > 0 renders black on ANGLE/D3D11 with this effect chain.
    <EffectComposer multisampling={0}>
      {/* focus on the mic; the backdrop 6 units behind goes soft */}
      <DepthOfField target={MIC_TARGET} focalLength={0.045} bokehScale={1.2} height={540} />
      <Bloom mipmapBlur luminanceThreshold={0.92} luminanceSmoothing={0.15} intensity={0.6} radius={0.7} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <primitive object={grade} />
      <ChromaticAberration offset={caOffset} radialModulation modulationOffset={0.45} />
      <Vignette offset={0.26} darkness={0.85} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.14} />
    </EffectComposer>
  );
}
