import { site } from "@/lib/site";
import { FadeIn, Hairline, SplitReveal } from "@/components/ui/reveal";
import { ThemeWords } from "@/components/brand/theme-words";

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
    <section id="theme" aria-label="The theme, word by word" className="gutter relative py-[clamp(48px,7vw,96px)]">
      {/* Sanskrit, word by word: art left, meanings right (stacked below lg) */}
      <FadeIn className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <ThemeWords className="-ml-[2%]" widthClass="w-[clamp(280px,62vw,860px)] lg:w-full" />
          {/* the art carries the words visually; screen readers also get the transliteration */}
          <p className="sr-only">{site.theme.transliteration}</p>
        </div>
        <dl className="grid border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-line lg:col-span-5 lg:grid-cols-1 lg:divide-x-0 lg:divide-y">
          {WORDS.map((w) => (
            <div key={w.roman} className="border-b border-line py-5 last:border-b-0 sm:border-b-0 sm:px-6 sm:first:pl-0 lg:grid lg:grid-cols-[9rem_1fr] lg:items-baseline lg:gap-4 lg:px-0 lg:py-4">
              <dt>
                <span lang="sa" className="font-deva block text-2xl font-semibold text-white">{w.deva}</span>
                <span className="text-sm italic text-grey">{w.roman}</span>
              </dt>
              <dd className="mt-2 text-white/90 lg:mt-0">{w.gloss}</dd>
            </div>
          ))}
        </dl>
      </FadeIn>

      {/* Essay */}
      <div className="mt-[clamp(48px,7vw,96px)] grid gap-12 lg:grid-cols-12">
        <div className="space-y-6 text-[18px] leading-[1.65] text-grey lg:col-span-7">
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
      <ul className="mt-[clamp(48px,7vw,96px)] grid gap-px bg-line lg:grid-cols-3">
        {PILLARS.map((p, i) => (
          <li key={p.name} className="bg-black">
            <FadeIn delay={i * 0.1} className="h-full">
              <article className="group relative h-full overflow-hidden border border-transparent p-8 transition-[transform,border-color] duration-700 ease-out-expo hover:-translate-y-2 hover:border-red md:p-10">
                {/* red glow bleed on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-1/2 left-1/2 h-full w-[120%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(235_0_40/0.35),transparent)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                />
                <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-red" />
                <p className="eyebrow relative text-red-text">{p.n}</p>
                <h3 className="display relative mt-10 text-[clamp(2.5rem,5vw,4.5rem)] uppercase md:mt-16">{p.name}</h3>
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
