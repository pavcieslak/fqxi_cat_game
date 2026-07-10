export const LEVELS = {
  1: { id: 1, particleCount: 10, mechanics: "SINGLE_GATE", label: "NORMAL" },
  2: { id: 2, particleCount: 14, mechanics: "SINGLE_GATE", label: "NORMAL" },
  3: { id: 3, particleCount: 12, mechanics: "DOUBLE_GATE", label: "HARD" },
  4: { id: 4, particleCount: 16, mechanics: "DOUBLE_GATE", label: "HARD" },
};

export function getLevel(levelId) {
  const level = LEVELS[levelId];
  if (!level) {
    throw new Error(`Unknown level: ${levelId}`);
  }
  return level;
}

export function listLevels() {
  return Object.values(LEVELS);
}
