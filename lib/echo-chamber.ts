export type RoomId = "foyer" | "archive" | "chapel" | "basement" | "attic" | "studio";
export type EvidenceType = "voice" | "air" | "reflection";
export type EchoPhase = "investigating" | "won" | "lost";

export type RoomDefinition = {
  id: RoomId;
  name: string;
  symbol: string;
  description: string;
  connections: readonly RoomId[];
};

export type EvidenceOption = {
  id: EvidenceType;
  label: string;
  detail: string;
};

export type EvidenceRecord = {
  roomId: RoomId;
  kind: EvidenceType;
  text: string;
  decisive: boolean;
};

export type EchoState = {
  phase: EchoPhase;
  currentRoom: RoomId;
  sanity: number;
  visited: readonly RoomId[];
  evidence: readonly EvidenceRecord[];
  lastObservation: EvidenceRecord | null;
  selectedRoom: RoomId | null;
  message: string;
};

export const SANITY_START = 7;
export const ORIGIN_ROOM: RoomId = "attic";

export const ECHO_ROOMS: readonly RoomDefinition[] = [
  {
    id: "foyer",
    name: "Foyer",
    symbol: "◇",
    description: "The front door hangs open. There is no street outside.",
    connections: ["archive", "chapel"],
  },
  {
    id: "archive",
    name: "Archive",
    symbol: "▤",
    description: "Dusty shelves lean toward a recorder playing nothing.",
    connections: ["foyer", "attic"],
  },
  {
    id: "chapel",
    name: "Chapel",
    symbol: "†",
    description: "Wax stubs surround a chair facing the wrong way.",
    connections: ["foyer", "basement"],
  },
  {
    id: "basement",
    name: "Basement",
    symbol: "▽",
    description: "Pipes run into the floor and return as a soft knock.",
    connections: ["chapel", "studio"],
  },
  {
    id: "attic",
    name: "Attic",
    symbol: "⌂",
    description: "A locked window faces a sky with no moon.",
    connections: ["archive", "studio"],
  },
  {
    id: "studio",
    name: "Studio",
    symbol: "◉",
    description: "An old microphone points at an empty stool.",
    connections: ["basement", "attic"],
  },
];

export const EVIDENCE_OPTIONS: readonly EvidenceOption[] = [
  {
    id: "voice",
    label: "Listen to the room",
    detail: "Compare the timing of your voice and the echo.",
  },
  {
    id: "air",
    label: "Feel the air",
    detail: "Track where the cold moves when you move.",
  },
  {
    id: "reflection",
    label: "Watch the reflection",
    detail: "Check whether the room copies you honestly.",
  },
];

const EVIDENCE_TEXT: Record<RoomId, Record<EvidenceType, string>> = {
  foyer: {
    voice: "Your words return a half-second late.",
    air: "The air is still. Even the dust refuses to move.",
    reflection: "The glass mirrors your face exactly.",
  },
  archive: {
    voice: "Paper repeats your breath a beat late.",
    air: "Cold gathers between the shelves.",
    reflection: "The glass is cloudy, but honest.",
  },
  chapel: {
    voice: "The hymn follows your footsteps from the next aisle.",
    air: "Warm wax melts beside your hand.",
    reflection: "The painted eyes do not blink.",
  },
  basement: {
    voice: "A tap answers from somewhere below.",
    air: "Water chills your knuckles.",
    reflection: "The puddle keeps the ceiling in view.",
  },
  attic: {
    voice: "Your answer comes back before you finish speaking.",
    air: "The cold moves when you do.",
    reflection: "The mirror shows your mouth closed while you hear yourself.",
  },
  studio: {
    voice: "The microphone plays your last recording.",
    air: "The lamps leave the room warm.",
    reflection: "The mirror trails one blink behind.",
  },
};

export const INITIAL_STATE: EchoState = {
  phase: "investigating",
  currentRoom: "foyer",
  sanity: SANITY_START,
  visited: ["foyer"],
  evidence: [],
  lastObservation: null,
  selectedRoom: null,
  message: "The recorder clicks on. Find where the echo begins.",
};

export function getRoom(roomId: RoomId): RoomDefinition {
  return ECHO_ROOMS.find((room) => room.id === roomId) ?? ECHO_ROOMS[0];
}

function hasEvidence(state: EchoState, kind: EvidenceType): boolean {
  return state.evidence.some(
    (record) => record.roomId === state.currentRoom && record.kind === kind,
  );
}

export function moveToRoom(state: EchoState, roomId: RoomId): EchoState {
  if (state.phase !== "investigating" || roomId === state.currentRoom) {
    return state;
  }

  const currentRoom = getRoom(state.currentRoom);
  if (!currentRoom.connections.includes(roomId)) {
    return state;
  }

  const visited = state.visited.includes(roomId)
    ? state.visited
    : [...state.visited, roomId];

  return {
    ...state,
    currentRoom: roomId,
    visited,
    selectedRoom: null,
    lastObservation: null,
    message: `You enter the ${getRoom(roomId).name.toLowerCase()}. The house listens back.`,
  };
}

export function investigate(state: EchoState, kind: EvidenceType): EchoState {
  if (state.phase !== "investigating" || state.sanity <= 0 || hasEvidence(state, kind)) {
    return state;
  }

  const record: EvidenceRecord = {
    roomId: state.currentRoom,
    kind,
    text: EVIDENCE_TEXT[state.currentRoom][kind],
    decisive: state.currentRoom === ORIGIN_ROOM,
  };
  const sanity = state.sanity - 1;

  return {
    ...state,
    sanity,
    evidence: [...state.evidence, record],
    lastObservation: record,
    message:
      sanity === 0
        ? "Your sanity is gone. Mark a room and name the source."
        : record.decisive
          ? "The recorder runs backward. This clue is impossible."
          : "The signal is faint, but the pattern is real.",
  };
}

export function selectRoom(state: EchoState, roomId: RoomId): EchoState {
  if (state.phase !== "investigating" || !state.visited.includes(roomId)) {
    return state;
  }

  return {
    ...state,
    selectedRoom: roomId,
    message: `You mark the ${getRoom(roomId).name.toLowerCase()} as the source.`,
  };
}

export function nameSource(state: EchoState): EchoState {
  if (state.phase !== "investigating" || !state.selectedRoom) {
    return state;
  }

  const won = state.selectedRoom === ORIGIN_ROOM;

  return {
    ...state,
    phase: won ? "won" : "lost",
    message: won
      ? "The attic exhales. The echo had been waiting above you."
      : `The ${getRoom(state.selectedRoom).name.toLowerCase()} goes silent. You named the wrong room.`,
  };
}

export function resetEchoChamber(): EchoState {
  return INITIAL_STATE;
}
