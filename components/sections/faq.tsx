"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import { site } from "@/lib/site";
import { SectionHeading } from "@/components/ui/section-heading";

/** Edit questions here. Keep answers factual: only what organisers have confirmed. */
const FAQS = [
  {
    q: "What is TEDxSUAS Women?",
    a: `An independently organised TEDx event at ${site.venue.display}, celebrating women's voices, ideas and agency under the theme ${site.theme.transliteration}: "${site.theme.meaning}"`,
  },
  {
    q: "When and where is it?",
    a: `${site.date.display}, at ${site.venue.display}. The detailed schedule will be shared closer to the day.`,
  },
  {
    q: "Who can apply to speak?",
    a: `Anyone with an original idea that fits the theme. Apply through the speaker form; the curation team reviews every application and will reach out to shortlisted speakers. ${site.speakerRules}`,
  },
  {
    q: "How long are the talks?",
    a: "TEDx talks are short by design: 18 minutes at most. Speakers can propose 6, 12 or 18 minutes in the application.",
  },
  {
    q: "How do I attend?",
    a: "Attendance details will be announced on our channels. Follow along so you don't miss it.",
  },
  {
    q: "Who do I contact with questions?",
    a: `Write to our lead organisers: ${site.organisers.map((o) => `${o.name} (${o.email})`).join(" or ")}.`,
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <section id="faq" aria-labelledby="faq-title" className="gutter relative border-t border-line py-28 md:py-40">
      <div className="grid gap-14 lg:grid-cols-12">
        <SectionHeading id="faq-title" index="06" label="FAQ" title="Before you" accent="ask." className="lg:col-span-5" />

        <ul className="border-t border-line lg:col-span-7">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            const btn = `${base}-b${i}`;
            const panel = `${base}-p${i}`;
            return (
              <li key={f.q} className="border-b border-line">
                <h3>
                  <button
                    id={btn}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panel}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-medium text-white md:text-xl"
                  >
                    <span className="transition-colors group-hover:text-red-text">{f.q}</span>
                    <span aria-hidden className="relative block size-4 shrink-0">
                      <span className="absolute left-0 top-1/2 h-px w-full bg-red" />
                      <span
                        className={`absolute left-1/2 top-0 h-full w-px bg-red transition-transform duration-500 ${isOpen ? "scale-y-0" : ""}`}
                      />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panel}
                      role="region"
                      aria-labelledby={btn}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-7 text-grey">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
