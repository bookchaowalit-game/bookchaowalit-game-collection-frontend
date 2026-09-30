import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { buildSitemapEntries } from "@/lib/sitemap-entries";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemapEntries(SITE_URL);
}
