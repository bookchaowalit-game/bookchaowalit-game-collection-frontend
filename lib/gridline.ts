export type Position = {
  row: number;
  column: number;
};

export type GridlinePhase = "playing" | "won" | "lost";

export type GridlineState = {
  player: Position;
  enemies: readonly Position[];
  beacons: readonly Position[];
  turn: number;
  phase: GridlinePhase;
};

export type TurnAction =
  | { type: "move"; position: Position }
  | { type: "wait" };

export type TurnResult = {
  state: GridlineState;
  changed: boolean;
  captured: boolean;
  caught: boolean;
};

export const GRID_SIZE = 6;
export const MAX_TURNS = 28;
export const ENEMY_MOVE_INTERVAL = 2;

export const WALLS: readonly Position[] = [
  { row: 1, column: 1 },
  { row: 1, column: 2 },
  { row: 2, column: 3 },
  { row: 3, column: 3 },
  { row: 4, column: 1 },
];

export const INITIAL_STATE: GridlineState = {
  player: { row: 5, column: 0 },
  enemies: [
    { row: 0, column: 0 },
    { row: 3, column: 5 },
  ],
  beacons: [
    { row: 0, column: 5 },
    { row: 2, column: 1 },
    { row: 4, column: 4 },
  ],
  turn: 0,
  phase: "playing",
};

export function positionKey(position: Position): string {
  return `${position.row}:${position.column}`;
}

export function samePosition(first: Position, second: Position): boolean {
  return first.row === second.row && first.column === second.column;
}

export function isInsideBoard(position: Position): boolean {
  return (
    position.row >= 0 &&
    position.row < GRID_SIZE &&
    position.column >= 0 &&
    position.column < GRID_SIZE
  );
}

export function isWall(position: Position): boolean {
  return WALLS.some((wall) => samePosition(wall, position));
}

export function isWalkable(position: Position): boolean {
  return isInsideBoard(position) && !isWall(position);
}

export function getNeighbors(position: Position): Position[] {
  return [
    { row: position.row - 1, column: position.column },
    { row: position.row, column: position.column + 1 },
    { row: position.row + 1, column: position.column },
    { row: position.row, column: position.column - 1 },
  ].filter(isWalkable);
}

export function isAdjacent(first: Position, second: Position): boolean {
  return Math.abs(first.row - second.row) + Math.abs(first.column - second.column) === 1;
}

export function getAvailableMoves(state: GridlineState): Position[] {
  const enemyKeys = new Set(state.enemies.map(positionKey));

  return getNeighbors(state.player).filter(
    (position) => !enemyKeys.has(positionKey(position)),
  );
}

export function nextStepToward(from: Position, target: Position): Position {
  if (samePosition(from, target)) {
    return from;
  }

  const queue: Position[] = [from];
  const parents = new Map<string, string | null>([[positionKey(from), null]]);
  const positions = new Map<string, Position>([[positionKey(from), from]]);

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current) {
      continue;
    }

    for (const neighbor of getNeighbors(current)) {
      const neighborKey = positionKey(neighbor);

      if (parents.has(neighborKey)) {
        continue;
      }

      parents.set(neighborKey, positionKey(current));
      positions.set(neighborKey, neighbor);

      if (samePosition(neighbor, target)) {
        let stepKey = neighborKey;
        let parentKey = parents.get(stepKey);

        while (parentKey && parentKey !== positionKey(from)) {
          stepKey = parentKey;
          parentKey = parents.get(stepKey);
        }

        return positions.get(stepKey) ?? from;
      }

      queue.push(neighbor);
    }
  }

  return from;
}

function moveEnemies(enemies: readonly Position[], player: Position): Position[] {
  return enemies.map((enemy) => nextStepToward(enemy, player));
}

export function advanceTurn(state: GridlineState, action: TurnAction): TurnResult {
  if (state.phase !== "playing") {
    return { state, changed: false, captured: false, caught: false };
  }

  const destination = action.type === "wait" ? state.player : action.position;
  const enemyKeys = new Set(state.enemies.map(positionKey));
  const validAction =
    action.type === "wait" ||
    (isWalkable(destination) &&
      isAdjacent(state.player, destination) &&
      !enemyKeys.has(positionKey(destination)));

  if (!validAction) {
    return { state, changed: false, captured: false, caught: false };
  }

  const nextTurn = state.turn + 1;
  const remainingBeacons = state.beacons.filter(
    (beacon) => !samePosition(beacon, destination),
  );
  const captured = remainingBeacons.length !== state.beacons.length;

  if (remainingBeacons.length === 0) {
    return {
      state: {
        ...state,
        player: destination,
        beacons: remainingBeacons,
        turn: nextTurn,
        phase: "won",
      },
      changed: true,
      captured,
      caught: false,
    };
  }

  const nextEnemies =
    nextTurn % ENEMY_MOVE_INTERVAL === 0
      ? moveEnemies(state.enemies, destination)
      : [...state.enemies];
  const caught = nextEnemies.some((enemy) => samePosition(enemy, destination));
  const timedOut = nextTurn >= MAX_TURNS;

  return {
    state: {
      ...state,
      player: destination,
      enemies: nextEnemies,
      beacons: remainingBeacons,
      turn: nextTurn,
      phase: caught || timedOut ? "lost" : "playing",
    },
    changed: true,
    captured,
    caught,
  };
}
