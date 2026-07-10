import { getLevel } from "../config/levels.mjs";
import { PHYSICS_CONFIG, PARTICLE_RULES } from "../config/physicsConfig.mjs";
import { CollisionSystem } from "./CollisionSystem.mjs";

export const PARTICLE_TYPE = {
  RED: "RED",
  BLUE: "BLUE",
};

export class GameplaySystem {
  constructor({ config = PHYSICS_CONFIG, random = Math.random } = {}) {
    this.config = config;
    this.random = random;
    this.collisionSystem = new CollisionSystem(config);

    this.level = null;
    this.particles = [];
    this.wallOffset = 0;
    this.wallVelocity = 0;
    this.timeRemaining = config.GAME_DURATION;
    this.status = "PLAYING";
    this.gates = { leftOpen: false, rightOpen: false };
  }

  reset(levelId) {
    this.level = getLevel(levelId);
    this.status = "PLAYING";
    this.wallOffset = 0;
    this.wallVelocity = 0;
    this.timeRemaining = this.config.GAME_DURATION;
    this.gates = { leftOpen: false, rightOpen: false };

    this.particles = this.createParticles(this.level);
    return this.getSnapshot();
  }

  setGateState(nextState) {
    this.gates = {
      leftOpen: Boolean(nextState.leftOpen),
      rightOpen: Boolean(nextState.rightOpen),
    };
  }

  step(deltaMs) {
    if (this.status !== "PLAYING" || !this.level) {
      return this.getSnapshot();
    }

    this.timeRemaining = Math.max(0, this.timeRemaining - deltaMs / 1000);
    if (this.timeRemaining === 0) {
      this.status = "GAME_OVER";
      return this.getSnapshot();
    }

    const dt = Math.min(deltaMs, 50) / 16.667;
    const gateWidth = this.level.mechanics === "DOUBLE_GATE" ? this.config.GATE_WIDTH_L2 : this.config.GATE_WIDTH_L1;

    const centerX = this.getGateCenterX();
    const tankHeight = this.config.CANVAS_HEIGHT - this.config.TANK_TOP_OFFSET - this.config.TANK_BOTTOM_PADDING;
    const openingHeight = this.config.CANVAS_HEIGHT * this.config.DOOR_HEIGHT_RATIO;
    const openingCenterY = this.config.TANK_TOP_OFFSET + tankHeight / 2;

    const openingTop = openingCenterY - openingHeight / 2;
    const openingBottom = openingCenterY + openingHeight / 2;

    for (const particle of this.particles) {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;

      this.collisionSystem.applyBoundsCollision(particle);
      this.collisionSystem.applyGateCollision(particle, {
        gateCenterX: centerX,
        gateWidth,
        openingTop,
        openingBottom,
        leftGateOpen: this.gates.leftOpen,
        rightGateOpen: this.gates.rightOpen,
        doubleGate: this.level.mechanics === "DOUBLE_GATE",
      });
    }

    this.updateWallOffset();
    this.evaluateWinLose();

    return this.getSnapshot();
  }

  evaluateWinLose() {
    const gateX = this.getGateCenterX();

    let redTotal = 0;
    let redLeft = 0;
    let blueLeft = 0;

    for (const particle of this.particles) {
      if (particle.type === PARTICLE_TYPE.RED) {
        redTotal += 1;
        if (particle.x < gateX) {
          redLeft += 1;
        }
      } else if (particle.x < gateX) {
        blueLeft += 1;
      }
    }

    if (redTotal > 0 && redLeft === redTotal && blueLeft === 0 && this.wallOffset > this.config.WIN_THRESHOLD) {
      this.status = "WIN";
    }

    if (redTotal === 0 || this.countBlueParticles() > redTotal) {
      this.status = "GAME_OVER";
    }
  }

  countBlueParticles() {
    let total = 0;
    for (const particle of this.particles) {
      if (particle.type === PARTICLE_TYPE.BLUE) {
        total += 1;
      }
    }
    return total;
  }

