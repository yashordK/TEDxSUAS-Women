import { noiseGLSL } from "./noise";

// Volumetric spotlight cone. Open-ended ConeGeometry, apex at the lamp.
export const beamVertex = /* glsl */ `
varying vec3 vWorldPos;
varying vec3 vNormalW;
varying float vAlong; // 0 at floor, 1 at the lamp

void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldPos = wp.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vAlong = uv.y;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

export const beamFragment = /* glsl */ `
uniform float uTime;
uniform float uIntensity;
uniform vec3 uColor;
varying vec3 vWorldPos;
varying vec3 vNormalW;
varying float vAlong;

${noiseGLSL}

void main() {
  vec3 V = normalize(cameraPosition - vWorldPos);
  // Fresnel falloff: dense through the core, dissolving at the silhouette.
  // Guards: the apex normal can collapse to ~0, and pow() of a negative is undefined.
  // A single NaN here gets smeared across the whole frame by bloom.
  vec3 N = vNormalW;
  float nl = length(N);
  float facing = nl > 1e-4 ? abs(dot(N / nl, V)) : 0.0;
  float core = pow(clamp(facing, 0.0, 1.0), 1.6);

  // Brighter at the source, softly fading before it hits the floor.
  float t = clamp(vAlong, 0.0, 1.0);
  float along = mix(0.35, 1.0, pow(t, 1.3));
  along *= smoothstep(0.0, 0.12, t);

  // Drifting smoke inside the beam.
  vec3 p = vWorldPos * vec3(1.6, 0.55, 1.6) + vec3(0.0, -uTime * 0.12, uTime * 0.05);
  float n = fbm(p);
  float smoke = mix(0.45, 1.25, smoothstep(0.25, 0.75, n));

  float a = core * along * smoke * uIntensity;
  a = (a == a) ? clamp(a, 0.0, 4.0) : 0.0; // drop NaN/inf
  gl_FragColor = vec4(uColor * a, 1.0); // premultiplied, additive
}
`;
