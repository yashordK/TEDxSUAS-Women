import { Hairline, SplitReveal } from "./reveal";

/** "02 / ABOUT" index label, red hairline, then a large headline. */
export function SectionHeading({
  index,
  label,
  title,
  accent,
  id,
  className = "",
}: {
  index: string;
  label: string;
  title: string;
  /** trailing word(s) set in the signature gradient */
  accent?: string;
  id?: string;
  className?: string;
}) {
  return (
    <header className={className}>
      <p className="eyebrow flex items-center gap-3 text-white">
        <span className="text-red-text">{index}</span>
        <span aria-hidden className="text-grey">/</span>
        {label}
      </p>
      <Hairline className="mt-5 w-16 md:w-24" />
      <h2 id={id} className="display mt-8 text-[clamp(2.5rem,7vw,6rem)]">
        <SplitReveal text={title} />
        {accent && (
          <>
            {" "}
            <span className="text-gradient">{accent}</span>
          </>
        )}
      </h2>
    </header>
  );
}
