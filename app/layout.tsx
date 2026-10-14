import type { Metadata, Viewport } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TEDxSUAS Women — Call for Speakers",
  description:
    "त्वमेव परिवर्तनम् — It begins with you. TEDxSUAS Women is looking for voices with an idea worth spreading. Speaker applications are open.",
};

export const viewport: Viewport = {
  themeColor: "#050304",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${montserrat.variable} antialiased`}>{children}</body>
    </html>
  );
}
