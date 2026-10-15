import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHero } from "@/components/page-hero";
import { AboutEvent, WhatIsTedx } from "@/components/sections/about";
import { Faq } from "@/components/sections/faq";

export const metadata = pageMeta({
  title: "About",
  description: `About TED, TEDx and ${site.name}: the event, the theme, and answers to common questions.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow={site.name}
        title="ABOUT"
        intro={`${site.theme.transliteration} · ${site.date.display} · ${site.venue.display}`}
        image="/images/about-hero.webp"
        imagePosition="right center"
        mobileImage="/images/about-hero-mobile.webp"
        // stage and curtain fully below the nav; the seats fill the lower frame
        imageShift="clamp(56px, 8svh, 90px)"
      />
      <WhatIsTedx />
      <AboutEvent />
      <Faq footerLink={{ href: "/speak", label: "Call for speakers →" }} />
    </main>
  );
}
