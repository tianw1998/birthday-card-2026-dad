import { TILE, COLS, ROWS, NPCS, PLAYER_START } from './config.js';

export function getOffset(cw, ch) {
  const mapW = COLS * TILE;
  const mapH = ROWS * TILE;
  return {
    ox: Math.max(0, (cw - mapW) / 2),
    oy: Math.max(0, (ch - mapH) / 2),
  };
}

function drawFloor(ctx, ox, oy) {
  const floorColor = '#FEFEF2';
  const gridColor  = 'rgba(180,170,140,0.2)';

  // Base floor fill
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
    ctx.moveTo(ox,              oy + r * TILE);
    ctx.lineTo(ox + COLS * TILE, oy + r * TILE);
    ctx.stroke();
  }

  // Subtle marble vein: diagonal lines per tile
  ctx.strokeStyle = 'rgba(200,195,175,0.15)';
  ctx.lineWidth = 0.5;
  for (let r = 1; r < ROWS - 1; r++) {
    for (let c = 1; c < COLS - 1; c++) {
      if ((r + c) % 3 === 0) {
        ctx.beginPath();
        ctx.moveTo(ox + c * TILE + 4,      oy + r * TILE + 8);
        ctx.lineTo(ox + c * TILE + TILE - 4, oy + r * TILE + TILE - 8);
        ctx.stroke();
      }
    }
  }
}

function pixelRect(ctx, x, y, w, h, fill, stroke = '#4A2E0A') {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  }
}

