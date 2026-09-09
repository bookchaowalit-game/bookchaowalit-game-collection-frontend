export type Blueprint = "conveyor" | "smelter" | "press";
export type FactoryTile = "empty" | "mine" | "conveyor" | "smelter" | "press" | "shipment";
export type FoundryPhase = "planning" | "summary" | "won" | "lost";

export type BlueprintOption = {
  id: Blueprint;
  label: string;
  symbol: string;
  detail: string;
};

export type FactoryEvaluation = {
  ready: boolean;
  route: readonly number[];
  reason: string;
};

export type FactoryRun = {
  cycle: number;
  shipped: boolean;
  ready: boolean;
  routeLength: number;
  message: string;
};

export type PocketFoundryState = {
  phase: FoundryPhase;
  cycle: number;
  shipments: number;
  tiles: readonly FactoryTile[];
  inventory: Readonly<Record<Blueprint, number>>;
  selectedBlueprint: Blueprint;
  lastRun: FactoryRun | null;
  message: string;
};

export const GRID_SIZE = 4;
export const GRID_CELLS = GRID_SIZE * GRID_SIZE;
export const MINE_INDEX = 0;
export const SHIPMENT_INDEX = GRID_CELLS - 1;
export const CYCLE_LIMIT = 8;
export const TARGET_SHIPMENTS = 3;

export const BLUEPRINT_OPTIONS: readonly BlueprintOption[] = [
  {
    id: "conveyor",
    label: "Conveyor",
    symbol: "→",
    detail: "Carry the chain forward",
  },
  {
    id: "smelter",
    label: "Smelter",
    symbol: "♨",
    detail: "Ore becomes ingots",
  },
  {
    id: "press",
    label: "Press",
    symbol: "▣",
    detail: "Ingots become cargo",
  },
];

const STARTING_INVENTORY: Readonly<Record<Blueprint, number>> = {
  conveyor: 4,
  smelter: 1,
  press: 1,
};

const STARTING_TILES: FactoryTile[] = Array.from(
  { length: GRID_CELLS },
  (_, index) => {
    if (index === MINE_INDEX) {
      return "mine";
    }
    if (index === SHIPMENT_INDEX) {
      return "shipment";
    }
    return "empty";
  },
);

export const INITIAL_STATE: PocketFoundryState = {
  phase: "planning",
  cycle: 0,
  shipments: 0,
  tiles: STARTING_TILES,
  inventory: STARTING_INVENTORY,
  selectedBlueprint: "conveyor",
  lastRun: null,
  message: "Connect the mine to the shipment bay, then add both processing steps.",
};

function inBounds(index: number): boolean {
  return index >= 0 && index < GRID_CELLS;
}

function neighbors(index: number): number[] {
  const row = Math.floor(index / GRID_SIZE);
  const column = index % GRID_SIZE;
  const candidates = [
    index - GRID_SIZE,
    index + GRID_SIZE,
    column > 0 ? index - 1 : -1,
    column < GRID_SIZE - 1 ? index + 1 : -1,
  ];

  return candidates.filter((candidate) => {
    if (!inBounds(candidate)) {
      return false;
    }
    const candidateRow = Math.floor(candidate / GRID_SIZE);
    return Math.abs(candidateRow - row) <= 1;
  });
}

export function findRoute(tiles: readonly FactoryTile[]): readonly number[] {
  if (tiles.length !== GRID_CELLS || tiles[MINE_INDEX] !== "mine" || tiles[SHIPMENT_INDEX] !== "shipment") {
    return [];
  }

  const previous = Array.from({ length: GRID_CELLS }, () => -1);
  const queue = [MINE_INDEX];
  previous[MINE_INDEX] = MINE_INDEX;

  while (queue.length > 0) {
    const current = queue.shift();
    if (current === undefined) {
      break;
    }
    if (current === SHIPMENT_INDEX) {
      break;
    }

    for (const next of neighbors(current)) {
      if (previous[next] !== -1 || tiles[next] === "empty") {
        continue;
      }
      previous[next] = current;
      queue.push(next);
    }
  }

  if (previous[SHIPMENT_INDEX] === -1) {
    return [];
  }

  const route: number[] = [];
  let current = SHIPMENT_INDEX;
  while (current !== MINE_INDEX) {
    route.push(current);
    current = previous[current];
  }
  route.push(MINE_INDEX);

  return route.reverse();
}

