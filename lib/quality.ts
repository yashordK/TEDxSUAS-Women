import type { QualityTier } from "@/components/stage/StageContext";

const LOW_END_GPU = /(intel\(r\) (hd|uhd)|mali-[gt]?[0-7]\d|adreno \(tm\) [3-5]\d\d|powervr|swiftshader|llvmpipe|microsoft basic)/i;

interface Probe {
  supported: boolean;
  renderer: string;
}
let probe: Probe | null = null;

/**
 * One throwaway context, released immediately and cached: browsers cap live
 * contexts and drop the oldest, which would otherwise be the stage itself.
 */
function probeWebGL(): Probe {
  if (probe) return probe;
  probe = { supported: false, renderer: "" };
  try {
    const gl = document.createElement("canvas").getContext("webgl");
    if (gl) {
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      probe = { supported: true, renderer: ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : "" };
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    // keep the unsupported default
  }
  return probe;
}

export function supportsWebGL(): boolean {
  return probeWebGL().supported;
}

/** Mobile or weak GPUs get no reflector, no DOF and fewer particles. */
export function detectQualityTier(): QualityTier {
  if (typeof window === "undefined") return "low";
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 768;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const weakCpu = (nav.hardwareConcurrency ?? 8) <= 4;
  const lowMem = (nav.deviceMemory ?? 8) <= 4;

  const weakGpu = LOW_END_GPU.test(probeWebGL().renderer);

  return coarse || narrow || weakGpu || (weakCpu && lowMem) ? "low" : "high";
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
