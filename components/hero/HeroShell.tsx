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
    <div id="top" className="relative flex min-h-svh flex-col overflow-x-clip bg-ink desk:h-svh desk:min-h-[640px] desk:overflow-hidden">
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
      </div>

      {/* Nav + copy. On narrow screens a vertical scrim sits behind them and fades out
          just below the buttons, so the stage rises out of the dark with no seam. */}
      <div className="relative desk:flex desk:flex-1 desk:flex-col">
        <div className="pointer-events-none absolute inset-0 bg-ink/90 desk:hidden" aria-hidden />
        <div
          className="pointer-events-none absolute inset-x-0 top-full h-28 bg-gradient-to-b from-ink/90 to-transparent sm:h-36 desk:hidden"
          aria-hidden
        />
        <Nav />
        <main className="relative px-[max(1.25rem,env(safe-area-inset-left))] pb-1 pt-7 sm:px-[max(2rem,env(safe-area-inset-left))] sm:pt-9 desk:flex desk:flex-1 desk:flex-col desk:justify-center desk:px-16 desk:pb-24 desk:pt-0">
          <HeroCopy visible={live} reducedMotion={reducedMotion} />
        </main>
      </div>

      {/* Narrow screens: the open space where the stage shows. */}
      <div className="min-h-[22svh] flex-1 desk:hidden" aria-hidden />

      <BottomStrip />

      <AnimatePresence>
        {phase === "loading" && (
          <Loader key="loader" sceneReady={sceneReady} reducedMotion={reducedMotion} onComplete={onLoaded} />
        )}
      </AnimatePresence>
    </div>
  );
}
