"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { ThemeCalligraphy } from "@/components/brand/theme-calligraphy";
import { Button } from "@/components/ui/button";

const EASE = [0.16, 1, 0.3, 1] as const;

export function SubmittedScreen({ refCode, name }: { refCode: string; name: string }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  const first = name.trim().split(" ")[0];

  return (
    <section aria-live="polite" className="mx-auto flex min-h-[70svh] max-w-3xl flex-col items-center justify-center text-center">
      <div className="w-full max-w-xl">
        <ThemeCalligraphy delay={0.1} />
      </div>
      <motion.h1
        ref={heading}
        tabIndex={-1}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 1.6 }}
        className="display mt-12 text-[clamp(2.5rem,7vw,5rem)] focus:outline-none"
      >
        Your idea is <span className="text-gradient">with us.</span>
      </motion.h1>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 2.1 }}>
        <p className="mx-auto mt-6 max-w-lg text-lg text-grey">
          Thank you{first ? `, ${first}` : ""}. We have received your idea. Our curation team reads
          every application, and <span className="text-white">we&apos;ll get back to you within a month.</span>
        </p>
        <p className="eyebrow mt-10 text-grey">Your reference ID · please save this</p>
        <p className="mt-3 font-mono text-2xl tracking-[0.25em] text-red-text md:text-3xl">{refCode}</p>
        <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/">Back to home</Button>
          <Button href="/#ideas" variant="ghost">
            Explore the ideas
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
