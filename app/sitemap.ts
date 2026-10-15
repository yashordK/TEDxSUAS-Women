import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const ROUTES = ["", "/theme", "/about", "/speakers", "/speak", "/team", "/venue"];

export default function sitemap(): MetadataRoute.Sitemap {
  // /sponsors 404s while the sponsor list is empty, so only list it once it exists.
  const routes = site.sponsors.length ? [...ROUTES, "/sponsors"] : ROUTES;
  return routes.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