  updateWallOffset() {
    const redRatio = this.getRedLeftRatio();
    const score = (redRatio - 0.5) * 2;
    this.wallVelocity = score * (this.config.WALL_RANGE + 50);
    this.wallOffset += (this.wallVelocity - this.wallOffset) * this.config.WALL_DAMPING;
  }

  getRedLeftRatio() {
    const gateX = this.getGateCenterX();
    let redTotal = 0;
    let redLeft = 0;

    for (const particle of this.particles) {
      if (particle.type !== PARTICLE_TYPE.RED) {
        continue;
      }

      redTotal += 1;
      if (particle.x < gateX) {
        redLeft += 1;
      }
    }

    return redTotal === 0 ? 0 : redLeft / redTotal;
  }

  getGateCenterX() {
    const tankWidth = this.config.CANVAS_WIDTH - this.config.TANK_MARGIN_LEFT - this.config.TANK_MARGIN_RIGHT;
    return this.config.TANK_MARGIN_LEFT + tankWidth / 2 + this.wallOffset;
  }

  createParticles(level) {
    const rule = PARTICLE_RULES[level.mechanics];
    const particles = [];

    const redCount = Math.ceil(level.particleCount / 2);
    const blueCount = level.particleCount - redCount;

    const composition = [];
    let left = 0;
    let right = 0;

    for (let i = 0; i < redCount; i += 1) {
      if (left <= right) {
        composition.push({ type: PARTICLE_TYPE.RED, side: "LEFT" });
        left += 1;
      } else {
        composition.push({ type: PARTICLE_TYPE.RED, side: "RIGHT" });
        right += 1;
      }
    }

    for (let i = 0; i < blueCount; i += 1) {
      if (left <= right) {
        composition.push({ type: PARTICLE_TYPE.BLUE, side: "LEFT" });
        left += 1;
      } else {
        composition.push({ type: PARTICLE_TYPE.BLUE, side: "RIGHT" });
        right += 1;
      }
    }

    const tankWidth = this.config.CANVAS_WIDTH - this.config.TANK_MARGIN_LEFT - this.config.TANK_MARGIN_RIGHT;
    const leftEdge = this.config.TANK_MARGIN_LEFT;
    const rightEdge = this.config.CANVAS_WIDTH - this.config.TANK_MARGIN_RIGHT;
    const centerX = leftEdge + tankWidth / 2;

    for (const [index, item] of composition.entries()) {
      const lanePadding = level.mechanics === "SINGLE_GATE" ? 100 : 250;
      const sidePadding = 20;

      let minX;
      let maxX;
      if (item.side === "LEFT") {
        minX = leftEdge + sidePadding + rule.radius;
        maxX = centerX - lanePadding - rule.radius;
      } else {
        minX = centerX + lanePadding + rule.radius;
        maxX = rightEdge - sidePadding - rule.radius;
      }

      if (minX > maxX) {
        minX = leftEdge + sidePadding + rule.radius;
        maxX = rightEdge - sidePadding - rule.radius;
      }

      const minY = this.config.TANK_TOP_OFFSET + rule.radius + 20;
      const maxY = this.config.CANVAS_HEIGHT - this.config.TANK_BOTTOM_PADDING - rule.radius - 20;
      const angle = this.random() * Math.PI * 2;
      const speed = item.type === PARTICLE_TYPE.RED ? rule.speedRed : rule.speedBlue;

      particles.push({
        id: index,
        type: item.type,
        radius: rule.radius,
        x: this.randomBetween(minX, maxX),
        y: this.randomBetween(minY, maxY),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      });
    }

    return particles;
  }

  randomBetween(min, max) {
    return this.random() * (max - min) + min;
  }

  getSnapshot() {
    return {
      status: this.status,
      levelId: this.level?.id ?? null,
      wallOffset: this.wallOffset,
      timeRemaining: this.timeRemaining,
      particleCount: this.particles.length,
      particles: this.particles,
    };
  }
}
