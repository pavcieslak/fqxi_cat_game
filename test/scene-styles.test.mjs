import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const SCENE_SELECTORS = [
  ".scene-background",
  ".scene-clouds",
  ".clock-timer",
  ".clock-number",
  ".game-hud",
  ".hud-column",
  ".hud-center-column",
  ".level-indicator",
];

test("index.html loads the scene stylesheet after the global stylesheet", async () => {
  const html = await readFile("index.html", "utf8");
  const global = html.indexOf('href="/fqxi/index.css"');
  const scene = html.indexOf('href="/fqxi/styles/game-scene.css"');

  assert.ok(global >= 0 && scene > global);
});

test("scene rules live only in game-scene.css", async () => {
  const globalCss = await readFile("index.css", "utf8");
  const sceneCss = await readFile("styles/game-scene.css", "utf8");

  for (const selector of SCENE_SELECTORS) {
    assert.ok(sceneCss.includes(`${selector} {`), `${selector} missing from game-scene.css`);
    assert.ok(!globalCss.includes(`${selector}{`), `${selector} is duplicated in index.css`);
  }
  assert.ok(!globalCss.includes("--clock-"), "clock variables should only be defined in game-scene.css");
});

test("sky background no longer starts with an opaque white stop and uses the local image", async () => {
  const sceneCss = await readFile("styles/game-scene.css", "utf8");

  assert.match(sceneCss, /--scene-sky-top:\s*rgba\([^)]*,\s*0\)/);
  assert.ok(sceneCss.includes("url(/fqxi/assets/images/bg_img.png)"));
  assert.ok(!sceneCss.includes("lucmedia.co.uk"));
});

test("all custom tooltips are hidden in favor of native button tooltips", async () => {
  const html = await readFile("index.html", "utf8");
  const sceneCss = await readFile("styles/game-scene.css", "utf8");
  const tooltipScript = await readFile("tooltip-unifier.js", "utf8");

  assert.match(sceneCss, /\.hud-tooltip,\s*\.control-tooltip\s*\{\s*display:\s*none;\s*\}/);
  assert.match(tooltipScript, /button\.title = label/);
  assert.match(tooltipScript, /"\.hud-tooltip-wrapper, \.control-tooltip-wrapper"/);
  assert.ok(html.includes('src="/fqxi/tooltip-unifier.js"'));
});

test("the zap button receives a native tooltip without relying on app.js edits", async () => {
  const html = await readFile("index.html", "utf8");
  const tooltipScript = await readFile("tooltip-unifier.js", "utf8");

  assert.match(tooltipScript, /querySelectorAll\?\.\("\.btn-zap"\)/);
  assert.match(tooltipScript, /button\.title = "Hold to Zap"/);
  assert.ok(html.includes('src="/fqxi/tooltip-unifier.js"'));
});
