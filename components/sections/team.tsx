import Image from "next/image";
import { site } from "@/lib/site";
import { coreLeadership, teams, type Member } from "@/lib/team";
import { FadeIn } from "@/components/ui/reveal";

const SECTION = "gutter relative py-14 md:py-20";
const H2 = "display text-[clamp(2rem,4.5vw,3.5rem)]";

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

/** Organisers (TEDx: the licensee and organisers are the sole organisers) from lib/site.ts. */
const organiserNames = new Set<string>(site.organisers.map((o) => o.name));
const leads = coreLeadership.filter((m) => organiserNames.has(m.name));
const core = coreLeadership.filter((m) => !organiserNames.has(m.name));

/**
 * One 4:5 frame for everyone. With a `photo`: grayscale under a ~25% dark-red multiply,
 * colour on hover (desktop). Without: near-black tile, soft red spotlight from the top,
 * large outlined initials. Caption underneath either way.
 */
function MemberTile({ member: m, large = false }: { member: Member; large?: boolean }) {
  return (
    <figure className="team-tile group">
      <div className="team-frame">
        {m.photo ? (
          <>
            <Image
              src={m.photo}
              alt={m.name}
              fill
              sizes={large ? "(min-width: 1024px) 25vw, 50vw" : "(min-width: 1024px) 20vw, 50vw"}
              className="team-photo object-cover"
            />
            <span aria-hidden className="team-tint" />
          </>
        ) : (
          <>
            <span aria-hidden className="team-glow" />
            <span
              aria-hidden
              className={`display relative text-transparent [-webkit-text-stroke:1px_rgb(255_77_94/0.7)] ${large ? "text-[clamp(3.5rem,8vw,6.5rem)]" : "text-[clamp(2.75rem,6vw,4.5rem)]"}`}
            >
              {initials(m.name)}
            </span>
          </>
        )}
      </div>
      <figcaption className="mt-4">
        <span className={`block font-bold leading-snug text-white ${large ? "text-lg md:text-xl" : "text-base md:text-lg"}`}>{m.name}</span>
        {m.role && <span className="eyebrow mt-1.5 block text-[0.625rem] text-red-text md:text-[0.6875rem]">{m.role}</span>}
      </figcaption>
    </figure>
  );
}

function Group({ title, members, large = false }: { title: string; members: Member[]; large?: boolean }) {
  if (members.length === 0) return null;
  return (
    <div>
      <FadeIn>
        {/* two lines of room on wide screens so tiles line up across groups */}
        <h3 className={`eyebrow text-red-text ${large ? "" : "sm:min-h-[3.2em]"}`}>{title}</h3>
      </FadeIn>
      {/* Two tiles per row inside a group; groups sit side by side (see Team), so tile
          sizes stay identical whether a member has a photo or not. */}
      <ul className={`mt-6 grid grid-cols-2 gap-x-4 gap-y-10 ${large ? "md:gap-x-6" : "md:gap-x-5"}`}>
        {members.map((m, i) => (
          <li key={m.name}>
            <FadeIn delay={(i % 4) * 0.06}>
              <MemberTile member={m} large={large} />
            </FadeIn>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Team() {
  return (
    <>
      <section aria-labelledby="team-title" className={SECTION}>
        <FadeIn>
          <h2 id="team-title" className={H2}>
            Meet the <span className="text-red-text">team</span>
          </h2>
          {site.licensee !== "TODO" && (
            <p className="mt-4 text-[17px] text-[#cfc4c8]">
              Licensee: <span className="text-white">{site.licensee}</span>
            </p>
          )}
        </FadeIn>
        {/* Leads and core team side by side: four large tiles across on desktop. */}
        <div className="mt-12 grid gap-x-6 gap-y-14 lg:grid-cols-2">
          <Group title="Lead organisers" members={leads} large />
          <Group title="Core team" members={core} large />
        </div>
        {/* Teams flow as groups: two per row on tablet, three on desktop. */}
        <div className="mt-16 grid gap-x-10 gap-y-14 border-t border-line pt-14 sm:grid-cols-2 lg:grid-cols-3 md:mt-20">
          {teams.map((t) => (
            <Group key={t.name} title={t.name} members={t.members} />
          ))}
        </div>
      </section>

      <div className={`${SECTION} border-t border-line`}>
        <p className="text-[17px] leading-[1.7] text-[#cfc4c8] md:text-[18px]">
          Questions? Write to the lead organisers:{" "}
          {site.organisers.map((o, i) => (
            <span key={o.email}>
              {i > 0 && " or "}
              <a href={`mailto:${o.email}`} className="break-all text-white underline decoration-red underline-offset-4 hover:text-red-text">
                {o.email}
              </a>
            </span>
          ))}
        </p>
      </div>
    </>
  );
}
