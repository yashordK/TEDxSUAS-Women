const dot = <span className="block h-1 w-1 rounded-full bg-ted" aria-hidden />;

export function BottomStrip() {
  return (
    <div className="relative z-20 shrink-0 px-[max(1.25rem,env(safe-area-inset-left))] pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-[max(2rem,env(safe-area-inset-left))] desk:bg-none desk:px-16 desk:pt-4 desk:pb-4">
      {/* Phones: line 1 = event type, line 2 = date • venue. Wider: one line. */}
      <ul className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.625rem] font-semibold uppercase leading-[1.4] tracking-[0.12em] min-[400px]:text-[0.7rem] min-[400px]:tracking-[0.2em] text-[#cfc4c8] sm:gap-x-6">
        <li className="w-full sm:w-auto">Independently organized TED event</li>
        <li className="hidden sm:block">{dot}</li>
        <li className="hero-strip-date">4 February 2027</li>
        <li className="hero-strip-date">{dot}</li>
        <li>SUAS, Indore</li>
      </ul>
    </div>
  );
}
