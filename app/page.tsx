import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { HeroShell } from "@/components/hero/HeroShell";
import { HomeTeasers } from "@/components/home/teasers";
import { ClosingBand } from "@/components/closing-band";

export const metadata = pageMeta({
  description: `${site.theme.devanagari}: ${site.theme.tagline}. ${site.name} is looking for voices with an idea worth spreading. ${site.date.display}, ${site.venue.display}.`,
  path: "/",
});

export default function Home() {
  return (
    <>
      <HeroShell />
      {/* Solid background so the hero's fixed 3D stage stays behind the hero only. */}
      <div id="content" className="relative z-10 bg-black">
        <HomeTeasers />
        <ClosingBand />
      </div>
    </>
  );
}
