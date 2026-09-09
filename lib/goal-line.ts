export type Aim = "left" | "center" | "right";
export type ShotHeight = "low" | "high";
export type GoalLinePhase = "planning" | "summary" | "won" | "lost";

export type ShotForecast = {
  keeperAim: Aim;
  keeperHeight: ShotHeight;
  hint: string;
  crowd: string;
};

export type ShotReport = {
  round: number;
  aim: Aim;
  height: ShotHeight;
  keeperAim: Aim;
  keeperHeight: ShotHeight;
  goal: boolean;
  message: string;
};

export type GoalLineState = {
  round: number;
  goals: number;
  saves: number;
  phase: GoalLinePhase;
  selectedAim: Aim;
  selectedHeight: ShotHeight;
  lastShot: ShotReport | null;
};

export const SHOT_COUNT = 5;
export const GOAL_TARGET = 3;

export const AIM_OPTIONS: readonly { id: Aim; label: string; symbol: string }[] = [
  { id: "left", label: "Left corner", symbol: "←" },
  { id: "center", label: "Center", symbol: "●" },
  { id: "right", label: "Right corner", symbol: "→" },
];

export const HEIGHT_OPTIONS: readonly { id: ShotHeight; label: string; detail: string }[] = [
  { id: "low", label: "Low drive", detail: "Fast along the grass" },
  { id: "high", label: "High arc", detail: "Lift it over the gloves" },
];

export const SHOT_FORECASTS: readonly ShotForecast[] = [
  {
    keeperAim: "left",
    keeperHeight: "low",
    hint: "The keeper is shading left. The near post looks tempting.",
    crowd: "A hush falls over the east stand.",
  },
  {
    keeperAim: "right",
    keeperHeight: "high",
    hint: "The keeper keeps glancing right. The corners are being watched.",
    crowd: "The drums start a slow, steady roll.",
  },
  {
    keeperAim: "center",
    keeperHeight: "low",
    hint: "The keeper is standing tall in the center. Make the gloves move.",
    crowd: "The whole stadium leans toward the line.",
  },
  {
    keeperAim: "left",
    keeperHeight: "high",
    hint: "The keeper expects a high corner to the left. Change the rhythm.",
    crowd: "The captain points toward the far side.",
  },
  {
    keeperAim: "right",
    keeperHeight: "low",
    hint: "One goal wins the shootout. The keeper is low and right.",
    crowd: "The final whistle waits on your decision.",
  },
];

export const INITIAL_STATE: GoalLineState = {
  round: 0,
  goals: 0,
  saves: 0,
  phase: "planning",
  selectedAim: "center",
  selectedHeight: "low",
  lastShot: null,
};

export function selectAim(state: GoalLineState, aim: Aim): GoalLineState {
  if (state.phase !== "planning") {
    return state;
  }

  return { ...state, selectedAim: aim };
}

export function selectHeight(state: GoalLineState, height: ShotHeight): GoalLineState {
  if (state.phase !== "planning") {
    return state;
  }

  return { ...state, selectedHeight: height };
}

export function takeShot(state: GoalLineState): GoalLineState {
  if (state.phase !== "planning") {
    return state;
  }

  const forecast = SHOT_FORECASTS[state.round];

  if (!forecast) {
    return state;
  }

  const goal =
    state.selectedAim !== forecast.keeperAim || state.selectedHeight !== forecast.keeperHeight;
  const goals = state.goals + (goal ? 1 : 0);
  const saves = state.saves + (goal ? 0 : 1);
  const nextRound = state.round + 1;
  const phase: GoalLinePhase =
    nextRound >= SHOT_COUNT ? (goals >= GOAL_TARGET ? "won" : "lost") : "summary";

  return {
    ...state,
    round: nextRound,
    goals,
    saves,
    phase,
    lastShot: {
      round: state.round,
      aim: state.selectedAim,
      height: state.selectedHeight,
      keeperAim: forecast.keeperAim,
      keeperHeight: forecast.keeperHeight,
      goal,
      message: goal
        ? "The net ripples. The keeper guessed wrong."
        : "Saved. The keeper read the shot all the way through.",
    },
  };
}

export function advanceToNextShot(state: GoalLineState): GoalLineState {
  if (state.phase !== "summary") {
    return state;
  }

  return {
    ...state,
    phase: "planning",
    lastShot: null,
  };
}

export function resetGoalLine(): GoalLineState {
  return INITIAL_STATE;
}
