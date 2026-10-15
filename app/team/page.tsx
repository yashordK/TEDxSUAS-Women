import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/page-hero";
import { Team } from "@/components/sections/team";

export const metadata = pageMeta({
  title: "Team",
  description: `The organisers and team behind ${site.name}.`,
  path: "/team",
});

export default function TeamPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Organising Team"
        title="The people"
        accent="behind it."
        intro="The organisers and the team putting the day together."
      />
      <Team />
    </main>
  );
}
