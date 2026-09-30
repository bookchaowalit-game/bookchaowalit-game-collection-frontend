import { ImageResponse } from "next/og";
import { findGame, gameCounterLabel } from "@/lib/games";

// Shared renderer for per-game social cards (app/games/<slug>/opengraph-image.tsx).
export const gameOgSize = { width: 1200, height: 630 };
export const gameOgContentType = "image/png";

export function gameOgAlt(slug: string): string {
  const game = findGame(slug);
  return game ? `${game.title} — Book Arcade` : "Book Arcade";
}

export function renderGameOgImage(slug: string): ImageResponse {
  const game = findGame(slug);
  if (!game) throw new Error(`Unknown game slug for OG image: ${slug}`);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#15171b",
          color: "#f4f5f2",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, letterSpacing: 8 }}>
          <div style={{ display: "flex", color: "#d59cf0" }}>BOOK ARCADE</div>
          <div style={{ display: "flex", color: "#b7bcbe", letterSpacing: 4 }}>
            {gameCounterLabel(game.number)}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 700, lineHeight: 1.05 }}>
            {game.title}
          </div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 34, lineHeight: 1.35, color: "#b7bcbe" }}>
            {game.summary}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#d59cf0" }}>
          Play free in the browser · built in public
        </div>
      </div>
    ),
    gameOgSize,
  );
}
