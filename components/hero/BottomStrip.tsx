const dot = <span className="block h-1 w-1 rounded-full bg-ted" aria-hidden />;

export function BottomStrip() {
  return (
    <div className="relative z-20 bg-gradient-to-t from-ink/95 via-ink/80 to-transparent px-[max(1.25rem,env(safe-area-inset-left))] pb-[max(1rem,env(safe-area-inset-bottom))] pt-10 sm:px-[max(2rem,env(safe-area-inset-left))] desk:absolute desk:inset-x-0 desk:bottom-0 desk:bg-none desk:px-16 desk:pt-4 desk:pb-4">
      {/* Phones: line 1 = event type, line 2 = date • venue. Wider: one line. */}
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.7rem] font-semibold uppercase leading-[1.4] tracking-[0.2em] text-[#cfc4c8] sm:gap-x-6">
        <li className="w-full sm:w-auto">Independently organized TED event</li>
        <li className="hidden sm:block">{dot}</li>
        <li>4 February 2027</li>
        <li>{dot}</li>
        <li>SUAS, Indore</li>
      </ul>
    </div>
  );
}
