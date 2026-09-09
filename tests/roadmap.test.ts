import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  STAGES,
  STATUS_LABEL,
  hasShippedGame,
  honestyCopy,
} from "../lib/roadmap.ts";

describe("game collection roadmap honesty", () => {
  it("marks the first playable game shipped only after a real ship", () => {
    assert.equal(hasShippedGame(), true);
    const playable = STAGES.find((s) => /playable game/i.test(s.label));
    assert.ok(playable);
    assert.equal(playable?.status, "done");
  });

  it("exposes honest status labels", () => {
    assert.equal(STATUS_LABEL.done, "SHIPPED");
    assert.equal(STATUS_LABEL.planned, "PLANNED");
    assert.match(honestyCopy(), /Twelve games are live/i);
  });
});
