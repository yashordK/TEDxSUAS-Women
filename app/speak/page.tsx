import type { Metadata } from "next";
import { site } from "@/lib/site";
import { SpeakerForm } from "@/components/speak/speaker-form";
import { Hairline } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Apply to Speak",
  description: `Call for speakers: ${site.name}, ${site.date.display}. ${site.theme.tagline}.`,
};

export default function SpeakPage() {
  return (
    <main id="main" className="relative isolate overflow-hidden pb-28 pt-32 md:pt-44">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[60vh] w-[120vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(235_0_40/0.22),transparent)]"
      />
      <div className="gutter">
        <header className="mx-auto max-w-3xl">
          <p className="eyebrow text-red-text">Call for Speakers · {site.date.display}</p>
          <h1 className="display mt-6 text-[clamp(2.75rem,8vw,6rem)]">
            The stage is <span className="text-gradient">waiting.</span>
          </h1>
          <Hairline className="mt-8 w-24" />
          <p className="mt-8 max-w-2xl text-lg text-grey">
            Have an idea that could change how someone sees the world, or themselves? Tell us about it. You don&apos;t
            need to be a seasoned speaker, just someone with something worth saying. It takes about 15 minutes.
          </p>
        </header>

        <div className="mt-16 md:mt-20">
          <SpeakerForm />
        </div>
      </div>
    </main>
  );
}
