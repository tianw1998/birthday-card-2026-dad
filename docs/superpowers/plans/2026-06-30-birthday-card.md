# Birthday Card 2026 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Peeps-style pixel art interactive birthday card for Dad — a mobile browser game where Dad walks around a living room to collect birthday messages from Mom, Brother, and Little Brother.

**Architecture:** Single-page vanilla JS (ES6 modules, no build tool). Canvas 2D renders the game world (floor, furniture, characters, chat bubbles). HTML overlays handle UI (opening screen, dialog windows, joystick). All game state lives in `js/state.js`. Entry point: `js/main.js` runs a `requestAnimationFrame` loop.

**Tech Stack:** HTML5 Canvas, ES6 modules via `<script type="module">`, CSS custom properties, GitHub Pages (static hosting)

**Visual approach:** All furniture and characters drawn programmatically with Canvas API in a Peeps-inspired pixel art style. Floor: white marble with faint grid. Walls: white. Wood furniture: brown ~#8B6343. Rattan chair: ~#C4A882. Characters: simple 16×24 px pixel figures, each with distinctive hair/clothes color referencing the family photo headshots.

**Screen layout:** Phone portrait. Upper 65% = Canvas game area. Lower 35% = dark wood panel with title + floating joystick. Icons top-right: 🔊 audio toggle, 🔄 restart.

---

## File Map

| File | Responsibility |
|------|---------------|
| `index.html` | HTML skeleton, overlay divs, script entry |
| `style.css` | Layout (65/35 split), dialog CSS, joystick CSS, animations |
| `js/config.js` | All constants: tile size, collision map, NPC defs, messages |
| `js/state.js` | Mutable game state: player pos, NPC read flags, game phase |
| `js/renderer.js` | Canvas draw calls: floor, walls, furniture, characters, chat bubbles |
| `js/player.js` | Player movement logic + collision detection |
| `js/joystick.js` | Touch joystick — outputs direction vector |
| `js/npc.js` | NPC proximity checks, chat bubble visibility |
| `js/dialog.js` | Dialog window show/hide, end-game flow |
| `js/audio.js` | BGM load, play/pause, toggle |
| `js/confetti.js` | Canvas confetti particle animation |
| `js/main.js` | Game loop, wires all modules together |
| `assets/bgm.mp3` | CC0 piano BGM (downloaded in Task 1) |

---

## Task 1: Download BGM + Project scaffold

**Files:**
- Create: `index.html`
- Create: `style.css`
- Create: `js/config.js`, `js/state.js`, `js/renderer.js`, `js/player.js`, `js/joystick.js`, `js/npc.js`, `js/dialog.js`, `js/audio.js`, `js/confetti.js`, `js/main.js`
- Create: `assets/` (empty folder)

- [ ] **Step 1: Download CC0 piano BGM**

  Visit https://pixabay.com/music/search/piano%20gentle/ and download any warm piano loop (mp3, ~1-3 min). Save to `assets/bgm.mp3`.

  Alternative if Pixabay is unavailable: https://freepd.com/piano.php — pick any gentle piano track.

- [ ] **Step 2: Create folder structure**

```
birthday-card-2026-dad/
├── index.html
├── style.css
├── js/
│   ├── config.js
│   ├── state.js
│   ├── renderer.js
│   ├── player.js
│   ├── joystick.js
│   ├── npc.js
│   ├── dialog.js
│   ├── audio.js
│   ├── confetti.js
│   └── main.js
└── assets/
    └── bgm.mp3
```

- [ ] **Step 3: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>給爸爸的生日卡片</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- Opening screen overlay -->
  <div id="opening-overlay" class="overlay">
    <div class="opening-card">
      <div class="opening-text">您已收到一份祝福🎉</div>
      <button id="btn-start" class="btn-primary">查收</button>
    </div>
  </div>

  <!-- Dialog window overlay -->
  <div id="dialog-overlay" class="overlay hidden">
    <div class="dialog-card">
      <div id="dialog-title" class="dialog-title"></div>
      <div id="dialog-body" class="dialog-body"></div>
      <div class="dialog-actions">
        <button id="btn-accept" class="btn-primary">接收</button>
        <button id="btn-close" class="btn-secondary">關閉</button>
      </div>
    </div>
  </div>

  <!-- End-game overlay -->
  <div id="endgame-overlay" class="overlay hidden">
    <div class="dialog-card">
      <div class="dialog-title">🎂 你已收到全家人的祝福！</div>
      <div class="dialog-actions">
        <button id="btn-again" class="btn-primary">再接收一次祝福</button>
        <button id="btn-done" class="btn-secondary">完美收下</button>
      </div>
    </div>
  </div>

  <!-- Game area -->
  <div id="game-wrap">
    <div id="canvas-area">
      <canvas id="game-canvas"></canvas>
      <canvas id="confetti-canvas"></canvas>
      <!-- Top-right controls -->
      <div id="top-controls">
        <button id="btn-audio" class="icon-btn">🔊</button>
        <button id="btn-restart" class="icon-btn hidden" id="btn-restart">🔄</button>
      </div>
      <!-- Attribution -->
      <div id="attribution">Inspired by LimeZu</div>
    </div>

    <!-- Bottom panel -->
    <div id="bottom-panel">
      <div id="bottom-title">🎂 給爸爸的生日卡片</div>
      <div id="joystick-area">
        <div id="joystick-base">
          <div id="joystick-thumb"></div>
        </div>
      </div>
    </div>
  </div>

  <script type="module" src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Stub all JS files** (each exports its public API, no logic yet)

