import type { Metadata, Viewport } from "next";
import "./globals.css";
import { montserrat, mukta, playfair } from "./fonts";
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
};

export const viewport: Viewport = {
  themeColor: "#050304",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${montserrat.variable} ${mukta.variable} antialiased`}>
        <Providers>
          {/* Header renders on inner pages only; the landing hero has its own nav. */}
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
