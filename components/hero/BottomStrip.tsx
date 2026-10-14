export function BottomStrip() {
  const items = ["Independently organized TED event", "[Event date]", "SUAS, Indore"];
  return (
    <div className="relative z-20 border-t border-white/10 bg-ink/70 px-4 py-4 backdrop-blur-sm sm:px-8 lg:absolute lg:inset-x-0 lg:bottom-0 lg:border-white/5 lg:bg-transparent lg:px-16 lg:backdrop-blur-none">
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#cfc4c8]">
        {items.map((t, i) => (
          <li key={t} className="flex items-center gap-6">
            {i > 0 && <span className="hidden h-1 w-1 rounded-full bg-ted sm:block" aria-hidden />}
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