`js/config.js`:
```js
export const TILE = 32;
export const COLS = 15;
export const ROWS = 10;
```

`js/state.js`:
```js
export const state = {
  phase: 'opening', // 'opening' | 'playing' | 'ended'
  player: { x: 7 * 32, y: 5 * 32 }, // pixel coords
  joystick: { dx: 0, dy: 0 },
  npcs: {
    mom:     { read: false },
    brother: { read: false },
    me:      { read: false },
  },
  activeNpc: null,
  audioOn: true,
};
```

`js/main.js`:
```js
import { state } from './state.js';

function loop() {
  requestAnimationFrame(loop);
}

window.addEventListener('DOMContentLoaded', () => {
  loop();
});
```

All other JS files: create as empty module files (`export {}`).

- [ ] **Step 5: Open `index.html` in mobile browser (or DevTools mobile emulation) and verify the page loads without errors**

  Expected: white page, opening overlay visible with "您已收到一份祝福🎉" and [查收] button.

---

## Task 2: Layout & CSS

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Write full `style.css`**

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: #1a1a1a;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100dvh;
  overflow: hidden;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

#game-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100dvh;
  max-width: 430px;
}

#canvas-area {
  position: relative;
  flex: 0 0 65%;
  background: #f5f5f0;
  overflow: hidden;
}

#game-canvas,
#confetti-canvas {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
}

#confetti-canvas {
  pointer-events: none;
  z-index: 10;
}

#top-controls {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 8px;
  z-index: 20;
}

.icon-btn {
  background: rgba(255,255,255,0.75);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

#attribution {
  position: absolute;
  bottom: 4px;
  left: 6px;
  font-size: 9px;
  color: rgba(0,0,0,0.3);
  pointer-events: none;
  z-index: 5;
}

#bottom-panel {
  flex: 0 0 35%;
  background: #5c3d1e;
  background-image: repeating-linear-gradient(
    90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 20px
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 12px;
}

#bottom-title {
  color: #ffe8c0;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}

#joystick-area {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex: 1;
}

#joystick-base {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  border: 2px solid rgba(255,255,255,0.25);
  position: relative;
  touch-action: none;
}

#joystick-thumb {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  border: 2px solid rgba(255,255,255,0.8);
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  transition: none;
}

/* Overlays */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.overlay.hidden { display: none; }

.opening-card,
.dialog-card {
  background: #fff;
  border-radius: 16px;
  padding: 28px 24px;
  width: min(85vw, 320px);
  text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}

.opening-text {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 24px;
  line-height: 1.5;
}

.dialog-title {
  font-size: 17px;
  font-weight: bold;
  color: #333;
  margin-bottom: 14px;
}

.dialog-body {
  font-size: 14px;
  color: #555;
  line-height: 1.8;
  max-height: 200px;
  overflow-y: auto;
  text-align: left;
  padding: 0 4px;
  margin-bottom: 16px;
}

.dialog-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn-primary {
  background: #e8734a;
  color: #fff;
  border: none;
  border-radius: 24px;
  padding: 10px 24px;
  font-size: 15px;
  cursor: pointer;
  font-weight: bold;
}

.btn-secondary {
  background: #eee;
  color: #555;
  border: none;
  border-radius: 24px;
  padding: 10px 20px;
  font-size: 15px;
  cursor: pointer;
}

/* Fade-in for canvas area */
#canvas-area.fade-in {
  animation: fadeIn 0.5s ease forwards;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
```

- [ ] **Step 2: Verify layout**

  Open in DevTools mobile emulation (iPhone 14 size, 390×844). Verify:
  - Top 65% area visible
  - Brown wood panel bottom 35%
  - Title "🎂 給爸爸的生日卡片" in warm cream colour
  - Joystick circles centred in bottom panel

---

## Task 3: Config — Map & NPC definitions

**Files:**
- Modify: `js/config.js`

- [ ] **Step 1: Write full config**

```js
export const TILE = 32;       // px per tile on screen
export const COLS = 15;
export const ROWS = 10;

// 0 = walkable, 1 = obstacle
// Row 0 = top wall, Row 9 = bottom wall
// Col 0 = left wall, Col 14 = right wall
export const COLLISION = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],  // row 0: top wall
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],  // row 1: TV cabinet row (全障礙)
  [1,1,0,0,1,0,0,0,0,0,0,0,1,0,1],  // row 2: 竹藤椅 col2, 長桌 cols5-9, 木桌電話 col12
  [1,0,0,0,0,0,0,0,0,0,0,0,1,0,1],  // row 3: walkable (under table overhang)
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],  // row 4: walkable
  [1,1,0,0,0,0,0,0,0,0,1,1,1,1,1],  // row 5: 大書櫃 col1, 木頭沙發右 cols10-13
  [1,1,0,0,0,0,0,0,0,0,1,1,1,1,1],  // row 6: 大書櫃 col1, 木頭沙發右 cols10-13
  [1,1,0,0,1,1,1,1,1,0,1,1,1,1,1],  // row 7: 大書櫃, 木頭沙發下 cols4-8, 木桌禮物 cols10-13
  [1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],  // row 8: walkable
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],  // row 9: bottom wall
];

export const NPCS = [
  {
    id: 'mom',
    name: '媽',
    tileX: 5, tileY: 7,   // centre of bottom sofa left
    title: '來自媽媽的祝福 💓',
    hairColor: '#8B4513',
    shirtColor: '#E8A0BF',
  },
  {
    id: 'brother',
    name: '哥',
    tileX: 8, tileY: 7,   // centre of bottom sofa right
    title: '來自哥哥的祝福 🎁',
    hairColor: '#2C2C2C',
    shirtColor: '#4A90D9',
  },
  {
    id: 'me',
    name: '弟',
    tileX: 12, tileY: 5,  // right sofa
    title: '來自弟弟的祝福 🎂',
    hairColor: '#3A3A3A',
    shirtColor: '#6BBF6B',
  },
];

