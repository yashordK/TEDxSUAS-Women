"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { site } from "@/lib/site";
import { Arrow } from "@/components/ui/button";

export interface HeroCopyProps {
  visible: boolean;
  reducedMotion: boolean;
}


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
      className="relative flex min-h-0 w-full flex-1 flex-col desk:block desk:max-w-[36rem] desk:flex-none"
      variants={container}
      initial="hidden"
      animate={visible ? "show" : "hidden"}
    >
      {/* Title block: wordmark and SPEAKERS share one width and one right edge. */}
      <div className="hero-title @container">
        <motion.h1 variants={item}>
          <Wordmark />
        </motion.h1>

        <motion.div variants={item} className="mt-[var(--hero-gap)]">
          <p className="text-sm font-medium uppercase leading-[1.4] tracking-[0.6em] text-white sm:text-base" aria-hidden>
            Call for
          </p>
          {/* 19.6cqw ≈ the container width for Playfair 700 "SPEAKERS" at 0.01em tracking (≈5.0em wide). */}
          {/* Phones: a size smaller so the hero breathes; full logo width from sm up. */}
          <p className="mt-2 whitespace-nowrap font-display text-[15.5cqw] leading-none tracking-[0.01em] text-white sm:mt-3 sm:text-[19.6cqw]" aria-hidden>
            SPEAKERS
          </p>
          <span className="sr-only">Call for speakers</span>
        </motion.div>
      </div>

      {/* Phones: the stage shows through this gap, between the title and the bottom block. */}
      <div className="min-h-0 flex-1 desk:hidden" aria-hidden />

      <div data-hero-bottom className="sm:max-w-[60vw] desk:max-w-none">
        <motion.div variants={item} className="mt-[var(--hero-gap)] hidden h-px w-14 bg-ted/40 desk:block" aria-hidden />

        <motion.p variants={item} className="hero-para max-w-[26rem] text-[15px] font-normal leading-[1.6] text-[#bfb3b6] desk:mt-[var(--hero-gap)] desk:text-[clamp(15px,2.1dvh,17px)] desk:leading-[1.65]">
          TEDxSUAS Women is looking for voices with an idea worth spreading. If change starts with you, the stage is
          waiting.
        </motion.p>
        <motion.p variants={item} className="hero-rules mt-2 max-w-[26rem] text-xs leading-[1.55] text-[#9d9195] desk:mt-3">
          {site.speakerRules}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-4 grid grid-cols-1 items-center gap-x-6 gap-y-1 sm:grid-cols-[auto_auto] sm:justify-start desk:mt-[var(--hero-gap)] desk:flex desk:flex-wrap"
        >
          <Link href="/speak" className="cta cta-primary w-full sm:w-auto">
            <span className="relative z-10">Apply to speak</span>
            <Arrow />
          </Link>
          <Link href="/theme" className="cta cta-link justify-self-center sm:justify-self-start">
            <span className="cta-label">Explore the theme</span>
            <Arrow />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
