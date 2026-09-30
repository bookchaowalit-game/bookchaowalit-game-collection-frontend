# Upgrade plan

## Current state

**Score: 8/10** (7.5 after pass 2, 7 after pass 1, 6 originally). Twelve
small games with pure, unit-tested rule modules; lint, typecheck, 99 tests
and the production build pass. Every game has its own social card and all
count/roster copy comes from the catalog. Remaining gaps: accessibility of
canvas games, high scores, UI-level verification.

## Backlog

### P0
- Confirm the production domain. `lib/site.ts` (`SITE_URL`), `public/robots.txt`
  and the old sitemap disagreed (bookchaowalit.com vs. a vercel.app URL);
  everything now uses `SITE_URL = https://bookchaowalit.com`. Change it in
  one place if the arcade is served elsewhere.

### P1
- Accessibility pass on the canvas/keyboard games: visible focus, keyboard
  alternatives for pointer-only controls, `prefers-reduced-motion`.
- Stage 3 roadmap items: select screen and local high scores
  (`localStorage`, wrapped in try/catch).

### P2
- Playwright smoke test that opens each game route and checks for console
  errors.

## Done in this pass (pass 4)
- Edge-case audit of every `lib/` game model (numbers, rounding next to win
  thresholds, NaN/huge inputs, deck draw/reshuffle, pluralized copy). No real
  bug found: all state is integer-valued, frame deltas are clamped to 50 ms in
  the clients, win checks use raw counts (not rounded percentages), there is no
  `Math.random`/biased shuffle, and `countWord`/`honestyCopy` pluralize 0/1/n.
  No code change; checks re-run green.
- Backlog (P2): `tickPulse`/`movePlayer` would stick on NaN if a caller ever
  passed one (not reachable from the current clients); guard if reused.

## Done in this pass (pass 3)
- Roadmap/homepage copy derived from `lib/games.ts`: `honestyCopy(count)`
  and `liveSummary(count)` spell and pluralize the count, the "First
  playable game" stage lists catalog titles; adding a game no longer needs
  copy edits. Tests cover 1/13/25 counts and forbid hard-coded counts in
  `app/page.tsx`.
- Per-game social cards: `app/games/<slug>/opengraph-image.tsx` via the
  shared `lib/game-og.tsx` (title, summary, "GAME 003 / 012"). Verified in
  `next build`: 12 static 1200x630 PNGs, og:image/alt meta per game page.
  Catalog test requires a card for every game.

## Done in pass 2
- Social cards no longer 404: `/og-image.png` reference removed and
  `app/opengraph-image.tsx` generates a 1200x630 PNG at build time (checked
  in `next build` output; og:image and twitter:image meta present on home
  and game pages). Test guards layout image references against `public/`.
- Homepage hero buttons and game cards render from `lib/games.ts` (was 24
  hand-written blocks); test forbids hard-coded `/games/` links in the page.
- Removed an unused test import (lint now warning-free).

## Done in pass 1 (2026-09-30)
- CI now runs `typecheck` and `npm test` (tests existed but never ran in
  CI); fixed the TypeScript errors that `tsc --noEmit` reported in tests.
- Added `lib/games.ts` catalog with tests that tie it to the route folders,
  homepage links, header counters and canonical paths.
- Game headers said "GAME 003 / 003" etc.; they now show the real total
  ("GAME 003 / 012").
- Every page inherited the root canonical URL, telling search engines each
  game was a duplicate of the homepage; pages now declare their own.
- Replaced the static sitemap (home + more-projects only) with
  `app/sitemap.ts` generated from the catalog.
- MCP endpoint returned placeholder "Sample data"; it now exposes a real
  read-only `list_games` tool with correct JSON-RPC error codes and
  notification handling (unit-tested in `tests/mcp.test.ts`).
- Removed the stale `app/page.tsx.backup`.
