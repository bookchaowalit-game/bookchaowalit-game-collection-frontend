export type CardId = "strike" | "guard" | "spark" | "mend";
export type CascadePhase = "ready" | "playing" | "reward" | "won" | "lost";

export type CardDefinition = {
  id: CardId;
  label: string;
  cost: number;
  damage: number;
  block: number;
  heal: number;
  detail: string;
};

export type CascadeEnemy = {
  name: string;
  maxHp: number;
  hp: number;
  baseDamage: number;
  intent: number;
};

export type CardCascadeState = {
  phase: CascadePhase;
  room: number;
  turn: number;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  block: number;
  score: number;
  enemy: CascadeEnemy;
  hand: readonly CardId[];
  deck: readonly CardId[];
  discard: readonly CardId[];
  rewardOptions: readonly CardId[];
  message: string;
};

export const ROOM_COUNT = 4;
export const HAND_SIZE = 3;
export const MAX_ENERGY = 3;
export const STARTING_HP = 38;

export const CARD_LIBRARY: Readonly<Record<CardId, CardDefinition>> = {
  strike: {
    id: "strike",
    label: "Strike",
    cost: 1,
    damage: 7,
    block: 0,
    heal: 0,
    detail: "Deal 7 damage.",
  },
  guard: {
    id: "guard",
    label: "Guard",
    cost: 1,
    damage: 0,
    block: 7,
    heal: 0,
    detail: "Gain 7 shield.",
  },
  spark: {
    id: "spark",
    label: "Spark",
    cost: 2,
    damage: 14,
    block: 0,
    heal: 0,
    detail: "Deal 14 damage.",
  },
  mend: {
    id: "mend",
    label: "Mend",
    cost: 2,
    damage: 0,
    block: 0,
    heal: 6,
    detail: "Restore 6 HP.",
  },
};

export const ENEMY_DEFINITIONS: readonly Omit<CascadeEnemy, "hp" | "intent">[] = [
  { name: "Rust Scout", maxHp: 18, baseDamage: 4 },
  { name: "Glass Warden", maxHp: 24, baseDamage: 5 },
  { name: "Wire Titan", maxHp: 30, baseDamage: 6 },
  { name: "The Cascade", maxHp: 38, baseDamage: 7 },
];

export const STARTING_DECK: readonly CardId[] = [
  "strike",
  "strike",
  "strike",
  "guard",
  "guard",
  "spark",
];

export const REWARD_OPTIONS: readonly (readonly CardId[])[] = [
  ["spark", "mend"],
  ["guard", "mend"],
  ["spark", "guard"],
];

function enemyForRoom(room: number): CascadeEnemy {
  const definition = ENEMY_DEFINITIONS[Math.min(room, ENEMY_DEFINITIONS.length - 1)];

  return {
    ...definition,
    hp: definition.maxHp,
    intent: definition.baseDamage,
  };
}

export function getCardDefinition(cardId: CardId): CardDefinition {
  return CARD_LIBRARY[cardId];
}

export const INITIAL_STATE: CardCascadeState = {
  phase: "ready",
  room: 0,
  turn: 1,
  hp: STARTING_HP,
  maxHp: STARTING_HP,
  energy: MAX_ENERGY,
  maxEnergy: MAX_ENERGY,
  block: 0,
  score: 0,
  enemy: enemyForRoom(0),
  hand: [],
  deck: STARTING_DECK,
  discard: [],
  rewardOptions: [],
  message: "Choose a card, then end your turn to face the enemy intent.",
};

function drawCards(state: CardCascadeState, amount: number): CardCascadeState {
  const deck = [...state.deck];
  const discard = [...state.discard];
  const hand = [...state.hand];

  for (let draw = 0; draw < amount; draw += 1) {
    if (deck.length === 0 && discard.length > 0) {
      deck.push(...discard);
      discard.length = 0;
    }

    const card = deck.shift();

    if (!card) {
      break;
    }

    hand.push(card);
  }

  return { ...state, deck, discard, hand };
}

