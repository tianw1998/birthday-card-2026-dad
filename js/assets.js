import { SPRITE_SHEETS } from './config.js';

const images = {};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

// Mobile networks occasionally drop a request; retry with a short backoff
// instead of giving up after one attempt (this previously left the whole
// room permanently blank if a single sprite failed to load once).
async function loadImageWithRetry(src, maxRetries = 5, delayMs = 500) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await loadImage(src);
    } catch (err) {
      if (attempt >= maxRetries) throw err;
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}

// Mom's base sprite (LimeZu "Amelia") ships with a mid-brown/mauve palette
// that read as a dark, featureless blob at in-game size. Recolor just her
// hair and shirt to the warm tones matched from her actual photo, leaving
// the shared outline colors and skin tones untouched.
const MOM_RECOLOR_MAP = {
  '138,101,82': [61, 26, 16],   // hair -> dark reddish-brown (#3D1A10)
  '149,115,80': [77, 35, 22],   // hair highlight
  '141,112,81': [48, 20, 12],   // hair shadow
  '168,83,119': [192, 57, 43],  // shirt -> orange-red (#C0392B)
  '185,93,114': [214, 90, 70],  // shirt highlight
  '170,94,86':  [150, 40, 30],  // shirt shadow
};

function recolorMom(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] === 0) continue;
    const target = MOM_RECOLOR_MAP[`${d[i]},${d[i + 1]},${d[i + 2]}`];
    if (target) { d[i] = target[0]; d[i + 1] = target[1]; d[i + 2] = target[2]; }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export async function loadAssets() {
  const entries = Object.entries(SPRITE_SHEETS);
  const results = await Promise.allSettled(
    entries.map(([key, src]) => loadImageWithRetry(src).then(img => { images[key] = img; }))
  );
  results.forEach((r, i) => {
    if (r.status === 'rejected') console.error(`Asset failed after retries: ${entries[i][0]}`, r.reason);
  });
  if (images.momSit) images.momSit = recolorMom(images.momSit);
  return images;
}

export { images };
