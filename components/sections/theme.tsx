import { site } from "@/lib/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { FadeIn, Hairline, SplitReveal } from "@/components/ui/reveal";

const WORDS = [
  { deva: "त्वम्", roman: "tvam", gloss: "you" },
  { deva: "एव", roman: "eva", gloss: "alone, indeed, none other" },
  { deva: "परिवर्तनम्", roman: "parivartanam", gloss: "change, the turning of things" },
];

const PILLARS = [
  {
    n: "01",
    name: "Speak",
    line: "Say the thing you were taught to keep quiet.",
    body: "Every change starts as a sentence someone was brave enough to say out loud. We make room for the voices that have waited longest for the microphone.",
  },
  {
    n: "02",
    name: "Change",
    line: "Not someday. Not someone else.",
    body: "Ideas only matter when they move something: a policy, a household, a habit, a mind. We look for talks that leave the room carrying a plan.",
  },
  {
    n: "03",
    name: "Inspire",
    line: "One story, many beginnings.",
    body: "The right idea, told well, travels. It finds the person in the back row who needed permission to begin. That is how one becomes many.",
  },
];

export function Theme() {
  return (
    <section id="theme" aria-labelledby="theme-title" className="gutter relative py-28 md:py-40">
      <div className="grid gap-16 lg:grid-cols-12">
        <SectionHeading
          id="theme-title"
          index="01"
          label="The Theme"
          title="You are"
          accent="the change."
          className="lg:col-span-7"
        />

        {/* Sanskrit, word by word */}
        <FadeIn className="lg:col-span-5 lg:pt-24">
          <p lang="sa" className="font-deva text-gradient text-[clamp(2.25rem,5vw,3.75rem)] font-extrabold leading-none">
            {site.theme.devanagari}
          </p>
          <p className="eyebrow mt-4 text-grey">{site.theme.transliteration}</p>
          <dl className="mt-10 divide-y divide-line border-y border-line">
            {WORDS.map((w) => (
              <div key={w.roman} className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 py-4 md:grid-cols-[9rem_1fr]">
                <dt>
                  <span lang="sa" className="font-deva block text-xl text-white">{w.deva}</span>
                  <span className="text-xs italic text-grey">{w.roman}</span>
                </dt>
                <dd className="text-grey">{w.gloss}</dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </div>

      {/* Essay */}
      <div className="mt-24 grid gap-12 md:mt-32 lg:grid-cols-12">
        <div className="space-y-6 text-lg leading-relaxed text-grey lg:col-span-6 lg:col-start-2">
          <FadeIn>
            <p>
              There is an old habit of waiting. Waiting for the right moment, the right permission,
              the right person to arrive and set things in motion. <span className="text-white">Twamev Parivartanam</span> ends
              the wait with three words: <em className="text-white">you are the change.</em> Not a
              symbol of it, not a witness to it. The thing itself.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p>
              For generations, women have been the quiet engines of change: in classrooms and
              courtrooms, in laboratories and kitchens, in boardrooms and on the streets. Too often
              that work went unnamed. This edition names it, and hands over the stage.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p>
              TEDxSUAS Women is a day of ideas from women who did not wait, and an invitation to
              everyone listening to stop waiting too. Change does not begin in a policy document or
              a distant capital. <span className="text-white">It begins with you.</span>
            </p>
          </FadeIn>
        </div>

        <figure className="relative lg:col-span-4 lg:col-start-9 lg:self-center">
          <Hairline className="mb-8 w-full" />
          <blockquote className="display text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.02]">
            <SplitReveal text="The change you are waiting for" className="block" />
            <span className="text-gradient">is waiting for you.</span>
          </blockquote>
          <figcaption className="eyebrow mt-8 text-grey">{site.lines.tomorrow}</figcaption>
        </figure>
      </div>

      {/* Pillars */}
      <ul className="mt-28 grid gap-px bg-line md:mt-36 md:grid-cols-3">
        {PILLARS.map((p, i) => (
          <li key={p.name} className="bg-black">
            <FadeIn delay={i * 0.1} className="h-full">
              <article className="group relative h-full overflow-hidden border border-transparent p-8 transition-[transform,border-color] duration-700 ease-out-expo hover:-translate-y-2 hover:border-red md:p-10">
                {/* red glow bleed on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-1/2 left-1/2 h-full w-[120%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(235_0_40/0.35),transparent)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                />
                <p className="eyebrow relative text-red-text">{p.n}</p>
                <h3 className="display relative mt-16 text-5xl uppercase md:mt-24 md:text-6xl">{p.name}</h3>
                <p className="relative mt-4 font-medium text-white">{p.line}</p>
                <p className="relative mt-4 text-grey">{p.body}</p>
              </article>
            </FadeIn>
          </li>
        ))}
      </ul>
    </section>
  );
}
