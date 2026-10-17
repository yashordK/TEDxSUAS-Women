import Link from "next/link";
import { site } from "@/lib/site";
import { FadeIn } from "@/components/ui/reveal";
import { ThemeWords } from "@/components/brand/theme-words";
import { Arrow } from "@/components/ui/button";

const SECTION = "gutter relative py-[clamp(64px,10vw,120px)]";

function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="cta cta-link">
      <span className="cta-label">{children}</span>
      <Arrow />
    </Link>
  );
}

function MicIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" />
    </svg>
  );
}

/** Home page below the hero. Plain #050304 background; any glow stays inside its section. */
export function HomeTeasers() {
  const [day, ...rest] = site.date.display.split(" ");

  return (
    <>
      {/* Theme */}
      <section aria-labelledby="t-theme" className={`${SECTION} overflow-hidden text-center`}>
        {/* contained glow: closest-side fades to transparent well inside the section */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[min(90%,900px)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgb(235_0_40/0.2),transparent)]"
        />
        <FadeIn className="relative">
          <p className="eyebrow text-red-text">The Theme</p>
          <ThemeWords className="mx-auto mt-4" />
          <h2 id="t-theme" className="display mx-auto mt-4 max-w-3xl text-[clamp(1.75rem,4vw,3rem)] leading-[1.1]">
            The change you are waiting for is waiting for you.
          </h2>
          <div className="mt-8 flex justify-center">
            <TextLink href="/theme">Read the theme</TextLink>
          </div>
        </FadeIn>
      </section>

      {/* Speakers: three podium cards */}
      <section aria-labelledby="t-speakers" className={SECTION}>
        <ul className="mx-auto grid max-w-4xl grid-cols-3 items-end gap-[clamp(0.5rem,2.5vw,2rem)]">
          {[0, 1, 2].map((i) => (
            <li key={i}>
              <FadeIn delay={i * 0.08}>
                <Link
                  href="/speakers"
                  aria-label="Speaker to be revealed: see the speakers page"
                  className={`podium-card group ${i === 1 ? "aspect-[3/5]" : "aspect-[3/4.4]"}`}
                >
                  <span aria-hidden className="podium-card-cone" />
                  <span className="relative mt-auto flex flex-col items-center gap-3 pb-[clamp(1rem,3vw,2rem)] text-center">
                    <span className="text-red-text"><MicIcon /></span>
                    <span className="eyebrow text-[0.625rem] text-white sm:text-[0.6875rem]">To be revealed</span>
                  </span>
                </Link>
              </FadeIn>
            </li>
          ))}
        </ul>
        <FadeIn className="mt-[clamp(40px,6vw,72px)] text-center">
          <h2 id="t-speakers" className="display text-[clamp(2rem,5vw,3.75rem)]">
            The stage is <span className="text-red-text">waiting.</span>
          </h2>
          {/* One action here; Apply lives in the hero and the closing band. */}
          <div className="mt-8 flex justify-center">
            <TextLink href="/speakers">Meet the speakers</TextLink>
          </div>
        </FadeIn>
      </section>

      {/* Date + venue band */}
      <section aria-labelledby="t-date" className="gutter relative">
        <div className="border-y border-red/70 py-[clamp(32px,5vw,64px)]">
          <FadeIn className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 id="t-date" className="flex items-end gap-[clamp(0.75rem,2vw,1.5rem)]">
                <time dateTime={site.date.iso} className="contents">
                  <span className="display text-[clamp(6rem,18vw,13rem)] leading-[0.85] [font-variant-numeric:lining-nums]">{day}</span>
                  <span className="display pb-[0.3em] text-[clamp(1.5rem,4vw,3rem)] leading-none [font-variant-numeric:lining-nums]">{rest.join(" ")}</span>
                </time>
              </h2>
              <p className="mt-6 text-white">{site.venue.name}</p>
              <p className="eyebrow mt-1 text-red-text">{site.venue.city}</p>
            </div>
            <TextLink href="/venue">Venue details</TextLink>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
