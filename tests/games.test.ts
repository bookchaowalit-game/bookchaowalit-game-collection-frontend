import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { GAMES, GAME_COUNT, findGame, gameCounterLabel, gamePath } from "../lib/games.ts";
import { honestyCopy } from "../lib/roadmap.ts";
import { buildSitemapEntries } from "../lib/sitemap-entries.ts";

const root = join(import.meta.dirname, "..");

describe("game catalog", () => {
  it("numbers games 1..N with unique slugs", () => {
    assert.deepEqual(
      GAMES.map((g) => g.number),
      Array.from({ length: GAME_COUNT }, (_, i) => i + 1),
    );
    assert.equal(new Set(GAMES.map((g) => g.slug)).size, GAME_COUNT);
  });

  it("matches the route folders under app/games exactly", () => {
    const dirs = readdirSync(join(root, "app/games")).sort();
    assert.deepEqual(dirs, GAMES.map((g) => g.slug).sort());
    for (const game of GAMES) {
      assert.ok(existsSync(join(root, "app/games", game.slug, "page.tsx")), game.slug);
      assert.ok(existsSync(join(root, "app/games", game.slug, "game-client.tsx")), game.slug);
    }
  });

  it("links every game from the homepage", () => {
    const home = readFileSync(join(root, "app/page.tsx"), "utf8");
    for (const game of GAMES) {
      assert.ok(home.includes(`href="${gamePath(game.slug)}"`), `homepage missing ${game.slug}`);
    }
  });

  it("gives every game page its own counter and canonical path", () => {
    for (const game of GAMES) {
      const page = readFileSync(join(root, "app/games", game.slug, "page.tsx"), "utf8");
      assert.ok(page.includes(`gameCounterLabel(${game.number})`), `${game.slug} counter`);
      assert.ok(page.includes(`canonical: gamePath("${game.slug}")`), `${game.slug} canonical`);
    }
  });

  it("formats the header counter against the total", () => {
    assert.equal(gameCounterLabel(3, 12), "GAME 003 / 012");
    assert.equal(gameCounterLabel(1), `GAME 001 / ${String(GAME_COUNT).padStart(3, "0")}`);
  });

  it("keeps the roadmap copy in sync with the catalog size", () => {
    assert.equal(GAME_COUNT, 12);
    assert.match(honestyCopy(), /Twelve/);
  });

  it("finds games by slug", () => {
    assert.equal(findGame("gridline")?.title, "Gridline");
    assert.equal(findGame("missing"), undefined);
  });
});

describe("sitemap", () => {
  it("lists home, more-projects and every game once", () => {
    const entries = buildSitemapEntries("https://example.test/");
    const urls = entries.map((e) => e.url);
    assert.equal(urls[0], "https://example.test");
    assert.ok(urls.includes("https://example.test/more-projects"));
    for (const game of GAMES) {
      assert.ok(urls.includes(`https://example.test/games/${game.slug}`), game.slug);
    }
    assert.equal(new Set(urls).size, urls.length);
  });
});
