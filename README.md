# Book Arcade

A small arcade of games by [bookchaowalit](https://bookchaowalit.com), built in
public. No games are shipped yet — the homepage says so plainly and tracks the
three real build stages instead of hiding behind a "coming soon" placeholder.
See [`PRODUCT.md`](./PRODUCT.md) for the full product brief (audience, problem,
visual identity, and why the empty state is the honest content right now).

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
app/
├── page.tsx           # homepage: hero, build-status ladder, portfolio cross-link
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

Stage 1 (visual identity & shell) shipped 2026-08-04. Stage 2 (first playable
game) is not started — see the status ladder on the homepage for the current,
honest state.
