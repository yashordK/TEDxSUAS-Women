import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHero } from "@/components/page-hero";
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
        eyebrow={site.name}
        title="TEAM"
        intro="The people behind the stage."
        image="/images/team-hero.webp"
        imagePosition="right center"
        mobileImage="/images/team-hero-mobile.webp"
      />
      <Team />
    </main>
  );
}
