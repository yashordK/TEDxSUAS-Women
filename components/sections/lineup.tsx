import { FadeIn } from "@/components/ui/reveal";

/** Thin-line stand mic: red stroke, no fill. */
function MicMark() {
  return (
    <svg aria-hidden viewBox="0 0 24 40" className="h-10 w-6" fill="none" stroke="#eb0028" strokeWidth="1.2" strokeLinecap="round">
      <rect x="8.5" y="1.5" width="7" height="11" rx="3.5" />
      <path d="M9 5.5h6M9 8.5h6" strokeWidth="0.8" />
      <path d="M12 12.5v24M7 38.5h10" />
    </svg>
  );
}

/**
 * Lineup placeholders while speakers are unannounced: three podium panels (the middle
 * one ~15% taller), each with a thin red outline, a spotlight beam falling from the top
 * centre onto a red pool, the outlined number, a mic mark in the pool, and the label.
 * No faces, no initials.
 */
export function LineupPlaceholders() {
  return (
    <ul className="grid items-end gap-6 sm:grid-cols-3 sm:gap-[clamp(1rem,2.5vw,2rem)]">
      {["01", "02", "03"].map((n, i) => (
        <li key={n}>
          <FadeIn delay={i * 0.08}>
            <div className={`lineup-podium ${i === 1 ? "lineup-podium-tall" : ""}`} style={{ "--pulse-delay": `${i * 2}s` } as React.CSSProperties}>
              <span aria-hidden className="lineup-beam" />
              <span aria-hidden className="lineup-pool" />
              <span
                aria-hidden
                className="display relative text-[clamp(2.75rem,5.5vw,4.5rem)] leading-none text-transparent [font-variant-numeric:lining-nums] [-webkit-text-stroke:1px_rgb(255_77_94/0.8)]"
              >
                {n}
              </span>
              <span className="relative mt-3">
                <MicMark />
              </span>
              <span className="eyebrow relative mt-3 text-[0.625rem] text-[#cfc4c8] sm:text-[0.6875rem]">Speaker to be announced</span>
            </div>
          </FadeIn>
        </li>
      ))}
    </ul>
  );
}
