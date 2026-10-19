import { Montserrat, Playfair_Display, Vesper_Libre } from "next/font/google";

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

// Vesper Libre: a Devanagari-first serif designed for both scripts.
export const mukta = Vesper_Libre({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-mukta",
  display: "swap",
});
