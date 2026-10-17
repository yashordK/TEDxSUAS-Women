"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { site } from "@/lib/site";
import { coreLeadership, people, type Person, type Team as TeamName } from "@/lib/team";
import { FadeIn } from "@/components/ui/reveal";

const SECTION = "gutter relative py-14 md:py-20";
const H2 = "display text-[clamp(2rem,4.5vw,3.5rem)]";
const EASE = [0.16, 1, 0.3, 1] as const;

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

const organiserNames = new Set<string>(site.organisers.map((o) => o.name));
const leads = coreLeadership.filter((m) => organiserNames.has(m.name));
const core = coreLeadership.filter((m) => !organiserNames.has(m.name));
const teamsInUse = [...new Set(people.flatMap((p) => p.teams ?? []))] as TeamName[];

/** Portrait or outlined initials on the spotlight tile. Shared by tiles and the panel. */
function Face({ person: p, size }: { person: Person; size: "lg" | "md" | "xl" }) {
  const text = { xl: "text-[clamp(5rem,14vw,8rem)]", lg: "text-[clamp(3.5rem,8vw,6.5rem)]", md: "text-[clamp(2.75rem,6vw,4.5rem)]" }[size];
  return p.photo ? (
    <>
      <Image src={p.photo} alt="" fill sizes={size === "md" ? "(min-width: 1024px) 20vw, 50vw" : "(min-width: 1024px) 30vw, 60vw"} className="team-photo object-cover" />
      <span aria-hidden className="team-tint" />
    </>
  ) : (
    <>
      <span aria-hidden className="team-glow" />
      <span aria-hidden className={`team-initials display relative ${text}`}>{initials(p.name)}</span>
    </>
  );
}

/**
 * One 4:5 tile. A button: click / Enter opens the detail panel. On pointer hover a red
 * spotlight follows the cursor (CSS vars set here), the initials fill, the tile lifts.
 */
function Tile({ person: p, large = false, onOpen }: { person: Person; large?: boolean; onOpen: (p: Person, el: HTMLElement) => void }) {
  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <button
      type="button"
      onClick={(e) => onOpen(p, e.currentTarget)}
      onPointerMove={onMove}
      aria-haspopup="dialog"
      aria-label={`${p.name}, ${p.roles.join(", ")}: open details`}
      className="team-tile group block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff3b55]"
    >
      <span className="team-frame">
        <Face person={p} size={large ? "lg" : "md"} />
        <span aria-hidden className="team-spot" />
      </span>
      <span className="mt-4 block">
        <span className={`block font-bold leading-snug text-white ${large ? "text-lg md:text-xl" : "text-base md:text-lg"}`}>{p.name}</span>
        <span className="eyebrow mt-1.5 block text-[0.625rem] text-red-text md:text-[0.6875rem]">{p.roles.join(" · ")}</span>
      </span>
    </button>
  );
}

