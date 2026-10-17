import type { Metadata, Viewport } from "next";
import "./globals.css";
import { montserrat, mukta, playfair, tiro } from "./fonts";
import { site } from "@/lib/site";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Call for Speakers`,
    template: `%s | ${site.name}`,
  },
  description:
    "त्वमेव परिवर्तनम् — It begins with you. TEDxSUAS Women is looking for voices with an idea worth spreading. Speaker applications are open.",
  openGraph: {
    siteName: site.name,
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: site.name }],
  },
  twitter: { card: "summary_large_image", images: ["/images/og.jpg"] },
};

export const viewport: Viewport = {
  themeColor: "#050304",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable} ${mukta.variable} ${tiro.variable}`}>
      <body className="antialiased">
        <Providers>
          {/* Header renders on inner pages only; the landing hero has its own nav. */}
          <Header />
          <div className="relative z-10">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
