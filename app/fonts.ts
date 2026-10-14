import { Montserrat, Mukta, Playfair_Display } from "next/font/google";

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
  weight: ["400", "600", "800"],
  variable: "--font-mukta",
  display: "swap",
});