export const PLAYER_START = { tileX: 7, tileY: 5 };

export const MESSAGES = {
  mom: '爸爸生日快樂！這一年辛苦你了，感謝你一直照顧著我們這個家，希望你天天健康、開心、平安。我們愛你 ♥',
  brother: '老爸生日快樂！從小到大你都默默扛起所有事，願你新的一歲少一點操心，多一點屬於自己的時間，好好休息。',
  me: '爸生日快樂！我們都長大了，現在換我們來照顧你。希望你身體永遠健康，繼續當那個愛講冷笑話的老爸 :)',
};

export const PROXIMITY_TILES = 1.8; // trigger distance in tiles
export const PLAYER_SPEED = 2.5;    // px per frame
```

- [ ] **Step 2: Verify export**

  In browser console: `import('./js/config.js').then(m => console.log(m.NPCS))` — should log array of 3 NPC objects.

---

## Task 4: Canvas setup & floor/wall rendering

**Files:**
- Modify: `js/renderer.js`
- Modify: `js/main.js`

- [ ] **Step 1: Write canvas sizing in `main.js`**

```js
import { TILE, COLS, ROWS } from './config.js';
import { draw } from './renderer.js';
import { state } from './state.js';

let canvas, ctx;

function resize() {
  const canvasArea = document.getElementById('canvas-area');
  canvas.width  = canvasArea.clientWidth;
  canvas.height = canvasArea.clientHeight;
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw(ctx, canvas.width, canvas.height, state);
  requestAnimationFrame(loop);
}

window.addEventListener('DOMContentLoaded', () => {
  canvas = document.getElementById('game-canvas');
  ctx = canvas.getContext('2d');
  resize();
  window.addEventListener('resize', resize);
  loop();
});
```

- [ ] **Step 2: Write floor & wall drawing in `renderer.js`**

```js
import { TILE, COLS, ROWS } from './config.js';

// Compute offset so map is centred in canvas
function getOffset(cw, ch) {
  const mapW = COLS * TILE;
  const mapH = ROWS * TILE;
  return {
    ox: Math.max(0, (cw - mapW) / 2),
    oy: Math.max(0, (ch - mapH) / 2),
  };
}

function drawFloor(ctx, ox, oy) {
  const floorColor = '#FEFEF2';
  const gridColor  = 'rgba(180,170,140,0.25)';
  ctx.fillStyle = floorColor;
  ctx.fillRect(ox, oy, COLS * TILE, ROWS * TILE);

  // Marble grid lines
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  for (let c = 0; c <= COLS; c++) {
    ctx.beginPath();
    ctx.moveTo(ox + c * TILE, oy);
    ctx.lineTo(ox + c * TILE, oy + ROWS * TILE);
    ctx.stroke();
  }
  for (let r = 0; r <= ROWS; r++) {
    ctx.beginPath();
    ctx.moveTo(ox,           oy + r * TILE);
    ctx.lineTo(ox + COLS * TILE, oy + r * TILE);
    ctx.stroke();
  }
}

function drawWalls(ctx, ox, oy) {
  ctx.fillStyle = '#E8E8E0';
  // Top wall
  ctx.fillRect(ox, oy, COLS * TILE, TILE);
  // Left wall
  ctx.fillRect(ox, oy, TILE * 0, ROWS * TILE); // no left wall strip visible
  // Baseboard
  ctx.fillStyle = '#D0C8B0';
  ctx.fillRect(ox, oy + TILE - 4, COLS * TILE, 4);
}

export function draw(ctx, cw, ch, state) {
  const { ox, oy } = getOffset(cw, ch);
  drawFloor(ctx, ox, oy);
  drawWalls(ctx, ox, oy);
}

export { getOffset };
```

- [ ] **Step 3: Open browser, verify**

  Floor should render as cream-white grid on the upper 65% of screen. Walls as slightly grey top strip.

---

## Task 5: Furniture rendering

**Files:**
- Modify: `js/renderer.js`

All furniture is drawn with Canvas primitives (rectangles, rounded rects, small pixel details) in the Peeps/LimeZu colour palette.

- [ ] **Step 1: Add furniture draw helpers to `renderer.js`**

```js
// Pixel-art rounded rect (no radius ≤ 2 for pixel feel)
function pixelRect(ctx, x, y, w, h, color, outline = '#5C3D1E') {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = outline;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
}

