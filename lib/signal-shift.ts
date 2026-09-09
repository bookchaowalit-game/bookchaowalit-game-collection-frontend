export type TileKind = "end" | "straight" | "corner";

export type Tile = {
  kind: TileKind;
  rotation: number;
  locked?: boolean;
  role?: "source" | "goal";
};

export const GRID_SIZE = 4;
export const BOARD_LENGTH = GRID_SIZE * GRID_SIZE;
export const SOURCE_INDEX = 0;
export const GOAL_INDEX = 12;

export const CONNECTION_BITS = {
  up: 1,
  right: 2,
  down: 4,
  left: 8,
} as const;

export const TILE_SEGMENTS = [
  { bit: CONNECTION_BITS.up, x2: 50, y2: 7 },
  { bit: CONNECTION_BITS.right, x2: 93, y2: 50 },
  { bit: CONNECTION_BITS.down, x2: 50, y2: 93 },
  { bit: CONNECTION_BITS.left, x2: 7, y2: 50 },
] as const;

const BASE_MASKS: Record<TileKind, number> = {
  end: CONNECTION_BITS.up,
  straight: CONNECTION_BITS.up | CONNECTION_BITS.down,
  corner: CONNECTION_BITS.up | CONNECTION_BITS.right,
};

const DIRECTIONS = [
  { bit: CONNECTION_BITS.up, opposite: CONNECTION_BITS.down, dx: 0, dy: -1 },
  { bit: CONNECTION_BITS.right, opposite: CONNECTION_BITS.left, dx: 1, dy: 0 },
  { bit: CONNECTION_BITS.down, opposite: CONNECTION_BITS.up, dx: 0, dy: 1 },
  { bit: CONNECTION_BITS.left, opposite: CONNECTION_BITS.right, dx: -1, dy: 0 },
] as const;

function normalizeRotation(rotation: number): number {
  return ((rotation % 4) + 4) % 4;
}

function rotateMaskClockwise(mask: number): number {
  return ((mask << 1) & 0b1111) | (mask >> 3);
}

export function getTileMask(tile: Tile): number {
  let mask = BASE_MASKS[tile.kind];

  for (let rotation = 0; rotation < normalizeRotation(tile.rotation); rotation += 1) {
    mask = rotateMaskClockwise(mask);
  }

  return mask;
}

export const SOLUTION_BOARD: readonly Tile[] = [
  { kind: "end", rotation: 1, locked: true, role: "source" },
  { kind: "straight", rotation: 1 },
  { kind: "straight", rotation: 1 },
  { kind: "corner", rotation: 2 },
  { kind: "corner", rotation: 1 },
  { kind: "straight", rotation: 1 },
  { kind: "straight", rotation: 1 },
  { kind: "corner", rotation: 3 },
  { kind: "corner", rotation: 0 },
  { kind: "straight", rotation: 1 },
  { kind: "straight", rotation: 1 },
  { kind: "corner", rotation: 2 },
  { kind: "end", rotation: 1, locked: true, role: "goal" },
  { kind: "straight", rotation: 1 },
  { kind: "straight", rotation: 1 },
  { kind: "corner", rotation: 3 },
];

const INITIAL_ROTATIONS = [1, 3, 2, 0, 3, 0, 2, 1, 2, 3, 0, 1, 1, 2, 0, 1];

export const INITIAL_BOARD: readonly Tile[] = SOLUTION_BOARD.map((tile, index) => ({
  ...tile,
  rotation: tile.locked ? tile.rotation : INITIAL_ROTATIONS[index],
}));

export function rotateTile(board: readonly Tile[], index: number): readonly Tile[] {
  const tile = board[index];

  if (!tile || tile.locked) {
    return board;
  }

  return board.map((currentTile, currentIndex) =>
    currentIndex === index
      ? { ...currentTile, rotation: normalizeRotation(currentTile.rotation + 1) }
      : currentTile,
  );
}

export function getReachableTiles(board: readonly Tile[]): Set<number> {
  if (board.length !== BOARD_LENGTH) {
    return new Set();
  }

  const reachable = new Set<number>([SOURCE_INDEX]);
  const queue = [SOURCE_INDEX];

  while (queue.length > 0) {
    const currentIndex = queue.shift();

    if (currentIndex === undefined) {
      continue;
    }

    const row = Math.floor(currentIndex / GRID_SIZE);
    const column = currentIndex % GRID_SIZE;
    const currentMask = getTileMask(board[currentIndex]);

    for (const direction of DIRECTIONS) {
      if ((currentMask & direction.bit) === 0) {
        continue;
      }

      const nextRow = row + direction.dy;
      const nextColumn = column + direction.dx;

      if (
        nextRow < 0 ||
        nextRow >= GRID_SIZE ||
        nextColumn < 0 ||
        nextColumn >= GRID_SIZE
      ) {
        continue;
      }

      const nextIndex = nextRow * GRID_SIZE + nextColumn;
      const nextMask = getTileMask(board[nextIndex]);

      if ((nextMask & direction.opposite) !== 0 && !reachable.has(nextIndex)) {
        reachable.add(nextIndex);
        queue.push(nextIndex);
      }
    }
  }

  return reachable;
}

export function isSolved(board: readonly Tile[]): boolean {
  const reachable = getReachableTiles(board);
  return reachable.has(GOAL_INDEX) && reachable.size === BOARD_LENGTH;
}

export function getHintIndex(
  board: readonly Tile[],
  solution: readonly Tile[] = SOLUTION_BOARD,
): number {
  return board.findIndex(
    (tile, index) => !tile.locked && tile.rotation !== solution[index]?.rotation,
  );
}

export function alignOneTile(
  board: readonly Tile[],
  index: number,
  solution: readonly Tile[] = SOLUTION_BOARD,
): readonly Tile[] {
  const tile = board[index];
  const target = solution[index];

  if (!tile || tile.locked || !target || tile.rotation === target.rotation) {
    return board;
  }

  return rotateTile(board, index);
}
