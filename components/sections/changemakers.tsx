import Link from "next/link";
import { site } from "@/lib/site";
import { FadeIn } from "@/components/ui/reveal";

const names = site.changemakers.map((c) => c.name);

/** Split the names into `n` rows, rotated so neighbouring rows don't start alike. */
function rows(n: number) {
  return Array.from({ length: n }, (_, r) => {
    const k = Math.round((names.length / n) * r);
    return [...names.slice(k), ...names.slice(0, k)];
  });
}

function Row({ list, i }: { list: string[]; i: number }) {
  // Two identical halves; the track slides by -50% for a seamless loop.
  const half = list.join("  ·  ") + "  ·  ";
  return (
    <div className={`names-row names-row-${i}`}>
      <div className="names-track">
        <span>{half}</span>
        <span>{half}</span>
      </div>
    </div>
  );
}

/**
 * /theme hero backdrop: the changemakers' names in huge outlined type, rows drifting in
 * opposite directions. A brighter copy of the same rows is masked to a slowly moving
 * spotlight, so whichever name the light passes over brightens. Decoration only.
 */
export function NamesBackdrop() {
  const desktop = rows(3);
  const phone = rows(2);
  const layer = (list: string[][], cls: string) => (
    <div className={`names-layer ${cls}`}>
      {list.map((l, i) => (
        <Row key={i} list={l} i={i} />
      ))}
    </div>
  );
  return (
    <div aria-hidden className="names-backdrop">
      <div className="names-set hidden sm:flex">
        {layer(desktop, "names-faint")}
        {layer(desktop, "names-lit")}
      </div>
      <div className="names-set flex sm:hidden">
        {layer(phone, "names-faint")}
        {layer(phone, "names-lit")}
      </div>
      <span className="names-spot" />
      {/* keep the title side darker */}
      <span className="absolute inset-0 bg-[linear-gradient(90deg,rgb(5_3_4/0.85),rgb(5_3_4/0.35)_55%,transparent_80%)]" />
    </div>
  );
}

/** "Change always begins with one.": one row per changemaker. */
export function Changemakers() {
  return (
    <section aria-labelledby="changemakers-title" className="gutter relative border-t border-line py-14 md:py-20">
      <FadeIn>
        <h2 id="changemakers-title" className="display text-[clamp(2rem,4.5vw,3.5rem)]">
          Change always begins <span className="text-red-text">with one.</span>
        </h2>
      </FadeIn>
      <ol className="mt-10">
        {site.changemakers.map((c, i) => (
          <li key={c.name}>
            <FadeIn delay={(i % 6) * 0.05}>
              {/* tabIndex: keyboard users can focus a row to reveal its line */}
              <div tabIndex={0} className="cm-row grid grid-cols-[3rem_1fr] items-baseline gap-x-4 border-t border-line py-5 outline-none focus-visible:bg-white/[0.03] md:grid-cols-[5rem_1fr_minmax(0,1.1fr)] md:gap-x-8 md:py-6">
                <span aria-hidden className="cm-num display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-none [font-variant-numeric:lining-nums]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display text-[clamp(1.5rem,3.2vw,2.5rem)] leading-tight text-white">{c.name}</h3>
                <p className="cm-line col-start-2 mt-2 text-[16px] leading-[1.6] text-[#cfc4c8] md:col-start-auto md:mt-0 md:text-[17px]">{c.line}</p>
              </div>
            </FadeIn>
          </li>
        ))}
      </ol>
      <p className="mt-10">
        <Link href="/speak" className="inline-flex min-h-11 items-center text-lg text-white underline decoration-red underline-offset-4 hover:text-red-text">
          Your name could be next. Apply to speak →
        </Link>
      </p>
    </section>
  );
}
