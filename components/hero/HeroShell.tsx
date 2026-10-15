"use client";

import { getImageProps } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Loader } from "@/components/Loader";
import { prefersReducedMotion } from "@/lib/quality";
import { BottomStrip } from "./BottomStrip";
import { HeroCopy } from "./HeroCopy";
import { Nav } from "./Nav";

type Phase = "loading" | "live";

// Art direction: wide stage on desktop/tablet, a 4:5 crop centred on the mic on phones.
const common = { alt: "", fill: true, priority: true, sizes: "100vw" } as const;
const desktop = getImageProps({ ...common, src: "/images/home-hero.webp" }).props;
const mobile = getImageProps({ ...common, src: "/images/home-hero-mobile.webp" }).props;

/**
 * Home hero over a static stage photo (the 3D scene in components/stage/* is no longer
 * imported here, so three.js stays out of the home bundle). Motion is CSS only:
 * a slow 24s push-in and a pulsing glow on the spotlight, both off under reduced motion.
 */
export function HeroShell() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [sceneReady, setSceneReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
    // the priority image may finish before hydration attaches onLoad
    if (img.current?.complete) setSceneReady(true);
    // Never trap people behind the loader if the image stalls.
    const t = window.setTimeout(() => setSceneReady(true), 6000);
    return () => window.clearTimeout(t);
  }, []);

  const onImageReady = useCallback(() => setSceneReady(true), []);
  const onLoaded = useCallback(() => setPhase("live"), []);

  const live = phase === "live";

  return (
    <div id="top" className="relative flex h-dvh min-h-dvh flex-col justify-between overflow-hidden bg-ink">
      {/* Stage photo, contained in the hero */}
      <div className="absolute inset-0" aria-hidden>
        <div className="home-hero-media absolute inset-0">
          <picture>
            <source media="(max-width: 639px)" srcSet={mobile.srcSet} sizes={mobile.sizes} />
            {/* art-directed <picture>; src/srcSet/alt come from getImageProps */}
            <img
              {...desktop}
              ref={img}
              alt=""
              onLoad={onImageReady}
              className="object-cover object-[right_center] max-sm:object-center"
            />
          </picture>
        </div>
        <span className="home-hero-glow" />
        <span className="grain absolute inset-0 opacity-[0.08]" />

        {/* Left scrim for the headline (sm and up), and under the strip on desktop. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[55%] bg-[linear-gradient(90deg,rgb(5_3_4/0.9),transparent)] sm:block" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-ink/90 to-transparent desk:block" />
        {/* Narrow-screen scrims: top behind nav + title, bottom behind the copy and strip.
            The middle stays clear so the mic and spotlight read. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[36%] bg-gradient-to-b from-ink via-ink/85 to-transparent desk:hidden" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-ink via-ink/90 to-transparent desk:hidden" />
      </div>

      {/* Nav + copy. On narrow screens the copy fills the screen: title at the top, the
          stage in the middle, paragraph + buttons + strip pinned to the bottom. */}
      <div className="relative flex min-h-0 flex-1 flex-col">
        <Nav />
        <main className="relative flex min-h-0 flex-1 flex-col px-[max(1.25rem,env(safe-area-inset-left))] pt-[var(--hero-gap)] sm:px-[max(2rem,env(safe-area-inset-left))] desk:flex desk:min-h-0 desk:flex-1 desk:flex-col desk:justify-center desk:px-16 desk:py-[var(--hero-gap)]">
          <HeroCopy visible={live} reducedMotion={reducedMotion} />
        </main>
      </div>

      <BottomStrip />

      <AnimatePresence>
        {phase === "loading" && (
          <Loader key="loader" sceneReady={sceneReady} reducedMotion={reducedMotion} onComplete={onLoaded} />
        )}
      </AnimatePresence>
    </div>
  );
}
