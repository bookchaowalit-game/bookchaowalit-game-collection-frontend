export type NoteLane = 0 | 1 | 2 | 3;
export type PulsePhase = "ready" | "playing" | "won" | "lost";
export type Judgement = "pending" | "perfect" | "good" | "miss";

export type PulseNote = {
  id: number;
  lane: NoteLane;
  atMs: number;
};

export type PulseState = {
  phase: PulsePhase;
  elapsedMs: number;
  score: number;
  combo: number;
  maxCombo: number;
  hits: number;
  perfects: number;
  goods: number;
  misses: number;
  judgements: readonly Judgement[];
  lastJudgement: Exclude<Judgement, "pending"> | null;
};

export const LANE_KEYS = ["A", "S", "D", "F"] as const;
export const PERFECT_WINDOW_MS = 90;
export const GOOD_WINDOW_MS = 230;
export const NOTE_TRAVEL_MS = 1_600;
export const TARGET_HITS = 8;

export const NOTE_PATTERN: readonly PulseNote[] = [
  { id: 0, lane: 0, atMs: 1_000 },
  { id: 1, lane: 1, atMs: 1_700 },
  { id: 2, lane: 2, atMs: 2_400 },
  { id: 3, lane: 3, atMs: 3_100 },
  { id: 4, lane: 1, atMs: 4_000 },
  { id: 5, lane: 3, atMs: 4_700 },
  { id: 6, lane: 0, atMs: 5_400 },
  { id: 7, lane: 2, atMs: 6_100 },
  { id: 8, lane: 3, atMs: 7_000 },
  { id: 9, lane: 2, atMs: 7_700 },
  { id: 10, lane: 1, atMs: 8_400 },
  { id: 11, lane: 0, atMs: 9_100 },
];

export const ROUND_END_MS = 9_800;

export const INITIAL_STATE: PulseState = {
  phase: "ready",
  elapsedMs: 0,
  score: 0,
  combo: 0,
  maxCombo: 0,
  hits: 0,
  perfects: 0,
  goods: 0,
  misses: 0,
  judgements: NOTE_PATTERN.map(() => "pending"),
  lastJudgement: null,
};

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

function resetJudgements(): readonly Judgement[] {
  return NOTE_PATTERN.map(() => "pending");
}

export function startPulse(): PulseState {
  return {
    ...INITIAL_STATE,
    phase: "playing",
    judgements: resetJudgements(),
  };
}

function markMisses(state: PulseState): PulseState {
  const judgements = [...state.judgements];
  let misses = state.misses;
  let combo = state.combo;
  let lastJudgement = state.lastJudgement;

  NOTE_PATTERN.forEach((note, index) => {
    if (judgements[index] === "pending" && state.elapsedMs - note.atMs > GOOD_WINDOW_MS) {
      judgements[index] = "miss";
      misses += 1;
      combo = 0;
      lastJudgement = "miss";
    }
  });

  return {
    ...state,
    judgements,
    misses,
    combo,
    lastJudgement,
  };
}

export function tickPulse(state: PulseState, elapsedMs: number): PulseState {
  if (state.phase !== "playing") {
    return state;
  }

  const nextElapsed = clamp(Math.max(state.elapsedMs, elapsedMs), 0, ROUND_END_MS);
  const advanced = markMisses({ ...state, elapsedMs: nextElapsed });

  if (nextElapsed < ROUND_END_MS) {
    return advanced;
  }

  return {
    ...advanced,
    phase: advanced.hits >= TARGET_HITS ? "won" : "lost",
  };
}

export function hitPulse(state: PulseState, lane: NoteLane): PulseState {
  if (state.phase !== "playing") {
    return state;
  }

  const advanced = markMisses(state);
  const nextIndex = advanced.judgements.findIndex((judgement) => judgement === "pending");

  if (nextIndex < 0) {
    return advanced;
  }

  const note = NOTE_PATTERN[nextIndex];

  if (!note || note.lane !== lane) {
    return advanced;
  }

  const offset = Math.abs(note.atMs - advanced.elapsedMs);

  if (offset > GOOD_WINDOW_MS) {
    return advanced;
  }

  const judgement: Exclude<Judgement, "pending"> =
    offset <= PERFECT_WINDOW_MS ? "perfect" : "good";
  const combo = advanced.combo + 1;
  const scoreGain = judgement === "perfect" ? 100 + combo * 10 : 60 + combo * 5;
  const judgements = [...advanced.judgements];
  judgements[nextIndex] = judgement;

  return {
    ...advanced,
    score: advanced.score + scoreGain,
    combo,
    maxCombo: Math.max(advanced.maxCombo, combo),
    hits: advanced.hits + 1,
    perfects: advanced.perfects + (judgement === "perfect" ? 1 : 0),
    goods: advanced.goods + (judgement === "good" ? 1 : 0),
    judgements,
    lastJudgement: judgement,
  };
}

export function getNoteProgress(note: PulseNote, elapsedMs: number): number {
  return clamp((elapsedMs - note.atMs + NOTE_TRAVEL_MS) / NOTE_TRAVEL_MS, 0, 1);
}

export function getAccuracy(state: PulseState): number {
  const attempts = state.hits + state.misses;

  return attempts === 0 ? 0 : Math.round((state.hits / attempts) * 100);
}
