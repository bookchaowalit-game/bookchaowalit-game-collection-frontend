export type PrepId = "light" | "standard" | "full";
export type MarketPhase = "planning" | "summary" | "won" | "lost";

export type MarketDay = {
  name: string;
  mood: string;
  forecast: string;
  baseDemand: number;
  priceSensitivity: number;
};

export type PrepOption = {
  id: PrepId;
  label: string;
  stock: number;
  cost: number;
  detail: string;
};

export type DayReport = {
  dayName: string;
  mood: string;
  demand: number;
  price: number;
  stockBought: number;
  sold: number;
  leftover: number;
  revenue: number;
  cost: number;
  cashAfter: number;
  reputationAfter: number;
};

export type MarketState = {
  day: number;
  cash: number;
  reputation: number;
  selectedPrice: number;
  selectedPrep: PrepId;
  phase: MarketPhase;
  lastReport: DayReport | null;
};

export const STARTING_CASH = 80;
export const TARGET_CASH = 420;
export const MAX_REPUTATION = 5;

export const PRICE_OPTIONS = [6, 8, 10] as const;

export const PREP_OPTIONS: readonly PrepOption[] = [
  { id: "light", label: "Light prep", stock: 8, cost: 14, detail: "Low risk, small crowd" },
  { id: "standard", label: "Standard prep", stock: 16, cost: 26, detail: "Balanced everyday plan" },
  { id: "full", label: "Full prep", stock: 24, cost: 40, detail: "Serve a big night" },
];

export const MARKET_DAYS: readonly MarketDay[] = [
  {
    name: "Opening Rush",
    mood: "Clear skies",
    forecast: "The first crowd is curious and forgiving.",
    baseDemand: 16,
    priceSensitivity: 1,
  },
  {
    name: "Rainy Lane",
    mood: "Heavy rain",
    forecast: "Fewer people are out, but warm drinks feel worth it.",
    baseDemand: 10,
    priceSensitivity: 2,
  },
  {
    name: "Festival Night",
    mood: "Lanterns up",
    forecast: "The street is packed. This is the night to be ready.",
    baseDemand: 23,
    priceSensitivity: 1,
  },
  {
    name: "Quiet Tuesday",
    mood: "Slow traffic",
    forecast: "A lean menu protects your cash on a quiet night.",
    baseDemand: 8,
    priceSensitivity: 2,
  },
  {
    name: "Payday Crowd",
    mood: "City lights",
    forecast: "End the week with a strong offer and a full queue.",
    baseDemand: 19,
    priceSensitivity: 1,
  },
];

export const INITIAL_STATE: MarketState = {
  day: 0,
  cash: STARTING_CASH,
  reputation: 1,
  selectedPrice: 8,
  selectedPrep: "standard",
  phase: "planning",
  lastReport: null,
};

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

export function getPrepOption(id: PrepId): PrepOption {
  return PREP_OPTIONS.find((option) => option.id === id) ?? PREP_OPTIONS[1];
}

export function calculateDemand(day: MarketDay, price: number, reputation: number): number {
  const priceSteps = Math.max(0, Math.floor((price - PRICE_OPTIONS[0]) / 2));
  return Math.max(0, day.baseDemand + reputation - priceSteps * day.priceSensitivity);
}

export function canOpenMarket(state: MarketState): boolean {
  const prep = getPrepOption(state.selectedPrep);
  return state.phase === "planning" && state.cash >= prep.cost;
}

export function openMarket(state: MarketState): MarketState {
  if (!canOpenMarket(state)) {
    return state;
  }

  const day = MARKET_DAYS[state.day];

  if (!day) {
    return state;
  }

  const prep = getPrepOption(state.selectedPrep);
  const demand = calculateDemand(day, state.selectedPrice, state.reputation);
  const sold = Math.min(prep.stock, demand);
  const leftover = prep.stock - sold;
  const revenue = sold * state.selectedPrice;
  const cashAfter = state.cash - prep.cost + revenue;
  const reputationDelta =
    demand > prep.stock ? -1 : state.selectedPrice === 6 ? 1 : state.selectedPrice === 10 ? -1 : 0;
  const reputationAfter = clamp(
    state.reputation + reputationDelta,
    0,
    MAX_REPUTATION,
  );
  const nextDay = state.day + 1;
  const finished = nextDay >= MARKET_DAYS.length;
  const phase: MarketPhase = finished
    ? cashAfter >= TARGET_CASH
      ? "won"
      : "lost"
    : "summary";

  return {
    ...state,
    day: nextDay,
    cash: cashAfter,
    reputation: reputationAfter,
    phase,
    lastReport: {
      dayName: day.name,
      mood: day.mood,
      demand,
      price: state.selectedPrice,
      stockBought: prep.stock,
      sold,
      leftover,
      revenue,
      cost: prep.cost,
      cashAfter,
      reputationAfter,
    },
  };
}

export function advanceToNextDay(state: MarketState): MarketState {
  if (state.phase !== "summary") {
    return state;
  }

  return {
    ...state,
    phase: "planning",
    lastReport: null,
  };
}

export function resetMarket(): MarketState {
  return INITIAL_STATE;
}
