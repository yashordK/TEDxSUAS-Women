import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { PageHero } from "@/components/page-hero";
import { Theme } from "@/components/sections/theme";
import { Marquee } from "@/components/sections/marquee";

export const metadata = pageMeta({
  title: "Theme",
  description: `${site.theme.transliteration} (${site.theme.devanagari}): "${site.theme.meaning}" The theme of ${site.name}, word by word.`,
  path: "/theme",
});

export default function ThemePage() {
  const [first, second] = site.theme.transliteration.split(" ");
  return (
    <main id="main">
      <PageHero
        eyebrow="The Theme · 2027"
        title="You are"
        accent="the change."
        intro={`${first} ${second}: three Sanskrit words, one idea. Change does not wait for someone else.`}
        image="/reference/4.jpg"
        imagePosition="50% 76%"
      />
      <Theme />
      <Marquee />
    </main>
  );
}
