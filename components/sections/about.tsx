import { site } from "@/lib/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { FadeIn } from "@/components/ui/reveal";
import { ReelEmbed } from "@/components/ui/reel-embed";

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

const EXPECT = [
  ["Live talks", "Women with lived experience and hard-won insight, each bringing one idea worth carrying home."],
  ["Conversations", "The talks end; the conversations shouldn't. Time and space to meet the people in the room."],
  ["A day to begin", "Leave with a thought you can act on the next morning. That is the whole point."],
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="gutter relative border-t border-line py-28 md:py-40">
      <SectionHeading id="about-title" index="02" label="About" title="Ideas worth" accent="spreading." />

      <div className="mt-20 grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <FadeIn>
            <p className="text-[clamp(1.35rem,2.4vw,2rem)] font-medium leading-snug text-white">
              <span className="text-red-text">{site.name}</span> is a women-led edition of TEDx at
              Symbiosis University of Applied Sciences, Indore: a stage for women&apos;s voices,
              ideas and agency, and for everyone ready to listen to them.
            </p>
          </FadeIn>

          <div className="mt-14 grid gap-10 sm:grid-cols-2">
            {BLOCKS.map((b, i) => (
              <FadeIn key={b.k} delay={i * 0.1}>
                <h3 className="eyebrow border-t border-red pt-5 text-white">About {b.k}</h3>
                <p className="mt-4 text-grey">{b.body}</p>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mt-16">
            <h3 className="eyebrow text-white">What to expect</h3>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {EXPECT.map(([t, d], i) => (
                <li key={t} className="grid gap-2 py-6 md:grid-cols-[3rem_14rem_1fr] md:gap-6">
                  <span className="eyebrow text-red-text">0{i + 1}</span>
                  <span className="text-lg font-semibold text-white">{t}</span>
                  <span className="text-grey">{d}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>

        <FadeIn className="lg:col-span-4 lg:col-start-9" delay={0.15}>
          <ReelEmbed url={site.featuredReel} />
          <p className="eyebrow mt-5 text-grey">From the TEDxSUAS stage</p>
        </FadeIn>
      </div>
    </section>
  );
}
