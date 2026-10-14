// Colour grade for postprocessing's Effect: crushed blacks, crimson shadows,
// slightly desaturated non-red hues, soft S-curve. Runs after tone mapping.
export const gradeFragment = /* glsl */ `
uniform float uStrength;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 c = inputColor.rgb;
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));

  // Crush the blacks.
  c = max(c - 0.006, 0.0) * 1.012;

  // Pull greens/blues out unless the pixel is near-white (spotlight).
  float redness = clamp(c.r - max(c.g, c.b), 0.0, 1.0);
  vec3 grey = vec3(l);
  c = mix(mix(grey, c, 0.82), c, max(redness * 2.0, smoothstep(0.55, 0.95, l)));

  // Shadows toward deep crimson, highlights stay warm white.
  float shadow = 1.0 - smoothstep(0.0, 0.35, l);
  c = mix(c, c * vec3(1.18, 0.78, 0.82), shadow * 0.6);

  // Gentle S-curve.
  vec3 s = c * c * (3.0 - 2.0 * c);
  c = mix(c, s, 0.28);

  outputColor = vec4(mix(inputColor.rgb, c, uStrength), inputColor.a);
}
`;
