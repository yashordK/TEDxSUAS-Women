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
    <div id="top" className="relative flex min-h-svh flex-col overflow-hidden bg-ink lg:h-svh lg:min-h-[640px]">
      {/* Stage: full-bleed behind the copy on desktop, its own block on phones. */}
      <div className="relative order-3 h-[56svh] min-h-[360px] w-full lg:absolute lg:inset-0 lg:order-none lg:h-auto">
        {failed ? (
          <Image
            src="/reference/4.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[50%_78%] lg:object-[50%_72%]"
            priority
          />
        ) : (
          <StageCanvas started={live} onReady={onReady} onFail={onFail} />
        )}
        {/* Phone: blend the top of the stage into the copy above. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink to-transparent lg:hidden" aria-hidden />
        {/* Desktop scrim behind the copy. */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[62%] bg-gradient-to-r from-ink via-ink/80 to-transparent lg:block"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-ink/90 to-transparent lg:block" aria-hidden />
      </div>

      <div className="order-1">
        <Nav />
      </div>

      <main className="relative order-2 flex flex-1 flex-col justify-center px-4 pb-2 pt-2 sm:px-8 lg:px-16 lg:pb-24">
        <HeroCopy visible={live} reducedMotion={reducedMotion} />
      </main>

      <div className="order-4">
        <BottomStrip />
      </div>

      <AnimatePresence>
        {phase === "loading" && (
          <Loader key="loader" sceneReady={sceneReady} reducedMotion={reducedMotion} onComplete={onLoaded} />
        )}
      </AnimatePresence>
    </div>
  );
}
