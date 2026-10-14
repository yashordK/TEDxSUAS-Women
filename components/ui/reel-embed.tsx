"use client";

import { useState } from "react";

/**
 * Instagram reel behind a click-to-load facade: the heavy third-party embed (and its
 * cookies) only loads when someone asks for it, which keeps Lighthouse happy.
 */
export function ReelEmbed({ url, title = "TEDxSUAS on Instagram" }: { url: string; title?: string }) {
  const [active, setActive] = useState(false);
  const embed = `${url.replace(/\/?$/, "/")}embed/`;

  return (
    <div className="relative aspect-[9/14] w-full overflow-hidden border border-line bg-black">
      {active ? (
        <iframe
          src={embed}
          title={title}
          className="absolute inset-0 h-full w-full bg-white"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group absolute inset-0 flex flex-col items-center justify-center gap-6"
          aria-label={`Play video: ${title}`}
        >
          <span
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgb(235_0_40/0.35),transparent_65%)] transition-opacity duration-700 group-hover:opacity-70"
          />
          <span aria-hidden className="grain absolute inset-0 opacity-[0.08]" />
          <span className="relative flex size-20 items-center justify-center rounded-full border border-red bg-red/10 transition-transform duration-500 ease-out-expo group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="ml-1 size-7 fill-white" aria-hidden>
              <path d="M7 4.5v15l13-7.5z" />
            </svg>
          </span>
          <span className="eyebrow relative text-white">Watch the reel</span>
          <span className="relative text-xs text-grey">Loads from Instagram</span>
        </button>
      )}
    </div>
  );
}
