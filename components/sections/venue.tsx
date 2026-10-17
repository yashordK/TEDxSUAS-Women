import Image from "next/image";
import { site } from "@/lib/site";
import { FadeIn } from "@/components/ui/reveal";

const SECTION = "gutter relative py-14 md:py-20";
const H2 = "display text-[clamp(2rem,4.5vw,3.5rem)]";
const BODY = "max-w-[62ch] text-[17px] leading-[1.7] text-[#cfc4c8] md:text-[18px]";

/** "Where it happens": date, venue and city from lib/site.ts, plus one line from existing copy. */
export function VenueFacts() {
  const facts = [
    { k: "Date", v: <time dateTime={site.date.iso}>{site.date.display}</time> },
    { k: "Venue", v: site.venue.name },
    { k: "City", v: site.venue.city },
  ];
  return (
    <section aria-labelledby="venue-title" className={SECTION}>
      <FadeIn>
        <h2 id="venue-title" className={H2}>
          Where it <span className="text-red-text">happens</span>
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
      <FadeIn className="mt-12">
        <p className={BODY}>
          {site.name} takes place on {site.date.display} at {site.venue.display}, on the Super Corridor near the
          airport.
        </p>
      </FadeIn>
    </section>
  );
}

/** Wide auditorium band: the About photo, cropped to the left with the stage in view. */
export function AuditoriumBand() {
  return (
    <figure className="relative h-[clamp(320px,55vh,620px)] w-full overflow-hidden">
      <Image
        src="/images/about-hero.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-[left_center]"
      />
      <span aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgb(5_3_4/0.85),rgb(5_3_4/0.2)_45%,transparent_70%)]" />
      <span aria-hidden className="absolute inset-x-0 top-0 h-[18%] bg-gradient-to-b from-[#050304] to-transparent" />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-[#050304] to-transparent" />
      <figcaption className="gutter eyebrow absolute inset-x-0 bottom-6 text-[#cfc4c8] md:bottom-10">The auditorium</figcaption>
    </figure>
  );
}

/**
 * "Getting here": renders only the fields that are filled in lib/site.ts
 * (venue.address, venue.mapUrl, venue.notes), so no placeholder ever shows.
 */
export function GettingHere() {
  const { address, mapUrl, notes } = site.venue;
  const hasAddress = address.length > 0 && !address.some((l) => l.startsWith("TODO"));
  if (!hasAddress && !mapUrl && notes.length === 0) return null;
  return (
    <section aria-labelledby="getting-here" className={`${SECTION} border-t border-line`}>
      <FadeIn>
        <h2 id="getting-here" className={H2}>
          Getting <span className="text-red-text">here</span>
        </h2>
      </FadeIn>
      <div className="mt-10 grid gap-12 lg:grid-cols-12">
        <FadeIn className="lg:col-span-5">
          {hasAddress && (
            <address className="not-italic text-[17px] leading-[1.7] text-white md:text-[18px]">
              {address.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </address>
          )}
          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center text-white underline decoration-red underline-offset-4 hover:text-red-text"
            >
              Open in Maps
            </a>
          )}
        </FadeIn>
        {notes.length > 0 && (
          <FadeIn className="lg:col-span-7" delay={0.08}>
            <ul className="divide-y divide-line border-y border-line">
              {notes.map((n) => (
                <li key={n.k} className="grid gap-1 py-5 sm:grid-cols-[8rem_1fr] sm:gap-6">
                  <span className="eyebrow pt-1 text-red-text">{n.k}</span>
                  <span className={BODY}>{n.v}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
