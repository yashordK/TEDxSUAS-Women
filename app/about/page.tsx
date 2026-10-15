import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHero } from "@/components/page-hero";
import { AboutEvent, AboutOutro, WhatIsTedx } from "@/components/sections/about";
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
      />
      <WhatIsTedx />
      <AboutEvent />
      <Faq />
      <AboutOutro />
    </main>
  );
}