function drawFurniture(ctx, ox, oy) {
  const T = TILE;
  const wood   = '#8B6343';
  const woodDk = '#6B4A2A';
  const sofa   = '#7B5E3A';
  const sofaCu = '#A0784E';
  const rattan = '#C4A882';
  const wall   = '#E8E8E0';

  // === TV CABINET (row 1, cols 1-11) ===
  // TV unit background
  pixelRect(ctx, ox+T, oy+4, T*11, T-8, woodDk);
  // Speaker left
  pixelRect(ctx, ox+T+4, oy+6, T-6, T-12, '#3A3A3A');
  // TV screen (cols 3-8)
  pixelRect(ctx, ox+T*3, oy+4, T*6, T-8, '#1A1A2E');
  ctx.fillStyle = '#2A2A4E';
  ctx.fillRect(ox+T*3+4, oy+6, T*6-8, T-16);
  // Cabinet right (cols 9-10)
  pixelRect(ctx, ox+T*9, oy+6, T*2-4, T-12, wood);
  // Speaker right (col 11)
  pixelRect(ctx, ox+T*11+4, oy+6, T-6, T-12, '#3A3A3A');

  // === 盆栽 (row 1-2, col 13) ===
  // Pot
  pixelRect(ctx, ox+T*13+6, oy+T*1+8, T-12, T*1-6, '#C27A52');
  // Plant
  ctx.fillStyle = '#4A8A3A';
  ctx.beginPath();
  ctx.arc(ox+T*13+T/2, oy+T*1+6, 10, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(ox+T*13+T/2-6, oy+T*1+4, 8, 0, Math.PI*2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(ox+T*13+T/2+6, oy+T*1+4, 8, 0, Math.PI*2);
  ctx.fill();

  // === 高櫃 (rows 1-4, col 0) ===
  pixelRect(ctx, ox+2, oy+T, T-4, T*4-4, woodDk);
  // Shelf line
  ctx.strokeStyle = wood;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ox+4, oy+T*2+2);
  ctx.lineTo(ox+T-4, oy+T*2+2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(ox+4, oy+T*3+2);
  ctx.lineTo(ox+T-4, oy+T*3+2);
  ctx.stroke();

  // === 竹藤椅 (row 2, col 2) ===
  pixelRect(ctx, ox+T*2+4, oy+T*2+4, T-8, T-8, rattan);
  // Seat cross
  ctx.strokeStyle = '#B09070';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(ox+T*2+4, oy+T*2+8); ctx.lineTo(ox+T*3-4, oy+T*2+8); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ox+T*2+8, oy+T*2+4); ctx.lineTo(ox+T*2+8, oy+T*3-4); ctx.stroke();

  // === 長桌 (rows 2-3, cols 4-10) ===
  pixelRect(ctx, ox+T*4+2, oy+T*2+2, T*7-4, T*2-4, wood);
  // Table top edge
  ctx.fillStyle = '#A07850';
  ctx.fillRect(ox+T*4+2, oy+T*2+2, T*7-4, 5);

  // === 🎂 生日蛋糕 (on table, col 7) ===
  // Cake base
  pixelRect(ctx, ox+T*7+4, oy+T*2+6, T-8, T/2, '#F4C8A0');
  // Cake top
  pixelRect(ctx, ox+T*7+6, oy+T*2+2, T-12, T/2-2, '#F8E0C8');
  // Candle
  ctx.fillStyle = '#FFDD55';
  ctx.fillRect(ox+T*7+T/2-1, oy+T*2, 3, 6);
  ctx.fillStyle = '#FF6633';
  ctx.fillRect(ox+T*7+T/2, oy+T*2-3, 2, 4);

  // === 木桌 right-top (rows 2-3, cols 12-13) ===
  pixelRect(ctx, ox+T*12+2, oy+T*2+2, T*2-4, T*2-4, wood);
  // Phone on it
  ctx.fillStyle = '#444';
  ctx.fillRect(ox+T*12+6, oy+T*2+8, 10, 14);
  ctx.fillStyle = '#66BBFF';
  ctx.fillRect(ox+T*12+7, oy+T*2+9, 8, 8);

  // === 大書櫃 (rows 4-8, col 1) ===
  pixelRect(ctx, ox+T+2, oy+T*4+2, T-4, T*5-4, woodDk);
  // Books
  const bookColors = ['#CC4444','#44AA44','#4444CC','#AAAA22','#AA44AA'];
  bookColors.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(ox+T+4, oy+T*4+6 + i*14, T-8, 12);
  });

  // === 木頭沙發 下方 (rows 6-7, cols 4-8) ===
  // Back
  pixelRect(ctx, ox+T*4+2, oy+T*6+2, T*5-4, T-4, sofa);
  // Seat
  pixelRect(ctx, ox+T*4+2, oy+T*7+2, T*5-4, T-4, sofaCu);
  // Armrests
  pixelRect(ctx, ox+T*4+2, oy+T*6+2, T/2, T*2-4, woodDk);
  pixelRect(ctx, ox+T*9-T/2, oy+T*6+2, T/2, T*2-4, woodDk);

  // === 木頭沙發 右側 (rows 5-6, cols 10-13) ===
  // Back
  pixelRect(ctx, ox+T*10+2, oy+T*5+2, T*4-4, T-4, sofa);
  // Seat
  pixelRect(ctx, ox+T*10+2, oy+T*6+2, T*4-4, T-4, sofaCu);
  // Armrests
  pixelRect(ctx, ox+T*10+2, oy+T*5+2, T/2, T*2-4, woodDk);
  pixelRect(ctx, ox+T*14-T/2-2, oy+T*5+2, T/2, T*2-4, woodDk);

  // === 木桌 right-bottom + 禮物 (rows 7-8, cols 12-13) ===
  pixelRect(ctx, ox+T*12+2, oy+T*7+2, T*2-4, T-4, wood);
  // Gift box
  pixelRect(ctx, ox+T*12+6, oy+T*7+5, T-8, T/2, '#EE5555');
  ctx.fillStyle = '#FFDD55';
  ctx.fillRect(ox+T*12+T/2-1, oy+T*7+5, 3, T/2);
  ctx.fillRect(ox+T*12+6, oy+T*7+5+T/4-1, T-8, 3);

  // === 門 (rows 8-9, col 0-1) ===
  pixelRect(ctx, ox+2, oy+T*8+2, T-2, T-4, '#D2A87A');
  // Door knob
  ctx.fillStyle = '#C8A84A';
  ctx.beginPath();
  ctx.arc(ox+T-8, oy+T*8+T/2, 3, 0, Math.PI*2);
  ctx.fill();
}
```

- [ ] **Step 2: Add `drawFurniture` call inside `draw()` in `renderer.js`**

```js
export function draw(ctx, cw, ch, state) {
  const { ox, oy } = getOffset(cw, ch);
  drawFloor(ctx, ox, oy);
  drawWalls(ctx, ox, oy);
  drawFurniture(ctx, ox, oy);
}
```

- [ ] **Step 3: Open browser, verify furniture layout**

  Check that sofa, TV, bookshelf, table with cake, right table with phone, lower-right table with gift are all visible and roughly in correct positions per the layout diagram. Adjust tile coordinates if needed.

---

## Task 6: Character sprites

**Files:**
- Modify: `js/renderer.js`

Simple pixel-art characters: body ~14×24px. Head (round, 10px), body rectangle, legs.

- [ ] **Step 1: Add `drawCharacter` function to `renderer.js`**

```js
// x,y = pixel centre of character feet
function drawCharacter(ctx, x, y, hairColor, shirtColor, label) {
  const headR = 6;
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath();
  ctx.ellipse(x, y+1, 8, 3, 0, 0, Math.PI*2);
  ctx.fill();
  // Legs
  ctx.fillStyle = '#3A2A1A';
  ctx.fillRect(x-5, y-10, 4, 10);
  ctx.fillRect(x+1, y-10, 4, 10);
  // Shoes
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(x-6, y-4, 5, 4);
  ctx.fillRect(x+1, y-4, 5, 4);
  // Body / shirt
  ctx.fillStyle = shirtColor;
  ctx.fillRect(x-7, y-22, 14, 12);
  // Head
  ctx.fillStyle = '#F5D5B0';
  ctx.beginPath();
  ctx.arc(x, y-26, headR, 0, Math.PI*2);
  ctx.fill();
  // Hair
  ctx.fillStyle = hairColor;
  ctx.fillRect(x-headR, y-32, headR*2, 8);
  ctx.beginPath();
  ctx.arc(x, y-26, headR, Math.PI, 0);
  ctx.fill();
  // Eyes
  ctx.fillStyle = '#2A1A0A';
  ctx.fillRect(x-4, y-28, 2, 2);
  ctx.fillRect(x+2, y-28, 2, 2);
  // Name label
  if (label) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    const pad = 4;
    const tw = ctx.measureText(label).width;
    ctx.fillRect(x - tw/2 - pad, y - 44, tw + pad*2, 14);
    ctx.fillStyle = '#fff';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, y - 33);
  }
}
```

- [ ] **Step 2: Add `drawCharacters` function to `renderer.js`**

```js
import { NPCS, PLAYER_START } from './config.js';

