import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/page-hero";
import { FadeIn } from "@/components/ui/reveal";
import { ApplyButton } from "@/components/ui/apply-button";

export const metadata = pageMeta({
  title: "Apply to Speak",
  description: `Speak at ${site.name}: who can apply, the TEDx speaker rules, and how to apply.`,
  path: "/speak",
});

// Only what the organisers have already published on the site (see the FAQ).
const ELIGIBILITY = [
  "Anyone with an original idea that fits the theme.",
  "Talks are short by design: 18 minutes at most. You can propose 6, 12 or 18 minutes in the application.",
  "The curation team reviews every application and will reach out to shortlisted speakers.",
];

export default function SpeakPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Call for Speakers"
        title="Apply to"
        accent="speak."
        intro="Have an idea worth spreading? Read the essentials, then apply."
      />
      <section aria-labelledby="eligibility" className="gutter relative py-16 md:py-24">
        <div className="grid gap-14 lg:grid-cols-12">
          <FadeIn className="lg:col-span-7">
            <h2 id="eligibility" className="eyebrow text-red-text">Who can apply</h2>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {ELIGIBILITY.map((e, i) => (
                <li key={e} className="grid grid-cols-[2.5rem_1fr] gap-4 py-5">
                  <span className="eyebrow pt-1 text-red-text">0{i + 1}</span>
                  <span className="text-white">{e}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn className="lg:col-span-5" delay={0.1}>
            <h2 className="eyebrow text-red-text">TEDx speaker rules</h2>
            <p className="mt-6 border-l border-red pl-5 text-white">{site.speakerRules}</p>
            <p className="mt-6">Talks should speak to this year&apos;s theme:</p>
            <Link href="/theme" className="cta cta-link mt-1 -ml-1">
              <span className="cta-label">{site.theme.transliteration}</span>
            </Link>
          </FadeIn>
        </div>
        <FadeIn className="mt-16 flex flex-col items-start gap-3">
          <ApplyButton className="min-h-16 w-full px-10 text-[15px] sm:w-auto" />
          {site.applyUrl === "TODO" && <p className="text-sm">The application form will be linked here when it opens.</p>}
        </FadeIn>
      </section>
    </main>
  );
}
