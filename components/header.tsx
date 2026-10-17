"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";
import { TedxWordmark } from "@/components/brand/tedx-wordmark";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // The landing page uses the hero's own nav (components/hero/Nav.tsx).
  if (pathname === "/") return null;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-200 ${
          open
            ? "border-white/8 bg-[#050304]"
            : scrolled
              ? "border-white/8 bg-[rgb(5_3_4/0.82)] backdrop-blur-[14px]"
              : "border-transparent"
        }`}
      >
        <div className="gutter flex h-20 items-center justify-between md:h-24">
          <Link href="/" aria-label={`${site.name}, home`} className="flex flex-col">
            <TedxWordmark className="text-2xl md:text-[1.9rem]" />
            <span className="mt-1 text-[0.625rem] tracking-wide text-white/70 md:text-[0.6875rem]">
              {site.disclaimer}
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                className="eyebrow relative flex min-h-11 items-center text-white/85 transition-colors hover:text-white aria-[current=page]:text-white after:absolute after:bottom-2 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-red after:transition-transform after:duration-500 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/speak" aria-current={pathname === "/speak" ? "page" : undefined} className="cta cta-outline">
              Apply to speak
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="eyebrow flex min-h-11 items-center gap-3 py-2 text-white lg:hidden"
          >
            {open ? "Close" : "Menu"}
            <span aria-hidden className="relative block h-3 w-6">
              <span className={`absolute left-0 top-0 h-px w-full bg-white transition-transform duration-500 ${open ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-px bg-red transition-all duration-500 ${open ? "w-full -translate-y-1.5 -rotate-45 bg-white" : "w-2/3"}`} />
            </span>
          </button>
        </div>
      </header>

      {/* Sibling of <header>: its backdrop-filter would otherwise trap this fixed layer */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="gutter fixed inset-0 top-20 z-40 flex flex-col bg-black pb-10 pt-10 md:top-24 lg:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {[...nav, { label: "Apply to Speak", href: "/speak" }].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.05 }}
                  className="border-b border-line"
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={`display flex items-baseline justify-between py-4 text-4xl ${item.href === "/speak" ? "text-red-text" : "text-white"}`}
                  >
                    {item.label}
                    <span className="eyebrow text-grey">0{i + 1}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto space-y-1 text-sm text-grey">
              <p className="eyebrow text-white">{site.date.display}</p>
              <p>{site.venue.display}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
