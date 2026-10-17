import Image from "next/image";
import { coreLeadership, teams, type Member } from "@/lib/team";
import { SectionHeading } from "@/components/ui/section-heading";
import { FadeIn } from "@/components/ui/reveal";

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

export function Team() {
  return (
    <section id="team" aria-labelledby="team-title" className="gutter relative border-t border-line py-28 md:py-40">
      <SectionHeading id="team-title" index="05" label="Organising Team" title="The people" accent="behind it." />

      {/* Core leadership */}
      <div className="mt-20 flex items-center gap-6">
        <span className="eyebrow text-red-text">Core Leadership</span>
        <span aria-hidden className="h-px flex-1 bg-line" />
      </div>
      <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
        {coreLeadership.map((m, i) => (
          <li key={m.name}>
            <FadeIn delay={i * 0.08}>
              <LeaderCard member={m} />
            </FadeIn>
          </li>
        ))}
      </ul>

      {/* Teams */}
      <div className="mt-24 flex items-center gap-6">
        <span className="eyebrow text-red-text">Teams</span>
        <span aria-hidden className="h-px flex-1 bg-line" />
      </div>
      <ul className="mt-10 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
        {teams.map((t, i) => (
          <li key={t.name} className="bg-black">
            <FadeIn delay={(i % 4) * 0.08} className="h-full">
              <div className="group h-full p-8 transition-colors duration-700 hover:bg-[radial-gradient(ellipse_at_top_left,rgb(235_0_40/0.12),transparent_60%)] md:p-10">
                <span className="flex size-14 items-center justify-center rounded-full border border-red text-red-text transition-transform duration-500 ease-out-expo group-hover:scale-110">
                  {TEAM_ICONS[t.name] ?? TEAM_ICONS.default}
                </span>
                <h3 className="mt-8 text-xl font-semibold leading-tight text-white">{t.name}</h3>
                <span aria-hidden className="mt-4 block h-px w-10 bg-red" />
                <ul className="mt-5 space-y-1.5 text-grey">
                  {t.members.map((m) => (
                    <li key={m.name}>{m.name}</li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </li>
        ))}
      </ul>
    </section>
  );
}

function LeaderCard({ member: m }: { member: Member }) {
  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden border border-line bg-[linear-gradient(160deg,#120206,#000_70%)]">
        {m.photo ? (
          <Image
            src={m.photo}
            alt={m.name}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover grayscale transition duration-700 ease-out-expo group-hover:scale-105 group-hover:grayscale-0"
          />
        ) : (
          <>
            <span
              aria-hidden
              className="display absolute inset-0 flex items-center justify-center text-[clamp(3.5rem,9vw,7rem)] text-transparent [-webkit-text-stroke:1px_rgb(255_77_94/0.6)] transition-transform duration-700 ease-out-expo group-hover:scale-110"
            >
              {initials(m.name)}
            </span>
            <span className="eyebrow absolute bottom-4 left-4 text-[0.625rem] text-grey">Portrait soon</span>
          </>
        )}
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-red transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
        />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-white md:text-xl">{m.name}</h3>
      <p className="eyebrow mt-2 text-[0.625rem] text-red-text md:text-[0.6875rem]">{m.role}</p>
    </article>
  );
}

const ic = "size-6";
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const TEAM_ICONS: Record<string, React.ReactNode> = {
  "Curator Team": (
    <svg viewBox="0 0 24 24" className={ic} {...stroke} aria-hidden>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" />
    </svg>
  ),
  "Communication, Editorial & Marketing": (
    <svg viewBox="0 0 24 24" className={ic} {...stroke} aria-hidden>
      <path d="M3 10v4h3l6 4V6L6 10H3ZM16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12" />
    </svg>
  ),
  "Event Manager": (
    <svg viewBox="0 0 24 24" className={ic} {...stroke} aria-hidden>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
    </svg>
  ),
  "Website Manager": (
    <svg viewBox="0 0 24 24" className={ic} {...stroke} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" className={ic} {...stroke} aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  ),
};