function drawFurniture(ctx, ox, oy) {
  const T = TILE;
  const wood    = '#8B6343';
  const woodDk  = '#6B4A2A';
  const sofa    = '#7B5E3A';
  const sofaCu  = '#A0784E';
  const rattan  = '#C4A882';

  // === TV CABINET (row 1, cols 1–11) ===
  pixelRect(ctx, ox+T,   oy+2,    T*11, T-4, woodDk);
  // Speaker left
  pixelRect(ctx, ox+T+3,   oy+5,  T-6,  T-10, '#2A2A2A', '#111');
  // TV screen (cols 3–8)
  pixelRect(ctx, ox+T*3,   oy+2,  T*6,  T-4,  '#1A1A2E', '#111');
  ctx.fillStyle = '#2A3A5E';
  ctx.fillRect(ox+T*3+4, oy+5, T*6-8, T-14);
  // Cabinet right (cols 9–10)
  pixelRect(ctx, ox+T*9+2, oy+5,  T*2-6, T-10, wood);
  // Speaker right (col 11)
  pixelRect(ctx, ox+T*11+3, oy+5, T-6,  T-10, '#2A2A2A', '#111');

  // === 盆栽 (col 13, rows 1–2) ===
  pixelRect(ctx, ox+T*13+8, oy+T+10, T-16, T/2-4, '#B06040'); // pot
  ctx.fillStyle = '#3A7A2A';
  ctx.beginPath(); ctx.arc(ox+T*13+T/2, oy+T+6,  9, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(ox+T*13+T/2-7, oy+T+4, 7, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(ox+T*13+T/2+7, oy+T+4, 7, 0, Math.PI*2); ctx.fill();

  // === 高櫃 (col 0, rows 1–4) ===
  pixelRect(ctx, ox+1, oy+T, T-2, T*4, woodDk);
  ctx.strokeStyle = wood; ctx.lineWidth = 1;
  [2,3,4].forEach(r => {
    ctx.beginPath();
    ctx.moveTo(ox+3, oy+T*r+2); ctx.lineTo(ox+T-3, oy+T*r+2); ctx.stroke();
  });

  // === 竹藤椅 (col 2, row 2) ===
  pixelRect(ctx, ox+T*2+4, oy+T*2+4, T-8, T-8, rattan, '#9A7852');
  ctx.strokeStyle = '#B09070'; ctx.lineWidth = 1;
  // Horizontal weave lines
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(ox+T*2+4, oy+T*2+4 + i*6);
    ctx.lineTo(ox+T*3-4, oy+T*2+4 + i*6);
    ctx.stroke();
  }
  // Vertical weave lines
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(ox+T*2+4 + i*6, oy+T*2+4);
    ctx.lineTo(ox+T*2+4 + i*6, oy+T*3-4);
    ctx.stroke();
  }

  // === 長桌 (cols 4–10, rows 2–3) ===
  pixelRect(ctx, ox+T*4+1, oy+T*2+1, T*7-2, T*2-2, wood);
  ctx.fillStyle = '#A07850';
  ctx.fillRect(ox+T*4+1, oy+T*2+1, T*7-2, 5); // table top edge

  // 🎂 Birthday cake (on table, col 7)
  const cx7 = ox+T*7+T/2;
  // Cake base layer
  pixelRect(ctx, cx7-10, oy+T*2+6,  20, 11, '#F0C890', '#C8A050');
  // Cake top layer
  pixelRect(ctx, cx7-7,  oy+T*2+1,  14,  8, '#F8E0C0', '#D0A870');
  // Frosting drip
  ctx.fillStyle = '#FFF8F0';
  ctx.fillRect(cx7-6, oy+T*2+1, 2, 3);
  ctx.fillRect(cx7+2, oy+T*2+1, 2, 3);
  // Candles (3)
  [-4, 0, 4].forEach(dx => {
    ctx.fillStyle = '#FFEE44';
    ctx.fillRect(cx7+dx-1, oy+T*2-5, 2, 6);
    ctx.fillStyle = '#FF6622';
    ctx.beginPath(); ctx.arc(cx7+dx, oy+T*2-6, 2, 0, Math.PI*2); ctx.fill();
  });

  // === 木桌 top-right (cols 12–13, rows 2–3) ===
  pixelRect(ctx, ox+T*12+1, oy+T*2+1, T*2-2, T*2-2, wood);
  // 📞 Telephone
  ctx.fillStyle = '#333';
  ctx.fillRect(ox+T*12+5, oy+T*2+6, 12, 16);
  ctx.fillStyle = '#4488AA';
  ctx.fillRect(ox+T*12+6, oy+T*2+7, 10, 8);

  // === 大書櫃 (col 1, rows 4–8) ===
  pixelRect(ctx, ox+T+1, oy+T*4, T-2, T*5, woodDk);
  const bookColors = ['#CC4444','#44AA55','#4466CC','#BBAA22','#AA44AA','#CC7722'];
  bookColors.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(ox+T+3, oy+T*4+4 + i*13, T-6, 11);
  });

  // === 木頭沙發 下方 (cols 4–8, rows 6–7) ===
  // Back (row 6)
  pixelRect(ctx, ox+T*4+1, oy+T*6+1, T*5-2, T-2, sofa);
  // Seat (row 7)
  pixelRect(ctx, ox+T*4+1, oy+T*7+1, T*5-2, T-2, sofaCu);
  // Armrests
  pixelRect(ctx, ox+T*4+1, oy+T*6+1, T/2, T*2-2, woodDk);
  pixelRect(ctx, ox+T*9-T/2-1, oy+T*6+1, T/2, T*2-2, woodDk);

  // === 木頭沙發 右側 (cols 10–13, rows 5–6) ===
  // Back (row 5)
  pixelRect(ctx, ox+T*10+1, oy+T*5+1, T*4-2, T-2, sofa);
  // Seat (row 6)
  pixelRect(ctx, ox+T*10+1, oy+T*6+1, T*4-2, T-2, sofaCu);
  // Armrests
  pixelRect(ctx, ox+T*10+1, oy+T*5+1, T/2, T*2-2, woodDk);
  pixelRect(ctx, ox+T*14-T/2-1, oy+T*5+1, T/2, T*2-2, woodDk);

  // === 木桌 bottom-right (cols 12–13, rows 7–8) ===
  pixelRect(ctx, ox+T*12+1, oy+T*7+1, T*2-2, T*2-2, wood);
  // 🎁 Gift box
  pixelRect(ctx, ox+T*12+5, oy+T*7+5, T-6, T/2-2, '#DD4444', '#991111');
  // Ribbon
  ctx.fillStyle = '#FFDD44';
  ctx.fillRect(ox+T*12+5, oy+T*7+T/4+1, T-6, 3);
  ctx.fillRect(ox+T*12+T/2-1, oy+T*7+5, 3, T/2-2);
  // Bow
  ctx.fillStyle = '#FFDD44';
  ctx.beginPath(); ctx.arc(ox+T*12+T/2-4, oy+T*7+5, 3, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(ox+T*12+T/2+4, oy+T*7+5, 3, 0, Math.PI*2); ctx.fill();

  // === 門 (col 0-1, rows 8–9) ===
  pixelRect(ctx, ox+1, oy+T*8+1, T*2-2, T*2-2, '#D2A87A', '#8B6030');
  // Door knob
  ctx.fillStyle = '#C8A840';
  ctx.beginPath(); ctx.arc(ox+T*2-8, oy+T*8+T/2, 3, 0, Math.PI*2); ctx.fill();
}

