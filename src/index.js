import { EventBus } from "./core/EventBus.js";
import { GameEngine } from "./core/GameEngine.js";
import { GameStateMachine, GAME_STATES } from "./core/GameStateMachine.js";
import { AssetManager } from "./systems/AssetManager.js";
import { GameplaySystem } from "./systems/GameplaySystem.mjs";
import { ASSET_MANIFEST, flattenManifest } from "./config/assetManifest.mjs";
import { listLevels } from "./config/levels.mjs";

// This bootstrap is intentionally side-effect free for now.
export function createModularRuntime() {
  const events = new EventBus();
  const state = new GameStateMachine(GAME_STATES.MENU);
  const assets = new AssetManager(ASSET_MANIFEST);
  const engine = new GameEngine();
  const gameplay = new GameplaySystem();

  return {
    events,
    state,
    assets,
    engine,
    gameplay,
    levels: listLevels(),
    preloadAssets: () => assets.preloadImages(flattenManifest()),
  };
}
