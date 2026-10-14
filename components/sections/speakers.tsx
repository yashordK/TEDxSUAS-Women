import { speakers } from "@/lib/speakers";
import { SectionHeading } from "@/components/ui/section-heading";
import { FadeIn } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { SpeakerGrid } from "./speaker-grid";

export function Speakers() {
  const revealed = speakers.length > 0;
  return (
    <section id="speakers" aria-labelledby="speakers-title" className="gutter relative border-t border-line py-28 md:py-40">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <SectionHeading
          id="speakers-title"
          index="03"
          label="Speakers"
          title={revealed ? "The voices of" : "Voices,"}
          accent={revealed ? "2027." : "coming soon."}
          className="lg:col-span-8"
        />
        {!revealed && (
          <FadeIn className="lg:col-span-4">
            <p className="text-grey">
              Our lineup is being curated right now, one idea at a time. The names land soon. If
              yours should be among them, the stage is still open.
            </p>
            <div className="mt-8">
              <Button href="/speak">Apply to Speak</Button>
            </div>
          </FadeIn>
        )}
      </div>

      <div className="mt-16 md:mt-20">
        <SpeakerGrid />
      </div>
    </section>
  );
}
