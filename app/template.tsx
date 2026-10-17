"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Page transition: fade plus a small rise, 250ms, opacity/transform only.
 * Framer clears the transform once it settles at 0, so fixed descendants
 * (the home page's 3D stage) are not trapped by a containing block.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
