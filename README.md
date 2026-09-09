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
├── api/mcp/             # MCP server endpoint (shared portfolio infrastructure)
└── globals.css          # Book Design System tokens (Game domain accent)
```

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
