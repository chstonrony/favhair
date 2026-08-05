import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://favhair.co.kr/sitemap.xml",
    host: "https://favhair.co.kr",
  };
}
