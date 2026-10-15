import Image from "next/image";
import { site } from "@/lib/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { FadeIn } from "@/components/ui/reveal";
import { CalendarIcon, PinIcon } from "@/components/ui/icons";

const NOTES = [
  ["By air", "The campus sits on the Super Corridor, a short drive from Devi Ahilya Bai Holkar Airport."],
  ["By road", "Cabs and autos run along the Super Corridor from across the city. Allow extra time on event morning."],
  ["On arrival", "Volunteers will guide you from the gate to registration. Keep your confirmation handy."],
];

export function Venue() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.venue.mapQuery)}&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.venue.mapQuery)}`;

  return (
    <section id="venue" aria-labelledby="venue-title" className="relative border-t border-line py-28 md:py-40">
      <div className="gutter">
        <SectionHeading id="venue-title" index="05" label="Venue" title="Where it" accent="begins." />
      </div>

      {/* Campus, red-lit */}
      <FadeIn className="relative mt-16 md:mt-20">
        <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9] lg:aspect-[2/1]">
          <Image
            src="/images/venue-suas.webp"
            alt="Symbiosis University of Applied Sciences campus at night, its curved facade lit red"
            fill
            sizes="100vw"
            className="object-cover object-[42%_30%]"
          />
          {/* title sits over the dark road; keep the facade and logo clear */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent via-30% to-black/30 sm:from-black sm:via-black/10 sm:via-35% sm:to-black/40" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-black/50 via-transparent via-40% to-transparent sm:block" />
        </div>
        {/* Phones: below the photo so the facade stays visible. sm+: over the dark road. */}
        <div className="gutter pt-8 sm:absolute sm:inset-x-0 sm:bottom-0 sm:pb-10 sm:pt-0 md:pb-14">
          <p className="display max-w-xl text-[clamp(1.75rem,4vw,3.5rem)]">{site.venue.name}</p>
          <p className="eyebrow mt-4 text-white/80">{site.venue.city}, Madhya Pradesh</p>
        </div>
      </FadeIn>

      <div className="gutter mt-16 grid gap-14 md:mt-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ul className="space-y-6">
            <li className="flex items-center gap-5">
              <span className="text-red-text"><CalendarIcon /></span>
              <span aria-hidden className="h-12 w-px bg-white/30" />
              <time dateTime={site.date.iso} className="text-lg text-white">{site.date.display}</time>
            </li>
            <li className="flex items-center gap-5">
              <span className="text-red-text"><PinIcon /></span>
              <span aria-hidden className="h-16 w-px bg-white/30" />
              <address className="not-italic text-white">
                {site.venue.address.map((l) => (
                  <span key={l} className="block">{l}</span>
                ))}
              </address>
            </li>
          </ul>

          <ul className="mt-12 divide-y divide-line border-y border-line">
            {NOTES.map(([k, v]) => (
              <li key={k} className="grid gap-1 py-5 sm:grid-cols-[7rem_1fr] sm:gap-4">
                <span className="eyebrow pt-1 text-red-text">{k}</span>
                <span className="text-grey">{v}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            <a href={mapLink} target="_blank" rel="noopener noreferrer" className="eyebrow inline-flex min-h-11 items-center border-b border-red text-white hover:text-red-text">
              Open in Google Maps →
            </a>
            <a href={site.venue.website} target="_blank" rel="noopener noreferrer" className="eyebrow inline-flex min-h-11 items-center border-b border-white/30 text-white hover:border-red">
              suas.ac.in →
            </a>
          </div>
        </div>

        <FadeIn className="lg:col-span-7" delay={0.1}>
          <div className="relative aspect-[4/3] overflow-hidden border border-line">
            <iframe
              title={`Map: ${site.venue.display}`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full [filter:invert(0.92)_hue-rotate(180deg)_grayscale(0.6)_contrast(0.95)]"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
