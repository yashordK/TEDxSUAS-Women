"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Arrow } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/reveal";

/**
 * Closing call over a stage photo (public/images/closing-stage.webp). Top and bottom
 * fade to #050304 so it joins the surrounding black sections without an edge.
 */
export function ClosingBand() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section
      ref={ref}
      aria-labelledby="closing-title"
      className="closing-band relative isolate flex min-h-[clamp(420px,70vh,720px)] items-center overflow-hidden bg-[#050304]"
    >
      {/* image, oversized so the parallax never reveals an edge */}
      <motion.div aria-hidden style={reduce ? undefined : { y }} className="absolute inset-x-0 -inset-y-[6%]">
        <Image
          src="/images/closing-stage.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[72%_center] brightness-[0.7] lg:object-[right_center] lg:brightness-100"
        />
      </motion.div>

      {/* red grade, readability scrim, grain, then the top/bottom joins */}
      <span aria-hidden className="absolute inset-0 bg-[#EB0028] opacity-15 mix-blend-multiply" />
      <span aria-hidden className="absolute inset-0 bg-[rgb(5_3_4/0.45)] lg:bg-[linear-gradient(90deg,rgb(5_3_4/0.75),transparent_60%)]" />
      <span aria-hidden className="grain absolute inset-0 opacity-[0.08]" />
      <span aria-hidden className="absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-[#050304] to-transparent" />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-[#050304] to-transparent" />

      <div className="gutter relative w-full py-[clamp(64px,10vw,120px)]">
        <FadeIn className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <p className="eyebrow text-red-text">Call for Speakers</p>
          <h2 id="closing-title" className="display mt-4 text-[clamp(3rem,9vw,8.5rem)] leading-[0.95]">
            It begins <span className="text-[#EB0028]">with you.</span>
          </h2>
          <p className="mt-6 max-w-md text-[#cfc4c8]">Have an idea worth spreading? The stage is waiting.</p>
          <Link href="/speak" className="cta cta-primary mt-8">
            <span className="relative z-10">Apply to speak</span>
            <Arrow />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
