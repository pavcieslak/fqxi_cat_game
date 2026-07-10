import { existsSync } from "node:fs";
import { ASSET_MANIFEST, flattenManifest } from "../src/config/assetManifest.mjs";

const assets = flattenManifest(ASSET_MANIFEST);
const missing = [];

for (const asset of assets) {
  if (!asset.localPath) {
    continue;
  }

  if (!existsSync(asset.localPath)) {
    missing.push(asset.localPath);
  }
}

if (missing.length > 0) {
  console.error("Missing assets:");
  for (const path of missing) {
    console.error(`- ${path}`);
  }
  process.exit(1);
}

console.log(`Asset manifest validated: ${assets.length} assets checked.`);