export function startCascade(): CardCascadeState {
  return drawCards(
    {
      ...INITIAL_STATE,
      phase: "playing",
      deck: [...STARTING_DECK],
      hand: [],
      discard: [],
      rewardOptions: [],
      message: "Read the enemy intent. Spend energy, then end the turn.",
    },
    HAND_SIZE,
  );
}

export function canPlayCard(state: CardCascadeState, handIndex: number): boolean {
  const cardId = state.hand[handIndex];

  return Boolean(
    state.phase === "playing" &&
      cardId &&
      state.energy >= getCardDefinition(cardId).cost,
  );
}

export function playCard(state: CardCascadeState, handIndex: number): CardCascadeState {
  if (!canPlayCard(state, handIndex)) {
    return state;
  }

  const cardId = state.hand[handIndex];
  const card = getCardDefinition(cardId);
  const hand = state.hand.filter((_, index) => index !== handIndex);
  const enemy = {
    ...state.enemy,
    hp: Math.max(0, state.enemy.hp - card.damage),
  };
  const hp = Math.min(state.maxHp, state.hp + card.heal);
  const roomCleared = enemy.hp === 0;

  if (roomCleared && state.room === ROOM_COUNT - 1) {
    return {
      ...state,
      phase: "won",
      energy: state.energy - card.cost,
      hp,
      enemy,
      hand,
      discard: [...state.discard, cardId],
      score: state.score + card.damage * 10 + card.heal * 4,
      message: `Final room cleared with ${card.label}.`,
    };
  }

  if (roomCleared) {
    return {
      ...state,
      phase: "reward",
      energy: state.energy - card.cost,
      hp,
      enemy,
      hand,
      discard: [...state.discard, cardId],
      score: state.score + card.damage * 10 + card.heal * 4,
      rewardOptions: REWARD_OPTIONS[state.room] ?? ["strike", "guard"],
      message: `${enemy.name} cleared. Choose one card for the deck.`,
    };
  }

  return {
    ...state,
    energy: state.energy - card.cost,
    hp,
    block: state.block + card.block,
    enemy,
    hand,
    discard: [...state.discard, cardId],
    score: state.score + card.damage * 10 + card.heal * 4 + card.block * 2,
    message: `${card.label}: ${card.detail}`,
  };
}

export function endTurn(state: CardCascadeState): CardCascadeState {
  if (state.phase !== "playing") {
    return state;
  }

  const damageTaken = Math.max(0, state.enemy.intent - state.block);
  const hp = state.hp - damageTaken;
  const discard = [...state.discard, ...state.hand];

  if (hp <= 0) {
    return {
      ...state,
      phase: "lost",
      hp: 0,
      block: 0,
      hand: [],
      discard,
      message: `${state.enemy.name} broke through. The run is over.`,
    };
  }

  const turn = state.turn + 1;
  const enemy = {
    ...state.enemy,
    intent: state.enemy.baseDamage + Math.floor((turn - 1) / 2),
  };

  return drawCards(
    {
      ...state,
      turn,
      hp,
      energy: state.maxEnergy,
      block: 0,
      enemy,
      hand: [],
      discard,
      message: `${state.enemy.name} dealt ${damageTaken}. New intent: ${enemy.intent}.`,
    },
    HAND_SIZE,
  );
}

export function chooseReward(state: CardCascadeState, cardId: CardId): CardCascadeState {
  if (state.phase !== "reward" || !state.rewardOptions.includes(cardId)) {
    return state;
  }

  const room = state.room + 1;
  const deck = [...state.deck, ...state.hand, ...state.discard, cardId];
  const nextState: CardCascadeState = {
    ...state,
    phase: "playing",
    room,
    turn: 1,
    hp: Math.min(state.maxHp, state.hp + 4),
    energy: state.maxEnergy,
    block: 0,
    enemy: enemyForRoom(room),
    hand: [],
    deck,
    discard: [],
    rewardOptions: [],
    message: `${getCardDefinition(cardId).label} added. A small repair restores 4 HP.`,
  };

  return drawCards(nextState, HAND_SIZE);
}

export function resetCascade(): CardCascadeState {
  return INITIAL_STATE;
}
