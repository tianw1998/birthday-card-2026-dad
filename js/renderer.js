import {
  TILE, COLS, ROWS, NPCS, PLAYER_START,
  FURNITURE, PLANTS, GIFTS, TABLE_ITEMS, CAKE_ROWS, CAKE_POS,
  COFFEE_ROWS, COFFEE_POS, PIXEL_PALETTE, DAD_FRAMES,
} from './config.js';
import { images } from './assets.js';

// Fit the whole map inside the canvas: scale down on narrow screens,
// allow up to 2x on large screens, and centre it.
export function getView(cw, ch) {
  const mapW = COLS * TILE;
  const mapH = ROWS * TILE;
  const scale = Math.min(cw / mapW, ch / mapH, 2);
  return {
    scale,
    ox: (cw - mapW * scale) / 2,
    oy: (ch - mapH * scale) / 2,
  };
}

function drawFloor(ctx) {
  const rooms = images.rooms;
  const floorSrc = { sx: 11 * TILE, sy: 7 * TILE, sw: TILE, sh: TILE };
  for (let r = 3; r < 12; r++) {
    for (let c = 1; c < 9; c++) {
      ctx.drawImage(rooms, floorSrc.sx, floorSrc.sy, floorSrc.sw, floorSrc.sh,
        c * TILE, r * TILE, TILE, TILE);
    }
  }
}

function drawWalls(ctx) {
  const rooms = images.rooms;
  for (let c = 1; c < 9; c++) {
    ctx.drawImage(rooms, 1 * TILE, 7 * TILE, TILE, TILE, c * TILE, 1 * TILE, TILE, TILE);
    ctx.drawImage(rooms, 1 * TILE, 8 * TILE, TILE, TILE, c * TILE, 2 * TILE, TILE, TILE);
  }
}

function drawFurniture(ctx) {
  FURNITURE.forEach(f => {
    const sheet = images[f.sheet];
    if (f.mirror) {
      ctx.save();
      ctx.translate(f.dx + f.sw, f.dy);
      ctx.scale(-1, 1);
      ctx.drawImage(sheet, f.sx, f.sy, f.sw, f.sh, 0, 0, f.sw, f.sh);
      ctx.restore();
    } else {
      ctx.drawImage(sheet, f.sx, f.sy, f.sw, f.sh, f.dx, f.dy, f.sw, f.sh);
    }
  });
  PLANTS.forEach(p => {
    ctx.drawImage(images[p.sheet], p.sx, p.sy, p.sw, p.sh, p.dx, p.dy, p.sw, p.sh);
  });
}

// Draw a tiny hand-authored pixel-art sprite from a row-string grid.
function drawPixelArt(ctx, rows, dx, dy, scale = 2) {
  for (let y = 0; y < rows.length; y++) {
    const row = rows[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.') continue;
      ctx.fillStyle = PIXEL_PALETTE[ch];
      ctx.fillRect(dx + x * scale, dy + y * scale, scale, scale);
    }
  }
}

function drawTableSpread(ctx) {
  TABLE_ITEMS.forEach(t => {
    ctx.drawImage(images[t.sheet], t.sx, t.sy, t.sw, t.sh, t.dx, t.dy, t.sw, t.sh);
  });
  drawPixelArt(ctx, CAKE_ROWS, CAKE_POS.dx, CAKE_POS.dy);
  COFFEE_POS.forEach(p => drawPixelArt(ctx, COFFEE_ROWS, p.dx, p.dy));
  GIFTS.forEach(g => drawPixelArt(ctx, g.rows, g.dx, g.dy));
}

// Sitting poses span 2 native 16px cells (32px source) for a full side
// silhouette; character art is half the furniture grid's resolution, so
// it's drawn at 2x (64x64) to sit correctly-scaled in the 32px-tile room.
function drawNpcSprite(ctx, npc, destX, destY) {
  const sheet = images[npc.sitSheet];
  const sx = npc.sitFrame * 16;
  ctx.drawImage(sheet, sx, 0, 32, 32, destX, destY, 64, 64);
}

function drawNpcs(ctx, state) {
  NPCS.forEach(npc => {
    const destX = npc.tileX * TILE + npc.sitOffset.dx;
    const destY = npc.tileY * TILE + npc.sitOffset.dy;
    drawNpcSprite(ctx, npc, destX, destY);

    const labelX = destX + 32;
    drawLabel(ctx, npc.name, labelX, destY - 4);

    // Chat bubble or checkmark above head
    const npcState = state.npcs[npc.id];
    const bx = destX + 48;
    const by = destY - 18;
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    if (npcState && npcState.read) {
      ctx.fillStyle = '#44BB44';
      ctx.fillText('✓', bx, by);
    } else if (npcState && npcState.showBubble) {
      const bounce = Math.sin(Date.now() / 300) * 3;
      ctx.fillText('💬', bx, by + bounce);
    }
  });
}

function drawLabel(ctx, text, x, y) {
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  const tw = ctx.measureText(text).width;
  const pad = 4;
  const lw = tw + pad * 2;
  const lh = 14;
  ctx.fillStyle = 'rgba(30,20,10,0.72)';
  ctx.beginPath();
  ctx.roundRect(x - lw / 2, y - lh, lw, lh, 3);
  ctx.fill();
  ctx.fillStyle = '#FFE8C0';
  ctx.fillText(text, x, y - 3);
}

function pickDadFrame(state) {
  const { dir = 'down' } = state.player;
  const moving = state.joystick.dx !== 0 || state.joystick.dy !== 0;
  if (!moving) return { sheet: images.dadIdle, frame: DAD_FRAMES.idle[dir] };
  const cycle = DAD_FRAMES.walk[dir];
  const frame = cycle[Math.floor(Date.now() / 180) % cycle.length];
  return { sheet: images.dadRun, frame };
}

// Dad's native art is 16px-grid (16 wide x 32 tall); drawn at 2x (32x64)
// so his scale matches the 32px-tile furniture, feet aligned to tile bottom.
function drawDad(ctx, state) {
  const destX = state.player.x;
  const destY = state.player.y - TILE;
  const { sheet, frame } = pickDadFrame(state);
  ctx.drawImage(sheet, frame * 16, 0, 16, 32, destX, destY, 32, 64);
  drawLabel(ctx, '爸', destX + 16, destY - 4);
}

export function draw(ctx, cw, ch, state) {
  // During opening screen, just show dark background
  if (state.phase === 'opening') {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, cw, ch);
    return;
  }
  if (!images.rooms) return; // assets still loading

  ctx.imageSmoothingEnabled = false;

  const { ox, oy, scale } = getView(cw, ch);
  ctx.save();
  ctx.translate(ox, oy);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#18142A';
  ctx.fillRect(0, 0, COLS * TILE, ROWS * TILE);
  drawFloor(ctx);
  const rug = FURNITURE.find(f => f.isRug);
  ctx.drawImage(images[rug.sheet], rug.sx, rug.sy, rug.sw, rug.sh, rug.dx, rug.dy, rug.sw, rug.sh);
  drawWalls(ctx);
  drawFurniture(ctx);
  drawTableSpread(ctx);
  drawNpcs(ctx, state);
  drawDad(ctx, state);
  ctx.restore();
}
