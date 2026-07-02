import { SPRITE_SHEETS } from './config.js';

const images = {};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function loadAssets() {
  const entries = Object.entries(SPRITE_SHEETS);
  const loaded = await Promise.all(entries.map(([, src]) => loadImage(src)));
  entries.forEach(([key], i) => { images[key] = loaded[i]; });
  return images;
}

export { images };
