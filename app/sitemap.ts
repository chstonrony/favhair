import type { MetadataRoute } from "next";
import { SITE_URL, guides } from "./lib/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const latestGuide = guides.map((guide) => guide.updated).sort().at(-1) ?? "2026-11-24";
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date("2026-11-25"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/guide`,
      lastModified: new Date(latestGuide),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...guides.map((guide) => ({
      url: `${SITE_URL}/guide/${guide.slug}`,
      lastModified: new Date(guide.updated),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
