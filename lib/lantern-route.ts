export type ResourceKey = "supplies" | "trust" | "light";
export type ChapterId = "gate" | "mill" | "bridge" | "ridge" | "lighthouse";
export type LanternPhase = "playing" | "won" | "lost";
export type LanternEnding = "beacon" | "flame" | "lost";

export type ResourceEffects = Partial<Record<ResourceKey, number>>;

export type StoryChoice = {
  id: string;
  label: string;
  detail: string;
  effects: ResourceEffects;
  requires?: ResourceEffects;
};

export type StoryScene = {
  id: ChapterId;
  eyebrow: string;
  title: string;
  text: string;
  choices: readonly StoryChoice[];
};

export type ChoiceRecord = {
  sceneId: ChapterId;
  choiceId: string;
  label: string;
};

export type LanternState = {
  phase: LanternPhase;
  sceneIndex: number;
  supplies: number;
  trust: number;
  light: number;
  history: readonly ChoiceRecord[];
  lastChoice: ChoiceRecord | null;
  ending: LanternEnding | null;
  message: string;
};

export const MAX_SUPPLIES = 6;
export const MAX_TRUST = 5;
export const MAX_LIGHT = 5;

export const STORY_SCENES: readonly StoryScene[] = [
  {
    id: "gate",
    eyebrow: "CHAPTER I · THE GATE",
    title: "Leave a way open",
    text: "The storm has not reached the valley yet. Behind you, three families wait at a gate that will not hold until dawn.",
    choices: [
      {
        id: "mend-gate",
        label: "Mend the gate",
        detail: "Spend a bundle so the people behind you can follow.",
        effects: { supplies: -1, trust: 1 },
        requires: { supplies: 1 },
      },
      {
        id: "take-road",
        label: "Take the road",
        detail: "Keep the lantern moving before the weather turns.",
        effects: { trust: -1, light: -1 },
      },
    ],
  },
  {
    id: "mill",
    eyebrow: "CHAPTER II · THE MILL",
    title: "A warm window",
    text: "An abandoned mill still smells of grain. Someone has left one lamp burning beside a ledger of names.",
    choices: [
      {
        id: "share-grain",
        label: "Share the grain",
        detail: "Feed the names in the ledger before you continue.",
        effects: { supplies: -1, trust: 2 },
        requires: { supplies: 1 },
      },
      {
        id: "trade-flame",
        label: "Trade for oil",
        detail: "Use two bundles to make the lantern burn brighter.",
        effects: { supplies: -2, light: 1 },
        requires: { supplies: 2 },
      },
      {
        id: "pass-silent",
        label: "Pass in silence",
        detail: "Do not wake the mill. Do not ask who is inside.",
        effects: { trust: -1, light: -1 },
      },
    ],
  },
  {
    id: "bridge",
    eyebrow: "CHAPTER III · THE BRIDGE",
    title: "Water under the boards",
    text: "The bridge has lost its middle span. The river below is rising, and the far bank carries a single answering light.",
    choices: [
      {
        id: "tie-rope",
        label: "Tie a rope",
        detail: "Make a handline for whoever crosses after you.",
        effects: { supplies: -1, trust: 1 },
        requires: { supplies: 1 },
      },
      {
        id: "wait-tide",
        label: "Wait for the tide",
        detail: "Burn two bundles and let the river fall.",
        effects: { supplies: -2, light: 1 },
        requires: { supplies: 2 },
      },
      {
        id: "ford-dark",
        label: "Ford in the dark",
        detail: "Cross quickly. The lantern will not like the water.",
        effects: { trust: -1, light: -1 },
      },
    ],
  },
  {
    id: "ridge",
    eyebrow: "CHAPTER IV · THE RIDGE",
    title: "The last high ground",
    text: "From the ridge, the lighthouse is visible. The wind is strong enough to pull the flame from its glass.",
    choices: [
      {
        id: "shelter",
        label: "Build a shelter",
        detail: "Spend one bundle and protect the light from the wind.",
        effects: { supplies: -1, light: 1 },
        requires: { supplies: 1 },
      },
      {
        id: "signal-cliff",
        label: "Signal from the cliff",
        detail: "Give the people below a reason to keep climbing.",
        effects: { trust: 2, light: -1 },
      },
      {
        id: "race-storm",
        label: "Race the storm",
        detail: "Run for the lighthouse and leave the ridge behind.",
        effects: { supplies: -1, trust: -1, light: -1 },
        requires: { supplies: 1 },
      },
    ],
  },
  {
    id: "lighthouse",
    eyebrow: "CHAPTER V · THE LIGHTHOUSE",
    title: "What should remain?",
    text: "The beacon room is empty. You have one decision before the storm closes the road for good.",
    choices: [
      {
        id: "light-beacon",
        label: "Light the beacon",
        detail: "Spend three levels of flame so the whole coast can see.",
        effects: { light: -3, trust: 1 },
        requires: { light: 3 },
      },
      {
        id: "carry-flame",
        label: "Carry the flame",
        detail: "Keep one light for the people who trusted your route.",
        effects: { light: -1 },
        requires: { light: 1, trust: 2 },
      },
      {
        id: "turn-back",
        label: "Turn back",
        detail: "The road home is still visible through the rain.",
        effects: {},
      },
    ],
  },
];

