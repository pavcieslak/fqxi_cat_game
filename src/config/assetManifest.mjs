const local = (path) => ({ type: "image", path: `/fqxi/${path}`, localPath: path });

export const ASSET_MANIFEST = {
  static: {
    bucket: local("assets/static/bucket.png"),
    clouds: local("assets/static/clouds2.png"),
    timerBackground: local("assets/static/timer_bg.png"),
    introBackground: local("assets/images/bg_img.png"),
    splashWin: local("assets/static/end_splash_winner.png"),
    splashLose: local("assets/static/end_splash_looser.png"),
  },
  cat: {
    idle: [
      local("assets/sequences/cat_idle/cat_idle_1.png"),
      local("assets/sequences/cat_idle/cat_idle_2.png"),
      local("assets/sequences/cat_idle/cat_idle_3.png"),
    ],
    walk: [
      local("assets/sequences/cat_walking/cat_walk_1.png"),
      local("assets/sequences/cat_walking/cat_walk_2.png"),
      local("assets/sequences/cat_walking/cat_walk_3.png"),
      local("assets/sequences/cat_walking/cat_walk_4.png"),
    ],
    zap: [
      local("assets/sequences/cat_zap/cat_zap_1.png"),
      local("assets/sequences/cat_zap/cat_zap_2.png"),
      local("assets/sequences/cat_zap/cat_zap_3.png"),
    ],
    win: [
      local("assets/sequences/cat_win/cat_dance_1.png"),
      local("assets/sequences/cat_win/cat_dance_2.png"),
      local("assets/sequences/cat_win/cat_dance_3.png"),
      local("assets/sequences/cat_win/cat_dance_4.png"),
      local("assets/sequences/cat_win/cat_dance_5.png"),
      local("assets/sequences/cat_win/cat_dance_6.png"),
      local("assets/sequences/cat_win/cat_dance_7.png"),
    ],
    hand: [
      local("assets/sequences/cat_open_gate/cat_open_gate_1.png"),
      local("assets/sequences/cat_open_gate/cat_open_gate_2.png"),
    ],
  },
  explosion: [
    local("assets/sequences/explosion/explosion1.png"),
    local("assets/sequences/explosion/explosion2.png"),
    local("assets/sequences/explosion/explosion3.png"),
    local("assets/sequences/explosion/explosion4.png"),
    local("assets/sequences/explosion/explosion5.png"),
    local("assets/sequences/explosion/explosion6.png"),
    local("assets/sequences/explosion/explosion7.png"),
    local("assets/sequences/explosion/explosion8.png"),
  ],
  particles: {
    red: local("assets/static/particle_default_red.png"),
    blue: local("assets/static/particle_default_blue.png"),
    redPositive: local("assets/static/particle_default_red_positive.png"),
    redNegative: local("assets/static/particle_default_red_negative.png"),
    bluePositive: local("assets/static/particle_default_blue_positive.png"),
    blueNegative: local("assets/static/particle_default_blue_negative.png"),
  },
};

export function flattenManifest(manifestNode = ASSET_MANIFEST) {
  if (Array.isArray(manifestNode)) {
    return manifestNode.flatMap((item) => flattenManifest(item));
  }

  if (manifestNode && typeof manifestNode === "object" && "type" in manifestNode && "path" in manifestNode) {
    return [manifestNode];
  }

  if (manifestNode && typeof manifestNode === "object") {
    return Object.values(manifestNode).flatMap((value) => flattenManifest(value));
  }

  return [];
}
