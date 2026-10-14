import type { Metadata } from "next";
import { site } from "@/lib/site";
import { speakers } from "@/lib/speakers";
import { ThemeCalligraphy } from "@/components/brand/theme-calligraphy";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { SpeakerGrid } from "@/components/sections/speaker-grid";
import { HeroGlow } from "@/components/sections/hero-glow";

export const metadata: Metadata = {
  title: "Speakers",
  description: `The ${site.name} 2027 speaker lineup: coming soon.`,
};

export default function SpeakersPage() {
  if (speakers.length > 0) {
    return (
      <main id="main" className="gutter pb-28 pt-36 md:pt-44">
        <SectionHeading index="2027" label="Speakers" title="The voices of" accent="2027." />
        <div className="mt-16">
          <SpeakerGrid />
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="relative isolate flex min-h-svh flex-col overflow-hidden">
      <HeroGlow />
      <div className="gutter relative flex flex-1 flex-col items-center justify-center pb-20 pt-32 text-center">
        <p className="eyebrow text-red-text">Speakers · 2027</p>
        <h1 className="display mt-6 text-[clamp(3rem,11vw,9rem)]">
          Coming <span className="text-gradient">soon.</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg text-grey">
          The lineup is being curated, one idea at a time. Every name will carry the same
          promise: {site.theme.tagline.toLowerCase()}.
        </p>
        <div className="mt-14 w-full max-w-[min(640px,90vw)]">
          <ThemeCalligraphy delay={0.2} />
        </div>
        <div className="mt-14 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button href="/speak">Apply to Speak</Button>
          <Button href="/" variant="ghost">Back to Home</Button>
        </div>
      </div>
    </main>
  );
}
