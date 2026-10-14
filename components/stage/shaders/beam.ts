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
  float facing = abs(dot(normalize(vNormalW), V));
  float core = pow(facing, 1.6);

  // Brighter at the source, softly fading before it hits the floor.
  float along = mix(0.35, 1.0, pow(vAlong, 1.3));
  along *= smoothstep(0.0, 0.12, vAlong);

  // Drifting smoke inside the beam.
  vec3 p = vWorldPos * vec3(1.6, 0.55, 1.6) + vec3(0.0, -uTime * 0.12, uTime * 0.05);
  float n = fbm(p);
  float smoke = mix(0.45, 1.25, smoothstep(0.25, 0.75, n));

  float a = core * along * smoke * uIntensity;
  gl_FragColor = vec4(uColor * a, 1.0); // premultiplied, additive
}
`;
