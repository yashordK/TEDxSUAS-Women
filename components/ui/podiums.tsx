/**
 * Empty spotlit podiums: the lineup is not announced, so the stage waits.
 * Decorative only; pure CSS.
 */
export function Podiums({ count = 3 }: { count?: number }) {
  return (
    <div aria-hidden className="grid grid-cols-3 gap-[clamp(0.75rem,3vw,3rem)]">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="podium" style={{ animationDelay: `${i * 0.6}s` }}>
          <span className="podium-beam" />
          <span className="podium-pool" />
          <span className="podium-stand" />
        </div>
      ))}
    </div>
  );
}
