"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";

export interface HeroCopyProps {
  visible: boolean;
  reducedMotion: boolean;
}

const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hot";

/** Crops the black padding off tedx_logo.png (2172×724). */
function Wordmark() {
  return (
    <span className="relative block aspect-[3.625] w-full overflow-hidden">
      <Image
        src="/brand/tedx_logo.png"
        alt="त्वमेव परिवर्तनम् — It begins with you"
        width={2172}
        height={724}
        priority
        sizes="(min-width: 1024px) 760px, 140vw"
        className="absolute max-w-none mix-blend-screen"
        style={{ width: "137.93%", height: "auto", left: "-19.31%", top: "-35%" }}
      />
    </span>
  );
}

export function HeroCopy({ visible, reducedMotion }: HeroCopyProps) {
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reducedMotion ? 0 : 0.11, delayChildren: reducedMotion ? 0 : 0.7 } },
  };
  const item: Variants = {
    // No filter here: it would isolate the wordmark's mix-blend-mode.
    hidden: { opacity: 0, y: reducedMotion ? 0 : 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      className="relative max-w-[36rem]"
      variants={container}
      initial="hidden"
      animate={visible ? "show" : "hidden"}
    >
      {/* Title block: wordmark and SPEAKERS share one width and one right edge. */}
      <div className="@container w-full max-w-[34rem]">
        <motion.h1 variants={item}>
          <Wordmark />
        </motion.h1>

        <motion.div variants={item} className="mt-3 lg:mt-5">
          <p className="text-sm font-medium uppercase tracking-[0.62em] text-white sm:text-base" aria-hidden>
            Call for
          </p>
          {/* 20cqw ≈ the container width for Playfair 700 "SPEAKERS" (≈4.9em wide). */}
          <p className="whitespace-nowrap font-display text-[20cqw] leading-[0.95] tracking-tight text-white" aria-hidden>
            SPEAKERS
          </p>
          <span className="sr-only">Call for speakers</span>
        </motion.div>
      </div>

      <motion.div variants={item} className="mt-6 h-px w-14 bg-ted/40 sm:mt-7" aria-hidden />

      <motion.p variants={item} className="mt-5 max-w-[26rem] text-[0.95rem] font-normal leading-relaxed text-[#bfb3b6] sm:text-lg">
        TEDxSUAS Women is looking for voices with an idea worth spreading. If change starts with you, the stage is
        waiting.
      </motion.p>

      <motion.div variants={item} className="mt-6 flex flex-wrap gap-3 sm:mt-8">
        <a
          href="#apply"
          className={`inline-flex min-h-12 items-center rounded-full bg-ted px-7 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_rgba(235,0,40,0.8)] transition hover:bg-[#ff0a35] ${focus}`}
        >
          Apply to speak
        </a>
        <a
          href="#theme"
          className={`inline-flex min-h-12 items-center rounded-full border border-white/30 px-7 text-sm font-semibold text-white transition hover:border-white hover:bg-white/5 ${focus}`}
        >
          Explore the theme
        </a>
      </motion.div>
    </motion.div>
  );
}
