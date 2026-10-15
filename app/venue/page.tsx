import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/page-hero";
import { Venue } from "@/components/sections/venue";

export const metadata = pageMeta({
  title: "Venue",
  description: `${site.date.display} at ${site.venue.display}: address, map and travel notes.`,
  path: "/venue",
});

export default function VenuePage() {
  return (
    <main id="main">
      <PageHero eyebrow="Venue" title="Where it" accent="begins." intro={`${site.date.display}, ${site.venue.display}.`} />
      <Venue />
    </main>
  );
}
