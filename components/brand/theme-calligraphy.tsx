"use client";

import Image from "next/image";
import { useState } from "react";
import { site } from "@/lib/site";

const SRC = "/brand/logo-theme.png";
const REVEAL = "2.6s cubic-bezier(0.65, 0, 0.35, 1)";

/**
 * Theme calligraphy with a left→right mask reveal (the white→red direction of the
 * artwork), a glowing pen edge riding the reveal, then a slow infinite shimmer.
 *
 * The artwork ships on black, so the stack is isolated and screen-blended onto the
 * page: black drops out, strokes stay, and the shimmer (overlay blend) only lights
 * the strokes. Falls back to live Devanagari type if the PNG is missing.
 * Reduced motion: globals.css collapses every keyframe to its end state.
 */
export function ThemeCalligraphy({
  delay = 0.4,
  className = "",
  priority = false,
}: {
  delay?: number;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  const mask: React.CSSProperties = {
    WebkitMaskImage:
      "linear-gradient(90deg, #000 0%, #000 40%, transparent 60%, transparent 100%)",
    maskImage: "linear-gradient(90deg, #000 0%, #000 40%, transparent 60%, transparent 100%)",
    WebkitMaskSize: "300% 100%",
    maskSize: "300% 100%",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    animation: `calligraphy-reveal ${REVEAL} ${delay}s both`,
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* mask creates its own group, so the screen blend must live on this element */}
      <div
        className={`relative aspect-[1460/330] w-full ${failed ? "" : "mix-blend-screen"}`}
        style={mask}
      >
        {failed ? (
          <span
            lang="sa"
            className="font-deva text-gradient absolute inset-0 flex items-center justify-center whitespace-nowrap text-[clamp(2.75rem,12vw,10rem)] font-extrabold leading-none"
          >
            {site.theme.devanagari}
          </span>
        ) : (
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={SRC}
              alt=""
              fill
              priority={priority}
              sizes="(min-width: 1280px) 1180px, 100vw"
              className="object-contain"
              onError={() => setFailed(true)}
            />
            {/* shimmer band: overlay blend leaves the black untouched, brightens strokes */}
            <span
              aria-hidden
              data-motion="decorative"
              className="absolute inset-y-[-20%] left-0 w-1/4 bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.85),transparent)] mix-blend-overlay"
              style={{
                transform: "translateX(-120%) skewX(-18deg)",
                animation: `shimmer-sweep 7s ease-in-out ${delay + 2.8}s infinite`,
              }}
            />
          </div>
        )}
      </div>

      {/* pen edge: tracks the mask's soft edge (same duration + easing) */}
      <div
        aria-hidden
        data-motion="decorative"
        className="pointer-events-none absolute inset-0"
        style={{ animation: `pen-sweep ${REVEAL} ${delay}s both` }}
      >
        <span className="absolute inset-y-[-10%] left-0 w-px bg-white shadow-[0_0_24px_6px_var(--red),0_0_80px_20px_rgb(235_0_40/0.45)]" />
      </div>
    </div>
  );
}
