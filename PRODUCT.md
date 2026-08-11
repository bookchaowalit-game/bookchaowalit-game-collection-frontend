# Book Arcade — Product Brief

*Phase 3 identity doc for `bookchaowalit-game-collection-frontend`, written as part of the Book UI Portfolio redesign program (solo-empire workspace: docs/systems/book-design-system.md — not part of this repo).*

## Who is this for

Someone who lands here from bookchaowalit's portfolio or GitHub — curious what the
game-dev side of the work looks like. Not a general audience looking for a game to
kill time with; a visitor who wants to see craft and is deciding whether to keep
clicking around the rest of the portfolio.

## Problem this solves

The repo currently ships the literal `create-next-app` scaffold: "Welcome", "This
project is part of a 101-project portfolio", a generic tech-stack card, a blue
gradient background. It communicates nothing about games, and nothing about the
person who built it. Worse, it *claims* to be a project without being one yet —
that's a credibility problem, not just a visual one.

## What a visitor should accomplish in 60 seconds

Understand, without reading any code, that this is a personal arcade being built
in public — see what's shipped (currently: nothing) versus what's planned, and
leave with one clear next action: watch the build on GitHub, or move on to
another project in the portfolio. **Success here is honesty, not a fake demo.**

## What makes it different from a generic template

- No fictional "coming soon" filler pretending to be a game. The homepage's
  status section says exactly what's true right now (zero games shipped) and
  why that's worth watching rather than skipping.
- Arcade-cabinet visual language (marquee-style pixel type used sparingly,
  coin-slot/press-button micro-interactions on the primary CTA) instead of a
  generic SaaS card grid.
- The cross-portfolio "More projects" directory (already built, genuinely
  useful) is kept and restyled instead of thrown away — it's real
  infrastructure, not template filler.

## Color & typography

- **Domain accent: Game — `#9A3DBE` light / `#C766E8` dark** (magenta-leaning
  purple, distinct from the AI-domain violet used elsewhere in the portfolio),
  from the shared Book Design System doc (solo-empire workspace: docs/systems/book-design-system.md — not part of this repo).
- **Display/marquee face:** `Press Start 2P` (pixel arcade font) — used only
  for the wordmark, section eyebrows, and the primary CTA label. Never for
  paragraph text; an 8-bit face is illegible at body size.
- **Body face:** Geist Sans (kept from the existing scaffold — it's a
  reasonable, legible default once it's not the *only* typographic choice).
- **Numbers:** mono, tabular — for a future high-score/build-count feel.

## Interaction signature

- Primary CTA has a "press-in" micro-interaction (translate + shadow drop on
  `:active`) instead of a generic hover-lift — it should feel like pressing an
  arcade button, not clicking a SaaS button.
- Cards in the status grid get a faint marquee-glow on hover
  (`motion-safe` only — no animation at all under `prefers-reduced-motion`).

## Real content used on this page

There is no fabricated game content anywhere on this page — verified against
the two sibling repos in this category
(`bookchaowalit-arcade-games-mobile`, `bookchaowalit-game-engine-mobile`),
both of which are also unedited scaffolds with zero commits of real work.
The homepage instead states that status plainly and links to the one thing
that *is* real: the source repository.

## Status

v1 shipped as part of the Book UI Portfolio Phase 6 flagship pass
(2026-08-04). First of the two "blank-slate" Tier A repositories to be
redesigned — see the
[Phase 1 audit](https://claude.ai/code/artifact/840ec7d5-df97-4bf4-9fad-67155c3b1d50)
for how it was picked.
