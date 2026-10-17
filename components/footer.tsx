import Link from "next/link";
import { nav, site } from "@/lib/site";
import { TedxWordmark } from "@/components/brand/tedx-wordmark";

export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-line bg-black">
      <div className="gutter relative py-[clamp(64px,10vw,120px)]">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" aria-label={`${site.name}, home`} className="inline-flex min-h-11 items-center text-3xl">
              <TedxWordmark />
            </Link>
            <p className="mt-2 text-xs tracking-wide text-white/70">{site.disclaimer}</p>
            <a
              href={site.tedxUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-11 items-center text-sm text-white underline decoration-red underline-offset-4 hover:text-red-text"
            >
              What is TEDx?
            </a>
            <p className="mt-6 text-grey">
              {site.date.display}
              <br />
              {site.venue.display}
            </p>
          </div>

          <div className="lg:col-span-4">
            <h2 className="eyebrow text-red-text">Lead Organisers</h2>
            <ul className="mt-5 space-y-2">
              {site.organisers.map((o) => (
                <li key={o.email}>
                  <p className="font-medium text-white">{o.name}</p>
                  <a href={`mailto:${o.email}`} className="inline-flex min-h-11 items-center break-all text-grey transition-colors hover:text-white">
                    {o.email}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-2 lg:col-span-3">
            <div>
              <h2 className="eyebrow text-red-text">Explore</h2>
              <ul className="mt-3">
                {nav.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="inline-flex min-h-11 items-center text-grey hover:text-white">{n.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow text-red-text">Follow</h2>
              <ul className="mt-3">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} className="inline-flex min-h-11 items-center text-grey hover:text-white">{s.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-8 text-xs text-grey md:flex-row md:justify-between">
          <p>
            {site.license} <span className="text-white/70">({site.disclaimer})</span>
          </p>
          <p>© 2027 {site.name}</p>
        </div>
      </div>
    </footer>
  );
}
