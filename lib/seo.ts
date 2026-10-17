import type { Metadata } from "next";
import { site } from "./site";

const OG_IMAGE = { url: "/images/og.jpg", width: 1200, height: 630, alt: site.name };

/**
 * Per-page metadata. Next merges `openGraph` shallowly, so every page sets the
 * full object (including the image) instead of relying on the root layout's.
 */
export function pageMeta({
  title,
  description,
  path,
}: {
  title?: string;
  description: string;
  path: string;
}): Metadata {
  const full = title ? `${title} | ${site.name}` : `${site.name} | Call for Speakers`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: full,
      description,
      url: path,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: full, description, images: [OG_IMAGE.url] },
  };
}
