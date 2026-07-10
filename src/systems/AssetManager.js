export class AssetManager {
  constructor(manifest) {
    this.manifest = manifest;
    this.loadedImages = new Map();
  }

  async preloadImages(assetList) {
    const imageAssets = assetList.filter((asset) => asset.type === "image");
    await Promise.all(imageAssets.map((asset) => this.loadImage(asset.path)));
  }

  loadImage(path) {
    if (this.loadedImages.has(path)) {
      return Promise.resolve(this.loadedImages.get(path));
    }

    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        this.loadedImages.set(path, image);
        resolve(image);
      };
      image.onerror = () => {
        reject(new Error(`Could not load image: ${path}`));
      };
      image.src = path;
    });
  }

  getImage(path) {
    return this.loadedImages.get(path);
  }
}
