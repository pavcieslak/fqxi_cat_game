export const GAME_CONFIG = {
  serverPrefix: "/fqxi",
  levels: [
    { id: 1, mechanic: "SINGLE_GATE", label: "NORMAL" },
    { id: 2, mechanic: "SINGLE_GATE", label: "NORMAL" },
    { id: 3, mechanic: "DOUBLE_GATE", label: "HARD" },
    { id: 4, mechanic: "DOUBLE_GATE", label: "HARD" },
  ],
  timing: {
    frameMs: 16.667,
    maxFrameDeltaMs: 50,
  },
};