export function evaluateFactory(tiles: readonly FactoryTile[]): FactoryEvaluation {
  const route = findRoute(tiles);

  if (route.length === 0) {
    return {
      ready: false,
      route,
      reason: "The mine and shipment bay are not connected yet.",
    };
  }

  const routeTiles = route.map((index) => tiles[index]);
  if (!routeTiles.includes("smelter") || !routeTiles.includes("press")) {
    return {
      ready: false,
      route,
      reason: "The route needs one smelter and one press before it can ship.",
    };
  }

  return {
    ready: true,
    route,
    reason: "Production chain online. The cargo can ship.",
  };
}

export function selectBlueprint(
  state: PocketFoundryState,
  blueprint: Blueprint,
): PocketFoundryState {
  if (state.phase !== "planning" || state.inventory[blueprint] <= 0) {
    return state;
  }

  return {
    ...state,
    selectedBlueprint: blueprint,
    message: `${BLUEPRINT_OPTIONS.find((option) => option.id === blueprint)?.label ?? blueprint} selected. Place it on the grid.`,
  };
}

export function placeTile(state: PocketFoundryState, index: number): PocketFoundryState {
  if (
    state.phase !== "planning" ||
    !inBounds(index) ||
    index === MINE_INDEX ||
    index === SHIPMENT_INDEX ||
    state.tiles[index] !== "empty" ||
    state.inventory[state.selectedBlueprint] <= 0
  ) {
    return state;
  }

  const tiles = [...state.tiles];
  tiles[index] = state.selectedBlueprint;
  const inventory = {
    ...state.inventory,
    [state.selectedBlueprint]: state.inventory[state.selectedBlueprint] - 1,
  };

  return {
    ...state,
    tiles,
    inventory,
    message: "Machine placed. Keep the chain contiguous.",
  };
}

export function removeTile(state: PocketFoundryState, index: number): PocketFoundryState {
  if (
    state.phase !== "planning" ||
    !inBounds(index) ||
    index === MINE_INDEX ||
    index === SHIPMENT_INDEX ||
    state.tiles[index] === "empty"
  ) {
    return state;
  }

  const tile = state.tiles[index];
  if (tile === "mine" || tile === "shipment") {
    return state;
  }

  const tiles = [...state.tiles];
  tiles[index] = "empty";
  const inventory = {
    ...state.inventory,
    [tile]: state.inventory[tile] + 1,
  };

  return {
    ...state,
    tiles,
    inventory,
    message: "Machine removed. The blueprint is back in stock.",
  };
}

export function runCycle(state: PocketFoundryState): PocketFoundryState {
  if (state.phase !== "planning" || state.cycle >= CYCLE_LIMIT) {
    return state;
  }

  const evaluation = evaluateFactory(state.tiles);
  const cycle = state.cycle + 1;
  const shipments = state.shipments + (evaluation.ready ? 1 : 0);
  const phase: FoundryPhase =
    shipments >= TARGET_SHIPMENTS
      ? "won"
      : cycle >= CYCLE_LIMIT
        ? "lost"
        : "summary";
  const message = evaluation.ready
    ? `Shipment ${shipments}/${TARGET_SHIPMENTS} cleared the loading bay.`
    : evaluation.reason;

  return {
    ...state,
    phase,
    cycle,
    shipments,
    lastRun: {
      cycle,
      shipped: evaluation.ready,
      ready: evaluation.ready,
      routeLength: evaluation.route.length,
      message,
    },
    message,
  };
}

export function advanceCycle(state: PocketFoundryState): PocketFoundryState {
  if (state.phase !== "summary") {
    return state;
  }

  return {
    ...state,
    phase: "planning",
    lastRun: null,
    message: `Cycle ${state.cycle + 1} is ready. Tune the line before it runs.`,
  };
}

export function resetPocketFoundry(): PocketFoundryState {
  return INITIAL_STATE;
}
