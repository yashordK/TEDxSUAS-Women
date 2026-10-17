import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHero } from "@/components/page-hero";
import { AuditoriumBand, GettingHere, VenueFacts } from "@/components/sections/venue";

export const metadata = pageMeta({
  title: "Venue",
  description: `${site.date.display} at ${site.venue.display}: where it happens and how to get there.`,
  path: "/venue",
});

export default function VenuePage() {
  return (
    <main id="main">
      <PageHero
        eyebrow={site.name}
        title="VENUE"
        intro={site.venue.display}
        image="/images/venue-hero.webp"
        imagePosition="right center"
        mobileImage="/images/venue-hero-mobile.webp"
      />
      <VenueFacts />
      <AuditoriumBand />
      <GettingHere />
    </main>
  );
}
