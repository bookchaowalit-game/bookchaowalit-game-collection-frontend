export type Gravity = "up" | "down";
export type DriftPhase = "playing" | "won" | "lost";
export type DriftPoint = { x: number; y: number };

export const GRID_WIDTH = 9;
export const GRID_HEIGHT = 7;

/** A tiny hand-authored level keeps the platformer legible and replayable. */
export const LEVEL_LAYOUT = [
  "#########",
  "#...P..E#",
  "#.......#",
  "#P..#...#",
  "#...#P..#",
  "#S.X....#",
  "#########",
] as const;

export const TOTAL_PRISMS = LEVEL_LAYOUT.reduce(
  (total, row) => total + [...row].filter((cell) => cell === "P").length,
  0,
);

export type DriftState = {
  phase: DriftPhase;
  player: DriftPoint;
  gravity: Gravity;
  collected: number[];
  moves: number;
  message: string;
  lastAction: string;
};

function indexFor(point: DriftPoint): number {
  return point.y * GRID_WIDTH + point.x;
}

function cellAt(point: DriftPoint): string {
  if (
    point.x < 0 ||
    point.x >= GRID_WIDTH ||
    point.y < 0 ||
    point.y >= GRID_HEIGHT
  ) {
    return "#";
  }

  return LEVEL_LAYOUT[point.y][point.x] ?? "#";
}

function withCellEffect(state: DriftState): DriftState {
  const cell = cellAt(state.player);
  const cellIndex = indexFor(state.player);
  let nextState = state;

  if (cell === "P" && !state.collected.includes(cellIndex)) {
    nextState = {
      ...nextState,
      collected: [...state.collected, cellIndex],
      message: "A prism locks into the suit. Keep drifting.",
    };
  }

  if (cell === "X") {
    return {
      ...nextState,
      phase: "lost",
      message: "The red seam cuts the drift short. Reset and find a safer line.",
      lastAction: "Hit hazard",
    };
  }

  if (cell === "E" && nextState.collected.length === TOTAL_PRISMS) {
    return {
      ...nextState,
      phase: "won",
      message: "All three prisms are aligned. The gate opens into daylight.",
      lastAction: "Exit reached",
    };
  }

  if (cell === "E") {
    return {
      ...nextState,
      message: `The gate needs ${TOTAL_PRISMS - nextState.collected.length} more prism${TOTAL_PRISMS - nextState.collected.length === 1 ? "" : "s"}.`,
    };
  }

  return nextState;
}

function settle(state: DriftState, gravity: Gravity): DriftState {
  const step = gravity === "up" ? -1 : 1;
  let nextState = withCellEffect(state);

  if (nextState.phase !== "playing") {
    return nextState;
  }

  while (cellAt({ x: nextState.player.x, y: nextState.player.y + step }) !== "#") {
    nextState = {
      ...nextState,
      player: { x: nextState.player.x, y: nextState.player.y + step },
    };
    nextState = withCellEffect(nextState);

    if (nextState.phase !== "playing") {
      return nextState;
    }
  }

  return nextState;
}

export const INITIAL_STATE: DriftState = {
  phase: "playing",
  player: { x: 1, y: 5 },
  gravity: "down",
  collected: [],
  moves: 0,
  message: "Shift gravity, collect every prism, then reach the gate.",
  lastAction: "Ready",
};

export function moveHorizontal(state: DriftState, delta: -1 | 1): DriftState {
  if (state.phase !== "playing") {
    return state;
  }

  const target = { x: state.player.x + delta, y: state.player.y };
  if (cellAt(target) === "#") {
    return {
      ...state,
      message: "The wall catches the suit. Try another direction.",
      lastAction: "Wall blocked",
    };
  }

  return settle(
    {
      ...state,
      player: target,
      moves: state.moves + 1,
      message: delta < 0 ? "Drifted left." : "Drifted right.",
      lastAction: delta < 0 ? "Move left" : "Move right",
    },
    state.gravity,
  );
}

export function shiftGravity(state: DriftState, gravity: Gravity): DriftState {
  if (state.phase !== "playing") {
    return state;
  }

  return settle(
    {
      ...state,
      gravity,
      moves: state.moves + 1,
      message: gravity === "up" ? "Gravity flipped upward." : "Gravity flipped downward.",
      lastAction: gravity === "up" ? "Gravity up" : "Gravity down",
    },
    gravity,
  );
}

export function resetPrismDrift(): DriftState {
  return {
    ...INITIAL_STATE,
    player: { ...INITIAL_STATE.player },
    collected: [],
  };
}

