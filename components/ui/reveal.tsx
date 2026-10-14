"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Splits text into words that rise from a clipped line with a blur-to-sharp settle.
 * Screen readers get the full string once; the animated spans are aria-hidden.
 */
export function SplitReveal({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  stagger = 0.045,
  once = true,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (reduce) return <Tag className={className}>{text}</Tag>;

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  const word: Variants = {
    hidden: { y: "110%", opacity: 0, filter: "blur(10px)" },
    show: {
      y: "0%",
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 1.1, ease: EASE },
    },
  };

  const MotionTag = motion[Tag];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.4 }}
      variants={container}
    >
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span variants={word} className="inline-block will-change-transform">
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/** Generic fade-rise for blocks. */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** The poster's red hairline divider, drawn in left→right. */
export function Hairline({
  className = "",
  delay = 0,
  origin = "left",
}: {
  className?: string;
  delay?: number;
  origin?: "left" | "right" | "center";
}) {
  return (
    <motion.span
      aria-hidden
      className={`hairline block ${className}`}
      style={{ originX: origin === "left" ? 0 : origin === "right" ? 1 : 0.5 }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 1 }}
      transition={{ duration: 1.4, ease: EASE, delay }}
    />
  );
}
