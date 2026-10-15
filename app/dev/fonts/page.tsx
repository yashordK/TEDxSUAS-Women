import type { Metadata } from "next";
import {
  Baloo_2, Eczar, Hind, Kalam, Khand, Mukta, Noto_Sans_Devanagari, Poppins,
  Rozha_One, Teko, Tiro_Devanagari_Hindi, Yatra_One,
} from "next/font/google";
import { FontPicker, type FontOption } from "./font-picker";

/** Hidden font test bench. Not linked anywhere; fonts load only on this route. */
export const metadata: Metadata = {
  title: "Font test",
  robots: { index: false, follow: false },
};

const mukta = Mukta({ subsets: ["devanagari", "latin"], weight: "800" });
const hind = Hind({ subsets: ["devanagari", "latin"], weight: "700" });
const noto = Noto_Sans_Devanagari({ subsets: ["devanagari", "latin"], weight: "900" });
const poppins = Poppins({ subsets: ["devanagari", "latin"], weight: "700" });
const baloo = Baloo_2({ subsets: ["devanagari", "latin"], weight: "800" });
const teko = Teko({ subsets: ["devanagari", "latin"], weight: "700" });
const khand = Khand({ subsets: ["devanagari", "latin"], weight: "700" });
const tiro = Tiro_Devanagari_Hindi({ subsets: ["devanagari", "latin"], weight: "400" });
const eczar = Eczar({ subsets: ["devanagari", "latin"], weight: "800" });
const rozha = Rozha_One({ subsets: ["devanagari", "latin"], weight: "400" });
const yatra = Yatra_One({ subsets: ["devanagari", "latin"], weight: "400" });
const kalam = Kalam({ subsets: ["devanagari", "latin"], weight: "700" });

const FONTS: FontOption[] = [
  { name: "Mukta", weight: 800, className: mukta.className },
  { name: "Hind", weight: 700, className: hind.className },
  { name: "Noto Sans Devanagari", weight: 900, className: noto.className },
  { name: "Poppins", weight: 700, className: poppins.className },
  { name: "Baloo 2", weight: 800, className: baloo.className },
  { name: "Teko", weight: 700, className: teko.className },
  { name: "Khand", weight: 700, className: khand.className },
  { name: "Tiro Devanagari Hindi", weight: 400, className: tiro.className },
  { name: "Eczar", weight: 800, className: eczar.className },
  { name: "Rozha One", weight: 400, className: rozha.className },
  { name: "Yatra One", weight: 400, className: yatra.className },
  { name: "Kalam", weight: 700, className: kalam.className },
];

export default function FontsPage() {
  return <FontPicker fonts={FONTS} />;
}
