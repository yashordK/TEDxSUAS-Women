import { ideas, ideaStreams } from "@/lib/ideas";
import { SectionHeading } from "@/components/ui/section-heading";
import { FadeIn } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

export function Ideas() {
  return (
    <section id="ideas" aria-labelledby="ideas-title" className="gutter relative border-t border-line py-28 md:py-40">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <SectionHeading
          id="ideas-title"
          index="03"
          label="Curation Directions"
          title="Ideas we're"
          accent="exploring."
          className="lg:col-span-8"
        />
        <FadeIn className="lg:col-span-4">
          <p className="text-grey">
            A deliberately varied lineup across experience, creativity, science, knowledge and the
            social issues of our time. Use these as a starting point, not a boundary.
          </p>
        </FadeIn>
      </div>

      <ol className="mt-16 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4 md:mt-20">
        {ideas.map((idea, i) => (
          <li key={idea.area} className="bg-black">
            <FadeIn delay={(i % 4) * 0.07} className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden p-7 transition-colors duration-700 hover:bg-[#0c0507] md:p-8">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-1/2 left-1/2 h-full w-[130%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(235_0_40/0.28),transparent)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                />
                <p className="display relative text-4xl text-white/90">{String(i + 1).padStart(2, "0")}</p>
                <div className="relative mt-8 border-l border-red pl-5">
                  <h3 className="eyebrow font-semibold text-red-text">{idea.area}</h3>
                  <p className="mt-3 text-lg font-semibold leading-snug text-white">{idea.title}</p>
                  <p className="mt-3 text-grey">{idea.body}</p>
                </div>
              </article>
            </FadeIn>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <ul aria-label="Streams" className="flex flex-wrap gap-x-6 gap-y-3">
          {ideaStreams.map((s, i) => (
            <li key={s} className="eyebrow flex items-center gap-6 text-white/80">
              {i > 0 && <span aria-hidden className="h-3 w-px bg-red" />}
              {s}
            </li>
          ))}
        </ul>
        <Button href="/speak">Pitch your idea</Button>
      </div>
    </section>
  );
}
