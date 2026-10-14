// Dust motes: only visible while they drift through the spotlight cone.
export const dustVertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uBeamTop;
uniform float uBeamRadius;
attribute float aSeed;
attribute float aSize;
varying float vAlpha;

void main() {
  vec3 p = position;
  float t = uTime;
  p.y = mod(p.y + t * (0.025 + aSeed * 0.03), uBeamTop);
  p.x += sin(t * 0.21 + aSeed * 37.0) * 0.12;
  p.z += cos(t * 0.17 + aSeed * 19.0) * 0.12;

  float coneR = uBeamRadius * (uBeamTop - p.y) / uBeamTop;
  float dist = length(p.xz);
  float inBeam = 1.0 - smoothstep(coneR * 0.55, coneR * 1.05, dist);
  float twinkle = 0.55 + 0.45 * sin(t * (1.0 + aSeed * 2.0) + aSeed * 60.0);
  vAlpha = inBeam * twinkle * smoothstep(0.0, 0.4, p.y);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = aSize * uPixelRatio * (42.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;

export const dustFragment = /* glsl */ `
uniform float uIntensity;
varying float vAlpha;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.0, d);
  a = a * a * vAlpha * uIntensity;
  gl_FragColor = vec4(vec3(1.0, 0.9, 0.82) * a, 1.0); // premultiplied, additive
}
`;
