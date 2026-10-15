"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Loader } from "@/components/Loader";
import { prefersReducedMotion, supportsWebGL } from "@/lib/quality";
import { BottomStrip } from "./BottomStrip";
import { HeroCopy } from "./HeroCopy";
import { Nav } from "./Nav";

const StageCanvas = dynamic(() => import("@/components/stage/StageCanvas"), { ssr: false });

type Phase = "loading" | "live";

export function HeroShell() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [sceneReady, setSceneReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
    if (!supportsWebGL()) {
      setFailed(true);
      setSceneReady(true);
    }
    // Never trap people behind the loader if the scene stalls.
    const t = window.setTimeout(() => setSceneReady(true), 12000);
    return () => window.clearTimeout(t);
  }, []);

  const onReady = useCallback(() => setSceneReady(true), []);
  const onFail = useCallback(() => {
    setFailed(true);
    setSceneReady(true);
  }, []);
  const onLoaded = useCallback(() => setPhase("live"), []);

  const live = phase === "live";

  return (
    <div id="top" className="relative flex h-dvh min-h-dvh flex-col justify-between overflow-hidden bg-ink">
      {/* Stage: fixed and full-bleed behind the whole page at every size. */}
      <div className="fixed inset-0">
        {failed ? (
          <Image
            src="/reference/4.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[50%_85%] desk:object-[50%_72%]"
            priority
          />
        ) : (
          <StageCanvas started={live} onReady={onReady} onFail={onFail} />
        )}
        {/* Desktop scrims: behind the copy on the left, and under the strip. */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[62%] bg-gradient-to-r from-ink via-ink/80 to-transparent desk:block"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-ink/90 to-transparent desk:block" aria-hidden />
        {/* Narrow-screen scrims: top behind nav + title, bottom behind the copy and strip.
            The middle stays clear so the mic and spotlight read. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[36%] bg-gradient-to-b from-ink via-ink/85 to-transparent desk:hidden" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] bg-gradient-to-t from-ink via-ink/90 to-transparent desk:hidden" aria-hidden />
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
