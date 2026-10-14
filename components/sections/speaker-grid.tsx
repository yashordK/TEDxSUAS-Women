import Image from "next/image";
import { speakers, placeholderCount, type Speaker } from "@/lib/speakers";
import { FadeIn } from "@/components/ui/reveal";

/** Real speakers when announced; shimmering "to be revealed" tiles until then. */
export function SpeakerGrid({ count = placeholderCount }: { count?: number }) {
  const revealed = speakers.length > 0;
  return (
    <ul className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3">
      {revealed
        ? speakers.map((s, i) => (
            <li key={s.name}>
              <FadeIn delay={(i % 3) * 0.08}>
                <SpeakerCard speaker={s} />
              </FadeIn>
            </li>
          ))
        : Array.from({ length: count }, (_, i) => (
            <li key={i}>
              <FadeIn delay={(i % 3) * 0.08}>
                <PlaceholderTile n={i + 1} />
              </FadeIn>
            </li>
          ))}
    </ul>
  );
}

function PlaceholderTile({ n }: { n: number }) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden border border-line bg-[linear-gradient(160deg,#0b0b0b,#000)]">
      {/* silhouette */}
      <div aria-hidden className="absolute inset-x-[22%] top-[18%] aspect-square rounded-full bg-white/[0.04]" />
      <div aria-hidden className="absolute inset-x-[10%] -bottom-[8%] h-[38%] rounded-t-[50%] bg-white/[0.04]" />
      {/* red skeleton shimmer */}
      <span
        aria-hidden
        data-motion="decorative"
        className="absolute inset-0 bg-[linear-gradient(100deg,transparent_20%,rgb(235_0_40/0.16)_45%,rgb(255_77_94/0.22)_50%,transparent_75%)]"
        style={{ animation: `skeleton-shimmer 2.8s ease-in-out ${n * 0.25}s infinite`, transform: "translateX(-100%)" }}
      />
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
        <p className="eyebrow text-red-text">Speaker {String(n).padStart(2, "0")}</p>
        <p className="mt-2 text-lg font-semibold text-white md:text-xl">To be revealed</p>
      </div>
    </div>
  );
}

function SpeakerCard({ speaker: s }: { speaker: Speaker }) {
  return (
    <article className="group relative aspect-[3/4] overflow-hidden border border-line">
      {s.photo && (
        <Image
          src={s.photo}
          alt={s.name}
          fill
          sizes="(min-width: 1024px) 33vw, 50vw"
          className="object-cover grayscale transition duration-700 ease-out-expo group-hover:scale-105 group-hover:grayscale-0"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
        <p className="eyebrow text-red-text">Speaker</p>
        <h3 className="mt-2 text-lg font-semibold text-white md:text-2xl">{s.name}</h3>
        <p className="mt-1 text-sm text-grey">{s.title}</p>
        {s.talk && <p className="mt-3 text-sm italic text-white">&ldquo;{s.talk}&rdquo;</p>}
      </div>
    </article>
  );
}
