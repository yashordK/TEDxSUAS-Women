import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { site } from "@/lib/site";
import { TedxWordmark } from "@/components/brand/tedx-wordmark";

export const metadata: Metadata = { title: "Sponsors" };

/**
 * TEDx rules: sponsors live only on this page (never the homepage), and their logos
 * stay smaller than the TEDx logo. The wordmark is h-12 (3rem); sponsor logos cap at h-8.
 */
export default function SponsorsPage() {
  if (!site.sponsors.length) notFound();
  return (
    <main className="gutter flex min-h-dvh flex-col items-center pb-24 pt-36 text-center">
      <span className="text-5xl">
        <TedxWordmark />
      </span>
      <p className="eyebrow mt-10 text-red-text">With thanks to our sponsors</p>
      <ul className="mt-12 flex flex-wrap items-center justify-center gap-12">
        {site.sponsors.map((s) => (
          <li key={s.name}>
            <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name}>
              <Image src={s.logo} alt={s.name} width={240} height={80} className="h-8 w-auto max-w-[10rem] object-contain" />
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