export const INITIAL_STATE: LanternState = {
  phase: "playing",
  sceneIndex: 0,
  supplies: 4,
  trust: 2,
  light: 3,
  history: [],
  lastChoice: null,
  ending: null,
  message: "The lantern is warm. The road is not.",
};

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

function applyEffects(state: LanternState, effects: ResourceEffects): Pick<LanternState, ResourceKey> {
  return {
    supplies: clamp(state.supplies + (effects.supplies ?? 0), 0, MAX_SUPPLIES),
    trust: clamp(state.trust + (effects.trust ?? 0), 0, MAX_TRUST),
    light: clamp(state.light + (effects.light ?? 0), 0, MAX_LIGHT),
  };
}

export function currentScene(state: LanternState): StoryScene {
  return STORY_SCENES[state.sceneIndex] ?? STORY_SCENES[STORY_SCENES.length - 1];
}

export function isChoiceAvailable(state: LanternState, choice: StoryChoice): boolean {
  return Object.entries(choice.requires ?? {}).every(([resource, required]) => {
    const value = state[resource as ResourceKey];
    return value >= (required ?? 0);
  });
}

export function chooseStoryChoice(state: LanternState, choiceId: string): LanternState {
  if (state.phase !== "playing") {
    return state;
  }

  const scene = currentScene(state);
  const choice = scene.choices.find((candidate) => candidate.id === choiceId);
  if (!choice || !isChoiceAvailable(state, choice)) {
    return state;
  }

  const resources = applyEffects(state, choice.effects);
  const record: ChoiceRecord = {
    sceneId: scene.id,
    choiceId: choice.id,
    label: choice.label,
  };
  const history = [...state.history, record];
  const isFinalScene = state.sceneIndex === STORY_SCENES.length - 1;

  if (isFinalScene) {
    const ending: LanternEnding =
      choice.id === "light-beacon" ? "beacon" : choice.id === "carry-flame" ? "flame" : "lost";
    const won = ending === "beacon" || ending === "flame";

    return {
      ...state,
      ...resources,
      phase: won ? "won" : "lost",
      history,
      lastChoice: record,
      ending,
      message: won
        ? ending === "beacon"
          ? "The coast answers with a hundred small lights."
          : "One flame is enough to lead the people home."
        : "The storm folds over the road before the lantern can return.",
    };
  }

  return {
    ...state,
    ...resources,
    sceneIndex: state.sceneIndex + 1,
    history,
    lastChoice: record,
    message: `You chose to ${choice.label.toLowerCase()}. The next road opens.`,
  };
}

export function resetLanternRoute(): LanternState {
  return INITIAL_STATE;
}
