import { site } from "@/lib/site";
import { FadeIn } from "@/components/ui/reveal";

/**
 * "Ideas we're exploring": the curatorial directions from lib/site.ts as divided rows
 * (no cards). Two columns of four on desktop, one column on phones.
 */
export function Directions() {
  return (
    <div>
      <FadeIn>
        <h2 id="ideas-title" className="display text-[clamp(2rem,4.5vw,3.5rem)]">
          Ideas we&apos;re <span className="text-red-text">exploring</span>
        </h2>
        <p className="mt-4 max-w-[62ch] text-[17px] leading-[1.7] text-[#cfc4c8] md:text-[18px]">
          A deliberately varied lineup across experience, creativity, science, knowledge and contemporary social
          issues. These are directions, not a final programme.
        </p>
      </FadeIn>

      {/* column flow: 01–04 down the left, 05–08 down the right */}
      <ol className="mt-12 grid gap-x-12 md:grid-flow-col md:grid-cols-2 md:grid-rows-4">
        {site.directions.map((d, i) => (
          <li key={d.n}>
            <FadeIn delay={(i % 4) * 0.06}>
              <div className="direction-row group grid grid-cols-[3.75rem_1fr] items-start gap-x-4 border-t border-line py-6 md:grid-cols-[5rem_1fr] md:gap-x-5">
                <span aria-hidden className="direction-num display text-[clamp(2.5rem,5vw,3.5rem)] leading-[0.9] [font-variant-numeric:lining-nums]">
                  {d.n}
                </span>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-red-text">{d.title}</h3>
                  <p className="mt-2 text-lg font-bold leading-snug text-white">{d.sub}</p>
                  <p className="mt-1.5 text-[16px] leading-[1.6] text-[#cfc4c8] md:text-[17px]">{d.line}</p>
                </div>
              </div>
            </FadeIn>
          </li>
        ))}
      </ol>

      <FadeIn className="mt-10">
        <ul aria-label="Themes across the lineup" className="flex flex-wrap items-center gap-y-3">
          {site.directionTags.map((t, i) => (
            <li
              key={t}
              className={`eyebrow px-4 text-[0.6875rem] text-white first:pl-0 ${i > 0 ? "border-l border-red" : ""}`}
            >
              {t}
            </li>
          ))}
        </ul>
      </FadeIn>
    </div>
  );
}
