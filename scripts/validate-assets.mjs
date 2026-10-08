import { existsSync } from "node:fs";
import { ASSET_MANIFEST, flattenManifest } from "../src/config/assetManifest.mjs";
import { readFile } from "node:fs/promises";
import { getPngDimensions } from "./lib/png.mjs";

const assets = flattenManifest(ASSET_MANIFEST);
const missing = [];
const invalid = [];

for (const asset of assets) {
  if (!asset.localPath) {
    continue;
  }

  if (!existsSync(asset.localPath)) {
    missing.push(asset.localPath);
    continue;
  }

  if (asset.localPath.toLowerCase().endsWith(".png")) {
    try {
      const dimensions = getPngDimensions(await readFile(asset.localPath));
      if (dimensions.width <= 1 || dimensions.height <= 1) {
        invalid.push(`${asset.localPath} (${dimensions.width}x${dimensions.height})`);
      }
    } catch (error) {
      invalid.push(`${asset.localPath} (${error.message})`);
    }
  }
}

if (missing.length > 0 || invalid.length > 0) {
  if (missing.length > 0) {
    console.error("Missing assets:");
  }
  for (const path of missing) {
    console.error(`- ${path}`);
  }
  if (invalid.length > 0) {
    console.error("Invalid or placeholder images:");
  }
  for (const path of invalid) {
    console.error(`- ${path}`);
  }
  process.exit(1);
}

console.log(`Asset manifest validated: ${assets.length} assets checked.`);
