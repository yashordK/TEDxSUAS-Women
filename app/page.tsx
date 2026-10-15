import { HeroShell } from "@/components/hero/HeroShell";
import { Theme } from "@/components/sections/theme";
import { Marquee } from "@/components/sections/marquee";
import { About } from "@/components/sections/about";
import { Ideas } from "@/components/sections/ideas";
import { Speakers } from "@/components/sections/speakers";
import { Team } from "@/components/sections/team";
import { Venue } from "@/components/sections/venue";
import { Faq } from "@/components/sections/faq";

export default function Home() {
  return (
    <>
      <HeroShell />
      {/* Solid background so the hero's fixed 3D stage stays behind the hero only. */}
      <div id="content" className="relative z-10 bg-black">
        <Theme />
        <Marquee />
        <About />
        <Ideas />
        <Speakers />
        <Team />
        <Venue />
        <Faq />
      </div>
    </>
  );
}
