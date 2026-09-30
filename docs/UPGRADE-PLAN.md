# Upgrade plan

## Current state

**Score: 7/10** (was 6/10). Twelve small games with pure, unit-tested rule
modules; lint, typecheck, 94 tests and the production build pass locally
and in CI. Gaps are mostly SEO/metadata polish and UI-level verification.

## Backlog

### P0
- Confirm the production domain. `lib/site.ts` (`SITE_URL`), `public/robots.txt`
  and the old sitemap disagreed (bookchaowalit.com vs. a vercel.app URL);
  everything now uses `SITE_URL = https://bookchaowalit.com`. Change it in
  one place if the arcade is served elsewhere.
- `app/layout.tsx` references `/og-image.png`, which does not exist in
  `public/`; social cards 404. Add a 1200x630 image or drop the reference.

### P1
- Render the homepage game cards from `lib/games.ts` instead of 12
  hand-written blocks (the test currently only checks the links exist).
- Accessibility pass on the canvas/keyboard games: visible focus, keyboard
  alternatives for pointer-only controls, `prefers-reduced-motion`.
- Stage 3 roadmap items: select screen and local high scores
  (`localStorage`, wrapped in try/catch).

### P2
- Playwright smoke test that opens each game route and checks for console
  errors.

## Done in this pass (2026-09-30)
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
