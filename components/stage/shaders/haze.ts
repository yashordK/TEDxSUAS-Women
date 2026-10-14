import { noiseGLSL } from "./noise";

// Smoke / haze sheet: fbm with slow drift, feathered on every edge.
export const hazeVertex = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorldPos;
void main() {
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

export const hazeFragment = /* glsl */ `
uniform float uTime;
uniform float uOpacity;
uniform float uSeed;
uniform vec3 uColor;
uniform float uIntro;
varying vec2 vUv;
varying vec3 vWorldPos;

${noiseGLSL}

void main() {
  vec3 p = vec3(vUv * vec2(3.0, 1.6), uSeed);
  p.x += uTime * 0.025;
  p.y += uTime * 0.008;
  // Domain warp gives curling, smoke-like shapes instead of blobby clouds.
  float w = fbm(p + vec3(0.0, 0.0, uTime * 0.03));
  float n = fbm(p * 1.4 + vec3(w * 1.8, w * 0.9, uTime * 0.02));
  float smoke = smoothstep(0.32, 0.85, n);

  float edge = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x);
  edge *= smoothstep(0.0, 0.18, vUv.y) * smoothstep(1.0, 0.45, vUv.y);

  // Warmer and denser where the spotlight column passes.
  float beam = exp(-pow(vWorldPos.x / 1.1, 2.0));
  vec3 col = mix(uColor, vec3(1.0, 0.82, 0.74), beam * 0.55);

  float a = smoke * edge * uOpacity * (0.55 + beam * 0.9) * uIntro;
  gl_FragColor = vec4(col * a, 1.0); // premultiplied, additive
}
`;

// Soft radial glow card (halo behind the X, floor bounce).
export const glowFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uIntensity;
uniform float uTime;
varying vec2 vUv;
void main() {
  vec2 d = (vUv - 0.5) * 2.0;
  float r = length(d * vec2(1.0, 1.15));
  float g = exp(-r * r * 1.7);
  g *= 0.94 + 0.06 * sin(uTime * 0.6);
  gl_FragColor = vec4(uColor * g * uIntensity, 1.0); // premultiplied, additive
}
`;
