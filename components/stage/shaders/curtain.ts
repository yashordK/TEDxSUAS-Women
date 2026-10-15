import { noiseGLSL } from "./noise";

// Heavy velvet drape: pleats + sway in the vertex shader, analytic normals.
export const curtainVertex = /* glsl */ `
uniform float uTime;
uniform float uFolds;
uniform float uDepth;
uniform float uSway;
varying vec3 vNormalV;
varying vec3 vViewPos;
varying vec2 vUv;
varying float vFold;

void main() {
  vUv = uv;
  float k = uFolds * 6.2831853;
  // Pleats are irregular: two frequencies, gathered tighter at the top.
  float gather = mix(1.0, 0.55, uv.y);
  float ph = uv.x * k + sin(uv.x * 9.0) * 0.8;
  float pleat = sin(ph) * 0.75 + sin(ph * 2.07 + 1.3) * 0.25;
  float hang = 1.0 - uv.y; // the hem moves, the rod does not
  float sway = sin(uTime * 0.55 + uv.x * 2.4 + uv.y * 1.2) * uSway * hang * hang;

  vec3 p = position;
  p.z += pleat * uDepth * gather + sway;
  p.x += sway * 0.35;

  // d(z)/d(x) along the pleat for the normal (width is baked into k / size).
  float dz = (cos(ph) * 0.75 + cos(ph * 2.07 + 1.3) * 0.52) * uDepth * gather * k / 4.0;
  vec3 n = normalize(vec3(-dz, 0.0, 1.0));

  vFold = pleat * 0.5 + 0.5;
  vNormalV = normalize(normalMatrix * n);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vViewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

export const curtainFragment = /* glsl */ `
uniform vec3 uBase;
uniform vec3 uSheen;
uniform vec3 uKeyDirV;
uniform float uIntro;
uniform float uSide;
varying vec3 vNormalV;
varying vec3 vViewPos;
varying vec2 vUv;
varying float vFold;

${noiseGLSL}

void main() {
  vec3 N = normalize(vNormalV);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(-vViewPos);
  float NdV = clamp(dot(N, V), 0.0, 1.0);

  // Velvet: dark when facing you, bright sheen at grazing angles.
  float sheen = pow(1.0 - NdV, 3.2);
  float wrap = clamp((dot(N, normalize(uKeyDirV)) + 0.45) / 1.45, 0.0, 1.0);
  float folds = mix(0.12, 1.0, smoothstep(0.05, 0.95, vFold));

  // Pile texture so it does not read as plastic.
  float pile = 0.85 + 0.3 * vnoise(vec3(vUv * vec2(260.0, 40.0), 1.0));

  // Lit from stage-side and below, falling into black at the top.
  float vertical = smoothstep(1.0, 0.15, vUv.y) * 0.85 + 0.15;
  float stageSide = mix(0.35, 1.0, uSide);

  vec3 col = uBase * wrap * folds * pile;
  col += uSheen * sheen * folds * 0.9;
  col *= vertical * stageSide * uIntro;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
