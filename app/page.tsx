import Link from "next/link";

const STAGES = [
  {
    label: "Visual identity & shell",
    detail: "Design tokens, homepage, and honest status — this page.",
    status: "done" as const,
  },
  {
    label: "First playable game",
    detail: "One small game, shipped end-to-end, before adding a second.",
    status: "planned" as const,
  },
  {
    label: "Full arcade",
    detail: "Three or more games, a real select screen, high scores.",
    status: "planned" as const,
  },
];

const STATUS_STYLE: Record<string, string> = {
  done: "bg-good/15 text-good border-good/30",
  progress: "bg-warn/15 text-warn border-warn/30",
  planned: "bg-ink-faint/10 text-ink-faint border-ink-faint/20",
};

const STATUS_LABEL: Record<string, string> = {
  done: "SHIPPED",
  progress: "IN PROGRESS",
  planned: "PLANNED",
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
            A small arcade of games, built where you can watch.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-dim">
            No games are shipped yet — this page tracks exactly what&apos;s real
            and what&apos;s still ahead, instead of pretending otherwise.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
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
            Zero games shipped. That&apos;s not a placeholder — it&apos;s the
            real state, tracked here instead of hidden behind a generic
            &ldquo;coming soon&rdquo; splash.
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
