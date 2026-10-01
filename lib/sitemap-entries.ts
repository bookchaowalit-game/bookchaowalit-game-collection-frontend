import { GAMES, gamePath } from "./games.ts";

export type SitemapEntry = {
  url: string;
  changeFrequency: "daily" | "weekly" | "monthly";
  priority: number;
};

/** Pure helper so the sitemap can be unit-tested without Next.js. */
export function buildSitemapEntries(siteUrl: string): SitemapEntry[] {
  const base = siteUrl.replace(/\/+$/, "");
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/more-projects`, changeFrequency: "weekly", priority: 0.8 },
    ...GAMES.map((game) => ({
      url: `${base}${gamePath(game.slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
