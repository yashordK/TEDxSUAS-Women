import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { speakers } from "@/lib/speakers";
import { PageHero } from "@/components/page-hero";
import { ThemeWords } from "@/components/brand/theme-words";
import { FadeIn } from "@/components/ui/reveal";
import { Directions } from "@/components/sections/directions";
import { LineupPlaceholders } from "@/components/sections/lineup";
import { SpeakerGrid } from "@/components/sections/speaker-grid";

export const metadata = pageMeta({
  title: "Speakers",
  description: `The ${site.name} 2027 speaker lineup: to be announced.`,
  path: "/speakers",
});

const SECTION = "gutter relative py-14 md:py-20";
const BODY = "max-w-[62ch] text-[17px] leading-[1.7] text-[#cfc4c8] md:text-[18px]";

export default function SpeakersPage() {
  const revealed = speakers.length > 0;
  return (
    <main id="main">
      <PageHero
        eyebrow={site.name}
        title="SPEAKERS"
        intro="The voices on our stage. To be announced."
        image="/images/speakers-hero.webp"
        imagePosition="right center"
        mobileImage="/images/speakers-hero-mobile.webp"
      />

      {/* Theme calligraphy: transparent PNG on the plain page background, no blend, no box. */}
      <section aria-label="Theme" className={`${SECTION} flex justify-center`}>
        <FadeIn>
          <ThemeWords />
        </FadeIn>
      </section>

      <section aria-labelledby="lineup-title" className={`${SECTION} border-t border-line`}>
        <FadeIn>
          <h2 id="lineup-title" className="display text-[clamp(2rem,4.5vw,3.5rem)]">
            {revealed ? (
              <>
                The <span className="text-red-text">lineup</span>
              </>
            ) : (
              <>
                To be <span className="text-red-text">revealed</span>
              </>
            )}
          </h2>
        </FadeIn>
        <div className="mt-12">{revealed ? <SpeakerGrid /> : <LineupPlaceholders />}</div>
      </section>

      <section aria-labelledby="ideas-title" className={`${SECTION} border-t border-line`}>
        <Directions />
      </section>

      <section aria-label="How speakers are chosen" className={`${SECTION} border-t border-line`}>
        <FadeIn className="space-y-4">
          <p className={BODY}>
            Our speakers are chosen from open applications and invitations. They share ideas, not products.
          </p>
          <p className={BODY}>{site.speakerRules}</p>
        </FadeIn>

        <p className="mt-10">
          <Link href="/speak" className="inline-flex min-h-11 items-center text-lg text-white underline decoration-red underline-offset-4 hover:text-red-text">
            Want to be one of them? Apply to speak →
          </Link>
        </p>
      </section>
    </main>
  );
}
