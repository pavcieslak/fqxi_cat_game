import assert from "node:assert/strict";
import test from "node:test";
import { GAME_STATES, GameStateMachine } from "../src/core/GameStateMachine.js";

test("supports the menu, briefing, gameplay, win-animation, and outcome flow", () => {
  const state = new GameStateMachine();

  assert.equal(state.getState(), GAME_STATES.MENU);
  assert.equal(state.transition(GAME_STATES.INSTRUCTIONS), GAME_STATES.INSTRUCTIONS);
  assert.equal(state.transition(GAME_STATES.PLAYING), GAME_STATES.PLAYING);
  assert.equal(state.transition(GAME_STATES.WIN_ANIMATION), GAME_STATES.WIN_ANIMATION);
  assert.equal(state.transition(GAME_STATES.WON), GAME_STATES.WON);
  assert.equal(state.transition(GAME_STATES.MENU), GAME_STATES.MENU);
});

test("supports losing and retrying a level", () => {
  const state = new GameStateMachine(GAME_STATES.PLAYING);

  assert.equal(state.transition(GAME_STATES.GAME_OVER), GAME_STATES.GAME_OVER);
  assert.equal(state.transition(GAME_STATES.PLAYING), GAME_STATES.PLAYING);
});

test("rejects invalid transitions without changing the current state", () => {
  const state = new GameStateMachine();

  assert.throws(() => state.transition(GAME_STATES.WON), /Invalid state transition/);
  assert.equal(state.getState(), GAME_STATES.MENU);
});