function drawCharacters(ctx, ox, oy, state) {
  const T = TILE;

  // Draw NPCs
  NPCS.forEach(npc => {
    const px = ox + npc.tileX * T + T/2;
    const py = oy + npc.tileY * T + T - 2;
    drawCharacter(ctx, px, py, npc.hairColor, npc.shirtColor, npc.name);

    // Chat bubble or checkmark
    const npcState = state.npcs[npc.id];
    const bubbleX = px + 10;
    const bubbleY = py - 56;
    if (npcState.read) {
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✓', bubbleX, bubbleY);
    } else if (npcState.showBubble) {
      // Animated bounce
      const bounce = Math.sin(Date.now() / 300) * 3;
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('💬', bubbleX, bubbleY + bounce);
    }
  });

  // Draw player (爸)
  const px = ox + state.player.x + T/2;
  const py = oy + state.player.y + T - 2;
  // Dad: glasses + dark hair (referencing headshot)
  drawCharacter(ctx, px, py, '#2A2A2A', '#2A2A4E', '爸');
  // Glasses
  ctx.strokeStyle = '#1A1A1A';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(px-5, py-29, 4, 3);
  ctx.strokeRect(px+1, py-29, 4, 3);
  ctx.beginPath();
  ctx.moveTo(px-1, py-27);
  ctx.lineTo(px+1, py-27);
  ctx.stroke();
}
```

- [ ] **Step 3: Add `drawCharacters` call inside `draw()`**

```js
export function draw(ctx, cw, ch, state) {
  const { ox, oy } = getOffset(cw, ch);
  drawFloor(ctx, ox, oy);
  drawWalls(ctx, ox, oy);
  drawFurniture(ctx, ox, oy);
  drawCharacters(ctx, ox, oy, state);
}
```

- [ ] **Step 4: Update `state.js` to add `showBubble` to NPCs**

```js
export const state = {
  phase: 'opening',
  player: { x: 7 * 32, y: 5 * 32 },
  joystick: { dx: 0, dy: 0 },
  npcs: {
    mom:     { read: false, showBubble: false },
    brother: { read: false, showBubble: false },
    me:      { read: false, showBubble: false },
  },
  activeNpc: null,
  audioOn: true,
};
```

- [ ] **Step 5: Verify characters render**

  Open browser. Should see 3 NPC pixel figures at their sofa positions, and Dad figure in the centre of the map with tiny glasses detail.

---

## Task 7: Touch joystick

**Files:**
- Modify: `js/joystick.js`
- Modify: `js/main.js`

- [ ] **Step 1: Write `js/joystick.js`**

```js
export function initJoystick(state) {
  const base  = document.getElementById('joystick-base');
  const thumb = document.getElementById('joystick-thumb');
  const RADIUS = 24; // max thumb travel from centre

  let active = false;
  let baseRect;

  function updateThumb(cx, cy) {
    baseRect = base.getBoundingClientRect();
    const bx = baseRect.left + baseRect.width  / 2;
    const by = baseRect.top  + baseRect.height / 2;
    const dx = cx - bx;
    const dy = cy - by;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const clamped = Math.min(dist, RADIUS);
    const angle = Math.atan2(dy, dx);
    const tx = Math.cos(angle) * clamped;
    const ty = Math.sin(angle) * clamped;
    thumb.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;
    // Normalised direction
    state.joystick.dx = dist > 5 ? (dx / dist) : 0;
    state.joystick.dy = dist > 5 ? (dy / dist) : 0;
  }

  function reset() {
    active = false;
    thumb.style.transform = 'translate(-50%, -50%)';
    state.joystick.dx = 0;
    state.joystick.dy = 0;
  }

  base.addEventListener('touchstart', e => {
    e.preventDefault();
    active = true;
    updateThumb(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });

  base.addEventListener('touchmove', e => {
    e.preventDefault();
    if (active) updateThumb(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });

  base.addEventListener('touchend', reset);
  base.addEventListener('touchcancel', reset);
}
```

- [ ] **Step 2: Wire joystick into `main.js`**

```js
import { initJoystick } from './joystick.js';
// Add to DOMContentLoaded:
initJoystick(state);
```

- [ ] **Step 3: Verify joystick**

  On mobile: drag finger on joystick base, thumb follows. Release → thumb snaps back. Open DevTools console and verify `state.joystick.dx/dy` changes while dragging.

---

## Task 8: Player movement + collision

**Files:**
- Modify: `js/player.js`
- Modify: `js/main.js`

- [ ] **Step 1: Write `js/player.js`**

```js
import { COLLISION, TILE, PLAYER_SPEED } from './config.js';

function isSolid(tileX, tileY) {
  if (tileY < 0 || tileY >= COLLISION.length)    return true;
  if (tileX < 0 || tileX >= COLLISION[0].length) return true;
  return COLLISION[tileY][tileX] === 1;
}

// Check 4 corners of a hitbox (12×12 px centred on feet)
function canMove(px, py) {
  const HW = 6; // half-width
  const corners = [
    [px - HW, py - HW],
    [px + HW, py - HW],
    [px - HW, py + HW],
    [px + HW, py + HW],
  ];
  return corners.every(([cx, cy]) => !isSolid(Math.floor(cx / TILE), Math.floor(cy / TILE)));
}

export function updatePlayer(state) {
  if (state.phase !== 'playing') return;
  const { dx, dy } = state.joystick;
  if (dx === 0 && dy === 0) return;

  const speed = PLAYER_SPEED;
  // Centre of player is x+TILE/2, y+TILE/2; feet at y+TILE
  const cx = state.player.x + TILE / 2;
  const cy = state.player.y + TILE;

  // Try x then y independently for wall sliding
  const nx = cx + dx * speed;
  if (canMove(nx, cy)) state.player.x = nx - TILE / 2;

  const ny = cy + dy * speed;
  if (canMove(cx, ny)) state.player.y = ny - TILE;
}
```

- [ ] **Step 2: Call `updatePlayer` in game loop in `main.js`**

```js
import { updatePlayer } from './player.js';

function loop() {
  updatePlayer(state);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw(ctx, canvas.width, canvas.height, state);
  requestAnimationFrame(loop);
}
```

- [ ] **Step 3: Verify movement + collision**

  Open in browser mobile emulation. Dad should move when joystick is dragged. Dad should stop when hitting walls or furniture. Should slide along walls (not get stuck when pressing diagonally into a wall).

  Tweak `COLLISION` array in `config.js` if any furniture is incorrectly blocking/not-blocking.

---

## Task 9: NPC proximity + chat bubble

**Files:**
- Modify: `js/npc.js`
- Modify: `js/main.js`

- [ ] **Step 1: Write `js/npc.js`**

```js
import { NPCS, PROXIMITY_TILES, TILE } from './config.js';

export function updateNpcs(state) {
  if (state.phase !== 'playing') return;

  const playerCX = state.player.x + TILE / 2;
  const playerCY = state.player.y + TILE;

  NPCS.forEach(npc => {
    if (state.npcs[npc.id].read) {
      state.npcs[npc.id].showBubble = false;
      return;
    }
    const npcCX = npc.tileX * TILE + TILE / 2;
    const npcCY = npc.tileY * TILE + TILE;
    const dist = (Math.abs(playerCX - npcCX) + Math.abs(playerCY - npcCY)) / TILE;
    state.npcs[npc.id].showBubble = dist <= PROXIMITY_TILES;
  });
}
```

- [ ] **Step 2: Wire into game loop in `main.js`**

```js
import { updateNpcs } from './npc.js';

function loop() {
  updatePlayer(state);
  updateNpcs(state);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw(ctx, canvas.width, canvas.height, state);
  requestAnimationFrame(loop);
}
```

- [ ] **Step 3: Add canvas click handler in `main.js` to detect bubble taps**

```js
// In DOMContentLoaded, after canvas is assigned:
canvas.addEventListener('click', e => {
  if (state.phase !== 'playing') return;
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;
  const { ox, oy } = getOffset(canvas.width, canvas.height);

  NPCS.forEach(npc => {
    if (!state.npcs[npc.id].showBubble) return;
    const bx = ox + npc.tileX * TILE + TILE + 10;
    const by = oy + npc.tileY * TILE - 20;
    const dist = Math.hypot(clickX - bx, clickY - by);
    if (dist < 22) {
      openDialog(npc.id);
    }
  });
});
```

Add `import { getOffset } from './renderer.js';` and `import { NPCS } from './config.js';` to `main.js`, plus `import { openDialog } from './dialog.js';` (stubbed for now).

- [ ] **Step 4: Verify**

  Walk Dad close to Mom → 💬 appears over her head and bounces. Walk away → disappears. ✓ shows after message is marked read (tested in Task 10).

---

## Task 10: Dialog window system

**Files:**
- Modify: `js/dialog.js`
- Modify: `js/main.js`

- [ ] **Step 1: Write `js/dialog.js`**

```js
import { MESSAGES, NPCS } from './config.js';
import { state } from './state.js';

let onAllRead = null;

export function initDialog(allReadCallback) {
  onAllRead = allReadCallback;

  document.getElementById('btn-accept').addEventListener('click', () => {
    closeDialog(true);
  });
  document.getElementById('btn-close').addEventListener('click', () => {
    closeDialog(false);
  });
}

export function openDialog(npcId) {
  const npc = NPCS.find(n => n.id === npcId);
  if (!npc) return;

  state.activeNpc = npcId;
  state.phase = 'dialog';

  document.getElementById('dialog-title').textContent = npc.title;
  document.getElementById('dialog-body').textContent  = MESSAGES[npcId];

  const overlay = document.getElementById('dialog-overlay');
  overlay.classList.remove('hidden');
}

function closeDialog(accepted) {
  const overlay = document.getElementById('dialog-overlay');
  overlay.classList.add('hidden');
  state.phase = 'playing';

  if (accepted && state.activeNpc) {
    state.npcs[state.activeNpc].read = true;
    state.npcs[state.activeNpc].showBubble = false;
    state.activeNpc = null;

    const allRead = Object.values(state.npcs).every(n => n.read);
    if (allRead && onAllRead) onAllRead();
  }
}
```

- [ ] **Step 2: Wire in `main.js`**

```js
import { initDialog, openDialog } from './dialog.js';

// In DOMContentLoaded:
initDialog(() => {
  // allRead callback — trigger confetti + endgame (wired in Task 13)
  showEndGame();
});
```

- [ ] **Step 3: Verify dialog**

  Walk close to a family member, tap the 💬. Dialog window should appear with title and message. Tap [接收] → window closes, ✓ appears on NPC head. Tap [關閉] → window closes, 💬 still shows (not marked as read).

---

## Task 11: Opening screen + fade transition

**Files:**
- Modify: `js/main.js`

- [ ] **Step 1: Add opening screen logic in `main.js`**

```js
import { initAudio, playBgm } from './audio.js'; // stubbed until Task 12

function initOpeningScreen() {
  document.getElementById('btn-start').addEventListener('click', () => {
    const overlay = document.getElementById('opening-overlay');
    overlay.style.transition = 'opacity 0.5s';
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.classList.add('hidden');
      document.getElementById('canvas-area').classList.add('fade-in');
      state.phase = 'playing';
      playBgm();
    }, 500);
  });
}

