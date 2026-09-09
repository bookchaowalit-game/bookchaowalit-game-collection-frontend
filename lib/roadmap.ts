export type StageStatus = "done" | "progress" | "planned";

export type Stage = {
  label: string;
  detail: string;
  status: StageStatus;
};

/** Honest build-in-public roadmap. Keep tests and UI in sync. */
export const STAGES: Stage[] = [
  {
    label: "Visual identity & shell",
    detail: "Design tokens, homepage, and honest status — this page.",
    status: "done",
  },
  {
    label: "First playable game",
    detail: "Neon Harvest, Signal Shift, Gridline, Midnight Market, Pulse Parade, Card Cascade, Last Light, Goal Line, Echo Chamber, Pocket Foundry, Lantern Route, and Prism Drift — twelve small games shipped end-to-end.",
    status: "done",
  },
  {
    label: "Full arcade",
    detail: "Twelve games are live; a dedicated select screen and high scores are next.",
    status: "progress",
  },
];

export const STATUS_LABEL: Record<StageStatus, string> = {
  done: "SHIPPED",
  progress: "IN PROGRESS",
  planned: "PLANNED",
};

/** True only when at least one playable game stage is marked done. */
export function hasShippedGame(stages: Stage[] = STAGES): boolean {
  return stages.some(
    (stage) =>
      stage.status === "done" &&
      /playable game|full arcade/i.test(stage.label),
  );
}

export function honestyCopy(): string {
  return "Twelve games are live";
}
