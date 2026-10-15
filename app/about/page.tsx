import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHero } from "@/components/ui/page-hero";
import { About } from "@/components/sections/about";
import { Faq } from "@/components/sections/faq";

export const metadata = pageMeta({
  title: "About",
  description: `About TED, TEDx and ${site.name}: what to expect on the day, and answers to common questions.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="About"
        title="TED, TEDx and"
        accent="this stage."
        intro={`${site.name} is an independently organized TEDx event in ${site.venue.city}.`}
      />
      <About />
      <Faq />
    </main>
  );
}
