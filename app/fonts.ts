import { Montserrat, Mukta, Playfair_Display, Tiro_Devanagari_Hindi } from "next/font/google";

export const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const mukta = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["600", "800"],
  variable: "--font-devanagari",
  display: "swap",
});

// Big Devanagari display text. Single weight: never add font-bold/extrabold on top.
export const tiro = Tiro_Devanagari_Hindi({
  subsets: ["devanagari", "latin"],
  weight: "400",
  variable: "--font-deva-display",
  display: "swap",
});
