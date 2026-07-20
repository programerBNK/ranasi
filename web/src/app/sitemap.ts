import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/autofill", priority: 0.95, changeFrequency: "weekly" },
    { path: "/new-tab", priority: 0.95, changeFrequency: "weekly" },
    { path: "/chrome-extension", priority: 0.95, changeFrequency: "weekly" },
    { path: "/pro", priority: 0.9, changeFrequency: "weekly" },
    { path: "/activate", priority: 0.7, changeFrequency: "monthly" },
    { path: "/success", priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.4, changeFrequency: "yearly" },
    { path: "/demo-form.html", priority: 0.5, changeFrequency: "monthly" },
  ];

  return routes.map((r) => ({
    url: `${SITE_URL}${r.path === "/" ? "" : r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
