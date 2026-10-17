import { site } from "@/lib/site";
import { FadeIn } from "@/components/ui/reveal";

// Official TED boilerplate (reference/tedxsuas-2026/CONTENT.md). Keep word for word.
const BLOCKS = [
  {
    k: "TED",
    body: "TED is a non-profit devoted to spreading ideas, usually in the form of short, powerful talks (18 minutes or less). TED began in 1984 as a conference where Technology, Entertainment and Design converged, and today covers almost all topics — from science to business to global issues — in more than 100 languages. Meanwhile, independently run TEDx events help share ideas in communities around the world.",
  },
  {
    k: "TEDx",
    body: "TEDx is a grassroots initiative, created in the spirit of TED's overall mission to research and discover \"ideas worth spreading.\" TEDx brings the spirit of TED to local communities around the globe via \"rules and tools\". TEDx events are organized by passionate individuals who seek to uncover new ideas and the latest research in their local areas and spark conversations in their communities. TEDx events include live speakers and recorded TED Talks, and are organized independently under a free license granted by TED. These events are not controlled by TED, but event organizers agree to abide by our format, and are offered guidelines for curation, speaker coaching, event organizing and more. They learn from us and from each other. More than 3000 events are now held annually.",
  },
];

const SECTION = "gutter relative py-14 md:py-20";
const H2 = "display text-[clamp(2rem,4.5vw,3.5rem)]";
const BODY = "mt-4 max-w-[62ch] text-[17px] leading-[1.7] text-[#cfc4c8] md:text-[18px]";

/** "What is TEDx?": the official TED and TEDx text, unchanged, plus the ted.com link. */
export function WhatIsTedx() {
  return (
    <section aria-labelledby="what-is-tedx" className={SECTION}>
      <FadeIn>
        <h2 id="what-is-tedx" className={H2}>
          What is <span className="text-red-text">TEDx?</span>
        </h2>
      </FadeIn>
      {/* Shorter TED text + the link on the left, the long TEDx text on the wider right:
          both top-aligned at the same size, so neither column leaves a gap. */}
      <div className="mt-10 grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <FadeIn>
            <h3 className="eyebrow text-red-text">About {BLOCKS[0].k}</h3>
            <p className={BODY}>{BLOCKS[0].body}</p>
          </FadeIn>
          <FadeIn className="mt-8">
            <a
              href={site.tedxUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-white underline decoration-red underline-offset-4 hover:text-red-text"
            >
              What is TEDx?
            </a>
            <p className="text-sm text-white/70">{site.disclaimer}</p>
          </FadeIn>
        </div>
        <FadeIn className="lg:col-span-7" delay={0.08}>
          <h3 className="eyebrow text-red-text">About {BLOCKS[1].k}</h3>
          <p className={BODY}>{BLOCKS[1].body}</p>
        </FadeIn>
      </div>
    </section>
  );
}

/** "About this event": date, venue and theme facts from lib/site.ts, then a short note. */
export function AboutEvent() {
  const facts = [
    { k: "Date", v: <time dateTime={site.date.iso}>{site.date.display}</time> },
    { k: "Venue", v: `${site.venue.short}, ${site.venue.city}` },
    {
      k: "Theme",
      v: (
        <>
          <span lang="sa" className="font-deva-display block">{site.theme.devanagari}</span>
          <span className="mt-1 block font-sans text-sm font-medium tracking-wide text-[#cfc4c8]">{site.theme.tagline}</span>
        </>
      ),
    },
  ];
  return (
    <section aria-labelledby="about-event" className={`${SECTION} border-t border-line`}>
      <FadeIn>
        <h2 id="about-event" className={H2}>
          About this <span className="text-red-text">event</span>
        </h2>
      </FadeIn>
      <dl className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
        {facts.map((f, i) => (
          <FadeIn key={f.k} delay={i * 0.08}>
            <dt className="eyebrow text-red-text">{f.k}</dt>
            <dd className="display mt-3 text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.15] text-white">{f.v}</dd>
          </FadeIn>
        ))}
      </dl>
      <FadeIn className="mt-14 max-w-[62ch] space-y-4 text-[17px] leading-[1.7] text-[#cfc4c8] md:text-[18px]">
        <p>
          {site.name} is a women-led edition of TEDx at {site.venue.display}: a stage for women&apos;s
          voices, ideas and agency, and for everyone ready to listen to them.
        </p>
        <p>Organised by {site.organisers.map((o) => o.name).join(" and ")}.</p>
      </FadeIn>
    </section>
  );
}
