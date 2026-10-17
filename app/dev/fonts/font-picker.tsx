"use client";

import { useEffect, useState } from "react";

export type FontOption = { name: string; weight: number; className: string };

const PHRASE = "त्वमेव परिवर्तनम्";
const WORDS = ["त्वम्", "एव", "परिवर्तनम्"];
const KEY = "dev-font-choice";
const deva = { letterSpacing: 0, lineHeight: 1.3 } as const;

export function FontPicker({ fonts }: { fonts: FontOption[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState<FontOption | null>(null);

  useEffect(() => {
    try {
      setSelected(localStorage.getItem(KEY));
    } catch {}
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const pick = (name: string) => {
    setSelected(name);
    try {
      localStorage.setItem(KEY, name);
    } catch {}
  };

  return (
    <main className="min-h-dvh bg-[#050304] px-4 pb-24 pt-28 text-white sm:px-8">
      <div className="sticky top-0 z-10 -mx-4 mb-8 border-b border-white/10 bg-[#050304]/95 px-4 py-4 backdrop-blur sm:-mx-8 sm:px-8">
        <h1 className="text-sm font-semibold uppercase tracking-[0.2em]">Devanagari font test</h1>
        <p className="mt-1 text-sm text-white/70">
          Selected: <span className="font-semibold text-[#ff4d5e]">{selected ?? "none yet"}</span>
        </p>
      </div>

      <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {fonts.map((f) => (
          <li key={f.name}>
            <article
              className={`flex h-full flex-col border p-5 ${selected === f.name ? "border-[#EB0028]" : "border-white/10"}`}
            >
              <button
                type="button"
                onClick={() => setOpen(f)}
                className="flex-1 text-left focus-visible:outline-2 focus-visible:outline-[#ff3b55]"
                aria-label={`Open large preview of ${f.name}`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                  {f.name} · {f.weight}
                </p>
                <div className={f.className}>
                  <p className="mt-4 overflow-hidden whitespace-nowrap bg-[#050304] text-[64px] text-white" style={deva}>{PHRASE}</p>
                  <p className="overflow-hidden whitespace-nowrap text-[64px] text-[#EB0028]" style={deva}>{PHRASE}</p>
                  <p className="mt-2 text-[28px] text-white/90" style={deva}>{WORDS.join(" / ")}</p>
                </div>
                <p className="display mt-4 text-3xl">You are the change.</p>
              </button>
              <button
                type="button"
                onClick={() => pick(f.name)}
                className="mt-5 min-h-11 rounded-full border border-[#EB0028] px-5 text-sm font-semibold hover:bg-[#EB0028]"
              >
                {selected === f.name ? "Picked" : "Pick this"}
              </button>
            </article>
          </li>
        ))}
      </ul>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${open.name} preview`}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/90 p-4 sm:p-10"
          onClick={() => setOpen(null)}
        >
          <div className="mx-auto max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em]">{open.name} · {open.weight}</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => pick(open.name)} className="min-h-11 rounded-full border border-[#EB0028] px-5 text-sm font-semibold hover:bg-[#EB0028]">
                  {selected === open.name ? "Picked" : "Pick this"}
                </button>
                <button type="button" onClick={() => setOpen(null)} className="min-h-11 rounded-full border border-white/30 px-5 text-sm">Close</button>
              </div>
            </div>
            <div className={open.className}>
              <p className="mt-8 overflow-x-auto whitespace-nowrap bg-[#050304] px-6 text-[160px] text-white" style={deva}>{PHRASE}</p>
              <p className="mt-4 overflow-x-auto whitespace-nowrap bg-[#EB0028] px-6 text-[160px] text-white" style={deva}>{PHRASE}</p>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {[1, 1.3].map((lh) => (
                  <div key={lh}>
                    <p className="font-sans text-xs uppercase tracking-[0.2em] text-white/60">line-height {lh}</p>
                    {/* overflow-hidden exposes any clipped matras at this line-height */}
                    <p className="mt-2 overflow-hidden whitespace-nowrap border border-dashed border-white/30 text-[72px]" style={{ lineHeight: lh, letterSpacing: 0 }}>
                      {PHRASE}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
