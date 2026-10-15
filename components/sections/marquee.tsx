const ITEMS = ["Speak", "Change", "Inspire", "त्वमेव परिवर्तनम्"];

/** Slow infinite strip. Two identical halves; the track slides by -50%. */
export function Marquee() {
  const run = [...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div aria-hidden className="overflow-hidden border-y border-line py-6 md:py-8">
      <div
        data-motion="decorative"
        className="flex w-max whitespace-nowrap will-change-transform"
        style={{ animation: "marquee 45s linear infinite" }}
      >
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center">
            {run.map((item, i) => (
              <span key={i} className="flex items-center">
                <span
                  className={`px-6 text-[clamp(2rem,5vw,4.5rem)] md:px-10 ${
                    item.startsWith("त")
                      ? "font-deva-display text-white"
                      : "display uppercase text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.55)]"
                  }`}
                >
                  {item}
                </span>
                <span className="size-2 rounded-full bg-red" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