/** Right-side drawer (desktop) / bottom sheet (phone), modal, focus-trapped. */
function DetailPanel({ person: p, onClose }: { person: Person; onClose: () => void }) {
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const [wide, setWide] = useState(true);

  useEffect(() => {
    setWide(window.matchMedia("(min-width: 768px)").matches);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("[data-close]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !panel.current) return;
      const f = [...panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const off = reduce ? { opacity: 0 } : wide ? { opacity: 0, x: 48 } : { opacity: 0, y: 64 };

  // Portal to <body>: the page-transition wrapper is transformed, which would make
  // `fixed` relative to it instead of the viewport.
  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <motion.div
        data-backdrop
        className="absolute inset-0 bg-[rgb(5_3_4/0.75)] backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="team-panel-title"
        initial={off}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={off}
        transition={{ duration: reduce ? 0.15 : 0.35, ease: EASE }}
        className="absolute inset-x-0 bottom-0 max-h-[88svh] overflow-y-auto border-t border-[rgb(235_0_40/0.4)] bg-[#0a0506] p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[min(440px,90vw)] md:border-l md:border-t-0 md:p-8"
      >
        <div className="flex justify-end">
          <button
            type="button"
            data-close
            onClick={onClose}
            className="eyebrow inline-flex min-h-11 items-center gap-2 px-1 text-white hover:text-red-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff3b55]"
          >
            Close <span aria-hidden>✕</span>
          </button>
        </div>
        <div className="team-frame mx-auto mt-2 w-full max-w-[260px] md:max-w-none">
          <Face person={p} size="xl" />
        </div>
        <h2 id="team-panel-title" className="display mt-6 text-[clamp(1.75rem,4vw,2.5rem)] leading-tight">{p.name}</h2>
        <ul className="mt-3 space-y-1">
          {p.roles.map((r) => (
            <li key={r} className="eyebrow text-red-text">{r}</li>
          ))}
        </ul>
        {p.teams && p.teams.length > 0 && (
          <ul aria-label="Teams" className="mt-5 flex flex-wrap gap-2">
            {p.teams.map((t) => (
              <li key={t} className="border border-line px-3 py-1 text-xs uppercase tracking-[0.15em] text-[#cfc4c8]">{t}</li>
            ))}
          </ul>
        )}
        {(p.instagram || p.linkedin) && (
          <p className="mt-6 flex gap-6">
            {p.instagram && (
              <a href={p.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-white underline decoration-red underline-offset-4 hover:text-red-text">Instagram</a>
            )}
            {p.linkedin && (
              <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-white underline decoration-red underline-offset-4 hover:text-red-text">LinkedIn</a>
            )}
          </p>
        )}
      </motion.div>
    </div>,
    document.body,
  );
}

export function Team() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<TeamName | "All">("All");
  const [open, setOpen] = useState<Person | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  const onOpen = useCallback((p: Person, el: HTMLElement) => {
    opener.current = el;
    setOpen(p);
  }, []);
  const onClose = useCallback(() => setOpen(null), []);

  const crew = useMemo(() => (filter === "All" ? people : people.filter((p) => p.teams?.includes(filter))), [filter]);

  return (
    <>
      <section aria-labelledby="team-title" className={SECTION}>
        <FadeIn>
          <h2 id="team-title" className={H2}>
            Meet the <span className="text-red-text">team</span>
          </h2>
          {site.licensee !== "TODO" && (
            <p className="mt-4 text-[17px] text-[#cfc4c8]">
              Licensee: <span className="text-white">{site.licensee}</span>
            </p>
          )}
        </FadeIn>

        {/* Lead organisers and core team: four large tiles across on desktop. */}
        <div className="mt-12 grid gap-x-5 gap-y-14 lg:grid-cols-2">
          {([["Lead organisers", leads], ["Core team", core]] as const).map(([title, members]) => (
            <div key={title}>
              <FadeIn>
                <h3 className="eyebrow text-red-text">{title}</h3>
              </FadeIn>
              <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-5">
                {members.map((m, i) => (
                  <li key={m.name}>
                    <FadeIn delay={i * 0.06}>
                      <Tile person={m} large onOpen={onOpen} />
                    </FadeIn>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* The crew: one filterable roster */}
        <div className="mt-16 border-t border-line pt-12 md:mt-20">
          <h3 className={H2}>
            The <span className="text-red-text">crew</span>
          </h3>
          <div role="group" aria-label="Filter the crew by team" className="mt-6 flex flex-wrap gap-2">
            {(["All", ...teamsInUse] as const).map((t) => (
              <button key={t} type="button" aria-pressed={filter === t} onClick={() => setFilter(t)} className="team-chip">
                {t}
              </button>
            ))}
          </div>

          <LayoutGroup>
            <motion.ul layout={!reduce} className="team-crew mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:gap-x-5 lg:grid-cols-5">
              <AnimatePresence mode="popLayout" initial={false}>
                {crew.map((p) => (
                  <motion.li
                    key={p.name}
                    layout={!reduce}
                    initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
                    transition={{ duration: reduce ? 0.12 : 0.35, ease: EASE }}
                  >
                    <Tile person={p} onOpen={onOpen} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </LayoutGroup>
        </div>
      </section>

      <div className={`${SECTION} border-t border-line`}>
        <p className="text-[17px] leading-[1.7] text-[#cfc4c8] md:text-[18px]">
          Questions? Write to the lead organisers:{" "}
          {site.organisers.map((o, i) => (
            <span key={o.email}>
              {i > 0 && " or "}
              <a href={`mailto:${o.email}`} className="break-all text-white underline decoration-red underline-offset-4 hover:text-red-text">
                {o.email}
              </a>
            </span>
          ))}
        </p>
      </div>

      <AnimatePresence onExitComplete={() => opener.current?.focus()}>
        {open && <DetailPanel key={open.name} person={open} onClose={onClose} />}
      </AnimatePresence>
    </>
  );
}
