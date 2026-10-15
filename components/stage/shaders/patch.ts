import * as THREE from "three";

/**
 * Shared world-space fade for the stage materials: the headline side (world -x) falls
 * to black. Uniforms are shared so the camera rig can switch it off in portrait,
 * where the mic is centred and both sides of the stage are on screen.
 */
export const leftFade = {
  uFadeX0: { value: -6.5 },
  uFadeX1: { value: -1.2 },
};

/**
 * Patches a built-in material: adds a world-position varying, the left fade, and an
 * optional snippet run after lighting (`post`) and after the roughness map (`rough`).
 * Snippets can use `vStageWorld` (vec3).
 */
export function patchStageMaterial<M extends THREE.Material>(
  mat: M,
  opts: { post?: string; rough?: string } = {},
): M {
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, leftFade);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vStageWorld;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvStageWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vStageWorld;\nuniform float uFadeX0;\nuniform float uFadeX1;",
      )
      .replace("#include <roughnessmap_fragment>", `#include <roughnessmap_fragment>\n${opts.rough ?? ""}`)
      .replace(
        "#include <dithering_fragment>",
        `#include <dithering_fragment>\n${opts.post ?? ""}\ngl_FragColor.rgb *= smoothstep(uFadeX0, uFadeX1, vStageWorld.x);`,
      );
  };
  mat.customProgramCacheKey = () => `stage:${opts.post ?? ""}:${opts.rough ?? ""}`;
  return mat;
}
