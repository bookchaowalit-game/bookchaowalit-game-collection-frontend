export type SurvivalAction =
  | "scavenge"
  | "battery-run"
  | "craft-battery"
  | "reinforce"
  | "rest";
export type LightPhase = "planning" | "summary" | "won" | "lost";

export type NightForecast = {
  name: string;
  mood: string;
  detail: string;
  threat: number;
};

export type ActionOption = {
  id: SurvivalAction;
  label: string;
  detail: string;
};

export type NightReport = {
  nightName: string;
  action: SurvivalAction;
  threat: number;
  batteryUsed: boolean;
  damage: number;
  healthAfter: number;
  warmthAfter: number;
  scrapAfter: number;
  batteriesAfter: number;
  shelterAfter: number;
};

export type LastLightState = {
  night: number;
  health: number;
  maxHealth: number;
  warmth: number;
  maxWarmth: number;
  scrap: number;
  batteries: number;
  shelter: number;
  phase: LightPhase;
  selectedAction: SurvivalAction;
  lastReport: NightReport | null;
};

export const NIGHT_COUNT = 6;
export const STARTING_HEALTH = 10;
export const MAX_HEALTH = 12;
export const STARTING_WARMTH = 4;
export const MAX_WARMTH = 6;
export const STARTING_SCRAP = 4;
export const STARTING_BATTERIES = 2;
export const STARTING_SHELTER = 1;
export const MAX_SHELTER = 4;

export const NIGHT_FORECASTS: readonly NightForecast[] = [
  {
    name: "Ashfall Outskirts",
    mood: "Grey sky",
    detail: "The first cold front is close. A little shelter goes a long way.",
    threat: 3,
  },
  {
    name: "Static Rain",
    mood: "Signal storm",
    detail: "Radio towers are flickering. Search parties can still find useful cells.",
    threat: 4,
  },
  {
    name: "Blackout Ridge",
    mood: "No moon",
    detail: "The dark is deeper tonight. Keep one battery for the beacon if you can.",
    threat: 5,
  },
  {
    name: "The Long Wind",
    mood: "Crosswind",
    detail: "Loose panels are becoming dangerous. Reinforce before the next gust.",
    threat: 4,
  },
  {
    name: "Frostline",
    mood: "Hard freeze",
    detail: "Warmth matters as much as walls. A rest day may save the run.",
    threat: 6,
  },
  {
    name: "Last Signal",
    mood: "Distant lights",
    detail: "Hold the shelter through one final night and the rescue line can find you.",
    threat: 7,
  },
];

export const ACTION_OPTIONS: readonly ActionOption[] = [
  { id: "scavenge", label: "Scavenge", detail: "+4 scrap · -1 warmth" },
  { id: "battery-run", label: "Battery run", detail: "+1 battery · -1 warmth" },
  { id: "craft-battery", label: "Craft battery", detail: "-3 scrap · +2 batteries" },
  { id: "reinforce", label: "Reinforce", detail: "-2 scrap · +1 shelter" },
  { id: "rest", label: "Rest", detail: "+2 warmth · +1 health" },
];

export const INITIAL_STATE: LastLightState = {
  night: 0,
  health: STARTING_HEALTH,
  maxHealth: MAX_HEALTH,
  warmth: STARTING_WARMTH,
  maxWarmth: MAX_WARMTH,
  scrap: STARTING_SCRAP,
  batteries: STARTING_BATTERIES,
  shelter: STARTING_SHELTER,
  phase: "planning",
  selectedAction: "scavenge",
  lastReport: null,
};

export function getActionOption(action: SurvivalAction): ActionOption {
  return ACTION_OPTIONS.find((option) => option.id === action) ?? ACTION_OPTIONS[0];
}

export function canTakeAction(state: LastLightState, action: SurvivalAction): boolean {
  if (state.phase !== "planning") {
    return false;
  }

  if (action === "craft-battery") {
    return state.scrap >= 3;
  }

  if (action === "reinforce") {
    return state.scrap >= 2 && state.shelter < MAX_SHELTER;
  }

  return true;
}

export function chooseAction(state: LastLightState, action: SurvivalAction): LastLightState {
  if (!canTakeAction(state, action)) {
    return state;
  }

  return { ...state, selectedAction: action };
}

function applyAction(state: LastLightState): LastLightState {
  switch (state.selectedAction) {
    case "scavenge":
      return { ...state, scrap: state.scrap + 4, warmth: Math.max(0, state.warmth - 1) };
    case "battery-run":
      return { ...state, batteries: state.batteries + 1, warmth: Math.max(0, state.warmth - 1) };
    case "craft-battery":
      return { ...state, scrap: state.scrap - 3, batteries: state.batteries + 2 };
    case "reinforce":
      return { ...state, scrap: state.scrap - 2, shelter: Math.min(MAX_SHELTER, state.shelter + 1) };
    case "rest":
      return {
        ...state,
        health: Math.min(state.maxHealth, state.health + 1),
        warmth: Math.min(state.maxWarmth, state.warmth + 2),
      };
  }
}

export function resolveNight(state: LastLightState): LastLightState {
  if (state.phase !== "planning") {
    return state;
  }

  const forecast = NIGHT_FORECASTS[state.night];

  if (!forecast || !canTakeAction(state, state.selectedAction)) {
    return state;
  }

  const prepared = applyAction(state);
  const batteryUsed = prepared.batteries > 0;
  const batteriesAfter = Math.max(0, prepared.batteries - (batteryUsed ? 1 : 0));
  const warmthAfter = Math.max(0, prepared.warmth - 1);
  const lightDefense = batteryUsed ? 2 : 0;
  const coldPenalty = warmthAfter <= 1 ? 1 : 0;
  const damage = Math.max(0, forecast.threat - prepared.shelter - lightDefense + coldPenalty);
  const healthAfter = Math.max(0, prepared.health - damage);
  const nextNight = state.night + 1;
  const phase: LightPhase =
    healthAfter <= 0 ? "lost" : nextNight >= NIGHT_COUNT ? "won" : "summary";

  return {
    ...prepared,
    night: nextNight,
    health: healthAfter,
    warmth: warmthAfter,
    batteries: batteriesAfter,
    phase,
    lastReport: {
      nightName: forecast.name,
      action: state.selectedAction,
      threat: forecast.threat,
      batteryUsed,
      damage,
      healthAfter,
      warmthAfter,
      scrapAfter: prepared.scrap,
      batteriesAfter,
      shelterAfter: prepared.shelter,
    },
  };
}

export function advanceToNextNight(state: LastLightState): LastLightState {
  if (state.phase !== "summary") {
    return state;
  }

  return {
    ...state,
    phase: "planning",
    lastReport: null,
  };
}

export function resetLastLight(): LastLightState {
  return INITIAL_STATE;
}