// In DOMContentLoaded:
initOpeningScreen();
state.phase = 'opening';
```

- [ ] **Step 2: Stub `audio.js` for now**

```js
export function initAudio() {}
export function playBgm() {}
export function toggleAudio(state) {}
```

- [ ] **Step 3: Verify opening → playing flow**

  Refresh page → opening overlay visible. Tap [查收] → overlay fades out in 0.5s → game canvas fades in. Dad is controllable, NPCs show chat bubbles on approach.

---

## Task 12: Audio (BGM)

**Files:**
- Modify: `js/audio.js`
- Modify: `js/main.js`

- [ ] **Step 1: Write `js/audio.js`**

```js
let audio = null;

export function initAudio() {
  audio = new Audio('assets/bgm.mp3');
  audio.loop = true;
  audio.volume = 0.5;
}

export function playBgm() {
  if (audio) audio.play().catch(() => {}); // ignore autoplay errors
}

export function toggleAudio(state) {
  if (!audio) return;
  state.audioOn = !state.audioOn;
  if (state.audioOn) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
  document.getElementById('btn-audio').textContent = state.audioOn ? '🔊' : '🔇';
}
```

- [ ] **Step 2: Wire in `main.js`**

```js
import { initAudio, playBgm, toggleAudio } from './audio.js';

