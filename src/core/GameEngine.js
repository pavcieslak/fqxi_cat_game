export class GameEngine {
  constructor({ update, render, maxDeltaMs = 50 } = {}) {
    this.update = update;
    this.render = render;
    this.maxDeltaMs = maxDeltaMs;

    this.isRunning = false;
    this.lastFrameTime = 0;
    this.frameHandle = null;
  }

  start() {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.lastFrameTime = 0;
    this.frameHandle = requestAnimationFrame((timestamp) => this.tick(timestamp));
  }

  stop() {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    if (this.frameHandle !== null) {
      cancelAnimationFrame(this.frameHandle);
      this.frameHandle = null;
    }
  }

  tick(timestamp) {
    if (!this.isRunning) {
      return;
    }

    const rawDelta = this.lastFrameTime === 0 ? 16.667 : timestamp - this.lastFrameTime;
    const deltaMs = Math.min(rawDelta, this.maxDeltaMs);
    this.lastFrameTime = timestamp;

    if (typeof this.update === "function") {
      this.update(deltaMs);
    }

    if (typeof this.render === "function") {
      this.render();
    }

    this.frameHandle = requestAnimationFrame((nextTimestamp) => this.tick(nextTimestamp));
  }
}
