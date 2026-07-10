# Modular Migration Plan

This repository currently runs from a generated bundle in app.js.

## Goal
Move gameplay and rendering logic into maintainable source modules under src/ while keeping behavior parity.

## Current status
- Added modular core primitives:
  - Event bus
  - State machine
  - Animation frame engine loop
  - Asset manager and centralized manifest
- Added asset validator script to detect missing file regressions.
- Extracted gameplay configuration and systems:
  - Levels config
  - Physics config
  - Collision system
  - Gameplay system with deterministic verification script

## Next migration steps
1. Build rendering adapters (SVG and UI) in dedicated modules.
2. Connect extracted gameplay system to the new rendering layer.
3. Replace direct index.html bundle reference with a build output generated from src/.
4. Keep app.js as fallback until parity is validated.
