import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import test from "node:test";

const levelAccessScript = await readFile(new URL("../level-access.js", import.meta.url), "utf8");
const indexHtml = await readFile(new URL("../index.html", import.meta.url), "utf8");

function runLevelAccess(unlockAllLevels, entries = {}) {
  const values = new Map(Object.entries(entries));
  const localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };

  runInNewContext(levelAccessScript, {
    document: { currentScript: { dataset: { unlockAllLevels: String(unlockAllLevels) } } },
    localStorage,
  });

  return values;
}

test("unlocks every level without changing the player's saved progress", () => {
  const originalProgress = JSON.stringify([1]);
  const values = runLevelAccess(true, { "maxwell-cat-completed-levels": originalProgress });

  assert.equal(values.get("maxwell-cat-completed-levels"), JSON.stringify([1, 2, 3]));
  assert.equal(values.get("maxwell-cat-dev-original-levels"), originalProgress);
});

test("disabling the override restores the player's saved progress", () => {
  const values = runLevelAccess(true, { "maxwell-cat-completed-levels": JSON.stringify([1]) });
  runInNewContext(levelAccessScript, {
    document: { currentScript: { dataset: { unlockAllLevels: "false" } } },
    localStorage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, String(value)),
      removeItem: (key) => values.delete(key),
    },
  });

  assert.equal(values.get("maxwell-cat-completed-levels"), JSON.stringify([1]));
  assert.equal(values.has("maxwell-cat-dev-original-levels"), false);
  assert.equal(values.has("maxwell-cat-dev-has-original-levels"), false);
});

test("disabling the override restores an empty progress state", () => {
  const values = runLevelAccess(true);
  runInNewContext(levelAccessScript, {
    document: { currentScript: { dataset: { unlockAllLevels: "false" } } },
    localStorage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, String(value)),
      removeItem: (key) => values.delete(key),
    },
  });

  assert.equal(values.has("maxwell-cat-completed-levels"), false);
});

test("the level-access setting runs before the bundled game", () => {
  const accessScriptIndex = indexHtml.indexOf('src="/fqxi/level-access.js"');
  const gameScriptIndex = indexHtml.indexOf('src="/fqxi/app.js"');

  assert.notEqual(accessScriptIndex, -1);
  assert.ok(accessScriptIndex < gameScriptIndex);
  assert.match(indexHtml, /data-unlock-all-levels="true"/);
});
