/**
 * Single source of truth for the shipped games, used by the sitemap, the
 * game page headers and the MCP endpoint. tests/games.test.ts checks that
 * every entry has a route under app/games/<slug>/ (and vice versa) and a
 * homepage link.
 */
export type Game = {
  /** 1-based position in the arcade, shown as "GAME 001". */
  number: number;
  slug: string;
  title: string;
  summary: string;
};

export const GAMES: readonly Game[] = [
  {
    number: 1,
    slug: "neon-harvest",
    title: "Neon Harvest",
    summary:
      "An arcade action round about movement, collection, and finding a safe route under pressure.",
  },
  {
    number: 2,
    slug: "signal-shift",
    title: "Signal Shift",
    summary:
      "A logic puzzle about rotating circuit tiles until the whole network comes online.",
  },
  {
    number: 3,
    slug: "gridline",
    title: "Gridline",
    summary:
      "A turn-based tactical route-planning game with pursuit AI and three beacons to capture.",
  },
  {
    number: 4,
    slug: "midnight-market",
    title: "Midnight Market",
    summary:
      "A five-day business simulation about stock, pricing, demand, cash flow, and reputation.",
  },
  {
    number: 5,
    slug: "pulse-parade",
    title: "Pulse Parade",
    summary:
      "A rhythm timing game about landing notes, building combos, and keeping a moving parade alive.",
  },
  {
    number: 6,
    slug: "card-cascade",
    title: "Card Cascade",
    summary:
      "A roguelite deck-builder about spending energy, reading enemy intent, and choosing the right card reward.",
  },
  {
    number: 7,
    slug: "last-light",
    title: "Last Light",
    summary:
      "A survival crafting game about scrap, batteries, shelter, and six nights of resource pressure.",
  },
  {
    number: 8,
    slug: "goal-line",
    title: "Goal Line",
    summary:
      "A sports arcade penalty shootout about reading the keeper, choosing the shot, and scoring under pressure.",
  },
  {
    number: 9,
    slug: "echo-chamber",
    title: "Echo Chamber",
    summary:
      "A horror deduction game about exploring six rooms, collecting impossible evidence, and naming the true source.",
  },
  {
    number: 10,
    slug: "pocket-foundry",
    title: "Pocket Foundry",
    summary:
      "An automation puzzle about placing conveyors, connecting processing machines, and shipping a working production chain.",
  },
  {
    number: 11,
    slug: "lantern-route",
    title: "Lantern Route",
    summary:
      "An interactive narrative about carrying a lantern through five chapters and choosing what reaches the lighthouse.",
  },
  {
    number: 12,
    slug: "prism-drift",
    title: "Prism Drift",
    summary:
      "A gravity-shifting platformer about collecting three prisms, avoiding the seam, and finding the exit.",
  },
];

export const GAME_COUNT = GAMES.length;

export function gamePath(slug: string): string {
  return `/games/${slug}`;
}

/** Zero-padded label used in page headers, e.g. "GAME 003 / 012". */
export function gameCounterLabel(number: number, total: number = GAME_COUNT): string {
  const pad = (n: number) => String(n).padStart(3, "0");
  return `GAME ${pad(number)} / ${pad(total)}`;
}

export function findGame(slug: string): Game | undefined {
  return GAMES.find((game) => game.slug === slug);
}
