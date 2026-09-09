export type Vector = {
  x: number;
  y: number;
};

export type Actor = Vector & {
  size: number;
};

export type Target = Actor & {
  id: number;
};

export type Hazard = Actor & {
  id: number;
  driftX: number;
  driftY: number;
  phase: number;
};

export const BOARD_SIZE = 100;
export const PLAYER_SIZE = 7;
export const TARGET_SIZE = 4.5;
export const HAZARD_SIZE = 7;
export const PLAYER_SPEED = 32;
export const ROUND_SECONDS = 45;

export const START_POSITION: Vector = { x: 50, y: 88 };

export const TARGETS: readonly Target[] = [
  { id: 1, x: 14, y: 18, size: TARGET_SIZE },
  { id: 2, x: 34, y: 31, size: TARGET_SIZE },
  { id: 3, x: 73, y: 18, size: TARGET_SIZE },
  { id: 4, x: 88, y: 39, size: TARGET_SIZE },
  { id: 5, x: 57, y: 49, size: TARGET_SIZE },
  { id: 6, x: 20, y: 59, size: TARGET_SIZE },
  { id: 7, x: 42, y: 73, size: TARGET_SIZE },
  { id: 8, x: 79, y: 72, size: TARGET_SIZE },
  { id: 9, x: 11, y: 86, size: TARGET_SIZE },
  { id: 10, x: 91, y: 88, size: TARGET_SIZE },
  { id: 11, x: 64, y: 87, size: TARGET_SIZE },
  { id: 12, x: 48, y: 12, size: TARGET_SIZE },
];

export const HAZARDS: readonly Hazard[] = [
  { id: 1, x: 28, y: 47, size: HAZARD_SIZE, driftX: 9, driftY: 4, phase: 0.2 },
  { id: 2, x: 70, y: 61, size: HAZARD_SIZE, driftX: 6, driftY: 8, phase: 2.3 },
  { id: 3, x: 58, y: 28, size: HAZARD_SIZE, driftX: 8, driftY: 5, phase: 4.1 },
];

export function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

export function movePlayer(
  position: Vector,
  direction: Vector,
  deltaSeconds: number,
  speed = PLAYER_SPEED,
): Vector {
  const length = Math.hypot(direction.x, direction.y);
  const normalizedX = length === 0 ? 0 : direction.x / length;
  const normalizedY = length === 0 ? 0 : direction.y / length;
  const halfSize = PLAYER_SIZE / 2;

  return {
    x: clamp(position.x + normalizedX * speed * deltaSeconds, halfSize, BOARD_SIZE - halfSize),
    y: clamp(position.y + normalizedY * speed * deltaSeconds, halfSize, BOARD_SIZE - halfSize),
  };
}

export function overlaps(first: Actor, second: Actor): boolean {
  return (
    Math.abs(first.x - second.x) < (first.size + second.size) / 2 &&
    Math.abs(first.y - second.y) < (first.size + second.size) / 2
  );
}

export function collectTargets(
  position: Vector,
  targets: readonly Target[],
  collectedIds: ReadonlySet<number>,
): Set<number> {
  const player: Actor = { ...position, size: PLAYER_SIZE };
  const nextCollected = new Set(collectedIds);

  for (const target of targets) {
    if (!nextCollected.has(target.id) && overlaps(player, target)) {
      nextCollected.add(target.id);
    }
  }

  return nextCollected;
}

export function getHazardPosition(hazard: Hazard, elapsedSeconds: number): Vector {
  return {
    x: clamp(
      hazard.x + Math.sin(elapsedSeconds * 1.6 + hazard.phase) * hazard.driftX,
      hazard.size / 2,
      BOARD_SIZE - hazard.size / 2,
    ),
    y: clamp(
      hazard.y + Math.cos(elapsedSeconds * 1.25 + hazard.phase) * hazard.driftY,
      hazard.size / 2,
      BOARD_SIZE - hazard.size / 2,
    ),
  };
}