// In DOMContentLoaded:
initAudio();
document.getElementById('btn-audio').addEventListener('click', () => toggleAudio(state));
```

- [ ] **Step 3: Verify audio**

  Tap [查收] → BGM starts. Tap 🔊 → pauses (icon → 🔇). Tap 🔇 → resumes (icon → 🔊).

---

## Task 13: Confetti + end-game flow

**Files:**
- Modify: `js/confetti.js`
- Modify: `js/main.js`

- [ ] **Step 1: Write `js/confetti.js`**

```js
let particles = [];
let animating = false;
let confettiCanvas, confettiCtx;

const COLORS = ['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#FF9FF3','#FFA502'];

export function initConfetti() {
  confettiCanvas = document.getElementById('confetti-canvas');
  confettiCtx    = confettiCanvas.getContext('2d');
}

function spawnParticles() {
  particles = [];
  for (let i = 0; i < 80; i++) {
    particles.push({
      x:    Math.random() * confettiCanvas.width,
      y:    -10 - Math.random() * 100,
      vx:   (Math.random() - 0.5) * 3,
      vy:   2 + Math.random() * 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      w:    6 + Math.random() * 6,
      h:    4 + Math.random() * 4,
      rot:  Math.random() * Math.PI * 2,
      rSpeed: (Math.random() - 0.5) * 0.2,
    });
  }
}