// x, y = pixel centre of character's feet position
function drawCharacter(ctx, x, y, hairColor, shirtColor, label) {
  const headR = 6;

  // Drop shadow
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.beginPath();
  ctx.ellipse(x, y + 1, 8, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs (dark trousers)
  ctx.fillStyle = '#2A1E0E';
  ctx.fillRect(x - 5, y - 10, 4, 10);
  ctx.fillRect(x + 1, y - 10, 4, 10);

  // Shoes
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(x - 6, y - 3, 5, 3);
  ctx.fillRect(x + 1, y - 3, 5, 3);

  // Body / shirt
  ctx.fillStyle = shirtColor;
  ctx.fillRect(x - 7, y - 22, 14, 12);

  // Collar outline
  ctx.strokeStyle = 'rgba(0,0,0,0.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 7 + 0.5, y - 22 + 0.5, 13, 11);

  // Skin — head
  ctx.fillStyle = '#F5D5A8';
  ctx.beginPath();
  ctx.arc(x, y - 26, headR, 0, Math.PI * 2);
  ctx.fill();

  // Hair cap
  ctx.fillStyle = hairColor;
  ctx.fillRect(x - headR, y - 33, headR * 2, 8);
  ctx.beginPath();
  ctx.arc(x, y - 26, headR, Math.PI, 0);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#1A0A00';
  ctx.fillRect(x - 4, y - 28, 2, 2);
  ctx.fillRect(x + 2, y - 28, 2, 2);

  // Name label tag above head
  if (label) {
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    const tw = ctx.measureText(label).width;
    const pad = 4;
    const lx = x - tw / 2 - pad;
    const ly = y - 46;
    const lw = tw + pad * 2;
    const lh = 14;
    // Tag background
    ctx.fillStyle = 'rgba(30,20,10,0.72)';
    ctx.beginPath();
    ctx.roundRect(lx, ly, lw, lh, 3);
    ctx.fill();
    // Tag text
    ctx.fillStyle = '#FFE8C0';
    ctx.fillText(label, x, y - 35);
  }
}

function drawCharacters(ctx, ox, oy, state) {
  const T = TILE;

  // Draw NPCs
  NPCS.forEach(npc => {
    const px = ox + npc.tileX * T + T / 2;
    const py = oy + npc.tileY * T + T;
    drawCharacter(ctx, px, py, npc.hairColor, npc.shirtColor, npc.name);

    // Chat bubble or checkmark above head
    const npcState = state.npcs[npc.id];
    const bx = px + 10;
    const by = py - 56;

    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    if (npcState && npcState.read) {
      ctx.fillStyle = '#44BB44';
      ctx.fillText('✓', bx, by);
    } else if (npcState && npcState.showBubble) {
      const bounce = Math.sin(Date.now() / 300) * 3;
      ctx.fillText('💬', bx, by + bounce);
    }
  });

  // Draw player (爸 — Dad)
  const px = ox + state.player.x + T / 2;
  const py = oy + state.player.y + T;
  drawCharacter(ctx, px, py, '#2A2A2A', '#2A2A4E', '爸');

  // Glasses detail on Dad
  ctx.strokeStyle = '#1A1A1A';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(px - 5, py - 29, 4, 3);
  ctx.strokeRect(px + 1, py - 29, 4, 3);
  ctx.beginPath();
  ctx.moveTo(px - 1, py - 27);
  ctx.lineTo(px + 1, py - 27);
  ctx.stroke();
}

function drawWalls(ctx, ox, oy) {
  // Top wall strip (row 0 + row 1 used by furniture)
  ctx.fillStyle = '#EBEBEB';
  ctx.fillRect(ox, oy, COLS * TILE, TILE * 1.5);

  // Baseboard line
  ctx.strokeStyle = '#C8C0A8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ox,              oy + TILE * 1.5);
  ctx.lineTo(ox + COLS * TILE, oy + TILE * 1.5);
  ctx.stroke();

  // Side walls (thin strips at col 0 and col 14)
  ctx.fillStyle = '#EBEBEB';
  ctx.fillRect(ox,                         oy + TILE * 1.5, TILE * 0.3, ROWS * TILE);
  ctx.fillRect(ox + COLS * TILE - TILE * 0.3, oy + TILE * 1.5, TILE * 0.3, ROWS * TILE);
}

export function draw(ctx, cw, ch, state) {
  // During opening screen, just show dark background
  if (state.phase === 'opening') {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, cw, ch);
    return;
  }

  ctx.imageSmoothingEnabled = false;

  const { ox, oy } = getOffset(cw, ch);
  drawFloor(ctx, ox, oy);
  drawWalls(ctx, ox, oy);
  drawFurniture(ctx, ox, oy);
  drawCharacters(ctx, ox, oy, state);
}
