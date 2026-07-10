export const GAME_STATES = {
  MENU: "MENU",
  INSTRUCTIONS: "INSTRUCTIONS",
  PLAYING: "PLAYING",
  WIN_ANIMATION: "WIN_ANIMATION",
  WON: "WON",
  GAME_OVER: "GAME_OVER",
};

const ALLOWED_TRANSITIONS = {
  [GAME_STATES.MENU]: [GAME_STATES.INSTRUCTIONS, GAME_STATES.PLAYING],
  [GAME_STATES.INSTRUCTIONS]: [GAME_STATES.MENU, GAME_STATES.PLAYING],
  [GAME_STATES.PLAYING]: [GAME_STATES.WIN_ANIMATION, GAME_STATES.GAME_OVER, GAME_STATES.MENU],
  [GAME_STATES.WIN_ANIMATION]: [GAME_STATES.WON],
  [GAME_STATES.WON]: [GAME_STATES.PLAYING, GAME_STATES.MENU],
  [GAME_STATES.GAME_OVER]: [GAME_STATES.PLAYING, GAME_STATES.MENU],
};

export class GameStateMachine {
  constructor(initialState = GAME_STATES.MENU) {
    this.currentState = initialState;
  }

  canTransition(nextState) {
    const allowed = ALLOWED_TRANSITIONS[this.currentState] || [];
    return allowed.includes(nextState);
  }

  transition(nextState) {
    if (!this.canTransition(nextState)) {
      throw new Error(`Invalid state transition: ${this.currentState} -> ${nextState}`);
    }

    this.currentState = nextState;
    return this.currentState;
  }

  getState() {
    return this.currentState;
  }
}
