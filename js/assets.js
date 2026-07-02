import { SPRITE_SHEETS } from './config.js';

const images = {};

function loadImage(src, retriesLeft = 2) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      if (retriesLeft > 0) {
        setTimeout(() => loadImage(src, retriesLeft - 1).then(resolve, reject), 300);
      } else {
        reject(new Error(`Failed to load ${src}`));
      }
    };
    img.src = src;
  });
}

export async function loadAssets() {
  const entries = Object.entries(SPRITE_SHEETS);
  await Promise.all(entries.map(async ([key, src]) => {
    images[key] = await loadImage(src);
  }));
  return images;
}

export { images };
