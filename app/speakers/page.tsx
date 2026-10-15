import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { speakers } from "@/lib/speakers";
import { ThemeCalligraphy } from "@/components/brand/theme-calligraphy";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { Podiums } from "@/components/ui/podiums";
import { FadeIn } from "@/components/ui/reveal";
import { SpeakerGrid } from "@/components/sections/speaker-grid";

export const metadata = pageMeta({
  title: "Speakers",
  description: `The ${site.name} 2027 speaker lineup: coming soon.`,
  path: "/speakers",
});

export default function SpeakersPage() {
  const revealed = speakers.length > 0;
  return (
    <main id="main">
      <PageHero
        eyebrow="Speakers · 2027"
        title={revealed ? "The voices of" : "Coming"}
        accent={revealed ? "2027." : "soon."}
        intro="The lineup is being curated, one idea at a time."
      />
      <section aria-label="Lineup" className="gutter relative pb-24 pt-8 md:pb-32">
        {revealed ? (
          <SpeakerGrid />
        ) : (
          <>
            <FadeIn className="mx-auto max-w-4xl">
              <Podiums />
            </FadeIn>
            <FadeIn className="mx-auto mt-14 max-w-2xl text-center">
              <p>
                Every name will carry the same promise: {site.theme.tagline.toLowerCase()}. If yours
                should be among them, the stage is still open.
              </p>
              <div className="mx-auto mt-12 w-full max-w-[min(640px,90vw)] overflow-hidden">
                <ThemeCalligraphy delay={0.2} />
              </div>
            </FadeIn>
          </>
        )}
        <FadeIn className="mx-auto mt-14 max-w-2xl text-center">
          <p className="text-sm">{site.speakerRules}</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-8">
            <Button href="/speak">Apply to Speak</Button>
            <Button href="/" variant="ghost">Back to Home</Button>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