function animateConfetti() {
  if (!animating) return;
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  particles.forEach(p => {
    p.x  += p.vx;
    p.y  += p.vy;
    p.rot += p.rSpeed;
    p.vy *= 1.003; // slight acceleration
    confettiCtx.save();
    confettiCtx.translate(p.x, p.y);
    confettiCtx.rotate(p.rot);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
    confettiCtx.restore();
  });
  particles = particles.filter(p => p.y < confettiCanvas.height + 20);
  if (particles.length > 0) requestAnimationFrame(animateConfetti);
}

export function startConfetti(duration = 3000) {
  confettiCanvas.width  = confettiCanvas.offsetWidth;
  confettiCanvas.height = confettiCanvas.offsetHeight;
  animating = true;
  spawnParticles();
  animateConfetti();
  setTimeout(() => { animating = false; }, duration);
}
```

- [ ] **Step 2: Write `showEndGame` in `main.js`**

```js
import { initConfetti, startConfetti } from './confetti.js';

// In DOMContentLoaded:
initConfetti();

function showEndGame() {
  state.phase = 'ended';
  startConfetti(3000);

  setTimeout(() => {
    document.getElementById('endgame-overlay').classList.remove('hidden');
  }, 3000);
}

// End-game buttons
document.getElementById('btn-again').addEventListener('click', () => {
  // Reset all NPC read state
  Object.keys(state.npcs).forEach(k => {
    state.npcs[k].read = false;
    state.npcs[k].showBubble = false;
  });
  document.getElementById('endgame-overlay').classList.add('hidden');
  state.phase = 'playing';
});

document.getElementById('btn-done').addEventListener('click', () => {
  document.getElementById('endgame-overlay').classList.add('hidden');
  document.getElementById('btn-restart').classList.remove('hidden');
  state.phase = 'playing';
});

document.getElementById('btn-restart').addEventListener('click', () => {
  window.location.reload();
});
```

- [ ] **Step 3: Verify end-game flow**

  Play through: collect all 3 messages via [接收]. Confetti should rain down for 3 seconds, then end-game dialog appears. [再接收一次祝福] resets and allows re-collecting. [完美收下] closes dialog and shows 🔄 button. 🔄 reloads page.

---

## Task 14: Polish pass

**Files:**
- Modify: `style.css`
- Modify: `js/renderer.js`

- [ ] **Step 1: Fix canvas scaling for pixel-perfect rendering**

In `main.js` resize function:
```js
function resize() {
  const canvasArea = document.getElementById('canvas-area');
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = canvasArea.clientWidth  * dpr;
  canvas.height = canvasArea.clientHeight * dpr;
  canvas.style.width  = canvasArea.clientWidth  + 'px';
  canvas.style.height = canvasArea.clientHeight + 'px';
  ctx.scale(dpr, dpr);
  // Re-disable smoothing after scale
  ctx.imageSmoothingEnabled = false;
}
```

- [ ] **Step 2: Disable image smoothing on canvas context**

In `renderer.js` `draw()` first line:
```js
ctx.imageSmoothingEnabled = false;
```

- [ ] **Step 3: Make confetti canvas match game canvas sizing**

In `confetti.js` `startConfetti()`:
```js
const dpr = window.devicePixelRatio || 1;
confettiCanvas.width  = confettiCanvas.offsetWidth  * dpr;
confettiCanvas.height = confettiCanvas.offsetHeight * dpr;
confettiCtx.scale(dpr, dpr);
```

- [ ] **Step 4: Test full flow on real phone (or DevTools throttled mobile)**

  - Opening screen → tap [查收]
  - Music plays, canvas fades in
  - Joystick moves Dad smoothly
  - Walk to Mom: 💬 bounces. Tap it → dialog with scroll if needed.
  - Tap [接收] → ✓ on Mom's head
  - Collect all 3 → confetti → end dialog
  - [再接收一次祝福] → bubbles reset
  - [完美收下] → 🔄 appears
  - 🔄 → fresh page reload

- [ ] **Step 5: Replace demo messages with final family text (when ready)**

  Edit `js/config.js` → `MESSAGES` object. Each value is a plain string. No code changes needed.

---

## Task 15: GitHub Pages deployment

**Files:** None (git operations only)

- [ ] **Step 1: Initialise git repo**

```bash
cd "C:/for Claude/生日卡片/birthday-card-2026-dad"
git init
git add .
git commit -m "feat: initial birthday card"
```

- [ ] **Step 2: Create GitHub repo with `gh` CLI**

```bash
gh repo create birthday-card-2026-dad --public --source=. --remote=origin --push
```

  This creates the repo on GitHub and pushes in one command.

- [ ] **Step 3: Enable GitHub Pages**

```bash
gh api repos/:owner/birthday-card-2026-dad/pages \
  --method POST \
  -f source[branch]=main \
  -f source[path]=/
```

  Wait ~60 seconds for Pages to activate.

- [ ] **Step 4: Get the live URL**

```bash
gh api repos/:owner/birthday-card-2026-dad/pages --jq .html_url
```

  Output: `https://<your-account>.github.io/birthday-card-2026-dad/`

- [ ] **Step 5: Open URL on phone and verify full flow works**

  Test on actual phone, not emulator. Pay attention to: touch joystick responsiveness, font sizes, dialog readability, BGM plays after tap.

- [ ] **Step 6: Commit any final fixes**

```bash
git add -A
git commit -m "fix: mobile polish from device testing"
git push origin main
```

  GitHub Pages redeploys automatically within ~30 seconds.
