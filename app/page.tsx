import Link from "next/link";
import { STAGES, STATUS_LABEL } from "@/lib/roadmap";

const STATUS_STYLE: Record<string, string> = {
  done: "bg-good/15 text-good border-good/30",
  progress: "bg-warn/15 text-warn border-warn/30",
  planned: "bg-ink-faint/10 text-ink-faint border-ink-faint/20",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* ---------- nav ---------- */}
      <header className="border-b border-border">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <span className="font-pixel text-[10px] tracking-widest text-accent">
            BOOK ARCADE
          </span>
          <div className="flex items-center gap-5 text-sm text-ink-dim">
            <Link
              href="/more-projects"
              className="rounded-sm transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              More projects
            </Link>
            <a
              href="https://github.com/bookchaowalit-game/bookchaowalit-game-collection-frontend"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              Source
            </a>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-6">
        {/* ---------- hero ---------- */}
        <section className="py-16 sm:py-24">
          <p className="font-pixel text-[9px] tracking-[0.2em] text-accent">
            BUILD IN PUBLIC
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            A small arcade of games, built one playable idea at a time.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-dim">
            Twelve games are live. Each next game adds one new mechanic, genre, or
            experiment to the collection.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/games/neon-harvest"
              className="font-pixel inline-flex items-center gap-2 rounded-md bg-accent px-5 py-4 text-[10px] tracking-wider text-accent-ink shadow-sm transition-transform motion-safe:active:translate-y-0.5 motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              ▶ PLAY NEON HARVEST
            </Link>
            <Link
              href="/games/signal-shift"
              className="font-pixel inline-flex items-center gap-2 rounded-md border border-accent/40 bg-paper-raised px-5 py-4 text-[10px] tracking-wider text-accent shadow-sm transition-transform motion-safe:active:translate-y-0.5 motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              ▶ PLAY SIGNAL SHIFT
            </Link>
            <Link
              href="/games/gridline"
              className="font-pixel inline-flex items-center gap-2 rounded-md border border-accent/40 bg-paper-raised px-5 py-4 text-[10px] tracking-wider text-accent shadow-sm transition-transform motion-safe:active:translate-y-0.5 motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              ▶ PLAY GRIDLINE
            </Link>
            <Link
              href="/games/midnight-market"
              className="font-pixel inline-flex items-center gap-2 rounded-md border border-accent/40 bg-paper-raised px-5 py-4 text-[10px] tracking-wider text-accent shadow-sm transition-transform motion-safe:active:translate-y-0.5 motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              ▶ PLAY MIDNIGHT MARKET
            </Link>
            <Link
              href="/games/pulse-parade"
              className="font-pixel inline-flex items-center gap-2 rounded-md border border-accent/40 bg-paper-raised px-5 py-4 text-[10px] tracking-wider text-accent shadow-sm transition-transform motion-safe:active:translate-y-0.5 motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              ▶ PLAY PULSE PARADE
            </Link>
            <Link
              href="/games/card-cascade"
              className="font-pixel inline-flex items-center gap-2 rounded-md border border-accent/40 bg-paper-raised px-5 py-4 text-[10px] tracking-wider text-accent shadow-sm transition-transform motion-safe:active:translate-y-0.5 motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              ▶ PLAY CARD CASCADE
            </Link>
            <Link
              href="/games/last-light"
              className="font-pixel inline-flex items-center gap-2 rounded-md border border-accent/40 bg-paper-raised px-5 py-4 text-[10px] tracking-wider text-accent shadow-sm transition-transform motion-safe:active:translate-y-0.5 motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              ▶ PLAY LAST LIGHT
            </Link>
            <Link
              href="/games/goal-line"
              className="font-pixel inline-flex items-center gap-2 rounded-md border border-accent/40 bg-paper-raised px-5 py-4 text-[10px] tracking-wider text-accent shadow-sm transition-transform motion-safe:active:translate-y-0.5 motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              ▶ PLAY GOAL LINE
            </Link>
            <Link
              href="/games/echo-chamber"
              className="font-pixel inline-flex items-center gap-2 rounded-md border border-accent/40 bg-paper-raised px-5 py-4 text-[10px] tracking-wider text-accent shadow-sm transition-transform motion-safe:active:translate-y-0.5 motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              ▶ PLAY ECHO CHAMBER
            </Link>
            <Link
              href="/games/pocket-foundry"
              className="font-pixel inline-flex items-center gap-2 rounded-md border border-accent/40 bg-paper-raised px-5 py-4 text-[10px] tracking-wider text-accent shadow-sm transition-transform motion-safe:active:translate-y-0.5 motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              ▶ PLAY POCKET FOUNDRY
            </Link>
            <Link
              href="/games/lantern-route"
              className="font-pixel inline-flex items-center gap-2 rounded-md border border-accent/40 bg-paper-raised px-5 py-4 text-[10px] tracking-wider text-accent shadow-sm transition-transform motion-safe:active:translate-y-0.5 motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              ▶ PLAY LANTERN ROUTE
            </Link>
            <Link
              href="/games/prism-drift"
              className="font-pixel inline-flex items-center gap-2 rounded-md border border-accent/40 bg-paper-raised px-5 py-4 text-[10px] tracking-wider text-accent shadow-sm transition-transform motion-safe:active:translate-y-0.5 motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              ▶ PLAY PRISM DRIFT
            </Link>
            <a
              href="https://github.com/bookchaowalit-game/bookchaowalit-game-collection-frontend"
              target="_blank"
              rel="noopener noreferrer"
              className="font-pixel inline-flex items-center gap-2 rounded-md bg-accent px-5 py-4 text-[10px] tracking-wider text-accent-ink shadow-sm transition-transform motion-safe:active:translate-y-0.5 motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              ▶ FOLLOW THE BUILD
            </a>
            <Link
              href="/more-projects"
              className="rounded-sm text-sm font-medium text-ink-dim underline decoration-border underline-offset-4 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              See the rest of the portfolio →
            </Link>
          </div>
        </section>

        {/* ---------- status: the honest empty state ---------- */}
        <section className="border-t border-border py-14">
          <h2 className="text-sm font-semibold tracking-wide text-ink-faint uppercase">
            What&apos;s actually live right now
          </h2>
          <p className="mt-2 max-w-xl text-ink-dim">
            Twelve games are shipped and playable. The arcade is now moving from
            game-by-game releases toward a dedicated select screen.
          </p>

          <ol className="mt-8 space-y-3">
            {STAGES.map((stage, i) => (
              <li
                key={stage.label}
                className="flex items-start gap-4 rounded-lg border border-border bg-paper-raised p-4 transition-transform motion-safe:hover:-translate-y-0.5"
              >
                <span className="font-mono text-sm text-ink-faint tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-ink">{stage.label}</h3>
                    <span
                      className={`rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-wide ${STATUS_STYLE[stage.status]}`}
                    >
                      {STATUS_LABEL[stage.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink-dim">{stage.detail}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-lg border border-accent/30 bg-accent-soft p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-pixel text-[9px] tracking-widest text-accent">NOW PLAYING</p>
                <h3 className="mt-3 text-xl font-semibold text-ink">Neon Harvest</h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-ink-dim">
                  An arcade action round about movement, collection, and finding
                  a safe route under pressure.
                </p>
              </div>
              <Link
                href="/games/neon-harvest"
                className="shrink-0 rounded-md border border-accent/40 px-4 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              >
                Open game →
              </Link>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-paper-raised p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-pixel text-[9px] tracking-widest text-accent">GAME 002</p>
                <h3 className="mt-3 text-xl font-semibold text-ink">Signal Shift</h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-ink-dim">
                  A logic puzzle about rotating circuit tiles until the whole
                  network comes online.
                </p>
              </div>
              <Link
                href="/games/signal-shift"
                className="shrink-0 rounded-md border border-accent/40 px-4 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              >
                Open game →
              </Link>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-paper-raised p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-pixel text-[9px] tracking-widest text-accent">GAME 003</p>
                <h3 className="mt-3 text-xl font-semibold text-ink">Gridline</h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-ink-dim">
                  A turn-based tactical route-planning game with pursuit AI and
                  three beacons to capture.
                </p>
              </div>
              <Link
                href="/games/gridline"
                className="shrink-0 rounded-md border border-accent/40 px-4 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              >
                Open game →
              </Link>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-paper-raised p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-pixel text-[9px] tracking-widest text-accent">GAME 004</p>
                <h3 className="mt-3 text-xl font-semibold text-ink">Midnight Market</h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-ink-dim">
                  A five-day business simulation about stock, pricing, demand,
                  cash flow, and reputation.
                </p>
              </div>
              <Link
                href="/games/midnight-market"
                className="shrink-0 rounded-md border border-accent/40 px-4 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              >
                Open game →
              </Link>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-paper-raised p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-pixel text-[9px] tracking-widest text-accent">GAME 005</p>
                <h3 className="mt-3 text-xl font-semibold text-ink">Pulse Parade</h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-ink-dim">
                  A rhythm timing game about landing notes, building combos, and
                  keeping a moving parade alive.
                </p>
              </div>
              <Link
                href="/games/pulse-parade"
                className="shrink-0 rounded-md border border-accent/40 px-4 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              >
                Open game →
              </Link>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-paper-raised p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-pixel text-[9px] tracking-widest text-accent">GAME 006</p>
                <h3 className="mt-3 text-xl font-semibold text-ink">Card Cascade</h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-ink-dim">
                  A roguelite deck-builder about spending energy, reading enemy
                  intent, and choosing the right card reward.
                </p>
              </div>
              <Link
                href="/games/card-cascade"
                className="shrink-0 rounded-md border border-accent/40 px-4 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              >
                Open game →
              </Link>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-paper-raised p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-pixel text-[9px] tracking-widest text-accent">GAME 007</p>
                <h3 className="mt-3 text-xl font-semibold text-ink">Last Light</h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-ink-dim">
                  A survival crafting game about scrap, batteries, shelter, and
                  six nights of resource pressure.
                </p>
              </div>
              <Link
                href="/games/last-light"
                className="shrink-0 rounded-md border border-accent/40 px-4 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              >
                Open game →
              </Link>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-paper-raised p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-pixel text-[9px] tracking-widest text-accent">GAME 008</p>
                <h3 className="mt-3 text-xl font-semibold text-ink">Goal Line</h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-ink-dim">
                  A sports arcade penalty shootout about reading the keeper,
                  choosing the shot, and scoring under pressure.
                </p>
              </div>
              <Link
                href="/games/goal-line"
                className="shrink-0 rounded-md border border-accent/40 px-4 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              >
                Open game →
              </Link>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-paper-raised p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-pixel text-[9px] tracking-widest text-accent">GAME 009</p>
                <h3 className="mt-3 text-xl font-semibold text-ink">Echo Chamber</h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-ink-dim">
                  A horror deduction game about exploring six rooms, collecting
                  impossible evidence, and naming the true source.
                </p>
              </div>
              <Link
                href="/games/echo-chamber"
                className="shrink-0 rounded-md border border-accent/40 px-4 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              >
                Open game →
              </Link>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-paper-raised p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-pixel text-[9px] tracking-widest text-accent">GAME 010</p>
                <h3 className="mt-3 text-xl font-semibold text-ink">Pocket Foundry</h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-ink-dim">
                  An automation puzzle about placing conveyors, connecting
                  processing machines, and shipping a working production chain.
                </p>
              </div>
              <Link
                href="/games/pocket-foundry"
                className="shrink-0 rounded-md border border-accent/40 px-4 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              >
                Open game →
              </Link>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-paper-raised p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-pixel text-[9px] tracking-widest text-accent">GAME 011</p>
                <h3 className="mt-3 text-xl font-semibold text-ink">Lantern Route</h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-ink-dim">
                  An interactive narrative about carrying a lantern through five
                  chapters and choosing what reaches the lighthouse.
                </p>
              </div>
              <Link
                href="/games/lantern-route"
                className="shrink-0 rounded-md border border-accent/40 px-4 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              >
                Open game →
              </Link>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-paper-raised p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-pixel text-[9px] tracking-widest text-accent">GAME 012</p>
                <h3 className="mt-3 text-xl font-semibold text-ink">Prism Drift</h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-ink-dim">
                  A gravity-shifting platformer about collecting three prisms,
                  avoiding the seam, and finding the exit.
                </p>
              </div>
              <Link
                href="/games/prism-drift"
                className="shrink-0 rounded-md border border-accent/40 px-4 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              >
                Open game →
              </Link>
            </div>
          </div>
        </section>

        {/* ---------- cross-portfolio link ---------- */}
        <section className="border-t border-border py-14">
          <h2 className="text-sm font-semibold tracking-wide text-ink-faint uppercase">
            Not looking for games?
          </h2>
          <p className="mt-2 max-w-xl text-ink-dim">
            This is one of several small products in the same portfolio —
            productivity tools, dev tools, and a few full products among them.
          </p>
          <Link
            href="/more-projects"
            className="mt-4 inline-flex items-center gap-1 rounded-sm text-sm font-medium text-accent transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            Browse the full project directory →
          </Link>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <p className="mx-auto max-w-4xl px-6 text-xs text-ink-faint">
          Book Arcade is part of the bookchaowalit portfolio.{" "}
          <a
            href="https://bookchaowalit.com"
            className="text-ink-dim underline decoration-border underline-offset-4 hover:text-ink"
          >
            bookchaowalit.com
          </a>
        </p>
      </footer>
    </div>
  );
}
