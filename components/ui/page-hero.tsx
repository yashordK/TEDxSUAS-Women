import { FadeIn } from "./reveal";

/**
 * Compact hero for inner pages: eyebrow, Playfair title, short intro, under a
 * spotlight cone. Kept to at most 40vh; keep intros to a sentence or two.
 */
export function PageHero({
  eyebrow,
  title,
  accent,
  intro,
}: {
  eyebrow: string;
  title: string;
  /** trailing word(s) in red */
  accent?: string;
  intro: string;
}) {
  return (
    <header className="page-hero gutter relative isolate overflow-hidden pb-[clamp(0.75rem,2vh,2.5rem)] pt-[calc(5rem+clamp(0.5rem,2vh,2.5rem))] md:pt-[calc(6rem+clamp(0.5rem,3vh,2.5rem))]">
      <span aria-hidden className="spot-cone" />
      <FadeIn>
        <p className="eyebrow text-red-text">{eyebrow}</p>
        <h1 className="display mt-2 text-[clamp(1.75rem,min(8vw,8vh),5.5rem)] md:mt-3">
          {title}
          {accent && (
            <>
              {" "}
              <span className="text-red-text">{accent}</span>
            </>
          )}
        </h1>
        <p className="mt-2 max-w-2xl md:mt-3">{intro}</p>
      </FadeIn>
    </header>
  );
}
