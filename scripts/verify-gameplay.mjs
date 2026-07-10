import { GameplaySystem } from "../src/systems/GameplaySystem.mjs";

function createDeterministicRandom(seed = 12345) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

const game = new GameplaySystem({ random: createDeterministicRandom(42) });

const snapshot = game.reset(1);
if (snapshot.particleCount !== 10) {
  throw new Error(`Expected 10 particles for level 1, got ${snapshot.particleCount}`);
}

for (let i = 0; i < 300; i += 1) {
  game.step(16.667);
}

const after = game.getSnapshot();
if (after.timeRemaining <= 0) {
  throw new Error("Gameplay simulation exhausted timer too quickly");
}

console.log("Gameplay system verification passed.");
