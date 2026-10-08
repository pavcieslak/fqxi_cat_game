import assert from "node:assert/strict";
import test from "node:test";
import { GameplaySystem } from "../src/systems/GameplaySystem.mjs";

function createRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

test("initializes the configured particle count for each level", () => {
  const expectedParticleCounts = [10, 14, 12, 16];
  const game = new GameplaySystem({ random: createRandom(42) });

  expectedParticleCounts.forEach((count, index) => {
    const snapshot = game.reset(index + 1);
    assert.equal(snapshot.particleCount, count);
    assert.equal(snapshot.status, "PLAYING");
  });
});

test("produces repeatable initial states for the same random seed", () => {
  const first = new GameplaySystem({ random: createRandom(42) }).reset(3);
  const second = new GameplaySystem({ random: createRandom(42) }).reset(3);

  assert.deepEqual(first.particles, second.particles);
});

test("decrements the timer and ends the game when time expires", () => {
  const game = new GameplaySystem({ random: createRandom(42) });
  game.reset(1);

  const active = game.step(1000);
  assert.equal(active.status, "PLAYING");
  assert.equal(active.timeRemaining, 179);

  const expired = game.step(180000);
  assert.equal(expired.status, "GAME_OVER");
  assert.equal(expired.timeRemaining, 0);
});

test("rejects unknown levels", () => {
  const game = new GameplaySystem();

  assert.throws(() => game.reset(99), /Unknown level/);
});
