# Book Arcade

A small arcade of games by [bookchaowalit](https://bookchaowalit.com), built in
public. The first twelve playable games, **Neon Harvest**, **Signal Shift**,
**Gridline**, **Midnight Market**, **Pulse Parade**, **Card Cascade**, **Last
Light**, **Goal Line**, **Echo Chamber**, **Pocket Foundry**, **Lantern Route**, and
**Prism Drift**, are now shipped. The homepage tracks the remaining arcade layer as planned work instead of
hiding behind a vague "coming soon" promise. See [`PRODUCT.md`](./PRODUCT.md)
for the product brief.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
app/
├── page.tsx           # homepage: hero, build-status ladder, game links
├── games/neon-harvest/    # first playable arcade game
├── games/signal-shift/    # second playable puzzle game
├── games/gridline/        # third playable tactical game
├── games/midnight-market/ # fourth playable simulation game
├── games/pulse-parade/    # fifth playable rhythm game
├── games/card-cascade/    # sixth playable roguelite game
├── games/last-light/      # seventh playable survival game
├── games/goal-line/       # eighth playable sports game
├── games/echo-chamber/    # ninth playable horror deduction game
├── games/pocket-foundry/  # tenth playable automation game
├── games/lantern-route/   # eleventh playable interactive narrative game
├── games/prism-drift/     # twelfth playable gravity platformer game
├── not-found.tsx       # styled 404
├── more-projects/      # directory of sibling bookchaowalit-* products
├── api/mcp/             # read-only MCP endpoint: `list_games` tool
├── sitemap.ts           # generated from lib/games.ts
└── globals.css          # Book Design System tokens (Game domain accent)
lib/
├── games.ts             # game catalog (source of truth for sitemap, headers, MCP)
├── <game>.ts            # pure rules for each game, unit-tested in tests/
└── mcp.ts, site.ts, roadmap.ts
```

## Checks

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

CI (`.github/workflows/ci.yml`) runs the same four commands. Tests use the
Node test runner with type stripping (Node 22+). Adding a game means adding
it to `lib/games.ts`; `tests/games.test.ts` fails until the route folder,
homepage link, header counter and canonical path all exist.

Design tokens follow the shared Book Design System doc (solo-empire workspace: docs/systems/book-design-system.md — not part of this repo) —
ink/paper neutrals plus one domain accent (`Game`, magenta-purple). The
`Press Start 2P` pixel face is used only for the wordmark, eyebrows, and the
primary CTA; body text stays on Geist Sans for legibility.

## Status

Stage 1 (visual identity & shell) shipped 2026-08-04. Stage 2 (playable game
layer) shipped with Neon Harvest, Signal Shift, Gridline, Midnight Market,
Pulse Parade, Card Cascade, Last Light, Goal Line, Echo Chamber, Pocket Foundry,
Lantern Route, and Prism Drift. Stage 3 (full arcade) is in progress
— the select screen and high scores remain next.
