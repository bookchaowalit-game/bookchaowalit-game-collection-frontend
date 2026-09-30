import { ImageResponse } from "next/og";
import { GAMES } from "@/lib/games";

// Generated at build time so social cards never point at a missing file.
// Child routes inherit this image unless they add their own.
export const alt = "Book Arcade — games, built in public";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 8, color: "#d59cf0" }}>
          BOOK ARCADE
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}>
            Games, built in public.
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 32, color: "#b7bcbe" }}>
            {`${GAMES.length} playable games · one new mechanic at a time`}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {GAMES.slice(0, 6).map((game) => (
            <div
              key={game.slug}
              style={{
                display: "flex",
                padding: "10px 18px",
                borderRadius: 8,
                border: "2px solid #9a3dbe",
                fontSize: 22,
              }}
            >
              {game.title}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
