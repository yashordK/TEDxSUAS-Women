import Link from "next/link";
import { nav, site } from "@/lib/site";
import { TedxWordmark } from "@/components/brand/tedx-wordmark";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-line bg-black">
      <div aria-hidden className="pointer-events-none absolute -bottom-1/2 left-1/2 h-full w-[120%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(235_0_40/0.22),transparent)]" />

      <div className="gutter relative py-24 md:py-32">
        {/* closing call */}
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p className="display max-w-3xl text-[clamp(2.5rem,7vw,6rem)]">
            It begins <span className="text-gradient">with you.</span>
          </p>
          <Button href="/speak">Apply to Speak</Button>
        </div>

        <div className="mt-24 grid gap-14 border-t border-line pt-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" aria-label={`${site.name}, home`} className="text-3xl">
              <TedxWordmark />
            </Link>
            <p className="mt-2 text-xs tracking-wide text-white/70">{site.disclaimer}</p>
            <p className="mt-6 text-grey">
              {site.date.display}
              <br />
              {site.venue.display}
            </p>
          </div>

          <div className="md:col-span-4">
            <h2 className="eyebrow text-red-text">Lead Organisers</h2>
            <ul className="mt-5 space-y-4">
              {site.organisers.map((o) => (
                <li key={o.email}>
                  <p className="font-medium text-white">{o.name}</p>
                  <a href={`mailto:${o.email}`} className="text-grey transition-colors hover:text-white">
                    {o.email}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-3">
            <div>
              <h2 className="eyebrow text-red-text">Explore</h2>
              <ul className="mt-5 space-y-2">
                {nav.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="text-grey hover:text-white">{n.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow text-red-text">Follow</h2>
              <ul className="mt-5 space-y-2">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} className="text-grey hover:text-white">{s.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-8 text-xs text-grey md:flex-row md:justify-between">
          <p>{site.license}</p>
          <p>© 2027 {site.name}</p>
        </div>
      </div>
    </footer>
  );
}
