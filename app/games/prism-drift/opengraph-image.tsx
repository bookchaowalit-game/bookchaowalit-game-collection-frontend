import { gameOgAlt, gameOgContentType, gameOgSize, renderGameOgImage } from "@/lib/game-og";

export const alt = gameOgAlt("prism-drift");
export const size = gameOgSize;
export const contentType = gameOgContentType;

export default function OpenGraphImage() {
  return renderGameOgImage("prism-drift");
}
