"use client";

import Image from "next/image";
import { useState } from "react";

const LINKS = [
  { label: "Theme", href: "#theme" },
  { label: "About", href: "#about" },
  { label: "Speakers", href: "#speakers" },
  { label: "Team", href: "#team" },
  { label: "Venue", href: "#venue" },
];

const focus = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-hot";

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="relative z-30 flex items-center justify-between gap-6 px-[max(1.25rem,env(safe-area-inset-left))] py-4 sm:px-[max(2rem,env(safe-area-inset-left))] desk:px-16 desk:py-6">
      <a href="#top" className={`flex min-h-11 items-center rounded-sm ${focus}`}>
        <Image src="/brand/logo-white.png" alt="TEDxSUAS Women" width={2744} height={440} priority className="h-6 w-auto sm:h-7" />
      </a>

      <nav aria-label="Primary" className="hidden items-center gap-1 desk:flex">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={`flex min-h-11 items-center rounded-sm px-4 text-xs font-semibold uppercase leading-[1.4] tracking-[0.2em] text-[#e8dfe2] transition-colors hover:text-white ${focus}`}
          >
            {l.label}
          </a>
        ))}
        <a
          href="#apply"
          className={`ml-4 inline-flex min-h-11 items-center rounded-full border border-ted px-6 text-sm font-semibold text-white transition-colors hover:bg-ted ${focus}`}
        >
          Apply to speak
        </a>
      </nav>

      <button
        type="button"
        className={`flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/25 desk:hidden ${focus}`}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="relative block h-3 w-5" aria-hidden>
          <span className={`absolute left-0 h-0.5 w-5 bg-white transition-transform ${open ? "top-1.25 rotate-45" : "top-0"}`} />
          <span className={`absolute left-0 h-0.5 w-5 bg-white transition-transform ${open ? "top-1.25 -rotate-45" : "top-2.5"}`} />
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 -z-10 bg-ink/75 backdrop-blur-sm desk:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Primary"
          className="absolute inset-x-5 top-full rounded-2xl border border-white/10 bg-ink/95 p-3 backdrop-blur sm:inset-x-8 desk:hidden"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold uppercase leading-[1.4] tracking-[0.2em] text-[#e8dfe2] hover:bg-white/5 ${focus}`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#apply"
            onClick={() => setOpen(false)}
            className={`mt-2 flex min-h-11 items-center justify-center rounded-full border border-ted font-semibold text-white ${focus}`}
          >
            Apply to speak
          </a>
        </nav>
      )}
    </header>
  );
}
