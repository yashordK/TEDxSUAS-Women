import { FadeIn } from "@/components/ui/reveal";

/**
 * Lineup placeholders while speakers are unannounced: three podium panels (the middle
 * one taller), each with a thin red outline, a soft spotlight from the top, a large
 * outlined number and "Speaker to be announced". No faces, no initials.
 */
export function LineupPlaceholders() {
  return (
    <ul className="grid items-end gap-6 sm:grid-cols-3 sm:gap-[clamp(1rem,2.5vw,2rem)]">
      {["01", "02", "03"].map((n, i) => (
        <li key={n}>
          <FadeIn delay={i * 0.08}>
            <div className={`lineup-podium ${i === 1 ? "lineup-podium-tall" : ""}`} style={{ animationDelay: `${i * 1.3}s` }}>
              <span aria-hidden className="lineup-podium-glow" />
              <span
                aria-hidden
                className="display relative text-[clamp(4rem,9vw,7.5rem)] leading-none text-transparent [-webkit-text-stroke:1px_rgb(255_77_94/0.75)]"
              >
                {n}
              </span>
              <span className="eyebrow relative mt-4 text-[0.6875rem] text-[#cfc4c8]">Speaker to be announced</span>
            </div>
          </FadeIn>
        </li>
      ))}
    </ul>
  );
}
