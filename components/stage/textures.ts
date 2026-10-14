import * as THREE from "three";

function makeTexture(data: Uint8Array, size: number, colorSpace: THREE.ColorSpace) {
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.anisotropy = 8;
  tex.colorSpace = colorSpace;
  tex.needsUpdate = true;
  return tex;
}

function heightToNormal(h: Float32Array, size: number, strength: number) {
  const out = new Uint8Array(size * size * 4);
  const at = (x: number, y: number) => h[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
      const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
      const len = Math.hypot(dx, dy, 1);
      const i = (y * size + x) * 4;
      out[i] = ((-dx / len) * 0.5 + 0.5) * 255;
      out[i + 1] = ((-dy / len) * 0.5 + 0.5) * 255;
      out[i + 2] = ((1 / len) * 0.5 + 0.5) * 255;
      out[i + 3] = 255;
    }
  }
  return out;
}

export interface GrilleMaps {
  map: THREE.DataTexture;
  normalMap: THREE.DataTexture;
  roughnessMap: THREE.DataTexture;
}

/** Woven wire-mesh grille: round perforations in a knurled lattice. */
export function createGrilleMaps(size = 256, cells = 16): GrilleMaps {
  const h = new Float32Array(size * size);
  const color = new Uint8Array(size * size * 4);
  const rough = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x / size) * cells;
      const v = (y / size) * cells;
      // Offset every other row for a hex-ish perforation pattern.
      const row = Math.floor(v);
      const fu = (u + (row % 2) * 0.5) % 1;
      const fv = v % 1;
      const d = Math.hypot(fu - 0.5, fv - 0.5);
      const hole = 1 - smoothstep(0.24, 0.34, d);
      const weave = 0.08 * Math.sin((u + v) * Math.PI * 2) * Math.sin((u - v) * Math.PI * 2);
      const height = 1 - hole + weave * (1 - hole);
      h[y * size + x] = height;
      const i = (y * size + x) * 4;
      const c = 18 + (1 - hole) * 150 + weave * 120;
      color[i] = color[i + 1] = c;
      color[i + 2] = c * 1.04;
      color[i + 3] = 255;
      const r = 70 + hole * 170 + Math.random() * 18;
      rough[i] = rough[i + 1] = rough[i + 2] = r;
      rough[i + 3] = 255;
    }
  }
  return {
    map: makeTexture(color, size, THREE.SRGBColorSpace),
    normalMap: makeTexture(heightToNormal(h, size, 2.2), size, THREE.NoColorSpace),
    roughnessMap: makeTexture(rough, size, THREE.NoColorSpace),
  };
}

/** Brushed-metal roughness: fine streaks running along U. */
export function createBrushedRoughness(size = 256): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  const rowNoise = new Float32Array(size);
  let acc = 0;
  for (let y = 0; y < size; y++) {
    acc = acc * 0.6 + Math.random() * 0.4;
    rowNoise[y] = acc;
  }
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const v = 60 + rowNoise[y] * 70 + Math.random() * 14;
      data[i] = data[i + 1] = data[i + 2] = v;
      data[i + 3] = 255;
    }
  }
  return makeTexture(data, size, THREE.NoColorSpace);
}

/** Tileable fibre noise used as a bump map for the carpet disc and floor. */
export function createFiberNoise(size = 256): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const v = 110 + Math.random() * 60;
    data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = v;
    data[i * 4 + 3] = 255;
  }
  return makeTexture(data, size, THREE.NoColorSpace);
}

/** Radial gradient (white centre → black) as a canvas texture. */
export function createRadialTexture(stops: [number, string][], size = 512): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [o, c] of stops) g.addColorStop(o, c);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
