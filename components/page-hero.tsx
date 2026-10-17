"use client";

import { getImageProps } from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Full-bleed image hero for inner pages (/theme, /about; the other pages still use the
 * compact components/ui/page-hero.tsx). Layers, back to front: the photo (supplied
 * already graded) with scroll parallax, a light top shade and bottom fade, grain, a slow red beam + haze (desktop only), outline echo, title.
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
  mobileImage,
  mobilePosition,
  imageShift,
}: {
  eyebrow: string;
  title: string;
  /** trailing word(s) in #EB0028 */
  accent?: string;
  intro: string;
  image: string;
  imagePosition?: string;
  /** Optional art-directed crop for phones (below 640px). */
  mobileImage?: string;
  /** object-position below 640px (defaults to imagePosition, or centre with mobileImage). */
  mobilePosition?: string;
  /** Push the photo down (CSS length), e.g. to keep a stage clear of the nav. */
  imageShift?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // 0 at the top of the page (the photo sits where it was framed), drifting down as it scrolls away.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  const common = { alt: "", fill: true, priority: true, sizes: "100vw" } as const;
  const desktop = getImageProps({ ...common, src: image }).props;
  const mobile = mobileImage ? getImageProps({ ...common, src: mobileImage }).props : null;
  const pos = {
    "--hero-pos": imagePosition,
    "--hero-pos-m": mobilePosition ?? (mobileImage ? "50% 50%" : imagePosition),
    ...(imageShift ? { transform: `translateY(${imageShift})` } : {}),
  } as React.CSSProperties;

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
      className="image-hero relative isolate flex flex-col overflow-hidden bg-[#050304]"
    >
      {/* 1. image + red grade + fades. Oversized so the parallax never shows an edge. */}
      <motion.div aria-hidden style={reduce ? undefined : { y }} className="absolute inset-x-0 -inset-y-[10%]">
        <picture>
          {mobile && <source media="(max-width: 639px)" srcSet={mobile.srcSet} sizes={mobile.sizes} />}
          {/* art-directed <picture>; src/srcSet come from getImageProps */}
          <img {...desktop} alt="" className="image-hero-img object-cover" style={{ ...desktop.style, ...pos }} />
        </picture>
      </motion.div>
      <span
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgb(5_3_4/0.85)_0px,transparent_160px),linear-gradient(180deg,transparent_55%,#050304_100%)]"
      />

      {/* 2. grain */}
      <span aria-hidden className="grain absolute inset-0 opacity-[0.08] [mask-image:linear-gradient(180deg,#000_55%,transparent_92%)]" />

      {/* 3. beam + haze (hidden on phones); each fades out well inside the hero */}
      <span aria-hidden className="image-hero-fx pointer-events-none absolute inset-0 hidden sm:block">
        <span className="image-hero-beam" />
        <span className="image-hero-haze left-[8%] top-[30%]" />
        <span className="image-hero-haze image-hero-haze-2 right-[10%] top-[45%]" />
      </span>

      {/* 4–5. eyebrow, title (+ outline echo), intro. One edge-less radial shade sits behind
          the whole block and fades out on every side; the intro also gets a soft text shadow. */}
      <div className="gutter relative flex w-full flex-1 items-center pb-[clamp(3.5rem,8svh,6rem)] pt-20 md:pt-24">
        <div className="relative w-fit max-w-full">
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-x-[18%] -inset-y-[45%] bg-[radial-gradient(closest-side,rgb(5_3_4/0.78),rgb(5_3_4/0.45)_60%,transparent)]"
          />
          <p className="eyebrow relative text-red-text">{eyebrow}</p>
          <h1 className="display relative mt-[max(1rem,0.2em)] text-[clamp(2.75rem,min(11vw,13vh),10rem)] leading-[0.95] sm:text-[clamp(3.5rem,min(11vw,13vh),10rem)]">
            <span
              aria-hidden
              className="pointer-events-none absolute left-[0.04em] top-[0.04em] w-full select-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.18)]"
            >
              {title}
              {accent && <> {accent}</>}
            </span>
            <span className="relative">{heading}</span>
          </h1>
          <p className="relative mt-5 max-w-[34rem] text-[18px] leading-[1.6] text-[#cfc4c8] [text-shadow:0_2px_24px_rgba(5,3,4,0.9)] sm:text-[20px]">
            {intro}
          </p>
        </div>
      </div>

      {/* scroll cue */}
      <span aria-hidden className="scroll-cue">
        <span className="scroll-cue-dot" />
      </span>
    </header>
  );
}
