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
    detail: "One small game, shipped end-to-end, before adding a second.",
    status: "planned",
  },
  {
    label: "Full arcade",
    detail: "Three or more games, a real select screen, high scores.",
    status: "planned",
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
  return "No games are shipped yet";
}
