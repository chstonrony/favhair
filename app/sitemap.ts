import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{
    url: "https://favhair.co.kr/",
    lastModified: new Date("2026-08-05"),
    changeFrequency: "monthly",
    priority: 1,
  }];
}
