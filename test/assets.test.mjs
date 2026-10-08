import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { flattenManifest } from "../src/config/assetManifest.mjs";
import { getPngDimensions } from "../scripts/lib/png.mjs";

test("all local PNG assets in the manifest exist and have usable dimensions", async () => {
  const assets = flattenManifest().filter((asset) => asset.localPath?.toLowerCase().endsWith(".png"));

  assert.ok(assets.length > 0, "expected local PNG assets in the manifest");

  for (const asset of assets) {
    const image = await readFile(asset.localPath);
    const { width, height } = getPngDimensions(image);
    assert.ok(width > 1 && height > 1, `${asset.localPath} is only ${width}x${height}`);
  }
});
