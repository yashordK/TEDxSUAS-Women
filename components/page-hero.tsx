"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Full-bleed image hero for inner pages (used on /theme for now; the other pages still
 * use the compact components/ui/page-hero.tsx). Layers, back to front: graded photo with
 * scroll parallax, grain, a slow red beam + haze (desktop only), outline echo, title.
 * Everything is clipped to the hero, and the bottom fades to #050304 so the next
 * section joins without a seam.
 */
export function PageHero({
  eyebrow,
  title,
  accent,
  intro,
  image,
  imagePosition = "50% 50%",
  height = "70vh",
}: {
  eyebrow: string;
  title: string;
  /** trailing word(s) in #EB0028 */
  accent?: string;
  intro: string;
  image: string;
  imagePosition?: string;
  height?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const heading = (
    <>
      {title}
      {accent && (
        <>
          {" "}
          <span className="text-[#EB0028]">{accent}</span>
        </>
      )}
    </>
  );

  return (
    <header
      ref={ref}
      className="image-hero relative isolate flex min-h-[420px] items-end overflow-hidden bg-[#050304]"
      style={{ "--hero-h": height } as React.CSSProperties}
    >
      {/* 1. image + red grade + fades. Oversized so the parallax never shows an edge. */}
      <motion.div aria-hidden style={reduce ? undefined : { y }} className="absolute inset-x-0 -inset-y-[10%]">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="image-hero-img object-cover"
          style={{ objectPosition: imagePosition, transformOrigin: imagePosition }}
        />
        <span className="absolute inset-0 bg-[#EB0028] opacity-35 mix-blend-multiply" />
      </motion.div>
      <span
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgb(5_3_4/0.85)_0%,rgb(5_3_4/0.35)_28%,rgb(5_3_4/0.45)_55%,#050304_100%)]"
      />

      {/* 2. grain */}
      <span aria-hidden className="grain absolute inset-0 opacity-[0.08] [mask-image:linear-gradient(180deg,#000_55%,transparent_92%)]" />

      {/* 3. beam + haze (hidden on phones); each fades out well inside the hero */}
      <span aria-hidden className="image-hero-fx pointer-events-none absolute inset-0 hidden sm:block">
        <span className="image-hero-beam" />
        <span className="image-hero-haze left-[8%] top-[30%]" />
        <span className="image-hero-haze image-hero-haze-2 right-[10%] top-[45%]" />
      </span>

      {/* 4–5. eyebrow, title (+ outline echo), intro */}
      <div className="gutter relative w-full pb-[clamp(2rem,6vh,4.5rem)] pt-28">
        <p className="eyebrow text-red-text">{eyebrow}</p>
        <h1 className="display relative mt-[max(1rem,0.2em)] text-[clamp(2.75rem,min(11vw,13vh),10rem)] leading-[0.95] sm:text-[clamp(3.5rem,min(11vw,13vh),10rem)]">
          <span
            aria-hidden
            className="pointer-events-none absolute left-[0.04em] top-[0.04em] select-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.18)]"
          >
            {title}
            {accent && <> {accent}</>}
          </span>
          <span className="relative">{heading}</span>
        </h1>
        {/* soft scrim keeps the intro above 4.5:1 wherever the photo is bright */}
        <p className="mt-5 inline-block max-w-[34rem] rounded-sm bg-[#050304]/55 px-3 py-2 -ml-3 text-[18px] leading-[1.6] text-[#cfc4c8] sm:text-[20px]">
          {intro}
        </p>
      </div>
    </header>
  );
}
