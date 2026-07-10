import { PHYSICS_CONFIG } from "../config/physicsConfig.mjs";

export class CollisionSystem {
  constructor(config = PHYSICS_CONFIG) {
    this.config = config;
  }

  applyBoundsCollision(particle) {
    const {
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      TANK_TOP_OFFSET,
      TANK_MARGIN_LEFT,
      TANK_MARGIN_RIGHT,
      TANK_BOTTOM_PADDING,
    } = this.config;

    const left = TANK_MARGIN_LEFT + 10;
    const right = CANVAS_WIDTH - TANK_MARGIN_RIGHT - 10;
    const top = TANK_TOP_OFFSET + 10;
    const bottom = CANVAS_HEIGHT - TANK_BOTTOM_PADDING - 10;

    if (particle.x - particle.radius < left) {
      particle.x = left + particle.radius;
      particle.vx *= -1;
    }

    if (particle.x + particle.radius > right) {
      particle.x = right - particle.radius;
      particle.vx *= -1;
    }

    if (particle.y - particle.radius < top) {
      particle.y = top + particle.radius;
      particle.vy *= -1;
    }

    if (particle.y + particle.radius > bottom) {
      particle.y = bottom - particle.radius;
      particle.vy *= -1;
    }
  }

  applyGateCollision(particle, context) {
    const { gateCenterX, gateWidth, openingTop, openingBottom, leftGateOpen, rightGateOpen, doubleGate } = context;
    const halfWidth = gateWidth / 2;
    const thickness = this.config.GATE_THICKNESS / 2;

    const leftWallX = gateCenterX - halfWidth;
    const rightWallX = gateCenterX + halfWidth;

    const collidesLeft = Math.abs(particle.x - leftWallX) < particle.radius + thickness;
    if (collidesLeft) {
      const inDoorOpening = particle.y >= openingTop && particle.y <= openingBottom;
      const shouldBlock = !inDoorOpening || !leftGateOpen;
      if (shouldBlock) {
        particle.x = particle.x < leftWallX ? leftWallX - (particle.radius + thickness) : leftWallX + (particle.radius + thickness);
        particle.vx *= -1;
      }
    }

    if (doubleGate) {
      const collidesRight = Math.abs(particle.x - rightWallX) < particle.radius + thickness;
      if (collidesRight) {
        const inDoorOpening = particle.y >= openingTop && particle.y <= openingBottom;
        const shouldBlock = !inDoorOpening || !rightGateOpen;
        if (shouldBlock) {
          particle.x = particle.x < rightWallX ? rightWallX - (particle.radius + thickness) : rightWallX + (particle.radius + thickness);
          particle.vx *= -1;
        }
      }
    }
  }
}
